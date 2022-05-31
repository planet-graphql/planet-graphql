import {
  defaultFieldResolver,
  GraphQLFieldConfig,
  GraphQLFieldResolver,
  GraphQLResolveInfo,
} from 'graphql'
import { withFilter } from 'graphql-subscriptions'
import _ from 'lodash'
import { z } from 'zod'
import { getCtxCache, PGError } from '../builder/utils'
import { parseResolveInfo, ResolveTree } from '../lib/graphql-parse-resolve-info'
import { GraphqlTypeRef, PGCache, PGTypes } from '../types/builder'
import { PGFieldKindAndType } from '../types/common'
import { PGInput, PGInputFieldBuilder, PGInputFieldMap } from '../types/input'
import { PGOutputField } from '../types/output'
import { convertToGraphQLInputFieldConfig } from './pg-input-field'
import { getGraphQLFieldConfigType } from './util'

export function createOutputField<T, Types extends PGTypes>(
  kindAndType: PGFieldKindAndType,
  inputFieldBuilder: PGInputFieldBuilder<Types>,
): PGOutputField<T, any, undefined, Types> {
  const field: PGOutputField<any> = {
    value: {
      ...kindAndType,
      isOptional: false,
      isNullable: false,
      isList: false,
    },
    list: () => {
      field.value.isList = true
      return field
    },
    nullable: () => {
      field.value.isOptional = true
      field.value.isNullable = true
      return field
    },
    args: (x) => {
      field.value.args = x(inputFieldBuilder)
      return field
    },
    resolve: (x) => {
      field.value.resolve = (source, args, context, info) =>
        x({ source, args, context, info, __type: undefined })
      return field
    },
    subscribe: (x) => {
      field.value.subscribe = withFilter(
        (source, args, context, info) => {
          const { pubSubIter } = x({ source, args, context, info, __type: undefined })
          return pubSubIter
        },
        (source, args, context, info) => {
          const { filter } = x({ source, args, context, info, __type: undefined })
          return filter !== undefined ? filter() : true
        },
      )
      return field
    },
    auth: (checker) => {
      field.value.authChecker = checker
      return field
    },
    __type: undefined as any,
  }
  return field
}

export function convertToGraphQLFieldConfig(
  field: PGOutputField<any>,
  cache: PGCache,
  graphqlTypeRef: GraphqlTypeRef,
): GraphQLFieldConfig<any, any, any> {
  return {
    type: getGraphQLFieldConfigType(field, cache, graphqlTypeRef),
    args: _.mapValues(field.value.args ?? {}, (pgInputField) =>
      convertToGraphQLInputFieldConfig(pgInputField, cache, graphqlTypeRef),
    ),
    resolve: async (...params) => {
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
    },
    subscribe: field.value.subscribe,
  }
}

export async function argsValidationChecker(
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

export async function accessControlWrapper(
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
