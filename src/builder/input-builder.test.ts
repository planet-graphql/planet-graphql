import { getPGBuilder } from '..'
import { DefaultScalars } from '../lib/scalars'
import { createPGEnum } from '../objects/pg-enum'
import { createPGInput } from '../objects/pg-input'
import { createInputField } from '../objects/pg-input-field'
import { mergeDefaultInputField, mergeDefaultPGInput } from '../test-utils'
import { PGTypes } from '../types/builder'
import { createPGInputFieldBuilder } from './input-builder'
import { createBuilderCache } from './utils'

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
      fieldMap: {
        id: mergeDefaultInputField({
          kind: 'scalar',
          type: 'id',
        }),
      },
    })
    expect(result).toEqual(expectValue)
    expect(builder.cache().input.SomeInput).toEqual(expectValue)
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
    const someEnum = createPGEnum('SomeEnum', ['A', 'B'] as const)

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
