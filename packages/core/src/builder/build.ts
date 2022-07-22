import { GraphQLObjectType, GraphQLSchema } from 'graphql'
import _ from 'lodash'
import { convertToGraphQLEnum } from '../objects/pg-enum'
import { convertToGraphQLInputObject } from '../objects/pg-input'
import { convertToGraphQLInterface } from '../objects/pg-interface'
import { convertToGraphQLObject } from '../objects/pg-object'
import { convertToGraphQLFieldConfig } from '../objects/pg-output-field'
import { convertToGraphQLUnion } from '../objects/pg-union'
import type { GraphqlTypeRef, PGBuilder, PGTypes } from '../types/builder'
import type { GraphQLFieldConfig } from 'graphql'

export const build: <Types extends PGTypes>(
  getBuilder: () => PGBuilder<Types>,
) => PGBuilder<Types>['build'] = (getBuilder) => (rootFieldConfigs) => {
  const builder = getBuilder()
  const cache = builder.cache()
  const typeRef: GraphqlTypeRef = () => ({
    enums,
    objects: Object.assign(objects, objectsFromRef),
    interfaces,
    unions,
    inputs,
  })
  const enums = _.mapValues(cache.enum, (pgEnum) => convertToGraphQLEnum(pgEnum))
  const objects = _.mapValues(cache.object, (pgObject) =>
    convertToGraphQLObject(pgObject, builder, typeRef),
  )
  const objectsFromRef = _.mapValues(cache.objectRef, (objectRef) =>
    convertToGraphQLObject(objectRef.ref(), builder, typeRef),
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
    fields: rootFieldConfigs
      .filter((x) => x.kind === 'query')
      .reduce<{ [key: string]: GraphQLFieldConfig<any, any> }>((acc, x) => {
        acc[x.name] = convertToGraphQLFieldConfig(
          x.field,
          x.name,
          'Query',
          builder,
          typeRef,
        )
        return acc
      }, {}),
  })
  const mutationConfigs = rootFieldConfigs.filter((x) => x.kind === 'mutation')
  const mutation =
    mutationConfigs.length > 0
      ? new GraphQLObjectType({
          name: 'Mutation',
          fields: mutationConfigs.reduce<{ [key: string]: GraphQLFieldConfig<any, any> }>(
            (acc, x) => {
              acc[x.name] = convertToGraphQLFieldConfig(
                x.field,
                x.name,
                'Mutation',
                builder,
                typeRef,
              )
              return acc
            },
            {},
          ),
        })
      : undefined
  const subscriptionConfigs = rootFieldConfigs.filter((x) => x.kind === 'subscription')
  const subscription =
    subscriptionConfigs.length > 0
      ? new GraphQLObjectType({
          name: 'Subscription',
          fields: subscriptionConfigs.reduce<{
            [key: string]: GraphQLFieldConfig<any, any>
          }>((acc, x) => {
            acc[x.name] = convertToGraphQLFieldConfig(
              x.field,
              x.name,
              'Subscription',
              builder,
              typeRef,
            )
            return acc
          }, {}),
        })
      : undefined
  return new GraphQLSchema({
    query,
    mutation,
    subscription,
    types: Object.values(typeRef().objects),
  })
}
