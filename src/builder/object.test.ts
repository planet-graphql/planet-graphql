import { expectType, TypeEqual } from 'ts-expect'
import { getPGBuilder } from '..'
import { DefaultScalars } from '../lib/scalars'
import { PGBuilder, PGTypes } from '../types/builder'
import { PGObject, PGOutputField } from '../types/output'
import { createEnum } from './enum'
import { createPGInputFieldBuilder } from './input'
import {
  createObjectBuilder,
  createOutputField,
  createPGObject,
  createPGOutputFieldBuilder,
} from './object'
import { mergeDefaultOutputField, mergeDefaultPGObject } from './test-utils'
import { createBuilderCache } from './utils'

describe('createObjectBuilder', () => {
  it('Returns a builder that generates PGObjects & sets generated PGObjects in cache', () => {
    const cache = createBuilderCache(DefaultScalars)
    const inputFieldBuilder = createPGInputFieldBuilder<PGTypes>(DefaultScalars)
    const outputFieldBuilder = createPGOutputFieldBuilder<PGTypes>(
      DefaultScalars,
      inputFieldBuilder,
    )
    const builder = createObjectBuilder<PGTypes>(
      cache,
      outputFieldBuilder,
      inputFieldBuilder,
    )

    const object = builder('SomeObject', (b) => ({
      id: b.id(),
    }))

    const expectValue = mergeDefaultPGObject({
      name: 'SomeObject',
      fieldMap: {
        id: mergeDefaultOutputField({
          kind: 'scalar',
          type: 'id',
        }),
      },
    })

    expect(object).toEqual(expectValue)
    expect(cache.object.SomeObject).toEqual(expectValue)
  })
})

describe('createPGOutputFieldBuilder', () => {
  it('Returns a PGOutputFieldBuilder created for the argument ScalarMap', () => {
    const inputFieldBuilder = createPGInputFieldBuilder<PGTypes>(DefaultScalars)
    const builder = createPGOutputFieldBuilder<PGTypes>(DefaultScalars, inputFieldBuilder)

    expect(Object.keys(builder)).toEqual([
      ...Object.keys(DefaultScalars),
      'enum',
      'object',
    ])
  })

  it('Returns a builder to create a scalar type outputField', () => {
    const inputFieldBuilder = createPGInputFieldBuilder<PGTypes>(DefaultScalars)
    const builder = createPGOutputFieldBuilder<PGTypes>(DefaultScalars, inputFieldBuilder)

    expect(builder.id()).toEqual(
      mergeDefaultOutputField({
        kind: 'scalar',
        type: 'id',
      }),
    )
  })

  it('Returns a builder to create a enum type outputField', () => {
    const inputFieldBuilder = createPGInputFieldBuilder<PGTypes>(DefaultScalars)
    const builder = createPGOutputFieldBuilder<PGTypes>(DefaultScalars, inputFieldBuilder)
    const someEnum = createEnum('SomeEnum', 'A', 'B')

    expect(builder.enum(someEnum)).toEqual(
      mergeDefaultOutputField({
        kind: 'enum',
        type: someEnum,
      }),
    )
  })

  it('Returns a builder to create a input type inputField', () => {
    const cache = createBuilderCache(DefaultScalars)
    const inputFieldBuilder = createPGInputFieldBuilder<PGTypes>(DefaultScalars)
    const outputFieldBuilder = createPGOutputFieldBuilder<PGTypes>(
      DefaultScalars,
      inputFieldBuilder,
    )
    const builder = createPGOutputFieldBuilder<PGTypes>(DefaultScalars, inputFieldBuilder)
    const someObject = createPGObject(
      'SomeInput',
      {
        id: createOutputField<string, PGTypes>(
          {
            kind: 'scalar',
            type: 'string',
          },
          inputFieldBuilder,
        ),
      },
      cache,
      outputFieldBuilder,
      inputFieldBuilder,
    )

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const type = () => someObject
    expect(builder.object(type)).toEqual(
      mergeDefaultOutputField({
        kind: 'object',
        type,
      }),
    )
  })
})

describe('createOutputField', () => {
  it('Returns a PGOutputField', () => {
    const inputFieldBuilder = createPGInputFieldBuilder<PGTypes>(DefaultScalars)
    const outputField = createOutputField<string, PGTypes>(
      {
        kind: 'scalar',
        type: 'string',
      },
      inputFieldBuilder,
    )

    expect(outputField).toEqual(
      mergeDefaultOutputField({
        kind: 'scalar',
        type: 'string',
      }),
    )
  })
})

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
              id: PGOutputField<string, any, undefined, PGTypes>
              name: PGOutputField<string | null, any, undefined, PGTypes>
              age: PGOutputField<number, any, undefined, PGTypes>
            },
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
        name: f.name,
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
