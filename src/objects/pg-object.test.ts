import { expectType, TypeEqual } from 'ts-expect'
import { getPGBuilder } from '..'
import { mergeDefaultPGObject, mergeDefaultOutputField } from '../builder/test-utils'
import { PGBuilder, PGTypes } from '../types/builder'
import { PGObject, PGOutputFieldOptionsDefault, PGOutputField } from '../types/output'

describe('PGObject', () => {
  let buider: PGBuilder<PGTypes>
  beforeEach(() => {
    buider = getPGBuilder()()
  })

  describe('copy', () => {
    it('Returns the same object with only the name changed & Set it to Builder Cache', () => {
      const original = buider.object('Original', (b) => ({
        id: b.id(),
      }))
      const copy = original.copy('Copy')

      const expectValue = mergeDefaultPGObject({
        name: 'Copy',
        fieldMap: {
          id: mergeDefaultOutputField({
            kind: 'scalar',
            type: 'id',
          }),
        },
      })
      expect(copy).toEqual(expectValue)
      expect(buider.cache().object.Copy).toEqual(expectValue)
      expectType<TypeEqual<typeof original, typeof copy>>(true)
    })

    it('Returns an entirely new object, so changes do not affect the original', () => {
      const copy = buider
        .object('Original', (b) => ({
          id: b.id(),
        }))
        .copy('Copy')
        .update((f, b) => {
          return {
            id: f.id.nullable(),
            name: b.string(),
          }
        })

      const expectOriginalValue = mergeDefaultPGObject({
        name: 'Original',
        fieldMap: {
          id: mergeDefaultOutputField({
            kind: 'scalar',
            type: 'id',
          }),
        },
      })

      const expectCopyValue = mergeDefaultPGObject({
        name: 'Copy',
        fieldMap: {
          id: mergeDefaultOutputField({
            kind: 'scalar',
            type: 'id',
            isNullable: true,
            isOptional: true,
          }),
          name: mergeDefaultOutputField({
            kind: 'scalar',
            type: 'string',
          }),
        },
      })

      expect(buider.cache().object.Original).toEqual(expectOriginalValue)
      expect(buider.cache().object.Copy).toEqual(expectCopyValue)
      expect(copy).toEqual(expectCopyValue)
    })
  })
  describe('update', () => {
    it('Returns updated object & Changes the object in Builder Cache', () => {
      const original = buider.object('Original', (b) => ({
        id: b.id(),
        name: b.string(),
      }))

      const updated = original.update((f, b) => ({
        ...f,
        name: f.name.nullable(),
        age: b.int(),
      }))

      const expectOriginalValue = mergeDefaultPGObject({
        name: 'Original',
        fieldMap: {
          id: mergeDefaultOutputField({
            kind: 'scalar',
            type: 'id',
          }),
          name: mergeDefaultOutputField({
            kind: 'scalar',
            type: 'string',
          }),
        },
      })

      const expectUpdatedValue = mergeDefaultPGObject({
        name: 'Original',
        fieldMap: {
          id: mergeDefaultOutputField({
            kind: 'scalar',
            type: 'id',
          }),
          name: mergeDefaultOutputField({
            kind: 'scalar',
            type: 'string',
            isNullable: true,
            isOptional: true,
          }),
          age: mergeDefaultOutputField({
            kind: 'scalar',
            type: 'int',
          }),
        },
      })

      expect(original).toEqual(expectOriginalValue)
      expect(updated).toEqual(expectUpdatedValue)
      expect(buider.cache().object.Original).toEqual(expectUpdatedValue)
      expectType<
        TypeEqual<
          typeof updated,
          PGObject<
            {
              id: PGOutputField<string, any, PGOutputFieldOptionsDefault, PGTypes>
              name: PGOutputField<
                string | null,
                any,
                PGOutputFieldOptionsDefault,
                PGTypes
              >
              age: PGOutputField<number, any, PGOutputFieldOptionsDefault, PGTypes>
            },
            any,
            PGTypes
          >
        >
      >(true)
    })
  })

  describe('modify', () => {
    it('Returns only value changed object & Changes the object in Builder Cache', () => {
      const original = buider.object('Original', (b) => ({
        id: b.id(),
        name: b.string(),
      }))

      const modified = original.modify((f) => ({
        id: f.id.resolve((params) => `id: ${params.source.id}`),
      }))

      const expectModifiedValue = mergeDefaultPGObject({
        name: 'Original',
        fieldMap: {
          id: mergeDefaultOutputField({
            kind: 'scalar',
            type: 'id',
            resolve: expect.any(Function),
          }),
          name: mergeDefaultOutputField({
            kind: 'scalar',
            type: 'string',
          }),
        },
      })

      expect(original).toEqual(expectModifiedValue)
      expect(modified).toEqual(expectModifiedValue)
      expect(buider.cache().object.Original).toEqual(expectModifiedValue)
      expectType<TypeEqual<typeof original, typeof modified>>(true)
    })
  })
})

describe('createPGObject', () => {})

describe('convertGraphQLObject', () => {})
