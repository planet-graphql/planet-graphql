import { GraphQLObjectType, GraphQLSchema } from 'graphql'
import _ from 'lodash'
import { convertToGraphQLEnum } from '../objects/pg-enum'
import { convertToGraphQLInputObject } from '../objects/pg-input'
import { convertToGraphQLObject } from '../objects/pg-object'
import { convertToGraphQLFieldConfig } from '../objects/pg-output-field'
import { GraphqlTypeRef, PGBuilder, PGCache, PGTypes } from '../types/builder'

export function getScalarTypeName(prismaTypeName: string, isPrismaId: boolean): string {
  if (isPrismaId) return 'id'
  return _.lowerFirst(prismaTypeName)
}

export const build: <Types extends PGTypes>(
  cache: PGCache,
) => PGBuilder<Types>['build'] = (cache) => () => {
  const typeRef: GraphqlTypeRef = () => ({
    enums,
    objects,
    inputs,
  })
  const enums = _.mapValues(cache.enum, (pgEnum) => convertToGraphQLEnum(pgEnum))
  const objects = _.mapValues(cache.object, (pgObject) =>
    convertToGraphQLObject(pgObject, cache, typeRef),
  )
  const inputs = _.mapValues(cache.input, (pgInput) =>
    convertToGraphQLInputObject(pgInput, cache, typeRef),
  )
  const query = new GraphQLObjectType({
    name: 'Query',
    fields: _.mapValues(cache.query, (pgRootFieldConfig) =>
      convertToGraphQLFieldConfig(pgRootFieldConfig.field, cache, typeRef),
    ),
  })
  const mutation =
    Object.keys(cache.mutation).length > 0
      ? new GraphQLObjectType({
          name: 'Mutation',
          fields: _.mapValues(cache.mutation, (pgRootFieldConfig) =>
            convertToGraphQLFieldConfig(pgRootFieldConfig.field, cache, typeRef),
          ),
        })
      : undefined
  const subscription =
    Object.keys(cache.subscription).length > 0
      ? new GraphQLObjectType({
          name: 'Subscription',
          fields: _.mapValues(cache.subscription, (pgRootFieldConfig) =>
            convertToGraphQLFieldConfig(pgRootFieldConfig.field, cache, typeRef),
          ),
        })
      : undefined
  return new GraphQLSchema({
    query: query,
    mutation: mutation,
    subscription: subscription,
  })
}
