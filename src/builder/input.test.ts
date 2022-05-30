import { expectType, TypeEqual } from 'ts-expect'
import { getPGBuilder } from '..'
import { DefaultScalars } from '../lib/scalars'
import { PGBuilder, PGTypes } from '../types/builder'
import { PGInput, PGInputField } from '../types/input'
import { createEnum } from './enum'
import {
  createInputBuilder,
  createInputField,
  createPGInput,
  createPGInputFieldBuilder,
} from './input'
import { mergeDefaultInputField, mergeDefaultPGInput } from './test-utils'
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
    const someEnum = createEnum('SomeEnum', 'A', 'B')

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

describe('PGInput', () => {
  let buider: PGBuilder<PGTypes>
  beforeEach(() => {
    buider = getPGBuilder()()
  })

  describe('copy', () => {
    it('Returns the same input with only the name changed & Set it to Builder Cache', () => {
      const original = buider.input('Original', (b) => ({
        id: b.id(),
      }))
      const copy = original.copy('Copy')

      const expectValue = mergeDefaultPGInput({
        name: 'Copy',
        fieldMap: {
          id: mergeDefaultInputField({
            kind: 'scalar',
            type: 'id',
          }),
        },
      })
      expect(copy).toEqual(expectValue)
      expect(buider.cache().input.Copy).toEqual(expectValue)
      expectType<TypeEqual<typeof original, typeof copy>>(true)
    })
    it('Returns an entirely new input, so changes do not affect the original', () => {
      const copy = buider
        .input('Original', (b) => ({
          id: b.id(),
        }))
        .copy('Copy')
        .update((f, b) => {
          return {
            id: f.id.nullish(),
            name: b.string(),
          }
        })

      const expectOriginalValue = mergeDefaultPGInput({
        name: 'Original',
        fieldMap: {
          id: mergeDefaultInputField({
            kind: 'scalar',
            type: 'id',
          }),
        },
      })

      const expectCopyValue = mergeDefaultPGInput({
        name: 'Copy',
        fieldMap: {
          id: mergeDefaultInputField({
            kind: 'scalar',
            type: 'id',
            isNullable: true,
            isOptional: true,
          }),
          name: mergeDefaultInputField({
            kind: 'scalar',
            type: 'string',
          }),
        },
      })

      expect(buider.cache().input.Original).toEqual(expectOriginalValue)
      expect(buider.cache().input.Copy).toEqual(expectCopyValue)
      expect(copy).toEqual(expectCopyValue)
    })
  })

  describe('update', () => {
    it('Returns updated object & Changes the object in Builder Cache', () => {
      const original = buider.input('Original', (b) => ({
        id: b.id(),
        name: b.string(),
      }))

      const updated = original.update((f, b) => ({
        ...f,
        name: f.name.nullish(),
        age: b.int(),
      }))

      const expectOriginalValue = mergeDefaultPGInput({
        name: 'Original',
        fieldMap: {
          id: mergeDefaultInputField({
            kind: 'scalar',
            type: 'id',
          }),
          name: mergeDefaultInputField({
            kind: 'scalar',
            type: 'string',
          }),
        },
      })

      const expectUpdatedValue = mergeDefaultPGInput({
        name: 'Original',
        fieldMap: {
          id: mergeDefaultInputField({
            kind: 'scalar',
            type: 'id',
          }),
          name: mergeDefaultInputField({
            kind: 'scalar',
            type: 'string',
            isNullable: true,
            isOptional: true,
          }),
          age: mergeDefaultInputField({
            kind: 'scalar',
            type: 'int',
          }),
        },
      })

      expect(original).toEqual(expectOriginalValue)
      expect(updated).toEqual(expectUpdatedValue)
      expect(buider.cache().input.Original).toEqual(expectUpdatedValue)
      expectType<
        TypeEqual<
          typeof updated,
          PGInput<
            {
              id: PGInputField<string, 'id', PGTypes>
              name: PGInputField<string | null | undefined, 'string', PGTypes>
              age: PGInputField<number, 'int', PGTypes>
            },
            PGTypes
          >
        >
      >(true)
    })
  })
})
