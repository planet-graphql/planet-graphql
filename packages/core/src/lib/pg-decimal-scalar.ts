import { Decimal } from 'decimal.js'
import { GraphQLError, GraphQLScalarType, Kind, print } from 'graphql'

export const PGGraphQLDecimal = new GraphQLScalarType<string | number | Decimal, string>({
  name: 'Decimal',
  description: 'The `Decimal` scalar type',

  // eslint-disable-next-line unicorn/prefer-native-coercion-functions
  serialize(value) {
    return String(value)
  },

  parseValue(value) {
    return new Decimal(value as Decimal.Value)
  },

  parseLiteral(value) {
    if (
      value.kind === Kind.INT ||
      value.kind === Kind.FLOAT ||
      value.kind === Kind.STRING
    ) {
      return value.value
    }
    throw new GraphQLError(
      'Decimal cannot represent a non-numeric value: ' + print(value),
      value,
    )
  },
})
