import { graphql } from 'graphql'
import { expectType } from 'ts-expect'
import { getPGBuilder } from '..'
import type { PGEnum } from '../types/common'
import type { TypeEqual } from 'ts-expect'

describe('EnumBuilder', () => {
  it('Returns a PGEnum & Set it to the Build Cache', () => {
    const pg = getPGBuilder()()

    const result = pg.enum({
      name: 'SomeEnum',
      values: ['A', 'B'],
    })

    const expectValue = {
      name: 'SomeEnum',
      values: ['A', 'B'],
      kind: 'enum',
    }
    expect(result).toEqual(expectValue)
    expectType<TypeEqual<typeof result, PGEnum<['A', 'B']>>>(true)
    expect(pg.cache().enum.SomeEnum).toEqual(expectValue)
  })

  it('Returns a PGEnum that can be used as an Input type and a Output type', async () => {
    const pg = getPGBuilder()()
    const someEnum = pg.enum({
      name: 'SomeEnum',
      values: ['A', 'B'],
    })
    const someQuery = pg.query({
      name: 'someQuery',
      field: (b) =>
        b
          .enum(someEnum)
          .args((b) => ({
            arg: b.enum(someEnum),
          }))
          .resolve(({ args }) => args.arg),
    })
    const query = `
      query {
        someQuery(arg: A)
      }
    `

    const response = await graphql({
      schema: pg.build([someQuery]),
      source: query,
      contextValue: {},
    })

    expect(response).toEqual({
      data: {
        someQuery: 'A',
      },
    })
  })
})

describe('createEnumBuilder', () => {})
