import { GraphQLResolveInfo } from 'graphql'
import { ResolveTree, FieldsByTypeName } from '../graphql-parse-resolve-info'
import { PGBuilder, PGCache } from '../types/builder'
import { PGOutputFieldMap } from '../types/output'
import { object } from './object'
import { PGError, getCtxCache } from './utils'

export const relayConnection: (cache: PGCache) => PGBuilder<any>['relayConnection'] =
  (cache) => (pgObject, options) => {
    function getDefaultCursor(fieldMap: PGOutputFieldMap): (node: any) => any {
      const idFieldEntry = Object.entries(fieldMap).find(
        ([_name, field]) => field.value.isId,
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

    const pgBuilderObject = object(cache)
    const connection = pgBuilderObject(`${pgObject.name}Connection`, (f) => ({
      edges: f
        .object(() =>
          pgBuilderObject(`${pgObject.name}Edge`, (f) => ({
            cursor: f.string().resolve((params) => {
              return encodeCursor(getCusorFn(params.source))
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
          // FIXME: 関数化して外に出して単体テストを行う
          if (args.raw.first !== undefined || args.raw.after !== undefined) {
            return {
              hasNextPage:
                args.raw.first !== undefined && params.source.length > args.raw.first,
              hasPreviousPage: args.raw.after !== undefined,
            }
          }
          if (args.raw.last !== undefined || args.raw.before !== undefined) {
            return {
              hasNextPage: args.raw.before !== undefined,
              hasPreviousPage:
                args.raw.last !== undefined && params.source.length > args.raw.last,
            }
          }
          return {
            hasNextPage: false,
            hasPreviousPage: false,
          }
        }),
      ...(options?.totalCount !== undefined
        ? {
            totalCount: f.int().resolve((params) => {
              const args = getParentFieldArgs(params.info, params.context)
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              return options.totalCount!(params, args.prisma)
            }),
          }
        : {}),
    }))
    connection.value.isRelayConnection = true
    return connection
  }
