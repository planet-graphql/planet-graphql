import { Decimal } from '@prisma/client/runtime'
import { expectType } from 'tsd'
import { JsonValue } from 'type-fest'
import { getPGBuilder } from '..'
import { PGInput, PGInputField } from '../types/input'
import { mergeDefaultInputField } from './test-utils'

describe('input', () => {
  it('Creates a new PGInput & Set it to the Build Cache', () => {
    const pg = getPGBuilder()()
    const anEnum = pg.enum('enum', 'VALUE1', 'VALUE2', 'VALUE3')

    const inner = pg.input('InnerInput', (f) => ({
      id: f.id(),
    }))

    const input = pg.input('Input', (f) => ({
      id: f.id(),
      string: f.string(),
      boolean: f.boolean(),
      int: f.int(),
      bigInt: f.bigInt(),
      float: f.float(),
      dateTime: f.dateTime(),
      json: f.json(),
      byte: f.bytes(),
      decimal: f.decimal(),
      scalarList: f.string().list(),
      nullableScalar: f.string().nullish(),
      nullableScalarList: f.string().list().nullish(),
      scalarDefault: f.string().default(''),
      scalarListDefault: f.string().list().default(['']),
      nullableScalarDefault: f.string().nullish().default('').default(null),
      nullableScalarListDefault: f.string().list().nullish().default(['']).default(null),
      enum: f.enum(anEnum),
      enumList: f.enum(anEnum).list(),
      nullableEnum: f.enum(anEnum).nullish(),
      nullableEnumList: f.enum(anEnum).list().nullish(),
      enumDefault: f.enum(anEnum).default('VALUE3'),
      enumListDefault: f.enum(anEnum).list().default(['VALUE3']),
      nullableEnumDefault: f.enum(anEnum).nullish().default('VALUE3').default(null),
      nullableEnumListDefault: f
        .enum(anEnum)
        .list()
        .nullish()
        .default(['VALUE3'])
        .default(null),
      object: f.input(() => inner),
      objectList: f.input(() => inner).list(),
      nullableObject: f.input(() => inner).nullish(),
      nullableObjectList: f
        .input(() => inner)
        .nullish()
        .list(),
      objectListDefault: f
        .input(() => inner)
        .list()
        .default([]),
      nullableObjectDefault: f
        .input(() => inner)
        .nullish()
        .default(null),
      nullableObjectListDefault: f
        .input(() => inner)
        .list()
        .nullish()
        .default([])
        .default(null),
    }))

    const expectValue = {
      name: 'Input',
      fieldMap: {
        id: mergeDefaultInputField({
          kind: 'scalar',
          type: 'id',
        }),
        string: mergeDefaultInputField({
          kind: 'scalar',
          type: 'string',
        }),
        boolean: mergeDefaultInputField({
          kind: 'scalar',
          type: 'boolean',
        }),
        int: mergeDefaultInputField({
          kind: 'scalar',
          type: 'int',
        }),
        bigInt: mergeDefaultInputField({
          kind: 'scalar',
          type: 'bigInt',
        }),
        float: mergeDefaultInputField({
          kind: 'scalar',
          type: 'float',
        }),
        dateTime: mergeDefaultInputField({
          kind: 'scalar',
          type: 'dateTime',
        }),
        json: mergeDefaultInputField({
          kind: 'scalar',
          type: 'json',
        }),
        byte: mergeDefaultInputField({
          kind: 'scalar',
          type: 'bytes',
        }),
        decimal: mergeDefaultInputField({
          kind: 'scalar',
          type: 'decimal',
        }),
        scalarList: mergeDefaultInputField({
          kind: 'scalar',
          isList: true,
          type: 'string',
        }),
        nullableScalar: mergeDefaultInputField({
          kind: 'scalar',
          isOptional: true,
          isNullable: true,
          type: 'string',
        }),
        nullableScalarList: mergeDefaultInputField({
          kind: 'scalar',
          isOptional: true,
          isNullable: true,
          isList: true,
          type: 'string',
        }),
        nullableScalarDefault: mergeDefaultInputField({
          kind: 'scalar',
          isOptional: true,
          isNullable: true,
          type: 'string',
          default: null,
        }),
        nullableScalarListDefault: mergeDefaultInputField({
          kind: 'scalar',
          isOptional: true,
          isNullable: true,
          isList: true,
          type: 'string',
          default: null,
        }),
        scalarDefault: mergeDefaultInputField({
          kind: 'scalar',
          type: 'string',
          default: '',
        }),
        scalarListDefault: mergeDefaultInputField({
          kind: 'scalar',
          isList: true,
          type: 'string',
          default: [''],
        }),
        enum: mergeDefaultInputField({
          kind: 'enum',
          type: anEnum,
        }),
        enumList: mergeDefaultInputField({
          kind: 'enum',
          isList: true,
          type: anEnum,
        }),
        nullableEnum: mergeDefaultInputField({
          kind: 'enum',
          isOptional: true,
          isNullable: true,
          type: anEnum,
        }),
        nullableEnumList: mergeDefaultInputField({
          kind: 'enum',
          isOptional: true,
          isNullable: true,
          isList: true,
          type: anEnum,
        }),
        enumDefault: mergeDefaultInputField({
          kind: 'enum',
          type: anEnum,
          default: 'VALUE3',
        }),
        enumListDefault: mergeDefaultInputField({
          kind: 'enum',
          isList: true,
          type: anEnum,
          default: ['VALUE3'],
        }),
        nullableEnumDefault: mergeDefaultInputField({
          kind: 'enum',
          isOptional: true,
          isNullable: true,
          type: anEnum,
          default: null,
        }),
        nullableEnumListDefault: mergeDefaultInputField({
          kind: 'enum',
          isOptional: true,
          isNullable: true,
          isList: true,
          type: anEnum,
          default: null,
        }),
        object: mergeDefaultInputField({
          kind: 'object',
          type: expect.any(Function),
        }),
        objectList: mergeDefaultInputField({
          kind: 'object',
          isList: true,
          type: expect.any(Function),
        }),
        nullableObject: mergeDefaultInputField({
          kind: 'object',
          isOptional: true,
          isNullable: true,
          type: expect.any(Function),
        }),
        nullableObjectList: mergeDefaultInputField({
          kind: 'object',
          isOptional: true,
          isNullable: true,
          isList: true,
          type: expect.any(Function),
        }),
        objectListDefault: mergeDefaultInputField({
          kind: 'object',
          isList: true,
          type: expect.any(Function),
          default: [],
        }),
        nullableObjectDefault: mergeDefaultInputField({
          kind: 'object',
          isOptional: true,
          isNullable: true,
          type: expect.any(Function),
          default: null,
        }),
        nullableObjectListDefault: mergeDefaultInputField({
          kind: 'object',
          isOptional: true,
          isNullable: true,
          isList: true,
          type: expect.any(Function),
          default: null,
        }),
      },
      kind: 'input',
      value: {},
      validation: expect.any(Function),
    }

    expect(input).toEqual(expectValue)
    expect(pg.cache().input.Input).toEqual(expectValue)

    expectType<
      PGInput<{
        id: PGInputField<string>
        string: PGInputField<string>
        boolean: PGInputField<boolean>
        int: PGInputField<number>
        bigInt: PGInputField<bigint>
        float: PGInputField<number>
        dateTime: PGInputField<Date>
        json: PGInputField<JsonValue>
        byte: PGInputField<Buffer>
        decimal: PGInputField<Decimal>
        scalarList: PGInputField<string[]>
        nullableScalar: PGInputField<string | null | undefined>
        nullableScalarList: PGInputField<string[] | null | undefined>
        nullableScalarDefault: PGInputField<string | null | undefined>
        nullableScalarListDefault: PGInputField<string[] | null | undefined>
        scalarDefault: PGInputField<string>
        scalarListDefault: PGInputField<string[]>
        enum: PGInputField<typeof anEnum>
        enumList: PGInputField<Array<typeof anEnum>>
        nullableEnum: PGInputField<typeof anEnum | null | undefined>
        nullableEnumList: PGInputField<Array<typeof anEnum> | null | undefined>
        enumDefault: PGInputField<typeof anEnum>
        enumListDefault: PGInputField<Array<typeof anEnum>>
        nullableEnumDefault: PGInputField<typeof anEnum | null | undefined>
        nullableEnumListDefault: PGInputField<Array<typeof anEnum> | null | undefined>
        object: PGInputField<() => typeof inner>
        objectList: PGInputField<Array<() => typeof inner>>
        nullableObject: PGInputField<(() => typeof inner) | null | undefined>
        nullableObjectList: PGInputField<Array<() => typeof inner> | null | undefined>
        objectListDefault: PGInputField<Array<() => typeof inner>>
        nullableObjectDefault: PGInputField<(() => typeof inner) | null | undefined>
        nullableObjectListDefault: PGInputField<
          Array<() => typeof inner> | null | undefined
        >
      }>
    >(input)
  })

  it('Returns an existing resource because a resource with the same name cannot be created', () => {
    const pg = getPGBuilder()()
    pg.input('Input', (f) => ({
      id: f.id(),
    }))
    expect(
      pg.input('Input', (f) => ({
        id: f.id(),
        title: f.string(),
      })),
    ).toEqual({
      name: 'Input',
      fieldMap: {
        id: mergeDefaultInputField({
          kind: 'scalar',
          type: 'id',
        }),
      },
      kind: 'input',
      value: {},
      validation: expect.any(Function),
    })
  })
})
