import {
  defaultFieldResolver,
  GraphQLArgumentConfig,
  GraphQLEnumType,
  GraphQLEnumValueConfigMap,
  GraphQLFieldConfig,
  GraphQLFieldConfigArgumentMap,
  GraphQLFieldConfigMap,
  GraphQLFieldResolver,
  GraphQLInputFieldConfig,
  GraphQLInputFieldConfigMap,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLResolveInfo,
  GraphQLSchema,
} from 'graphql'
import _ from 'lodash'
import { z } from 'zod'
import { parseResolveInfo, ResolveTree } from '../lib/graphql-parse-resolve-info'
import { GetGraphqlTypeRefFn, PGBuilder, PGCache, PGTypes } from '../types/builder'
import { PGEnum, PGField } from '../types/common'
import { PGInput, PGInputField, PGInputFieldMap } from '../types/input'
import { PGObject, PGOutputField, PGOutputFieldMap } from '../types/output'
import { getCtxCache, PGError } from './utils'

export function getScalarTypeName(prismaTypeName: string, isPrismaId: boolean): string {
  if (isPrismaId) return 'id'
  return _.lowerFirst(prismaTypeName)
}

function getInputFieldDefaultValue(field: PGField<any>): any {
  if (!('default' in field)) return undefined
  if (field.value.default !== undefined) return field.value.default
  if (field.value.kind !== 'object') return undefined
  const pgInput = field.value.type()
  const defaultValue = Object.entries(pgInput.fieldMap).reduce<{ [name: string]: any }>(
    (acc, [key, field]) => {
      acc[key] = getInputFieldDefaultValue(field as PGInputField<any, any>)
      return acc
    },
    {},
  )
  return Object.values(defaultValue).every((x) => x === undefined)
    ? undefined
    : defaultValue
}

function getGraphQLEnumType(pgEnum: PGEnum<string[]>): GraphQLEnumType {
  return new GraphQLEnumType({
    name: pgEnum.name,
    values: pgEnum.values.reduce<GraphQLEnumValueConfigMap>((acc, x) => {
      acc[x] = { value: x }
      return acc
    }, {}),
  })
}

function getGraphQLObjectType(
  cache: PGCache,
  pgObject: PGObject<PGOutputFieldMap>,
  typeRefFn: GetGraphqlTypeRefFn,
): GraphQLObjectType {
  return new GraphQLObjectType({
    name: pgObject.name,
    fields: () =>
      Object.entries(pgObject.fieldMap).reduce<GraphQLFieldConfigMap<any, any>>(
        (acc, [key, field]) => {
          acc[key] = getGraphQLFieldConfig(cache, field, typeRefFn)
          return acc
        },
        {},
      ),
  })
}

function getGraphQLInputObjectType(
  cache: PGCache,
  pgInput: PGInput<PGInputFieldMap>,
  typeRefFn: GetGraphqlTypeRefFn,
): GraphQLInputObjectType {
  return new GraphQLInputObjectType({
    name: pgInput.name,
    fields: () =>
      Object.entries(pgInput.fieldMap).reduce<GraphQLInputFieldConfigMap>(
        (acc, [key, field]) => {
          acc[key] = getGraphQLFieldConfigOnlyType(cache, field, typeRefFn)
          return acc
        },
        {},
      ),
  })
}

function getGraphQLFieldConfigOnlyType<T extends PGOutputField<any> | PGInputField<any>>(
  cache: PGCache,
  field: T,
  typeRefFn: GetGraphqlTypeRefFn,
): T extends PGInputField<any>
  ? GraphQLInputFieldConfig | GraphQLArgumentConfig
  : GraphQLFieldConfig<any, any> {
  const { enums, objects, inputs } = typeRefFn()
  let type
  switch (field.value.kind) {
    case 'enum': {
      type = enums[field.value.type.name]
      break
    }
    case 'scalar': {
      type = cache.scalar[field.value.type].scalar
      break
    }
    case 'object': {
      const pgInputOrPgOutput = field.value.type()
      if ('default' in field) {
        // NOTE:
        // The reason for considering the case where `inputs[name]` and `outputs[name]` are
        // undefined is that PGOutput/PGInput may be generated only after field.value.type() is executed.
        // An example is the following pattern:
        // ```ts
        // pg.mutation('createUser', (f) =>
        //   f
        //     .object(() => user)
        //     .args(f) => ({
        //       input: f.input(() =>
        //         pg.input('CreateUserInput', (f) => (f) => ({
        //           name: f.string(),
        //         })),
        //       ),
        //     }))
        //     ...
        // )
        // ```
        if (inputs[pgInputOrPgOutput.name] !== undefined) {
          type = inputs[pgInputOrPgOutput.name]
        } else {
          type = getGraphQLInputObjectType(cache, pgInputOrPgOutput, typeRefFn)
          inputs[pgInputOrPgOutput.name] = type
        }
      } else {
        if (objects[pgInputOrPgOutput.name] !== undefined) {
          type = objects[pgInputOrPgOutput.name]
        } else {
          type = getGraphQLObjectType(cache, pgInputOrPgOutput, typeRefFn)
          objects[field.value.type().name] = type
        }
      }
      break
    }
    default: {
      throw new PGError('Unexpected kind.', 'BuildError')
    }
  }
  if (!field.value.isNullable || !field.value.isOptional) {
    type = new GraphQLNonNull(type)
  }
  if (field.value.isList) {
    type =
      !field.value.isNullable || !field.value.isOptional
        ? new GraphQLNonNull(new GraphQLList(type))
        : new GraphQLList(type)
  }
  return { type, defaultValue: getInputFieldDefaultValue(field) } as any
}

