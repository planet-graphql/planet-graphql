import { inspect } from 'util'
import { Prisma } from '@prisma/client'
import { GraphQLError, GraphQLScalarType, Kind, print } from 'graphql'

export const PGGraphQLDecimal = new GraphQLScalarType<
  string | number | Prisma.Decimal,
  Prisma.Decimal
>({
  name: 'Decimal',
  description: 'The `Decimal` scalar type',

  serialize(value) {
    if (value instanceof Prisma.Decimal) {
      return value
    }
    throw new GraphQLError(`Decimal cannot represent a value: ${inspect(value)}`)
  },

  parseValue(value) {
    return new Prisma.Decimal(value as Prisma.Decimal.Value)
  },

  parseLiteral(value) {
    if (value.kind === Kind.INT || value.kind === Kind.FLOAT) {
      return value.value
    }
    throw new GraphQLError(
      'Decimal cannot represent a non-numeric value: ' + print(value),
      value,
    )
  },
})
