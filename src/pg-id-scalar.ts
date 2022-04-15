import { inspect } from 'util'
import { GraphQLError, GraphQLScalarType, Kind, print } from 'graphql'

// NOTE:
// https://github.com/graphql/graphql-js/blob/main/src/type/scalars.ts#L214
// のGraphQLIDに対して、bigintのserializeに対応させるようにしている。
// FIXME: graphql.jsに取り込まれたら不要になるので削除したい
export const PGGraphQLID = new GraphQLScalarType<string>({
  name: 'ID',
  description:
    'The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.',

  serialize(outputValue) {
    const coercedValue = serializeObject(outputValue)

    if (typeof coercedValue === 'string') {
      return coercedValue
    }
    if (typeof coercedValue === 'bigint') {
      return coercedValue.toString()
    }
    if (Number.isInteger(coercedValue)) {
      return String(coercedValue)
    }
    throw new GraphQLError(`ID cannot represent value: ${inspect(outputValue)}`)
  },

  parseValue(inputValue) {
    if (typeof inputValue === 'string') {
      return inputValue
    }
    if (typeof inputValue === 'number' && Number.isInteger(inputValue)) {
      return inputValue.toString()
    }
    throw new GraphQLError(`ID cannot represent value: ${inspect(inputValue)}`)
  },

  parseLiteral(valueNode) {
    if (valueNode.kind !== Kind.STRING && valueNode.kind !== Kind.INT) {
      throw new GraphQLError(
        'ID cannot represent a non-string and non-integer value: ' + print(valueNode),
        valueNode,
      )
    }
    return valueNode.value
  },
})

function serializeObject(outputValue: unknown): unknown {
  if (isObjectLike(outputValue)) {
    if (typeof outputValue.valueOf === 'function') {
      const valueOfResult = outputValue.valueOf()
      if (!isObjectLike(valueOfResult)) {
        return valueOfResult
      }
    }
    if (typeof outputValue.toJSON === 'function') {
      return outputValue.toJSON()
    }
  }
  return outputValue
}

function isObjectLike(value: unknown): value is { [key: string]: unknown } {
  // eslint-disable-next-line eqeqeq
  return typeof value == 'object' && value !== null
}
