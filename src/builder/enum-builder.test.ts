import { graphql } from 'graphql'
import { expectType, TypeEqual } from 'ts-expect'
import { getPGBuilder } from '..'
import { PGEnum } from '../types/common'

describe('EnumBuilder', () => {
  it('Returns a PGEnum & Set it to the Build Cache', () => {
    const pg = getPGBuilder()()

    const result = pg.enum('UserRole', 'USER', 'MANAGER', 'ADMIN')

    const expectValue = {
      name: 'UserRole',
      values: ['USER', 'MANAGER', 'ADMIN'],
      kind: 'enum',
    }
    expect(result).toEqual(expectValue)
    expectType<TypeEqual<typeof result, PGEnum<['USER', 'MANAGER', 'ADMIN']>>>(true)
    expect(pg.cache().enum.UserRole).toEqual(expectValue)
  })

  it('Returns a PGEnum that can be used as an Input type and a Output type', async () => {
    const pg = getPGBuilder()()
    const someEnum = pg.enum('SomeEnum', 'A', 'B')
    pg.query('someQuery', (b) =>
      b
        .enum(someEnum)
        .args((b) => ({
          arg: b.enum(someEnum),
        }))
        .resolve(({ args }) => args.arg),
    )
    const query = `
      query {
        someQuery(arg: A)
      }
    `

    const response = await graphql({
      schema: pg.build(),
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
