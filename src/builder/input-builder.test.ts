import { DefaultScalars } from '../lib/scalars'
import { createPGEnum } from '../objects/pg-enum'
import { createPGInput } from '../objects/pg-input'
import { createInputField } from '../objects/pg-input-field'
import { mergeDefaultInputField, mergeDefaultPGInput } from '../test-utils'
import { PGTypes } from '../types/builder'
import { createInputBuilder, createPGInputFieldBuilder } from './input-builder'
import { createBuilderCache } from './utils'

describe('createInputBuilder', () => {
  it('Returns a builder that generates PGInput & sets generated PGInputs in cache', () => {
    const cache = createBuilderCache(DefaultScalars)
    const fieldBuilder = createPGInputFieldBuilder<PGTypes>(DefaultScalars)
    const builder = createInputBuilder<PGTypes>(cache, fieldBuilder)

    const input = builder('SomeInput', (b) => ({
      id: b.id(),
    }))

    const expectValue = mergeDefaultPGInput({
      name: 'SomeInput',
      fieldMap: {
        id: mergeDefaultInputField({
          kind: 'scalar',
          type: 'id',
        }),
      },
    })

    expect(input).toEqual(expectValue)
    expect(cache.input.SomeInput).toEqual(expectValue)
  })
})

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
    const someEnum = createPGEnum('SomeEnum', 'A', 'B')

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
