import { GraphQLEnumType } from 'graphql'
import type { PGEnum } from '../types/common'
import type { GraphQLEnumValueConfigMap } from 'graphql'

export function createPGEnum<T extends string[]>(name: string, values: T): PGEnum<T> {
  const pgEnum: PGEnum<T> = {
    name,
    values,
    kind: 'enum' as const,
  }
  return pgEnum
}

export function convertToGraphQLEnum(pgEnum: PGEnum<string[]>): GraphQLEnumType {
  return new GraphQLEnumType({
    name: pgEnum.name,
    values: pgEnum.values.reduce<GraphQLEnumValueConfigMap>((acc, x) => {
      acc[x] = { value: x }
      return acc
    }, {}),
  })
}
