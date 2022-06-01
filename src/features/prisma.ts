import _ from 'lodash'
import { parseResolveInfo, ResolveTree } from '../lib/graphql-parse-resolve-info'
import { PGFeature } from '../types/feature'
import { PGInputField, PGInputFieldMap } from '../types/input'
import { PGObject, PGOutputField, PGOutputFieldMap } from '../types/output'

export const prismaArgsFeature: PGFeature = {
  name: 'prismaArgs',
  beforeResolve: ({ field, resolveParams }) => {
    if (field.value.resolve === undefined) {
      return {
        isCallNext: true,
      }
    }

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
  depth = 0,
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
  const fieldTypeObject: PGObject<PGOutputFieldMap> = fieldType()
  const isPrismaObject = fieldTypeObject.prismaModelName !== undefined
  if (!isPrismaObject) {
    return prismaArgs
  }

  const resolveTreeMap = _.values(resolveTree.fieldsByTypeName)[0]
  const includeArgs = Object.entries(resolveTreeMap).reduce<Record<string, any>>(
    (acc, [fieldName, tree]) => {
      const pgOutputField = fieldTypeObject.fieldMap[fieldName]
      const isRelationField = pgOutputField.value.isPrismaRelation === true
      if (isRelationField) {
        acc[fieldName] = getPrismaArgs(pgOutputField, tree, depth + 1)
      }
      return acc
    },
    {},
  )

  const mergedPrismaArgs = _.isEmpty(includeArgs)
    ? prismaArgs
    : { ...prismaArgs, include: includeArgs }
  return _.isEmpty(mergedPrismaArgs) ? (depth === 0 ? undefined : true) : mergedPrismaArgs
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
