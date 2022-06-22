import { GraphQLEnumType } from 'graphql'
import { convertToGraphQLEnum, createPGEnum } from './pg-enum'

describe('PGEnum', () => {})

describe('createPGEnum', () => {})

describe('convertToGraphQLEnum', () => {
  it('Converts PGEnum to GraphQLEnumType', () => {
    const pgEnum = createPGEnum('SomeEnum', ['A', 'B'])
    const graphQLEnum = convertToGraphQLEnum(pgEnum)
    expect(graphQLEnum).toEqual(
      new GraphQLEnumType({
        name: 'SomeEnum',
        values: {
          A: { value: 'A' },
          B: { value: 'B' },
        },
      }),
    )
  })
})
