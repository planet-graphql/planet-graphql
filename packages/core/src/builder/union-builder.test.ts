import { graphql } from 'graphql'
import { getPGBuilder } from '..'
import { mergeDefaultPGUnion } from '../test-utils'

describe('UnionBuilder', () => {
  it('Returns a PGUnion & Sets it to the Build Cache', () => {
    const pg = getPGBuilder()()
    const objectA = pg.object({
      name: 'A',
      fields: (b) => ({
        a: b.string(),
      }),
    })
    const objectB = pg.object({
      name: 'B',
      fields: (b) => ({
        b: b.string(),
      }),
    })

    const result = pg.union({
      name: 'SomeUnion',
      types: [objectA, objectB],
      resolveType: (value) => ('a' in value ? objectA : objectB),
    })

    const expectValue = mergeDefaultPGUnion({
      name: 'SomeUnion',
      value: {
        types: [objectA, objectB],
        resolveType: expect.any(Function),
      },
    })
    expect(result).toEqual(expectValue)
    expect(pg.cache().union.SomeUnion).toEqual(expectValue)
  })

  it('Returns a PGUnion that can be used as an output type', async () => {
    const pg = getPGBuilder()()
    const objectA = pg.object({
      name: 'A',
      fields: (b) => ({
        a: b.string(),
      }),
    })
    const objectB = pg.object({
      name: 'B',
      fields: (b) => ({
        b: b.string(),
      }),
    })
    const someUnion = pg.union({
      name: 'SomeUnion',
      types: [objectA, objectB],
      resolveType: (value) => ('a' in value ? objectA : objectB),
    })
    const someQuery = pg.query({
      name: 'someQuery',
      field: (b) =>
        b
          .object(() => someUnion)
          .list()
          .resolve(() => {
            return [{ a: 'a' }, { b: 'b' }]
          }),
    })
    const query = `
      query {
        someQuery {
          ... on A {
            a
          }
          ... on B {
            b
          }
        }
      }
    `

    const response = await graphql({
      schema: pg.build([someQuery]),
      source: query,
      contextValue: {},
    })

    expect(response).toEqual({
      data: {
        someQuery: [{ a: 'a' }, { b: 'b' }],
      },
    })
  })
})

describe('createUnionBuilder', () => {})
