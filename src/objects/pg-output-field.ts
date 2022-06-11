import { defaultFieldResolver, GraphQLFieldConfig } from 'graphql'
import { withFilter } from 'graphql-subscriptions'
import _ from 'lodash'
import { getContextCache } from '../builder/utils'
import { DefaultFeatures } from '../features'
import { GraphqlTypeRef, PGBuilder, PGTypes } from '../types/builder'
import { PGFieldKindAndType } from '../types/common'
import { GraphQLResolveParams, PGFeatureBeforeResolveResponse } from '../types/feature'
import { PGInputFieldBuilder } from '../types/input'
import { PGOutputFieldOptionsDefault, PGOutputField } from '../types/output'
import { convertToGraphQLInputFieldConfig, getRelayInputFieldMap } from './pg-input-field'
import { getGraphQLFieldConfigType } from './util'

export function createOutputField<T, Types extends PGTypes>(
  kindAndType: PGFieldKindAndType,
  inputFieldBuilder: PGInputFieldBuilder<Types>,
): PGOutputField<T, any, PGOutputFieldOptionsDefault, Types> {
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
      const args = x(inputFieldBuilder)
      field.value.args = Object.assign({}, field.value.args, args)
      return field
    },
    prismaArgs: (x) => {
      const prismaArgs = x(inputFieldBuilder)
      for (const field of Object.values(prismaArgs)) {
        field.value.isPrisma = true
      }
      field.value.args = Object.assign({}, field.value.args, prismaArgs)
      return field
    },
    relay: () => {
      field.value.relay = {
        isRelay: true,
      }
      const relayArgs = getRelayInputFieldMap<Types>()
      field.value.args = Object.assign({}, field.value.args, relayArgs)
      return field
    },
    relayArgs: (x) => {
      const relayArgs = getRelayInputFieldMap<Types>()
      const editedRelayArgs = x(relayArgs)
      field.value.args = Object.assign({}, field.value.args, editedRelayArgs)
      return field
    },
    relayTotalCount: (x) => {
      field.value.relay = {
        ...field.value.relay,
        totalCount: x,
      }
      return field
    },
    relayCursor: (x) => {
      field.value.relay = {
        ...field.value.relay,
        cursor: x,
      }
      return field
    },
    relayOrderBy: (x) => {
      field.value.relay = {
        ...field.value.relay,
        orderBy: x,
      }
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
  fieldName: string,
  sourceTypeName: string,
  builder: PGBuilder<any>,
  graphqlTypeRef: GraphqlTypeRef,
): GraphQLFieldConfig<any, any, any> {
  const cache = builder.cache()
  for (const feature of DefaultFeatures) {
    if (feature.beforeConvertToGraphQLFieldConfig !== undefined) {
      field = feature.beforeConvertToGraphQLFieldConfig(
        field,
        fieldName,
        sourceTypeName,
        builder,
      )
    }
  }
  return {
    type: getGraphQLFieldConfigType(field, builder, graphqlTypeRef),
    args: _.mapValues(field.value.args ?? {}, (pgInputField) =>
      convertToGraphQLInputFieldConfig(pgInputField, builder, graphqlTypeRef),
    ),
    resolve: async (source, args, context, info) => {
      if (field.value.resolve === undefined) {
        return defaultFieldResolver(source, args, context, info)
      }

      const parentTypeName = info.parentType.name
      const isRootField =
        parentTypeName === 'Query' ||
        parentTypeName === 'Mutation' ||
        parentTypeName === 'Subscription'

      let resolveParams: GraphQLResolveParams<PGTypes> = { source, args, context, info }
      for (const feature of DefaultFeatures) {
        if (feature.beforeResolve === undefined) {
          continue
        }
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
      return field.value.resolve(resolveParams as any)
    },
    subscribe: field.value.subscribe,
  }
}
