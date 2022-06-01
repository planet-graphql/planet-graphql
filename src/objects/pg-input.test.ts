import { expectType, TypeEqual } from 'ts-expect'
import { getPGBuilder } from '..'
import { mergeDefaultPGInput, mergeDefaultInputField } from '../builder/test-utils'
import { PGBuilder, PGTypes } from '../types/builder'
import { PGInput, PGInputField } from '../types/input'

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

describe('createPGInput', () => {})

describe('convertToGraphQLInputObject', () => {})
