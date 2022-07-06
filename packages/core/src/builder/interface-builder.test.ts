import { graphql } from 'graphql'
import { getPGBuilder } from '..'
import { mergeDefaultPGInterface, mergeDefaultOutputField } from '../test-utils'

describe('InterfaceBuilder', () => {
  it('Returns a PGInterface & Sets it to the Build Cache', () => {
    const pg = getPGBuilder()()

    const result = pg.interface({
      name: 'SomeInterface',
      fields: (b) => ({
        id: b.id(),
      }),
    })

    const expectValue = mergeDefaultPGInterface({
      name: 'SomeInterface',
      value: {
        fieldMap: {
          id: mergeDefaultOutputField({
            kind: 'scalar',
            type: 'id',
          }),
        },
      },
    })
    expect(result).toEqual(expectValue)
    expect(pg.cache().interface.SomeInterface).toEqual(expectValue)
  })

  it('Returns a PGInterface that can be used as an output type', async () => {
    const pg = getPGBuilder()()
    const someInterface = pg.interface({
      name: 'SomeInterface',
      fields: (b) => ({
        id: b.id(),
      }),
    })
    pg.object({
      name: 'SomeObject',
      interfaces: [someInterface],
      fields: (b) => ({
        name: b.string(),
      }),
      isTypeOf: (value) => value.name !== undefined,
    })
    pg.query({
      name: 'someQuery',
      field: (b) =>
        b
          .object(() => someInterface)
          .resolve(() => {
            return { id: '1', name: 'xxx' }
          }),
    })
    const query = `
      query {
        someQuery {
          id
          ... on SomeObject {
            name
          }
        }
      }
    `

    const response = await graphql({
      schema: pg.build(),
      source: query,
      contextValue: {},
    })

    expect(response).toEqual({
      data: {
        someQuery: {
          id: '1',
          name: 'xxx',
        },
      },
    })
  })
})

describe('createInterfaceBuilder', () => {})
