import { GraphQLUnionType } from 'graphql'
import { GraphqlTypeRef } from '../types/builder'
import { PGObject, PGUnion } from '../types/output'

export function createPGUnion<T extends Array<PGObject<any>>>(
  name: string,
  types: T,
  resolveType?: (value: any) => PGObject<any> | null,
): PGUnion<T> {
  return {
    name,
    kind: 'union' as const,
    value: {
      types,
      resolveType,
    },
  }
}

export function convertToGraphQLUnion(
  pgUnion: PGUnion<Array<PGObject<any>>>,
  graphqlTypeRef: GraphqlTypeRef,
): GraphQLUnionType {
  const resolveType =
    pgUnion.value.resolveType !== undefined
      ? (value: any) => {
          const pgObject = pgUnion.value.resolveType?.(value)
          return pgObject?.name
        }
      : undefined
  return new GraphQLUnionType({
    name: pgUnion.name,
    types: () => {
      const { objects } = graphqlTypeRef()
      return pgUnion.value.types.map((x) => objects[x.name])
    },
    resolveType,
  })
}
