import { defaultFieldResolver, GraphQLFieldConfig } from 'graphql'
import { withFilter } from 'graphql-subscriptions'
import _ from 'lodash'
import { getContextCache } from '../builder/utils'
import { DefaultFeatures } from '../features'
import { GraphqlTypeRef, PGCache, PGTypes } from '../types/builder'
import { PGFieldKindAndType } from '../types/common'
import { GraphQLResolveParams, PGFeatureBeforeResolveResponse } from '../types/feature'
import { PGInputFieldBuilder } from '../types/input'
import { PGOutputField } from '../types/output'
import { convertToGraphQLInputFieldConfig, getRelayInputFieldMap } from './pg-input-field'
import { getGraphQLFieldConfigType } from './util'

export function createOutputField<T, Types extends PGTypes>(
  kindAndType: PGFieldKindAndType,
  inputFieldBuilder: PGInputFieldBuilder<Types>,
): PGOutputField<T, any, undefined, undefined, Types> {
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
    prismaArgs: (x) => {
      const prismaArgsMap = x(inputFieldBuilder)
      for (const field of Object.values(prismaArgsMap)) {
        field.value.isPrisma = true
      }
      field.value.args = Object.assign({}, field.value.args, prismaArgsMap)
      return field
    },
    prismaRelayArgs: (x) => {
      const relayInputFieldMap = getRelayInputFieldMap<Types>()
      const prismaRelayArgsMap = x(relayInputFieldMap)
      for (const field of Object.values(prismaRelayArgsMap)) {
        field.value.isPrisma = true
      }
      field.value.args = Object.assign({}, field.value.args, prismaRelayArgsMap)
      return field
    },
    resolve: (x) => {
      field.value.resolve = x
      return field
    },
    subscribe: (x) => {
      field.value.subscribe = withFilter(
        (source, args, context, info) => {
          const { pubSubIter } = x({ source, args, context, info })
          return pubSubIter
        },
        (source, args, context, info) => {
          const { filter } = x({ source, args, context, info })
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
    resolve: async (source, args, context, info) => {
      const parentTypeName = info.parentType.name
      const isRootField =
        parentTypeName === 'Query' ||
        parentTypeName === 'Mutation' ||
        parentTypeName === 'Subscription'

      let resolveParams: GraphQLResolveParams<PGTypes> = { source, args, context, info }
      for (const feature of DefaultFeatures) {
        const contextCache = getContextCache<
          PGFeatureBeforeResolveResponse<object, PGTypes>
        >(context, feature.name)
        let response: PGFeatureBeforeResolveResponse<object, PGTypes> | undefined
        if (feature.cacheKey !== undefined) {
          const cacheKey = feature.cacheKey(resolveParams)
          if (contextCache[cacheKey] !== undefined) {
            response = contextCache[cacheKey]
          }
        }

        if (response === undefined) {
          response = await feature.beforeResolve({
            resolveParams,
            field,
            isRootField,
            cache,
          })
          const isCachable =
            feature.cacheKey !== undefined &&
            (!response.isCallNext ||
              (response.isCallNext && response.updatedResolveParams === undefined))
          if (isCachable) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const cacheKey = feature.cacheKey!(resolveParams)
            contextCache[cacheKey] = response
          }
        }

        if (response.isCallNext) {
          if (response.updatedResolveParams !== undefined) {
            resolveParams = response.updatedResolveParams
          }
          continue
        }
        if (response.resolveValue !== undefined) {
          return response.resolveValue
        }
        if (response.resolveError !== undefined) {
          throw response.resolveError
        }
      }
      if (field.value.resolve !== undefined) {
        return field.value.resolve(resolveParams as any)
      }
      return defaultFieldResolver(
        resolveParams.source,
        resolveParams.args,
        resolveParams.context,
        resolveParams.info,
      )
    },
    subscribe: field.value.subscribe,
  }
}