async function argsValidationChecker(
  resolveArgs: [any, any, any, GraphQLResolveInfo],
  cache: PGCache,
): Promise<void> {
  type ValidateError = {
    path: string
    issues?: z.ZodIssue[]
  }

  async function validateArgsCore(
    argsValue: {
      [str: string]: any
    },
    fieldMap: PGInputFieldMap,
    pathPrefix: string,
  ): Promise<ValidateError[]> {
    const errors = await Promise.all(
      Object.entries(argsValue).map(async ([fieldName, argValue]) => {
        const e: ValidateError[] = []
        const field = fieldMap[fieldName]

        // NOTE: PGInputField validation
        const schemaBuilder =
          field.value.kind === 'scalar'
            ? cache.scalar[field.value.type].schema
            : () => z.any()
        const validator = field.value.validator?.(schemaBuilder() as z.ZodAny, ctx)
        const parsed = validator?.safeParse(argValue)
        if (parsed?.success === false) {
          e.push({
            path: `${pathPrefix}.${fieldName}`,
            issues: parsed.error.issues,
          })
        }

        // NOTE: PGInput validation
        // TODO: Fixed to consider null
        if (typeof field?.value.type === 'function' && argValue !== null) {
          const pgInput = field.value.type() as PGInput<any>
          const listedArgValue = Array.isArray(argValue) ? argValue : [argValue]
          for (const value of listedArgValue) {
            const result = await pgInput.value.validator?.(value, ctx)

            if (result === false) {
              e.push({
                path: `${pathPrefix}.${fieldName}`,
              })
            }

            e.push(
              ...(await validateArgsCore(
                value,
                pgInput.fieldMap,
                `${pathPrefix}.${fieldName}`,
              )),
            )
          }
        }
        return e
      }),
    )
    return errors.flat()
  }

  async function validateArgs(
    rt: ResolveTree,
    fieldMap: PGInputFieldMap,
    pathPrefix: string,
  ): Promise<ValidateError[]> {
    const rootErrors = await validateArgsCore(rt.args, fieldMap, pathPrefix)
    const objectName = Object.keys(rt.fieldsByTypeName)[0]
    if (objectName === undefined) {
      return [...rootErrors]
    }
    const pgObject = cache.object[objectName]
    const innerErrors = await Promise.all(
      Object.entries(rt.fieldsByTypeName[objectName]).map(async ([fieldName, t]) => {
        return await validateArgs(
          t,
          pgObject.fieldMap[fieldName].value.args ?? {},
          `${pathPrefix}.${fieldName}`,
        )
      }),
    )
    return [...rootErrors, ...innerErrors.flat()]
  }

  const ctx = resolveArgs[2]
  const info = resolveArgs[3]
  const tree = parseResolveInfo(info) as ResolveTree
  const queryType = info.parentType.name.toLowerCase() as
    | 'query'
    | 'mutation'
    | 'subscription'
  const resolver = cache[queryType][info.fieldName]

  const errors = await validateArgs(tree, resolver.field.value.args ?? {}, tree.name)
  if (errors.length > 0) {
    throw new PGError('Invalid args.', 'ValidationError', errors)
  }
}

