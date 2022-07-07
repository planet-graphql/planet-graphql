import { graphql } from 'graphql'
import { getPGBuilder } from '..'
import { createPGEnum } from '../objects/pg-enum'
import { createPGInput } from '../objects/pg-input'
import { createInputField } from '../objects/pg-input-field'
import { DefaultScalars } from '../objects/pg-scalar'
import { mergeDefaultInputField, mergeDefaultPGInput } from '../test-utils'
import { createPGInputFieldBuilder } from './input-builder'
import { createBuilderCache } from './utils'
import type { PGTypes } from '../types/builder'

describe('InputBuilder', () => {
  it('Returns a PGInput & Sets it to the Build Cache', () => {
    const builder = getPGBuilder()()

    const result = builder.input({
      name: 'SomeInput',
      fields: (b) => ({
        id: b.id(),
      }),
    })

    const expectValue = mergeDefaultPGInput({
      name: 'SomeInput',
      value: {
        fieldMap: {
          id: mergeDefaultInputField({
            kind: 'scalar',
            type: 'id',
          }),
        },
      },
    })
    expect(result).toEqual(expectValue)
    expect(builder.cache().input.SomeInput).toEqual(expectValue)
  })

  it('Returns a PGInput that can be used as an input type', async () => {
    const pg = getPGBuilder()()
    const someInput = pg.input({
      name: 'SomeInput',
      fields: (b) => ({
        arg: b.string(),
      }),
    })
    pg.query({
      name: 'someQuery',
      field: (b) =>
        b
          .string()
          .args((b) => ({
            input: b.input(() => someInput),
          }))
          .resolve(({ args }) => args.input.arg),
    })
    const query = `
      query {
        someQuery(input: { arg: "hi" })
      }
    `

    const response = await graphql({
      schema: pg.build(),
      source: query,
      contextValue: {},
    })

    expect(response).toEqual({
      data: {
        someQuery: 'hi',
      },
    })
  })
})

describe('createInputBuilder', () => {})

describe('createPGInputFieldBuilder', () => {
  it('Returns a PGInputFieldBuilder created for the argument ScalarMap', () => {
    const builder = createPGInputFieldBuilder<PGTypes>(DefaultScalars)

    expect(Object.keys(builder)).toEqual([
      ...Object.keys(DefaultScalars),
      'enum',
      'input',
    ])
  })

  it('Returns a builder to create a scalar type inputField', () => {
    const builder = createPGInputFieldBuilder<PGTypes>(DefaultScalars)

    expect(builder.id()).toEqual(
      mergeDefaultInputField({
        kind: 'scalar',
        type: 'id',
      }),
    )
  })

  it('Returns a builder to create a enum type inputField', () => {
    const builder = createPGInputFieldBuilder<PGTypes>(DefaultScalars)
    const someEnum = createPGEnum('SomeEnum', ['A', 'B'])

    expect(builder.enum(someEnum)).toEqual(
      mergeDefaultInputField({
        kind: 'enum',
        type: someEnum,
      }),
    )
  })

  it('Returns a builder to create a input type inputField', () => {
    const cache = createBuilderCache(DefaultScalars)
    const builder = createPGInputFieldBuilder<PGTypes>(DefaultScalars)
    const someInput = createPGInput(
      'SomeInput',
      {
        id: createInputField<string, 'id', PGTypes>({ kind: 'scalar', type: 'string' }),
      },
      cache,
      builder,
    )

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const type = () => someInput
    expect(builder.input(type)).toEqual(
      mergeDefaultInputField({
        kind: 'object',
        type,
      }),
    )
  })
})
