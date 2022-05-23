import { GraphQLResolveInfo } from 'graphql'
import { ResolveTree, FieldsByTypeName } from '../lib/graphql-parse-resolve-info'
import { PGBuilder, PGCache, PGTypes } from '../types/builder'
import { PGOutputFieldBuilder, PGOutputFieldMap } from '../types/output'
import { object } from './object'
import { PGError, getCtxCache } from './utils'

export const relayConnection: <Types extends PGTypes>(
  cache: PGCache,
  outputFieldBuilder: PGOutputFieldBuilder<Types>,
) => PGBuilder<Types>['relayConnection'] =
  (cache, outputFieldBuilder) => (pgObject, options) => {
    function getDefaultCursor(fieldMap: PGOutputFieldMap): (node: any) => any {
      const idFieldEntry = Object.entries(fieldMap).find(
        ([_name, field]) => field.value.kind === 'scalar' && field.value.type === 'id',
      )
      if (idFieldEntry === undefined) {
        throw new PGError('ID field does not exists.', 'Error')
      }
      const idFieldName = idFieldEntry[0]
      return (node) => ({ [idFieldName]: node[idFieldName] })
    }

    function encodeCursor(cursorObject: any): string {
      return Buffer.from(JSON.stringify(cursorObject)).toString('base64')
    }

    function getParentTree(
      loc: ResolveTree['loc'],
      rootTree: ResolveTree,
    ): ResolveTree | null {
      function findParentSelection(
        loc: ResolveTree['loc'],
        parent: ResolveTree | null,
        childrens: FieldsByTypeName,
      ): ResolveTree | null {
        const objectName = Object.keys(childrens)[0]
        for (const tree of Object.values(childrens[objectName])) {
          if (tree.loc.start === loc.start && tree.loc.end === loc.end) {
            return parent
          }
          const innerObjectName = Object.keys(tree.fieldsByTypeName)?.[0]
          if (innerObjectName !== undefined) {
            const found = findParentSelection(loc, tree, tree.fieldsByTypeName)
            if (found !== null) {
              return found
            }
          }
        }
        return null
      }
      return findParentSelection(loc, rootTree, rootTree.fieldsByTypeName)
    }

    function getParentFieldArgs(
      info: GraphQLResolveInfo,
      context: any,
    ): {
      prisma: any
      raw: {
        first?: number
        after?: string
        last?: number
        before?: string
      }
    } {
      const contextCache = getCtxCache(context)
      const loc = info.fieldNodes[0].loc
      const rootParsedReolveInfo = contextCache.rootResolveInfo.parsed
      if (loc === undefined || rootParsedReolveInfo === null) {
        return { prisma: {}, raw: {} }
      }

      const tree = getParentTree(loc, rootParsedReolveInfo)
      if (tree?.loc === undefined) {
        return { prisma: {}, raw: {} }
      }
      return {
        prisma: contextCache.prismaFindArgs[`${tree.loc.start}:${tree.loc.end}`] ?? {},
        raw: tree.args ?? {},
      }
    }

    const getCusorFn = options?.cursor ?? getDefaultCursor(pgObject.fieldMap)

    const pgBuilderObject = object(cache, outputFieldBuilder)
    const connection = pgBuilderObject(`${pgObject.name}Connection`, (f) => ({
      edges: f
        .object(() =>
          pgBuilderObject(`${pgObject.name}Edge`, (f) => ({
            cursor: f.string().resolve((params) => {
              return encodeCursor(getCusorFn(params.source)) as any
            }),
            node: f.object(() => pgObject).resolve((params) => params.source),
          })),
        )
        .list()
        .resolve((params) => {
          const args = getParentFieldArgs(params.info, params.context)
          const nodeLength = args.raw.first ?? args.raw.last
          return nodeLength !== undefined
            ? params.source.slice(0, nodeLength)
            : params.source
        }),
      pageInfo: f
        .object(() =>
          pgBuilderObject('PageInfo', (f) => ({
            hasNextPage: f.boolean(),
            hasPreviousPage: f.boolean(),
          })),
        )
        .resolve((params) => {
          const args = getParentFieldArgs(params.info, params.context)
          return getPageInfo(params.source.length, args.raw) as any
        }),
      ...(options?.totalCount !== undefined
        ? {
            totalCount: f.int().resolve((params) => {
              const args = getParentFieldArgs(params.info, params.context)
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              return options.totalCount!(params, args.prisma) as any
            }),
          }
        : ({} as any)),
    }))
    connection.value.isRelayConnection = true
    return connection
  }

export function getPageInfo(
  sourceLength: number,
  args: {
    first?: number
    after?: string
    last?: number
    before?: string
  },
): {
  hasNextPage: boolean
  hasPreviousPage: boolean
} {
  if (args.first !== undefined || args.after !== undefined) {
    return {
      hasNextPage: args.first !== undefined && sourceLength > args.first,
      hasPreviousPage: args.after !== undefined,
    }
  }
  if (args.last !== undefined || args.before !== undefined) {
    return {
      hasNextPage: args.before !== undefined,
      hasPreviousPage: args.last !== undefined && sourceLength > args.last,
    }
  }
  return {
    hasNextPage: false,
    hasPreviousPage: false,
  }
}
