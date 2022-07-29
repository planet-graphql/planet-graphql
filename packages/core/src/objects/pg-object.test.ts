import { expectType } from 'ts-expect'
import { getPGBuilder } from '..'
import { mergeDefaultPGObject, mergeDefaultOutputField } from '../test-utils'
import type { PGTypes } from '../types/builder'
import type {
  PGObject,
  PGOutputFieldOptionsDefault,
  PGOutputField,
  PGInterface,
  PGObjectOptionsDefault,
} from '../types/output'
import type { TypeEqual } from 'ts-expect'

describe('PGObject', () => {
  describe('builder', () => {
    describe('Interface is specified', () => {
      it('Returns an object with fields defined in the interfaces', () => {
        const builder = getPGBuilder()()
        const interfaceA = builder.interface({
          name: 'A',
          fields: (b) => ({
            a: b.string(),
          }),
        })
        const interfaceB = builder.interface({
          name: 'B',
          fields: (b) => ({
            b: b.string(),
          }),
        })

        const object = builder.object({
          name: 'SomeObject',
          interfaces: [interfaceA, interfaceB],
          fields: (b) => ({
            id: b.int(),
          }),
        })

        const expectValue = mergeDefaultPGObject({
          name: 'SomeObject',
          value: {
            fieldMap: {
              id: mergeDefaultOutputField({
                kind: 'scalar',
                type: 'int',
              }),
              a: mergeDefaultOutputField({
                kind: 'scalar',
                type: 'string',
              }),
              b: mergeDefaultOutputField({
                kind: 'scalar',
                type: 'string',
              }),
            },
            interfaces: [interfaceA, interfaceB],
          },
        })

        expect(object).toEqual(expectValue)
        expect(builder.cache().object.SomeObject).toEqual(expectValue)
        expectType<
          TypeEqual<
            typeof object,
            PGObject<
              {
                id: PGOutputField<number, any, PGOutputFieldOptionsDefault, PGTypes>
                a: PGOutputField<string, any, PGOutputFieldOptionsDefault, PGTypes>
                b: PGOutputField<string, any, PGOutputFieldOptionsDefault, PGTypes>
              },
              Array<
                | PGInterface<{
                    a: PGOutputField<string, any, PGOutputFieldOptionsDefault, PGTypes>
                  }>
                | PGInterface<{
                    b: PGOutputField<string, any, PGOutputFieldOptionsDefault, PGTypes>
                  }>
              >,
              PGObjectOptionsDefault<PGTypes>,
              PGTypes
            >
          >
        >(true)
      })
    })
  })
  describe('copy', () => {
    it('Copies the object and adjust to specified fields & Set it to Builder Cache', () => {
      const builder = getPGBuilder()()
      const original = builder.object({
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

      const expectValue = mergeDefaultPGObject({
        name: 'Copy',
        value: {
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
        },
      })
      expect(copy).toEqual(expectValue)
      expect(builder.cache().object.Copy).toEqual(expectValue)
      expectType<
        TypeEqual<
          typeof copy,
          PGObject<
            {
              id: PGOutputField<string, any, PGOutputFieldOptionsDefault, PGTypes>
              name: PGOutputField<string, any, PGOutputFieldOptionsDefault, PGTypes>
            },
            undefined,
            PGObjectOptionsDefault<PGTypes>,
            PGTypes
          >
        >
      >(true)
    })

    it('Returns an entirely new instance, so changes do not affect the original', () => {
      const builder = getPGBuilder()()
      const original = builder.object({
        name: 'Original',
        fields: (b) => ({
          id: b.id(),
        }),
      })

      const copy = original.copy({
        name: 'Copy',
        fields: (f, b) => ({
          id: f.id.nullable(),
          name: b.string(),
        }),
      })

      const expectOriginalValue = mergeDefaultPGObject({
        name: 'Original',
        value: {
          fieldMap: {
            id: mergeDefaultOutputField({
              kind: 'scalar',
              type: 'id',
            }),
          },
        },
      })
      const expectCopyValue = mergeDefaultPGObject({
        name: 'Copy',
        value: {
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
        },
      })
      expect(original).toEqual(expectOriginalValue)
      expect(builder.cache().object.Original).toEqual(expectOriginalValue)
      expect(copy).toEqual(expectCopyValue)
      expect(builder.cache().object.Copy).toEqual(expectCopyValue)
    })
  })

  describe('implement', () => {
    it('Returns only value changed object & Changes the object in Builder Cache', () => {
      const builder = getPGBuilder()()
      const original = builder.object({
        name: 'Original',
        fields: (f) => ({
          id: f.id(),
          name: f.string(),
        }),
      })

      const modified = original.implement((f) => ({
        id: f.id.resolve((params) => `id: ${params.source.id}`),
      }))

      const expectModifiedValue = mergeDefaultPGObject({
        name: 'Original',
        value: {
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
        },
      })
      expect(original).toEqual(expectModifiedValue)
      expect(modified).toEqual(expectModifiedValue)
      expect(builder.cache().object.Original).toEqual(expectModifiedValue)
      expectType<TypeEqual<typeof original, typeof modified>>(true)
    })
  })
})

describe('createPGObject', () => {})

describe('convertGraphQLObject', () => {})
