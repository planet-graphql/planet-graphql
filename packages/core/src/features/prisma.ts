import _ from 'lodash'
import { PGError } from '../builder/utils'
import { parseResolveInfo } from '../lib/graphql-parse-resolve-info'
import type { ResolveTree } from '../lib/graphql-parse-resolve-info'
import type { PGBuilder, PGTypes } from '../types/builder'
import type { PGFeature } from '../types/feature'
import type { PGInputField, PGInputFieldMap } from '../types/input'
import type { PGObject, PGOutputField, PGOutputFieldMap } from '../types/output'

export const prismaArgsFeature: PGFeature = {
  name: 'prismaArgs',
  beforeResolve: ({ field, resolveParams }) => {
    const args = pickArgs(
      resolveParams.args,
      field.value.args,
      (field) => field.value.isPrisma !== true,
    )
    const prismaArgs = getPrismaArgs(
      field,
      parseResolveInfo(resolveParams.info) as ResolveTree,
    )
    return {
      isCallNext: true,
      updatedResolveParams: {
        ...resolveParams,
        args,
        prismaArgs,
      },
    }
  },
}

export function getPrismaArgs(
  field: PGOutputField<any>,
  resolveTree: ResolveTree,
  isInner = false,
): object | true | undefined {
  const prismaArgs = pickArgs(
    resolveTree.args,
    field.value.args,
    (field) => field.value.isPrisma === true,
  )

  const fieldType = field.value.type
  const isSclarOrEnumField = typeof fieldType !== 'function'
  if (isSclarOrEnumField) {
    return prismaArgs
  }

  const isRelayField = field.value.relay?.isRelay === true
  if (isRelayField) {
    const nodeTree = getRelayNodeResolveTree(resolveTree)
    if (nodeTree === undefined) {
      return prismaArgs
    }
    const nodeField = getRelayNodeField(field)
    return _.assign({}, getPrismaArgs(nodeField, nodeTree, true), prismaArgs)
  }

  const fieldTypeObject: PGObject<PGOutputFieldMap> = fieldType()
  const isPrismaObject = fieldTypeObject.value.prismaModelName !== undefined
  if (!isPrismaObject) {
    return prismaArgs
  }

  const resolveTreeMap = _.values(resolveTree.fieldsByTypeName)[0]
  const includeArgs = Object.entries(resolveTreeMap).reduce<Record<string, any>>(
    (acc, [fieldName, tree]) => {
      const pgOutputField = fieldTypeObject.value.fieldMap[fieldName]
      const isRelationField = pgOutputField.value.isPrismaRelation === true
      if (isRelationField) {
        acc[fieldName] = getPrismaArgs(pgOutputField, tree, true)
      }
      return acc
    },
    {},
  )

  const mergedPrismaArgs = _.isEmpty(includeArgs)
    ? prismaArgs
    : { ...prismaArgs, include: includeArgs }
  return _.isEmpty(mergedPrismaArgs) ? (isInner ? true : undefined) : mergedPrismaArgs
}

export function pickArgs(
  args: Record<string, any>,
  inputFieldMap: PGInputFieldMap | undefined,
  filter: (field: PGInputField<any>) => boolean,
): Record<string, any> | undefined {
  if (inputFieldMap === undefined) {
    return undefined
  }
  return Object.entries(args).reduce<Record<string, any>>((acc, [argName, argValue]) => {
    const inputField = inputFieldMap[argName]
    if (filter(inputField)) {
      acc[argName] = argValue
    }
    return acc
  }, {})
}

export function getRelayNodeField(field: PGOutputField<any>): PGOutputField<any> {
  const originalType = field.value.type as () => PGObject<any>
  const edgeType = originalType().value.fieldMap.edges.value.type as () => PGObject<any>
  const nodeField = edgeType().value.fieldMap.node
  return nodeField
}

export function getRelayNodeResolveTree(tree: ResolveTree): ResolveTree | undefined {
  return _.values(_.values(tree.fieldsByTypeName)[0].edges.fieldsByTypeName)[0].node
}

export const prismaRelayFeature: PGFeature = {
  name: 'prismaRelay',
  beforeConvertToGraphQLFieldConfig: (field, fieldName, sourceTypeName, builder) => {
    if (field.value.relay?.isRelay !== true) {
      return field
    }

    const namePrefix = `${sourceTypeName}${_.upperFirst(fieldName)}`
    const typeObject: PGObject<PGOutputFieldMap> = (field.value.type as Function)()
    const createCursorFn = field.value.relay?.cursor ?? getDefaultCursor(typeObject)
    const originalResolve = field.value.resolve
    const originalType = field.value.type as () => PGObject<any>

    field.value.type = () =>
      createConnectionObject(
        originalType,
        namePrefix,
        builder,
        field.value.relay?.totalCount !== undefined,
      )
    field.value.resolve = async (params) => {
      const orderBy =
        params.prismaArgs.orderBy ??
        field.value.relay?.orderBy ??
        getDefaultOrderBy(typeObject)
      const prismaRelayArgs = getPrismaRelayArgs(params.args, orderBy)
      const prismaArgs = Object.assign({}, params.prismaArgs, prismaRelayArgs)
      const nodes = (await originalResolve?.({ ...params, prismaArgs })) ?? []

      const edgeLength = params.args.first ?? params.args.last
      const edges = getEdges(nodes, edgeLength, createCursorFn)
      const pageInfo = getPageInfo(nodes.length, edges, params.args)
      const totalCount = await field.value.relay?.totalCount?.(params)
      return {
        totalCount,
        edges,
        pageInfo,
      }
    }
    field.value.isList = false

    return field
  },
}

