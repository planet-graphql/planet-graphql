import { Decimal } from '@prisma/client/runtime'
import { expectType, TypeEqual } from 'ts-expect'
import { JsonValue } from 'type-fest'
import { getPGBuilder } from '..'
import { PGTypes } from '../types/builder'
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
      TypeEqual<
        typeof input,
        PGInput<
          {
            id: PGInputField<string, 'id', PGTypes>
            string: PGInputField<string, 'string', PGTypes>
            boolean: PGInputField<boolean, 'boolean', PGTypes>
            int: PGInputField<number, 'int', PGTypes>
            bigInt: PGInputField<bigint, 'bigInt', PGTypes>
            float: PGInputField<number, 'float', PGTypes>
            dateTime: PGInputField<Date, 'dateTime', PGTypes>
            json: PGInputField<JsonValue, 'json', PGTypes>
            byte: PGInputField<Buffer, 'bytes', PGTypes>
            decimal: PGInputField<Decimal, 'decimal', PGTypes>
            scalarList: PGInputField<string[], 'string', PGTypes>
            nullableScalar: PGInputField<string | null | undefined, 'string', PGTypes>
            nullableScalarList: PGInputField<
              string[] | null | undefined,
              'string',
              PGTypes
            >
            nullableScalarDefault: PGInputField<
              string | null | undefined,
              'string',
              PGTypes
            >
            nullableScalarListDefault: PGInputField<
              string[] | null | undefined,
              'string',
              PGTypes
            >
            scalarDefault: PGInputField<string, 'string', PGTypes>
            scalarListDefault: PGInputField<string[], 'string', PGTypes>
            enum: PGInputField<typeof anEnum, 'enum', PGTypes>
            enumList: PGInputField<Array<typeof anEnum>, 'enum', PGTypes>
            nullableEnum: PGInputField<typeof anEnum | null | undefined, 'enum', PGTypes>
            nullableEnumList: PGInputField<
              Array<typeof anEnum> | null | undefined,
              'enum',
              PGTypes
            >
            enumDefault: PGInputField<typeof anEnum, 'enum', PGTypes>
            enumListDefault: PGInputField<Array<typeof anEnum>, 'enum', PGTypes>
            nullableEnumDefault: PGInputField<
              typeof anEnum | null | undefined,
              'enum',
              PGTypes
            >
            nullableEnumListDefault: PGInputField<
              Array<typeof anEnum> | null | undefined,
              'enum',
              PGTypes
            >
            object: PGInputField<() => typeof inner, 'input', PGTypes>
            objectList: PGInputField<Array<() => typeof inner>, 'input', PGTypes>
            nullableObject: PGInputField<
              (() => typeof inner) | null | undefined,
              'input',
              PGTypes
            >
            nullableObjectList: PGInputField<
              Array<() => typeof inner> | null | undefined,
              'input',
              PGTypes
            >
            objectListDefault: PGInputField<Array<() => typeof inner>, 'input', PGTypes>
            nullableObjectDefault: PGInputField<
              (() => typeof inner) | null | undefined,
              'input',
              PGTypes
            >
            nullableObjectListDefault: PGInputField<
              Array<() => typeof inner> | null | undefined,
              'input',
              PGTypes
            >
          },
          PGTypes
        >
      >
    >(true)
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
