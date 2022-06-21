import { GraphQLEnumType, GraphQLEnumValueConfigMap } from 'graphql'
import { PGEnum } from '../types/common'

export function createPGEnum<T extends readonly string[]>(
  name: string,
  values: T,
): PGEnum<T> {
  const pgEnum: PGEnum<T> = {
    name,
    values,
    kind: 'enum' as const,
  }
  return pgEnum
}

export function convertToGraphQLEnum(pgEnum: PGEnum<readonly string[]>): GraphQLEnumType {
  return new GraphQLEnumType({
    name: pgEnum.name,
    values: pgEnum.values.reduce<GraphQLEnumValueConfigMap>((acc, x) => {
      acc[x] = { value: x }
      return acc
    }, {}),
  })
}
