import { GraphQLObjectType, GraphQLSchema } from 'graphql'
import _ from 'lodash'
import { convertToGraphQLEnum } from '../objects/pg-enum'
import { convertToGraphQLInputObject } from '../objects/pg-input'
import { convertToGraphQLInterface } from '../objects/pg-interface'
import { convertToGraphQLObject } from '../objects/pg-object'
import { convertToGraphQLFieldConfig } from '../objects/pg-output-field'
import { convertToGraphQLUnion } from '../objects/pg-union'
import { GraphqlTypeRef, PGBuilder, PGTypes } from '../types/builder'

export const build: <Types extends PGTypes>(
  getBuilder: () => PGBuilder<Types>,
) => PGBuilder<Types>['build'] = (getBuilder) => () => {
  const builder = getBuilder()
  const cache = builder.cache()
  const typeRef: GraphqlTypeRef = () => ({
    enums,
    objects,
    interfaces,
    unions,
    inputs,
  })
  const enums = _.mapValues(cache.enum, (pgEnum) => convertToGraphQLEnum(pgEnum))
  const objects = _.mapValues(cache.object, (pgObject) =>
    convertToGraphQLObject(pgObject, builder, typeRef),
  )
  const interfaces = _.mapValues(cache.interface, (pgInterface) =>
    convertToGraphQLInterface(pgInterface, builder, typeRef),
  )
  const unions = _.mapValues(cache.union, (pgUnion) =>
    convertToGraphQLUnion(pgUnion, typeRef),
  )
  const inputs = _.mapValues(cache.input, (pgInput) =>
    convertToGraphQLInputObject(pgInput, builder, typeRef),
  )
  const query = new GraphQLObjectType({
    name: 'Query',
    fields: _.mapValues(cache.query, (pgRootFieldConfig) =>
      convertToGraphQLFieldConfig(
        pgRootFieldConfig.field,
        pgRootFieldConfig.name,
        'Query',
        builder,
        typeRef,
      ),
    ),
  })
  const mutation =
    Object.keys(cache.mutation).length > 0
      ? new GraphQLObjectType({
          name: 'Mutation',
          fields: _.mapValues(cache.mutation, (pgRootFieldConfig) =>
            convertToGraphQLFieldConfig(
              pgRootFieldConfig.field,
              pgRootFieldConfig.name,
              'Mutation',
              builder,
              typeRef,
            ),
          ),
        })
      : undefined
  const subscription =
    Object.keys(cache.subscription).length > 0
      ? new GraphQLObjectType({
          name: 'Subscription',
          fields: _.mapValues(cache.subscription, (pgRootFieldConfig) =>
            convertToGraphQLFieldConfig(
              pgRootFieldConfig.field,
              pgRootFieldConfig.name,
              'Subscription',
              builder,
              typeRef,
            ),
          ),
        })
      : undefined
  return new GraphQLSchema({
    query: query,
    mutation: mutation,
    subscription: subscription,
    types: Object.values(objects),
  })
}
