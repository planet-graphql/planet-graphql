import { Decimal } from '@prisma/client/runtime'
import { expectType } from 'tsd'
import { getPGBuilder } from '..'
import { PGInput, PGInputField } from '../types/input'
import { setInputFieldMethods } from './test-utils'

describe('input', () => {
  it('Creates a new PGInput & Set it to the Build Cache', () => {
    const pg = getPGBuilder<any>()
    const someEnum = pg.enum('SomeEnum', 'VALUE1', 'VALUE2', 'VALUE3')

    const inner = pg.input('SomeInnerInput', (f) => ({
      id: f.id(),
    }))

    const someInput = pg.input('SomeInput', (f) => ({
      someID: f.id(),
      someString: f.string(),
      someBoolean: f.boolean(),
      someInt: f.int(),
      someBigInt: f.bigInt(),
      someFloat: f.float(),
      someDateTime: f.dateTime(),
      someJson: f.json(),
      someByte: f.byte(),
      someDecimal: f.decimal(),
      someScalarList: f.string().list(),
      someNullableScalar: f.string().nullable(),
      someNullableScalarList: f.string().list().nullable(),
      someScalarDefault: f.string().default(''),
      someScalarListDefault: f.string().list().default(['']),
      someNullableScalarDefault: f.string().nullable().default('').default(null),
      someNullableScalarListDefault: f
        .string()
        .list()
        .nullable()
        .default([''])
        .default(null),
      someEnum: f.enum(someEnum),
      someEnumList: f.enum(someEnum).list(),
      someNullableEnum: f.enum(someEnum).nullable(),
      someNullableEnumList: f.enum(someEnum).list().nullable(),
      someEnumDefault: f.enum(someEnum).default('VALUE3'),
      someEnumListDefault: f.enum(someEnum).list().default(['VALUE3']),
      someNullableEnumDefault: f
        .enum(someEnum)
        .nullable()
        .default('VALUE3')
        .default(null),
      someNullableEnumListDefault: f
        .enum(someEnum)
        .list()
        .nullable()
        .default(['VALUE3'])
        .default(null),
      someObject: f.input(() => inner),
      someObjectList: f.input(() => inner).list(),
      someNullableObject: f.input(() => inner).nullable(),
      someNullableObjectList: f
        .input(() => inner)
        .nullable()
        .list(),
      someObjectListDefault: f
        .input(() => inner)
        .list()
        .default([]),
      someNullableObjectDefault: f
        .input(() => inner)
        .nullable()
        .default(null),
      someNullableObjectListDefault: f
        .input(() => inner)
        .list()
        .nullable()
        .default([])
        .default(null),
    }))

    const expectValue = {
      name: 'SomeInput',
      fieldMap: {
        someID: setInputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: false,
          isId: true,
          type: 'String',
        }),
        someString: setInputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: false,
          isId: false,
          type: 'String',
        }),
        someBoolean: setInputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: false,
          isId: false,
          type: 'Boolean',
        }),
        someInt: setInputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: false,
          isId: false,
          type: 'Int',
        }),
        someBigInt: setInputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: false,
          isId: false,
          type: 'BigInt',
        }),
        someFloat: setInputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: false,
          isId: false,
          type: 'Float',
        }),
        someDateTime: setInputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: false,
          isId: false,
          type: 'DateTime',
        }),
        someJson: setInputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: false,
          isId: false,
          type: 'Json',
        }),
        someByte: setInputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: false,
          isId: false,
          type: 'Bytes',
        }),
        someDecimal: setInputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: false,
          isId: false,
          type: 'Decimal',
        }),
        someScalarList: setInputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: true,
          isId: false,
          type: 'String',
        }),
        someNullableScalar: setInputFieldMethods({
          kind: 'scalar',
          isRequired: false,
          isList: false,
          isId: false,
          type: 'String',
        }),
        someNullableScalarList: setInputFieldMethods({
          kind: 'scalar',
          isRequired: false,
          isList: true,
          isId: false,
          type: 'String',
        }),
        someNullableScalarDefault: setInputFieldMethods({
          kind: 'scalar',
          isRequired: false,
          isList: false,
          isId: false,
          type: 'String',
          default: null,
        }),
        someNullableScalarListDefault: setInputFieldMethods({
          kind: 'scalar',
          isRequired: false,
          isList: true,
          isId: false,
          type: 'String',
          default: null,
        }),
        someScalarDefault: setInputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: false,
          isId: false,
          type: 'String',
          default: '',
        }),
        someScalarListDefault: setInputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: true,
          isId: false,
          type: 'String',
          default: [''],
        }),
        someEnum: setInputFieldMethods({
          kind: 'enum',
          isRequired: true,
          isList: false,
          isId: false,
          type: 'SomeEnum',
        }),
        someEnumList: setInputFieldMethods({
          kind: 'enum',
          isRequired: true,
          isList: true,
          isId: false,
          type: 'SomeEnum',
        }),
        someNullableEnum: setInputFieldMethods({
          kind: 'enum',
          isRequired: false,
          isList: false,
          isId: false,
          type: 'SomeEnum',
        }),
        someNullableEnumList: setInputFieldMethods({
          kind: 'enum',
          isRequired: false,
          isList: true,
          isId: false,
          type: 'SomeEnum',
        }),
        someEnumDefault: setInputFieldMethods({
          kind: 'enum',
          isRequired: true,
          isList: false,
          isId: false,
          type: 'SomeEnum',
          default: 'VALUE3',
        }),
        someEnumListDefault: setInputFieldMethods({
          kind: 'enum',
          isRequired: true,
          isList: true,
          isId: false,
          type: 'SomeEnum',
          default: ['VALUE3'],
        }),
        someNullableEnumDefault: setInputFieldMethods({
          kind: 'enum',
          isRequired: false,
          isList: false,
          isId: false,
          type: 'SomeEnum',
          default: null,
        }),
        someNullableEnumListDefault: setInputFieldMethods({
          kind: 'enum',
          isRequired: false,
          isList: true,
          isId: false,
          type: 'SomeEnum',
          default: null,
        }),
        someObject: setInputFieldMethods({
          kind: 'object',
          isRequired: true,
          isList: false,
          isId: false,
          type: expect.any(Function),
        }),
        someObjectList: setInputFieldMethods({
          kind: 'object',
          isRequired: true,
          isList: true,
          isId: false,
          type: expect.any(Function),
        }),
        someNullableObject: setInputFieldMethods({
          kind: 'object',
          isRequired: false,
          isList: false,
          isId: false,
          type: expect.any(Function),
        }),
        someNullableObjectList: setInputFieldMethods({
          kind: 'object',
          isRequired: false,
          isList: true,
          isId: false,
          type: expect.any(Function),
        }),
        someObjectListDefault: setInputFieldMethods({
          kind: 'object',
          isRequired: true,
          isList: true,
          isId: false,
          type: expect.any(Function),
          default: [],
        }),
        someNullableObjectDefault: setInputFieldMethods({
          kind: 'object',
          isRequired: false,
          isList: false,
          isId: false,
          type: expect.any(Function),
          default: null,
        }),
        someNullableObjectListDefault: setInputFieldMethods({
          kind: 'object',
          isRequired: false,
          isList: true,
          isId: false,
          type: expect.any(Function),
          default: null,
        }),
      },
      kind: 'input',
      value: {},
      validation: expect.any(Function),
    }

    expect(someInput).toEqual(expectValue)
    expect(pg.cache().input.SomeInput).toEqual(expectValue)

    expectType<
      PGInput<{
        someID: PGInputField<string>
        someString: PGInputField<string>
        someBoolean: PGInputField<boolean>
        someInt: PGInputField<number>
        someBigInt: PGInputField<bigint>
        someFloat: PGInputField<number>
        someDateTime: PGInputField<Date>
        someJson: PGInputField<string>
        someByte: PGInputField<Buffer>
        someDecimal: PGInputField<Decimal>
        someScalarList: PGInputField<string[]>
        someNullableScalar: PGInputField<string | null | undefined>
        someNullableScalarList: PGInputField<string[] | null | undefined>
        someNullableScalarDefault: PGInputField<string | null | undefined>
        someNullableScalarListDefault: PGInputField<string[] | null | undefined>
        someScalarDefault: PGInputField<string>
        someScalarListDefault: PGInputField<string[]>
        someEnum: PGInputField<typeof someEnum>
        someEnumList: PGInputField<Array<typeof someEnum>>
        someNullableEnum: PGInputField<typeof someEnum | null | undefined>
        someNullableEnumList: PGInputField<Array<typeof someEnum> | null | undefined>
        someEnumDefault: PGInputField<typeof someEnum>
        someEnumListDefault: PGInputField<Array<typeof someEnum>>
        someNullableEnumDefault: PGInputField<typeof someEnum | null | undefined>
        someNullableEnumListDefault: PGInputField<
          Array<typeof someEnum> | null | undefined
        >
        someObject: PGInputField<() => typeof inner>
        someObjectList: PGInputField<Array<() => typeof inner>>
        someNullableObject: PGInputField<(() => typeof inner) | null | undefined>
        someNullableObjectList: PGInputField<Array<() => typeof inner> | null | undefined>
        someObjectListDefault: PGInputField<Array<() => typeof inner>>
        someNullableObjectDefault: PGInputField<(() => typeof inner) | null | undefined>
        someNullableObjectListDefault: PGInputField<
          Array<() => typeof inner> | null | undefined
        >
      }>
    >(someInput)
  })

  it('Returns an existing resource because a resource with the same name cannot be created', () => {
    const pg = getPGBuilder<any>()
    pg.input('SomeInput', (f) => ({
      id: f.id(),
    }))
    expect(
      pg.input('SomeInput', (f) => ({
        id: f.id(),
        title: f.string(),
      })),
    ).toEqual({
      name: 'SomeInput',
      fieldMap: {
        id: setInputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: false,
          isId: true,
          type: 'String',
        }),
      },
      kind: 'input',
      value: {},
      validation: expect.any(Function),
    })
  })
})