export function createConnectionObject(
  nodeType: () => PGObject<any>,
  namePrefix: string,
  builder: PGBuilder<PGTypes>,
  isIncludeTotalCount: boolean,
): PGObject<any> {
  return builder.object({
    name: `${namePrefix}Connection`,
    fields: (b) => ({
      edges: b.object(() => createEdgeObject(nodeType, namePrefix, builder)).list(),
      pageInfo: b.object(() => createPageInfoObject(builder)),
      ...(isIncludeTotalCount ? { totalCount: b.int() } : {}),
    }),
  })
}

export function createEdgeObject(
  nodeType: () => PGObject<any>,
  namePrefix: string,
  builder: PGBuilder<PGTypes>,
): PGObject<any> {
  return builder.object({
    name: `${namePrefix}Edge`,
    fields: (b) => ({
      node: b.object(nodeType),
      cursor: b.string(),
    }),
  })
}

export function createPageInfoObject(builder: PGBuilder<PGTypes>): PGObject<any> {
  return (
    builder.cache().object.PageInfo ??
    builder.object({
      name: 'PageInfo',
      fields: (b) => ({
        hasNextPage: b.boolean(),
        hasPreviousPage: b.boolean(),
        startCursor: b.string().nullable(),
        endCursor: b.string().nullable(),
      }),
    })
  )
}

export function getEdges(
  nodes: any[],
  edgeLength: number | undefined,
  createCursor: (node: unknown) => unknown,
): Array<{ node: any; cursor: string }> {
  const edges = nodes.map((node) => ({
    node,
    cursor: encodeCursor(createCursor(node)),
  }))
  return edgeLength === undefined ? edges : edges.slice(0, edgeLength)
}

export function getPageInfo(
  nodesLength: number,
  edges: Array<{ node: any; cursor: string }>,
  relayArgs: {
    first?: number
    after?: string
    last?: number
    before?: string
  },
): {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor: string | null
  endCursor: string | null
} {
  const startCursor = edges.length === 0 ? null : edges[0].cursor
  const endCursor = edges.length === 0 ? null : edges[edges.length - 1].cursor
  if (relayArgs.first !== undefined || relayArgs.after !== undefined) {
    return {
      hasNextPage: relayArgs.first !== undefined && nodesLength > relayArgs.first,
      hasPreviousPage: relayArgs.after !== undefined,
      startCursor,
      endCursor,
    }
  }
  if (relayArgs.last !== undefined || relayArgs.before !== undefined) {
    return {
      hasNextPage: relayArgs.before !== undefined,
      hasPreviousPage: relayArgs.last !== undefined && nodesLength > relayArgs.last,
      startCursor,
      endCursor,
    }
  }
  return {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor,
    endCursor,
  }
}

export function getDefaultCursor(
  pgObject: PGObject<PGOutputFieldMap>,
): (node: any) => object {
  const idFieldEntry = Object.entries(pgObject.value.fieldMap).find(([_, field]) => {
    return field.value.type === 'id'
  })
  if (idFieldEntry === undefined) {
    throw new PGError('ID field does not exists.', 'Error')
  }
  const idFieldName = idFieldEntry[0]
  return (node) => ({ [idFieldName]: node[idFieldName] })
}

export function encodeCursor(cursorObject: unknown): string {
  return Buffer.from(JSON.stringify(cursorObject)).toString('base64')
}

export function decodeCursor(cursor: string): object {
  return JSON.parse(Buffer.from(cursor, 'base64').toString())
}

export function getDefaultOrderBy(pgObject: PGObject<PGOutputFieldMap>): object {
  const idFieldEntry = Object.entries(pgObject.value.fieldMap).find(([_, field]) => {
    return field.value.type === 'id'
  })
  if (idFieldEntry === undefined) {
    throw new PGError('ID field does not exists.', 'Error')
  }
  const idFieldName = idFieldEntry[0]
  return { [idFieldName]: 'asc' }
}

export function getPrismaRelayArgs(
  relayArgs: {
    first?: number
    after?: string
    last?: number
    before?: string
  },
  orderBy: object | object[],
): {
  take?: number
  skip?: number
  cursor?: any
  orderBy: any
} {
  const resp: ReturnType<typeof getPrismaRelayArgs> = {
    orderBy,
  }
  if (relayArgs.first !== undefined || relayArgs.last !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    resp.take = (relayArgs.first ?? relayArgs.last)! + 1
  }
  if (relayArgs.after !== undefined || relayArgs.before !== undefined) {
    resp.skip = 1
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    resp.cursor = decodeCursor((relayArgs.after ?? relayArgs.before)!)
  }
  if (relayArgs.last !== undefined) {
    resp.orderBy = reverseOrderBy(resp.orderBy)
  }
  return resp
}

function reverseOrderBy(orderBy: object | object[]): object | object[] {
  if (Array.isArray(orderBy)) return orderBy.map((x) => reverseOrderBy(x))
  return _.mapValues(orderBy, (value: 'asc' | 'desc') =>
    value === 'asc' ? 'desc' : 'asc',
  )
}
