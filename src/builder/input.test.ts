import { DefaultScalars } from '../lib/scalars'
import { PGTypes } from '../types/builder'
import { createEnum } from './enum'
import {
  createInputBuilder,
  createInputField,
  createPGInput,
  createPGInputFieldBuilder,
} from './input'
import { mergeDefaultInputField } from './test-utils'
import { createBuilderCache } from './utils'

describe('createInputBuilder', () => {
  it('Returns a builder that generates PGInput & sets generated PGInputs in cache', () => {
    const cache = createBuilderCache(DefaultScalars)
    const fieldBuilder = createPGInputFieldBuilder<PGTypes>(DefaultScalars)
    const builder = createInputBuilder<PGTypes>(cache, fieldBuilder)

    const input = builder('SomeInput', (b) => ({
      id: b.id(),
    }))

    const expectValue = {
      name: 'SomeInput',
      fieldMap: {
        id: mergeDefaultInputField({
          kind: 'scalar',
          type: 'id',
        }),
      },
      kind: 'input',
      value: {},
      validation: expect.any(Function),
    }

    expect(input).toEqual(expectValue)
    expect(cache.input.SomeInput).toEqual(expectValue)
  })

  it('Returns an existing resource because a resource with the same name cannot be created', () => {
    const cache = createBuilderCache(DefaultScalars)
    const fieldBuilder = createPGInputFieldBuilder<PGTypes>(DefaultScalars)
    const builder = createInputBuilder<PGTypes>(cache, fieldBuilder)

    builder('SomeInput', (b) => ({
      id: b.id(),
    }))

    const input = builder('SomeInput', (b) => ({
      int: b.int(),
    }))

    const expectValue = {
      name: 'SomeInput',
      fieldMap: {
        id: mergeDefaultInputField({
          kind: 'scalar',
          type: 'id',
        }),
      },
      kind: 'input',
      value: {},
      validation: expect.any(Function),
    }

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
    const someEnum = createEnum('SomeEnum', 'A', 'B')

    expect(builder.enum(someEnum)).toEqual(
      mergeDefaultInputField({
        kind: 'enum',
        type: someEnum,
      }),
    )
  })

  it('Returns a builder to create a input type inputField', () => {
    const builder = createPGInputFieldBuilder<PGTypes>(DefaultScalars)
    const someInput = createPGInput('SomeInput', {
      id: createInputField<string, 'id', PGTypes>({ kind: 'scalar', type: 'string' }),
    })

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

describe('createInputField', () => {
  it('Returns a PGInputField', () => {
    const inputField = createInputField<string, 'string', PGTypes>({
      kind: 'scalar',
      type: 'string',
    })

    expect(inputField).toEqual(
      mergeDefaultInputField({
        kind: 'scalar',
        type: 'string',
      }),
    )
  })
})
