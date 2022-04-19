import { inspect } from 'util'
import { Decimal } from '@prisma/client/runtime'
import { GraphQLError, GraphQLScalarType, Kind, print } from 'graphql'

export const PGGraphQLDecimal = new GraphQLScalarType<string | number | Decimal, Decimal>(
  {
    name: 'Decimal',
    description: 'The `Decimal` scalar type',

    serialize(value) {
      if (value instanceof Decimal) {
        return value
      }
      throw new GraphQLError(`Decimal cannot represent a value: ${inspect(value)}`)
    },

    parseValue(value) {
      return new Decimal(value as Decimal.Value)
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
  },
)
