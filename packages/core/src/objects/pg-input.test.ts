import { expectType } from 'ts-expect'
import { getPGBuilder } from '..'
import { mergeDefaultPGInput, mergeDefaultInputField } from '../test-utils'
import type { PGTypes } from '../types/builder'
import type { PGInput, PGInputField } from '../types/input'
import type { TypeEqual } from 'ts-expect'

describe('PGInput', () => {
  describe('copy', () => {
    it('Returns the same input with only the name changed & Set it to Builder Cache', () => {
      const builder = getPGBuilder()()
      const original = builder.input({
        name: 'Original',
        fields: (b) => ({
          id: b.id(),
          type: b.string(),
        }),
      })

      const copy = original.copy({
        name: 'Copy',
        fields: (f, b) => ({
          id: f.id,
          name: b.string(),
        }),
      })

      const expectValue = mergeDefaultPGInput({
        name: 'Copy',
        value: {
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
        },
      })
      expect(copy).toEqual(expectValue)
      expect(builder.cache().input.Copy).toEqual(expectValue)
      expectType<
        TypeEqual<
          typeof copy,
          PGInput<
            {
              id: PGInputField<string, 'id', PGTypes>
              name: PGInputField<string, 'string', PGTypes>
            },
            PGTypes
          >
        >
      >(true)
    })
    it('Returns an entirely new input, so changes do not affect the original', () => {
      const builder = getPGBuilder()()
      const original = builder.input({
        name: 'Original',
        fields: (b) => ({
          id: b.id(),
        }),
      })

      const copy = original.copy({
        name: 'Copy',
        fields: (f, b) => {
          return {
            id: f.id.nullish(),
            name: b.string(),
          }
        },
      })

      const expectOriginalValue = mergeDefaultPGInput({
        name: 'Original',
        value: {
          fieldMap: {
            id: mergeDefaultInputField({
              kind: 'scalar',
              type: 'id',
            }),
          },
        },
      })
      const expectCopyValue = mergeDefaultPGInput({
        name: 'Copy',
        value: {
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
        },
      })

      expect(builder.cache().input.Original).toEqual(expectOriginalValue)
      expect(builder.cache().input.Copy).toEqual(expectCopyValue)
      expect(copy).toEqual(expectCopyValue)
    })
  })
})

describe('createPGInput', () => {})

describe('convertToGraphQLInputObject', () => {})