async function accessControlWrapper(
  resolveArgs: [any, any, any, GraphQLResolveInfo],
  cache: PGCache,
  resolve: GraphQLFieldResolver<any, any>,
): Promise<any> {
  function getAuthCacheKey(info: GraphQLResolveInfo): string {
    return `${info.parentType.name}:${info.fieldName}`
  }

  function getUnAuthReturnValue(info: GraphQLResolveInfo): null | [] {
    const x = info.returnType.toString()
    const isNullable = !x.endsWith('!')
    if (isNullable) {
      return null
    }
    const isList = x.startsWith('[')
    if (isList) {
      return []
    }
    throw new PGError(
      `GraphQL permission denied. Field: ${parentTypeName}.${info.fieldName}`,
      'AuthError',
    )
  }

  const args = resolveArgs[1]
  const ctx = resolveArgs[2]
  const info = resolveArgs[3]
  const ctxCache = getCtxCache(ctx)
  const authCacheKey = getAuthCacheKey(info)
  const authCache = ctxCache.auth[authCacheKey]
  if (authCache !== undefined) {
    return authCache.hasAuth ? resolve(...resolveArgs) : authCache.unAuthReturnValue
  }

  const parentTypeName = info.parentType.name
  const field =
    parentTypeName === 'Query' ||
    parentTypeName === 'Mutation' ||
    parentTypeName === 'Subscription'
      ? cache[parentTypeName.toLowerCase() as 'query' | 'mutation' | 'subscription'][
          info.fieldName
        ].field
      : cache.object[parentTypeName].fieldMap[info.fieldName]
  const hasAuth =
    field.value.authChecker === undefined ||
    (await field.value.authChecker({ ctx, args }))
  const unAuthReturnValue = hasAuth ? null : getUnAuthReturnValue(info)

  ctxCache.auth[authCacheKey] = {
    hasAuth,
    unAuthReturnValue,
  }
  return hasAuth ? resolve(...resolveArgs) : unAuthReturnValue
}

function getGraphQLFieldConfig(
  cache: PGCache,
  field: PGOutputField<any, any, PGInputFieldMap>,
  typeRefFn: GetGraphqlTypeRefFn,
): GraphQLFieldConfig<any, any> {
  const fieldConfig: GraphQLFieldConfig<any, any> = getGraphQLFieldConfigOnlyType(
    cache,
    field,
    typeRefFn,
  )
  fieldConfig.args = Object.entries(
    field.value.args ?? {},
  ).reduce<GraphQLFieldConfigArgumentMap>((argsAcc, [argsKey, argsValue]) => {
    argsAcc[argsKey] = getGraphQLFieldConfigOnlyType(cache, argsValue, typeRefFn)
    return argsAcc
  }, {})
  fieldConfig.resolve = async (...params) => {
    if (
      params[3].parentType.name === 'Query' ||
      params[3].parentType.name === 'Mutation' ||
      params[3].parentType.name === 'Subscription'
    ) {
      await argsValidationChecker(params, cache)
      const ctxCache = getCtxCache(params[2])
      ctxCache.rootResolveInfo = {
        raw: params[3],
        parsed: parseResolveInfo(params[3]) as ResolveTree,
      }
    }
    return await accessControlWrapper(
      params,
      cache,
      field.value.resolve ?? defaultFieldResolver,
    )
  }
  fieldConfig.subscribe = field.value.subscribe
  return fieldConfig
}

export const build: <Types extends PGTypes>(
  cache: PGCache,
) => PGBuilder<Types>['build'] = (cache) => () => {
  const typeRefFn: GetGraphqlTypeRefFn = () => ({
    enums,
    objects,
    inputs,
  })
  const enums = Object.entries(cache.enum).reduce<{
    [name: string]: GraphQLEnumType
  }>((acc, [key, value]) => {
    acc[key] = getGraphQLEnumType(value)
    return acc
  }, {})
  const objects = Object.entries(cache.object).reduce<{
    [name: string]: GraphQLObjectType
  }>((acc, [key, value]) => {
    acc[key] = getGraphQLObjectType(cache, value, typeRefFn)
    return acc
  }, {})
  const inputs = Object.entries(cache.input).reduce<{
    [name: string]: GraphQLInputObjectType
  }>((acc, [key, value]) => {
    acc[key] = getGraphQLInputObjectType(cache, value, typeRefFn)
    return acc
  }, {})
  const query = new GraphQLObjectType({
    name: 'Query',
    fields: Object.entries(cache.query).reduce<GraphQLFieldConfigMap<any, any>>(
      (acc, [key, value]) => {
        acc[key] = getGraphQLFieldConfig(cache, value.field, typeRefFn)
        return acc
      },
      {},
    ),
  })
  const mutation =
    Object.keys(cache.mutation).length > 0
      ? new GraphQLObjectType({
          name: 'Mutation',
          fields: Object.entries(cache.mutation).reduce<GraphQLFieldConfigMap<any, any>>(
            (acc, [key, value]) => {
              acc[key] = getGraphQLFieldConfig(cache, value.field, typeRefFn)
              return acc
            },
            {},
          ),
        })
      : undefined
  const subscription =
    Object.keys(cache.subscription).length > 0
      ? new GraphQLObjectType({
          name: 'Subscription',
          fields: Object.entries(cache.subscription).reduce<
            GraphQLFieldConfigMap<any, any>
          >((acc, [key, value]) => {
            acc[key] = getGraphQLFieldConfig(cache, value.field, typeRefFn)
            return acc
          }, {}),
        })
      : undefined
  return new GraphQLSchema({
    query: query,
    mutation: mutation,
    subscription: subscription,
  })
}
