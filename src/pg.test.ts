import { AbilityBuilder, subject } from '@casl/ability'
import { PrismaAbility } from '@casl/prisma'
import { Prisma } from '@prisma/client'
import { DMMF } from '@prisma/generator-helper'
import { getDMMF } from '@prisma/sdk'
import {
  ExecutionResult,
  graphql,
  GraphQLError,
  GraphQLSchema,
  parse,
  subscribe,
} from 'graphql'
import { PubSub } from 'graphql-subscriptions'
import _ from 'lodash'
import { expectType } from 'tsd'
import { JsonValue, ReadonlyDeep, RequireAtLeastOne } from 'type-fest'
import { z } from 'zod'
import { parseResolveInfo } from './graphql-parse-resolve-info'
import { getPGBuilder, PGError } from './pg'
import { PGCache } from './types/builder'
import {
  PGFieldMap,
  PGField,
  PGModel,
  PGSelectorType,
  PGEnum,
  TypeOfPGModelBase,
  ResolveParams,
} from './types/common'
import { PGInputField, PGInput, InputFieldBuilder } from './types/input'
import { PGOutputField, PGObject } from './types/output'

function setOutputFieldMethods(
  value: PGOutputField<any, any>['value'],
): PGOutputField<any, any> {
  return {
    value,
    nullable: expect.any(Function),
    list: expect.any(Function),
    args: expect.any(Function),
    resolve: expect.any(Function),
    subscribe: expect.any(Function),
    auth: expect.any(Function),
    __type: undefined as any,
  }
}

function setInputFieldMethods(value: PGInputField<any>['value']): PGInputField<any> {
  return {
    value,
    nullable: expect.any(Function),
    list: expect.any(Function),
    default: expect.any(Function),
    validation: expect.any(Function),
    __type: undefined as any,
  }
}

function setPGObjectProperties(object: {
  name: string
  fieldMap: { [key: string]: any }
  value?: {
    isRelayConnection?: boolean
  }
}): PGObject<any> {
  return {
    kind: 'object',
    value: object.value ?? {},
    prismaAuth: expect.any(Function),
    checkPrismaPermission: expect.any(Function),
    ...object,
  }
}

function pgObjectToPGModel<TPrismaFindArgs = any>(): <
  T extends PGObject<any>,
  TFieldMap extends PGFieldMap = T extends PGObject<infer TOutputFieldMap>
    ? {
        [P in keyof TOutputFieldMap]: TOutputFieldMap[P] extends PGOutputField<infer U>
          ? PGField<U>
          : never
      }
    : never,
>(
  object: T,
  pgCache?: ReadonlyDeep<PGCache>,
) => PGModel<TFieldMap, TPrismaFindArgs> {
  return (object, pgCache) => {
    const model = {
      name: object.name,
      kind: 'model',
      fieldMap: object.fieldMap,
    } as any
    if (pgCache !== undefined) {
      const readableCache = pgCache as PGCache
      readableCache.model[model.name] = model
    }
    return model
  }
}

describe('PGSelectorType', () => {
  it("'Json'型の変換に他の型が影響されない", () => {
    const selector: PGSelectorType<{
      json: JsonValue
      jsonArray: JsonValue[]
      jsonScalarUnion: JsonValue | Date | Buffer
      // NOTE: JsonValueがJsonValue[]を含むため考慮しなくて良い
      // jsonJsonArrayUnion: JsonValue | JsonValue[]
      jsonObjectUnion: JsonValue | { date: Date }
    }> = {
      json: 'Json',
      jsonArray: ['Json'],
      jsonScalarUnion: 'Json',
      jsonObjectUnion: { date: 'DateTime' },
    }

    expectType<
      RequireAtLeastOne<{
        json: 'Json'
        jsonArray: ['Json']
        jsonScalarUnion: 'Json' | 'DateTime' | 'Bytes'
        jsonObjectUnion: 'Json' | { date: 'DateTime' }
      }>
    >(selector)
  })

  it("各Scalar型と'Json'型に変換される", () => {
    const selector: PGSelectorType<{
      base: {
        required: boolean
        optional?: boolean
        null: null
      }
      scalar: {
        string: string
        number: number
        boolean: boolean
        bigint: bigint
        date: Date
        buffer: Buffer
        decimal: Prisma.Decimal
      }
      array: {
        scalarArray: string[]
      }
      union: {
        scalarUnion: string | number | boolean | bigint | Date | Buffer | Prisma.Decimal
        nullUnion: string | null
      }
      json: {
        json: JsonValue
        jsonArray: JsonValue[]
        jsonScalarUnion: JsonValue | Date | Buffer
        // NOTE: JsonValue自体がJsonValue[]を含むため考慮しなくて良い
        // jsonJsonArrayUnion: JsonValue | JsonValue[]
        jsonObjectUnion: JsonValue | { date: Date }
      }
      object: {
        depth1: {
          string: string
        }
        depth2: {
          inner: {
            string: string
          }
        }
      }
      complex: {
        arrayObject: Array<{ string: string }>
        scalarArrayUnion: string | string[]
        scalarObjectUnion: string | { string: string }
        objectArrayUnion: { string: string } | string[]
        objectObjectUnion: { string: string } | { number: number }
        objectArrayObjectUnion: { string: string } | Array<{ string: string }>
      }
    }> = {
      json: {
        json: 'Json',
        jsonArray: ['Json'],
        jsonScalarUnion: 'DateTime',
        jsonObjectUnion: { date: 'DateTime' },
      },
      complex: {
        arrayObject: [
          {
            string: 'String',
          },
        ],
        scalarArrayUnion: ['String'],
        scalarObjectUnion: {
          string: 'String',
        },
        objectArrayUnion: ['String'],
        objectObjectUnion: { number: 'Int' },
        objectArrayObjectUnion: [
          {
            string: 'String',
          },
        ],
      },
    }

    expectType<
      RequireAtLeastOne<{
        base: RequireAtLeastOne<{
          required: 'Boolean'
          optional?: 'Boolean'
          null: never
        }>
        scalar: RequireAtLeastOne<{
          string: 'String'
          number: 'Int' | 'Float'
          boolean: 'Boolean'
          bigint: 'BigInt'
          date: 'DateTime'
          buffer: 'Bytes'
          decimal: 'Decimal'
        }>
        array: RequireAtLeastOne<{
          scalarArray: ['String']
        }>
        union: RequireAtLeastOne<{
          scalarUnion:
            | 'String'
            | 'Int'
            | 'Float'
            | 'Boolean'
            | 'BigInt'
            | 'DateTime'
            | 'Bytes'
            | 'Decimal'
          nullUnion: 'String'
        }>
        json: RequireAtLeastOne<{
          json: 'Json'
          jsonArray: ['Json']
          jsonScalarUnion: 'Json' | 'DateTime' | 'Bytes'
          jsonObjectUnion: 'Json' | { date: 'DateTime' }
        }>
        object: RequireAtLeastOne<{
          depth1: {
            string: 'String'
          }
          depth2: {
            inner: {
              string: 'String'
            }
          }
        }>
        complex: RequireAtLeastOne<{
          arrayObject: [{ string: 'String' }]
          scalarArrayUnion: 'String' | ['String']
          scalarObjectUnion: 'String' | { string: 'String' }
          objectArrayUnion: { string: 'String' } | ['String']
          objectObjectUnion: { string: 'String' } | { number: 'Int' | 'Float' }
          objectArrayObjectUnion: { string: 'String' } | [{ string: 'String' }]
        }>
      }>
    >(selector)
  })
})

describe('getPGBuilder', () => {
  describe('queryArgsBuilder', () => {
    it('指定した型に沿ったSelectorが指定でき、Selectorの内容に従ったPGFieldMapが返る', () => {
      const pg = getPGBuilder<any>()
      type SomeType = {
        string: string
        int: number
        float: number
        boolean: boolean
        bigint: bigint
        date: Date
        buffer: Buffer
        decimal: Prisma.Decimal
        json: JsonValue
        object: {
          string: string
        }
        nestedObject: {
          inner: {
            string: string
          }
        }
        array: string[]
        arrayObject: [
          {
            string: string
          },
        ]
      }

      const queryArgs = pg.queryArgsBuilder<SomeType>('Prefix')({
        string: 'String',
        int: 'Int',
        float: 'Float',
        boolean: 'Boolean',
        bigint: 'BigInt',
        date: 'DateTime',
        buffer: 'Bytes',
        decimal: 'Decimal',
        json: 'Json',
        object: {
          string: 'String',
        },
        nestedObject: {
          inner: {
            string: 'String',
          },
        },
        array: ['String'],
        arrayObject: [
          {
            string: 'String',
          },
        ],
      })

      const expectValue = {
        string: setInputFieldMethods({
          kind: 'scalar',
          isRequired: false,
          isList: false,
          isId: false,
          type: 'String',
        }),
        int: setInputFieldMethods({
          kind: 'scalar',
          isRequired: false,
          isList: false,
          isId: false,
          type: 'Int',
        }),
        float: setInputFieldMethods({
          kind: 'scalar',
          isRequired: false,
          isList: false,
          isId: false,
          type: 'Float',
        }),
        boolean: setInputFieldMethods({
          kind: 'scalar',
          isRequired: false,
          isList: false,
          isId: false,
          type: 'Boolean',
        }),
        bigint: setInputFieldMethods({
          kind: 'scalar',
          isRequired: false,
          isList: false,
          isId: false,
          type: 'BigInt',
        }),
        date: setInputFieldMethods({
          kind: 'scalar',
          isRequired: false,
          isList: false,
          isId: false,
          type: 'DateTime',
        }),
        buffer: setInputFieldMethods({
          kind: 'scalar',
          isRequired: false,
          isList: false,
          isId: false,
          type: 'Bytes',
        }),
        decimal: setInputFieldMethods({
          kind: 'scalar',
          isRequired: false,
          isList: false,
          isId: false,
          type: 'Decimal',
        }),
        json: setInputFieldMethods({
          kind: 'scalar',
          isRequired: false,
          isList: false,
          isId: false,
          type: 'Json',
        }),
        object: setInputFieldMethods({
          kind: 'object',
          isRequired: false,
          isList: false,
          isId: false,
          type: expect.any(Function),
        }),
        nestedObject: setInputFieldMethods({
          kind: 'object',
          isRequired: false,
          isList: false,
          isId: false,
          type: expect.any(Function),
        }),
        array: setInputFieldMethods({
          kind: 'scalar',
          isRequired: false,
          isList: true,
          isId: false,
          type: 'String',
        }),
        arrayObject: setInputFieldMethods({
          kind: 'object',
          isRequired: false,
          isList: true,
          isId: false,
          type: expect.any(Function),
        }),
      }

      expect(queryArgs).toEqual(expectValue)
      expect((queryArgs.object.value.type as Function)().name).toEqual(
        'PrefixObjectInput',
      )
      expect((queryArgs.nestedObject.value.type as Function)().name).toEqual(
        'PrefixNestedObjectInput',
      )
      expect((queryArgs.arrayObject.value.type as Function)().name).toEqual(
        'PrefixArrayObjectInput',
      )
      expect(pg.cache().input).toEqual({
        PrefixObjectInput: {
          name: 'PrefixObjectInput',
          fieldMap: {
            string: setInputFieldMethods({
              kind: 'scalar',
              isRequired: false,
              isList: false,
              isId: false,
              type: 'String',
            }),
          },
          value: {},
          kind: 'input',
          validation: expect.any(Function),
        },
        PrefixNestedObjectInput: {
          name: 'PrefixNestedObjectInput',
          fieldMap: {
            inner: setInputFieldMethods({
              kind: 'object',
              isRequired: false,
              isList: false,
              isId: false,
              type: expect.any(Function),
            }),
          },
          value: {},
          kind: 'input',
          validation: expect.any(Function),
        },
        PrefixNestedObjectInnerInput: {
          name: 'PrefixNestedObjectInnerInput',
          fieldMap: {
            string: setInputFieldMethods({
              kind: 'scalar',
              isRequired: false,
              isList: false,
              isId: false,
              type: 'String',
            }),
          },
          value: {},
          kind: 'input',
          validation: expect.any(Function),
        },
        PrefixArrayObjectInput: {
          name: 'PrefixArrayObjectInput',
          fieldMap: {
            string: setInputFieldMethods({
              kind: 'scalar',
              isRequired: false,
              isList: false,
              isId: false,
              type: 'String',
            }),
          },
          value: {},
          kind: 'input',
          validation: expect.any(Function),
        },
      })
      expect(
        (pg.cache().input.PrefixNestedObjectInput.fieldMap.inner.value.type as Function)()
          .name,
      ).toEqual('PrefixNestedObjectInnerInput')

      expectType<{
        string: PGInputField<string | null | undefined>
        int: PGInputField<number | null | undefined>
        float: PGInputField<number | null | undefined>
        boolean: PGInputField<boolean | null | undefined>
        bigint: PGInputField<bigint | null | undefined>
        date: PGInputField<Date | null | undefined>
        buffer: PGInputField<Buffer | null | undefined>
        decimal: PGInputField<Prisma.Decimal | null | undefined>
        json: PGInputField<string | null | undefined>
        object: PGInputField<
          | PGInput<{
              string: PGInputField<string | null | undefined>
            }>
          | null
          | undefined
        >
        nestedObject: PGInputField<
          | PGInput<{
              inner: PGInputField<
                | PGInput<{
                    string: PGInputField<string | null | undefined>
                  }>
                | null
                | undefined
              >
            }>
          | null
          | undefined
        >
        array: PGInputField<string[] | null | undefined>
        arrayObject: PGInputField<
          | Array<
              PGInput<{
                string: PGInputField<string | null | undefined>
              }>
            >
          | null
          | undefined
        >
      }>(queryArgs)
    })
  })

  describe('enum', () => {
    it('Enumが作られて、cacheにEnumValueが設定される', () => {
      const pg = getPGBuilder<any>()
      const result = pg.enum('UserRole', 'USER', 'MANAGER', 'ADMIN')
      const expectValue = {
        name: 'UserRole',
        values: ['USER', 'MANAGER', 'ADMIN'],
        kind: 'enum',
      }
      expect(result).toEqual(expectValue)
      expectType<PGEnum<['USER', 'MANAGER', 'ADMIN']>>(result)

      const cache = pg.cache().enum.UserRole
      expect(cache).toEqual(expectValue)
    })

    it('同じ名前のPGEnumは作成できず既存のリソースを返却する', () => {
      const pg = getPGBuilder<any>()
      pg.enum('SomeRole', 'A', 'B')

      expect(pg.enum('SomeRole', 'A', 'B', 'C')).toEqual({
        name: 'SomeRole',
        values: ['A', 'B'],
        kind: 'enum',
      })
    })
  })

  describe('object', () => {
    it('PGObjectが作られて、cacheにobjectとして設定される', () => {
      const pg = getPGBuilder<any>()
      const userRole = pg.enum('UserRole', 'USER', 'MANAGER', 'ADMIN')

      const post = pg.object('Post', (f) => ({
        id: f.id(),
        title: f.string(),
        ref: f.object(() => someObject),
      }))

      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      const someArgsBuilder = (f: InputFieldBuilder<any>) => ({
        arg: f.string(),
      })

      const someObject = pg.object('SomeObject', (f) => ({
        someID: f.id().args(someArgsBuilder),
        someString: f.string().args(someArgsBuilder),
        someBoolean: f.boolean().args(someArgsBuilder),
        someInt: f.int().args(someArgsBuilder),
        someBigInt: f.bigInt().args(someArgsBuilder),
        someFloat: f.float().args(someArgsBuilder),
        someDateTime: f.dateTime().args(someArgsBuilder),
        someJson: f.json().args(someArgsBuilder),
        someByte: f.byte().args(someArgsBuilder),
        someDecimal: f.decimal().args(someArgsBuilder),
        someObject: f.object(() => post).args(someArgsBuilder),
        someEnum: f.enum(userRole).args(someArgsBuilder),
        someScalarList: f.string().list(),
        someNullableScalar: f.string().nullable(),
        someNullableScalarList: f.string().list().nullable(),
        someEnumList: f.enum(userRole).list(),
        someNullableEnum: f.enum(userRole).nullable(),
        someNullableEnumList: f.enum(userRole).list().nullable(),
        someObjectList: f.object(() => post).list(),
        someNullableObject: f.object(() => post).nullable(),
        someNullableObjectList: f
          .object(() => post)
          .nullable()
          .list(),
      }))

      const expectSomeArgs = {
        arg: setInputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: false,
          isId: false,
          type: 'String',
        }),
      }

      const expectValue = setPGObjectProperties({
        name: 'SomeObject',
        fieldMap: {
          someID: setOutputFieldMethods({
            kind: 'scalar',
            isRequired: true,
            isList: false,
            isId: true,
            type: 'String',
            args: expectSomeArgs,
          }),
          someString: setOutputFieldMethods({
            kind: 'scalar',
            isRequired: true,
            isList: false,
            isId: false,
            type: 'String',
            args: expectSomeArgs,
          }),
          someBoolean: setOutputFieldMethods({
            kind: 'scalar',
            isRequired: true,
            isList: false,
            isId: false,
            type: 'Boolean',
            args: expectSomeArgs,
          }),
          someInt: setOutputFieldMethods({
            kind: 'scalar',
            isRequired: true,
            isList: false,
            isId: false,
            type: 'Int',
            args: expectSomeArgs,
          }),
          someBigInt: setOutputFieldMethods({
            kind: 'scalar',
            isRequired: true,
            isList: false,
            isId: false,
            type: 'BigInt',
            args: expectSomeArgs,
          }),
          someFloat: setOutputFieldMethods({
            kind: 'scalar',
            isRequired: true,
            isList: false,
            isId: false,
            type: 'Float',
            args: expectSomeArgs,
          }),
          someDateTime: setOutputFieldMethods({
            kind: 'scalar',
            isRequired: true,
            isList: false,
            isId: false,
            type: 'DateTime',
            args: expectSomeArgs,
          }),
          someJson: setOutputFieldMethods({
            kind: 'scalar',
            isRequired: true,
            isList: false,
            isId: false,
            type: 'Json',
            args: expectSomeArgs,
          }),
          someByte: setOutputFieldMethods({
            kind: 'scalar',
            isRequired: true,
            isList: false,
            isId: false,
            type: 'Bytes',
            args: expectSomeArgs,
          }),
          someDecimal: setOutputFieldMethods({
            kind: 'scalar',
            isRequired: true,
            isList: false,
            isId: false,
            type: 'Decimal',
            args: expectSomeArgs,
          }),
          someObject: setOutputFieldMethods({
            kind: 'object',
            isRequired: true,
            isList: false,
            isId: false,
            type: expect.any(Function),
            args: expectSomeArgs,
          }),
          someEnum: setOutputFieldMethods({
            kind: 'enum',
            isRequired: true,
            isList: false,
            isId: false,
            type: 'UserRole',
            args: expectSomeArgs,
          }),
          someScalarList: setOutputFieldMethods({
            kind: 'scalar',
            isRequired: true,
            isList: true,
            isId: false,
            type: 'String',
          }),
          someNullableScalar: setOutputFieldMethods({
            kind: 'scalar',
            isRequired: false,
            isList: false,
            isId: false,
            type: 'String',
          }),
          someNullableScalarList: setOutputFieldMethods({
            kind: 'scalar',
            isRequired: false,
            isList: true,
            isId: false,
            type: 'String',
          }),
          someEnumList: setOutputFieldMethods({
            kind: 'enum',
            isRequired: true,
            isList: true,
            isId: false,
            type: 'UserRole',
          }),
          someNullableEnum: setOutputFieldMethods({
            kind: 'enum',
            isRequired: false,
            isList: false,
            isId: false,
            type: 'UserRole',
          }),
          someNullableEnumList: setOutputFieldMethods({
            kind: 'enum',
            isRequired: false,
            isList: true,
            isId: false,
            type: 'UserRole',
          }),
          someObjectList: setOutputFieldMethods({
            kind: 'object',
            isRequired: true,
            isList: true,
            isId: false,
            type: expect.any(Function),
          }),
          someNullableObject: setOutputFieldMethods({
            kind: 'object',
            isRequired: false,
            isList: false,
            isId: false,
            type: expect.any(Function),
          }),
          someNullableObjectList: setOutputFieldMethods({
            kind: 'object',
            isRequired: false,
            isList: true,
            isId: false,
            type: expect.any(Function),
          }),
        },
      })

      expect(someObject).toEqual(expectValue)
      expect(pg.cache().object.SomeObject).toEqual(expectValue)

      type ExpectArgsType = { arg: PGInputField<string> }
      expectType<
        PGObject<{
          someID: PGOutputField<string, ExpectArgsType>
          someString: PGOutputField<string, ExpectArgsType>
          someBoolean: PGOutputField<boolean, ExpectArgsType>
          someInt: PGOutputField<number, ExpectArgsType>
          someBigInt: PGOutputField<bigint, ExpectArgsType>
          someFloat: PGOutputField<number, ExpectArgsType>
          someDateTime: PGOutputField<Date, ExpectArgsType>
          someJson: PGOutputField<string, ExpectArgsType>
          someByte: PGOutputField<Buffer, ExpectArgsType>
          someDecimal: PGOutputField<Prisma.Decimal, ExpectArgsType>
          someObject: PGOutputField<() => typeof post, ExpectArgsType>
          someEnum: PGOutputField<typeof userRole, ExpectArgsType>
          someScalarList: PGOutputField<string[], any>
          someNullableScalar: PGOutputField<string | null, any>
          someNullableScalarList: PGOutputField<string[] | null, any>
          someEnumList: PGOutputField<Array<typeof userRole>, any>
          someNullableEnum: PGOutputField<typeof userRole | null, any>
          someNullableEnumList: PGOutputField<Array<typeof userRole> | null, any>
          someObjectList: PGOutputField<Array<() => typeof post>, any>
          someNullableObject: PGOutputField<(() => typeof post) | null, any>
          someNullableObjectList: PGOutputField<Array<() => typeof post> | null, any>
        }>
      >(someObject)
    })

    it('同じ名前のPGObjectは作成できず既存のリソースを返却する', () => {
      const pg = getPGBuilder<any>()
      pg.object('SomeObject', (f) => ({
        id: f.id(),
      }))
      expect(
        pg.object('SomeObject', (f) => ({
          id: f.id(),
          title: f.string(),
        })),
      ).toEqual(
        setPGObjectProperties({
          name: 'SomeObject',
          fieldMap: {
            id: setOutputFieldMethods({
              kind: 'scalar',
              isRequired: true,
              isList: false,
              isId: true,
              type: 'String',
            }),
          },
        }),
      )
    })
  })

  describe('objectFromModel', () => {
    it('PGModelのfieldと新規のfieldを持つ、新規のPGObjectが作られる', () => {
      const user: PGModel<
        { id: PGField<string>; age: PGField<number> },
        { where?: { id: string } }
      > = {
        name: 'User',
        fieldMap: {
          id: {
            value: {
              kind: 'scalar',
              isRequired: true,
              isList: false,
              isId: true,
              type: 'String',
            },
            args: () => {},
            list: () => {},
            nullable: () => {},
            resolve: () => {},
            subscribe: () => {},
            auth: () => {},
          } as any,
          age: {
            value: {
              kind: 'scalar',
              isRequired: true,
              isList: false,
              isId: false,
              type: 'Int',
            },
            args: () => {},
            list: () => {},
            nullable: () => {},
            resolve: () => {},
            subscribe: () => {},
            auth: () => {},
          } as any,
        },
        kind: 'model',
        __type: undefined as any,
      }

      const pg = getPGBuilder<any>()
      const editableCache = pg.cache() as unknown as PGCache
      editableCache.model[user.name] = user
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      editableCache.object[user.name] = {
        ...user,
        kind: 'object',
      } as any

      const post = pg.object('Post', (f) => ({
        id: f.id(),
        title: f.string(),
        ref: f.object(() => someObject),
      }))

      const someObject = pg.objectFromModel(user, (keep, f) => ({
        id: keep.id,
        age: f.float(),
        post: f.object(() => post),
      }))

      const expectValue = setPGObjectProperties({
        name: 'User',
        fieldMap: {
          id: setOutputFieldMethods({
            kind: 'scalar',
            isRequired: true,
            isList: false,
            isId: true,
            type: 'String',
          }),
          age: setOutputFieldMethods({
            kind: 'scalar',
            isRequired: true,
            isList: false,
            isId: false,
            type: 'Float',
          }),
          post: setOutputFieldMethods({
            kind: 'object',
            isRequired: true,
            isList: false,
            isId: false,
            type: expect.any(Function),
          }),
        },
      })

      expect(someObject).toEqual(expectValue)
      expect(pg.cache().object.User).toEqual(expectValue)

      expectType<
        PGObject<{
          id: PGOutputField<string, any, { id: string }>
          age: PGOutputField<number, any>
          post: PGOutputField<() => typeof post, any>
        }>
      >(someObject)
    })
  })

  describe('input', () => {
    it('PGInputが作られて、cacheにinputとして設定される', () => {
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
          someDecimal: PGInputField<Prisma.Decimal>
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
          someNullableObjectList: PGInputField<
            Array<() => typeof inner> | null | undefined
          >
          someObjectListDefault: PGInputField<Array<() => typeof inner>>
          someNullableObjectDefault: PGInputField<(() => typeof inner) | null | undefined>
          someNullableObjectListDefault: PGInputField<
            Array<() => typeof inner> | null | undefined
          >
        }>
      >(someInput)
    })

    it('同じ名前のPGinputは作成できず既存のリソースを返却する', () => {
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

  describe('inputFromModel', () => {
    let user: PGModel<{ id: PGField<string>; age: PGField<number> }>
    beforeEach(() => {
      user = {
        name: 'User',
        fieldMap: {
          id: {
            value: {
              kind: 'scalar',
              isRequired: true,
              isList: false,
              isId: true,
              type: 'String',
            },
          } as any,
          age: {
            value: {
              kind: 'scalar',
              isRequired: true,
              isList: false,
              isId: false,
              type: 'Int',
            },
          } as any,
        },
        kind: 'model',
        __type: undefined as any,
      }
    })
    it('PGModelのfieldと新規のfieldを持つ、新規のPGInputが作られる', () => {
      const pg = getPGBuilder<any>()

      const post = pg.input('Post', (f) => ({
        id: f.id(),
        title: f.string(),
        ref: f.input(() => someInput),
      }))

      const someInput = pg.inputFromModel('CreateUser', user, (keep, f) => ({
        id: keep.id,
        age: f.float(),
        post: f.input(() => post),
      }))

      const expectValue = {
        name: 'CreateUser',
        fieldMap: {
          id: setInputFieldMethods({
            kind: 'scalar',
            isRequired: true,
            isList: false,
            isId: true,
            type: 'String',
          }),
          age: setInputFieldMethods({
            kind: 'scalar',
            isRequired: true,
            isList: false,
            isId: false,
            type: 'Float',
          }),
          post: setInputFieldMethods({
            kind: 'object',
            isRequired: true,
            isList: false,
            isId: false,
            type: expect.any(Function),
          }),
        },
        kind: 'input',
        value: {},
        validation: expect.any(Function),
      }

      expect(someInput).toEqual(expectValue)
      expect(pg.cache().input.CreateUser).toEqual(expectValue)

      expectType<
        PGInput<{
          id: PGInputField<string>
          age: PGInputField<number>
          post: PGInputField<() => typeof post>
        }>
      >(someInput)
    })

    it('同じPGModelから二度PGInputは作成できず既存のリソースを返却する', () => {
      const pg = getPGBuilder<any>()
      pg.inputFromModel('CreateUser', user, (keep, f) => ({
        id: keep.id,
      }))
      expect(
        pg.inputFromModel('CreateUser', user, (keep, f) => ({
          id: keep.id,
          title: f.string(),
        })),
      ).toEqual({
        name: 'CreateUser',
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

  describe('resolver', () => {
    it('objectにresolveがセットされる', () => {
      const pg = getPGBuilder<any>()

      const post = pg.object('Post', (f) => ({
        id: f.id(),
        title: f.string(),
        ref: f.object(() => user),
      }))

      const user = pg.object('User', (f) => ({
        someID: f.id(),
        someString: f.string(),
        someObject: f.object(() => post),
      }))

      const setResolverObject = pg.resolver(user, {
        someString: () => {
          return 'hi'
        },
        someObject: ({ source }) => {
          return source.someObject
        },
      })

      const expectValue = setPGObjectProperties({
        name: 'User',
        fieldMap: {
          someID: setOutputFieldMethods({
            kind: 'scalar',
            isRequired: true,
            isList: false,
            isId: true,
            type: 'String',
          }),
          someString: setOutputFieldMethods({
            kind: 'scalar',
            isRequired: true,
            isList: false,
            isId: false,
            type: 'String',
            resolve: expect.any(Function),
          }),
          someObject: setOutputFieldMethods({
            kind: 'object',
            isRequired: true,
            isList: false,
            isId: false,
            type: expect.any(Function),
            resolve: expect.any(Function),
          }),
        },
      })

      expect(setResolverObject).toEqual(expectValue)
      expect(
        setResolverObject.fieldMap.someString.value.resolve?.(
          undefined,
          {},
          {},
          {} as any,
        ),
      ).toEqual('hi')
      expect(
        setResolverObject.fieldMap.someObject.value.resolve?.(
          { someObject: 'hi' },
          {},
          {},
          {} as any,
        ),
      ).toEqual('hi')

      expect(pg.cache().object.User).toEqual(expectValue)

      expectType<
        PGObject<{
          someID: PGOutputField<string, any>
          someString: PGOutputField<string, any>
          someObject: PGOutputField<() => typeof post, any>
        }>
      >(setResolverObject)
    })
  })

  describe('query', () => {
    it('PGResolverが作られて、cacheにqueryとして設定される', () => {
      const pg = getPGBuilder<any>()
      const someObject = pg.object('SomeObject', (f) => ({
        id: f.id(),
        name: f.string(),
        age: f.int(),
      }))
      const someInput = pg.input('SomeInput', (f) => ({
        age: f.int(),
      }))
      const result = pg.query('someQuery', (f) =>
        f
          .object(() => someObject)
          .args((f) => ({
            name: f.string(),
            profile: f.input(() => someInput),
          }))
          .resolve(({ args }) => {
            return {
              id: 'id',
              name: args.name,
              age: args.profile.age,
            }
          }),
      )

      const expectValue = {
        name: 'someQuery',
        field: setOutputFieldMethods({
          kind: 'object',
          isRequired: true,
          isList: false,
          isId: false,
          type: expect.any(Function),
          args: {
            name: setInputFieldMethods({
              kind: 'scalar',
              isRequired: true,
              isList: false,
              isId: false,
              type: 'String',
            }),
            profile: setInputFieldMethods({
              kind: 'object',
              isRequired: true,
              isList: false,
              isId: false,
              type: expect.any(Function),
            }),
          },
          resolve: expect.any(Function),
        }),
        kind: 'query',
      }

      expect(result).toEqual(expectValue)
      expect(pg.cache().query.someQuery).toEqual(expectValue)
    })

    it('同じ名前のQueryは作成できず既存のリソースを返却する', () => {
      const pg = getPGBuilder<any>()

      pg.query('SomeQuery', (f) => f.string().resolve(() => ''))

      expect(pg.query('SomeQuery', (f) => f.int().resolve(() => 1))).toEqual({
        name: 'SomeQuery',
        field: setOutputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: false,
          isId: false,
          type: 'String',
          resolve: expect.any(Function),
        }),
        kind: 'query',
      })
    })
  })

  describe('mutation', () => {
    it('PGResolverが作られて、cacheにmutationとして設定される', () => {
      const pg = getPGBuilder<any>()
      const result = pg.mutation('someMutation', (f) => f.string().resolve(() => ''))
      const expectValue = {
        name: 'someMutation',
        field: setOutputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: false,
          isId: false,
          type: 'String',
          resolve: expect.any(Function),
        }),
        kind: 'mutation',
      }
      expect(result).toEqual(expectValue)
      expect(pg.cache().mutation.someMutation).toEqual(expectValue)
    })

    it('同じ名前のMutationは作成できず既存のリソースを返却する', () => {
      const pg = getPGBuilder<any>()

      pg.mutation('SomeMutation', (f) => f.string().resolve(() => ''))

      expect(pg.mutation('SomeMutation', (f) => f.int().resolve(() => 1))).toEqual({
        name: 'SomeMutation',
        field: setOutputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: false,
          isId: false,
          type: 'String',
          resolve: expect.any(Function),
        }),
        kind: 'mutation',
      })
    })
  })

  describe('subscription', () => {
    it('subscribeに設定した条件で、publishに応じて発火して値が返る', async () => {
      const pubsub = new PubSub()
      const pg = getPGBuilder<any>()

      pg.query('SomeQuery', (f) => f.string())
      pg.subscription('SomeSubscription', (f) =>
        f
          .string()
          .args((f) => ({
            someArg: f.string(),
          }))
          .resolve((params) => params.source)
          .subscribe((params) => ({
            pubSubIter: pubsub.asyncIterator('somethingUpdated'),
            filter: () => params.args.someArg === 'arg',
          })),
      )

      const schema = pg.build()

      const subscription = `
        subscription onSomeSubscription {
          SomeSubscription ( someArg: "arg" )
        }
      `

      const subscriptionResp = (await subscribe({
        schema,
        document: parse(subscription),
        contextValue: {},
      })) as AsyncIterableIterator<ExecutionResult>

      setTimeout(() => {
        // eslint-disable-next-line no-void
        void pubsub.publish('somethingUpdated', 'hi')
      }, 100)

      const result = await (await subscriptionResp.next()).value
      expect(result).toEqual({ data: { SomeSubscription: 'hi' } })
    })
    it('同じ名前のSubscriptionは作成できず既存のリソースを返却する', () => {
      const pg = getPGBuilder<any>()
      const pubsub = new PubSub()
      pg.subscription('SomeSubscription', (f) =>
        f
          .string()
          .resolve((params) => params.source)
          .subscribe((params) => ({
            pubSubIter: pubsub.asyncIterator('somethingUpdated'),
          })),
      )

      expect(
        pg.subscription('SomeSubscription', (f) =>
          f
            .int()
            .resolve((params) => params.source)
            .subscribe((params) => ({
              pubSubIter: pubsub.asyncIterator('somethingUpdated'),
            })),
        ),
      ).toEqual({
        name: 'SomeSubscription',
        field: setOutputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: false,
          isId: false,
          type: 'String',
          resolve: expect.any(Function),
          subscribe: expect.any(Function),
        }),
        kind: 'subscription',
      })
    })
  })

  describe('build', () => {
    let dmmf: DMMF.Document
    beforeAll(async () => {
      const datamodel = /* Prisma */ `
        datasource db {
          provider = "postgresql"
          url      = env("DATABASE_URL")
        }

        model User {
          id            BigInt  @id @default(autoincrement())
          name          String
          income        Decimal
          posts         Post[]
          role          UserRole
        }

        model Post {
          id            Int     @id @default(autoincrement())
          title         String
          userId        BigInt
          user          User    @relation(fields: [userId], references: [id])
        }

        enum UserRole {
          USER
          MANAGER
          ADMIN
        }
      `
      dmmf = await getDMMF({ datamodel })
    })
    it('GraphQLSchemaがbuildされる', async () => {
      const pg = getPGBuilder<any>()
      type UserFieldMapType = {
        id: PGField<bigint>
        name: PGField<string>
        income: PGField<Prisma.Decimal>
        posts: PGField<Array<PGModel<PostFieldMapType>>>
        role: PGField<PGEnum<UserRoleValuesType>>
      }
      type PostFieldMapType = {
        id: PGField<number>
        title: PGField<string>
        userId: PGField<bigint>
        user: PGField<PGModel<UserFieldMapType>>
      }
      type UserRoleValuesType = ['USER', 'MANAGER', 'ADMIN']
      type PGfyResponseEnums = {
        UserRole: PGEnum<UserRoleValuesType>
      }

      type PGfyResponseModels = {
        User: PGModel<UserFieldMapType>
        Post: PGModel<PostFieldMapType>
      }

      interface PGfyResponse {
        enums: PGfyResponseEnums
        models: PGfyResponseModels
      }
      const pgfyResult = pg.pgfy<PGfyResponse>(dmmf.datamodel)

      const user = pgfyResult.models.User

      const users: Array<TypeOfPGModelBase<typeof user>> = [
        {
          id: 1n,
          name: 'xxx',
          income: new Prisma.Decimal(100),
          posts: [
            {
              id: 1,
              title: 'xxx',
              userId: 1n,
              user: {
                id: 1n,
                name: 'xxx',
                income: new Prisma.Decimal(100),
                posts: [],
                role: 'USER',
              },
            },
          ],
          role: 'USER',
        },
        {
          id: 2n,
          name: 'yyy',
          income: new Prisma.Decimal(1000),
          posts: [],
          role: 'MANAGER',
        },
      ]
      pg.query('findUser', (f) =>
        f
          .object(() => user)
          .args((f) => ({
            id: f.id(),
          }))
          .resolve(({ args, context }) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return users.find((x) => x.id === BigInt(args.id))!
          }),
      )

      pg.mutation('createUser', (f) =>
        f
          .object(() => user)
          .args((f) => ({
            input: f.input(() =>
              pg.input('CreateUserInput', (f) => ({
                name: f.string(),
              })),
            ),
          }))
          .resolve(({ args }) => {
            const user = {
              id: BigInt(_.maxBy(users, (x) => x.id)?.id ?? '0') + 1n,
              income: new Prisma.Decimal(0),
              name: args.input.name,
              posts: [],
              role: 'USER' as const,
            }
            users.push(user)
            return user
          }),
      )

      const schemaResult = pg.build()

      const query = `
      query {
        findUser(id: "1") {
          id
          name
          income
          posts {
            id
            title
          }
          role
        }
      }
      `

      const mutation = `
      mutation {
        createUser(input: { name: "zzz" }) {
          id
          name
          income
          posts {
            id
          }
          role
        }
      }
      `

      const queryResp = await graphql({
        schema: schemaResult,
        source: query,
        contextValue: {},
      })
      if (queryResp.errors !== undefined) {
        console.log(queryResp)
      }

      const mutationResp = await graphql({
        schema: schemaResult,
        source: mutation,
        contextValue: {},
      })
      if (mutationResp.errors !== undefined) {
        console.log(mutationResp)
      }

      expect(queryResp).toEqual({
        data: {
          findUser: {
            id: '1',
            name: 'xxx',
            income: new Prisma.Decimal(100),
            posts: [
              {
                id: '1',
                title: 'xxx',
              },
            ],
            role: 'USER',
          },
        },
      })
      expect(mutationResp).toEqual({
        data: {
          createUser: {
            id: '3',
            name: 'zzz',
            income: new Prisma.Decimal(0),
            posts: [],
            role: 'USER',
          },
        },
      })
    })

    it('graphqlResolveInfoがctxCacheにセットされる', async () => {
      let ctxCache: any
      let resolveInfo: any
      const pg = getPGBuilder<any>()
      pg.query('someQuery', (f) =>
        f.string().resolve((params) => {
          ctxCache = params.context.__cache
          resolveInfo = params.info
          return 'hi'
        }),
      )
      const schema = pg.build()
      const query = `
          query {
            someQuery
          }
        `
      await graphql({ schema, source: query, contextValue: {} })

      expect(ctxCache?.rootResolveInfo).toEqual({
        raw: resolveInfo,
        parsed: parseResolveInfo(resolveInfo),
      })
    })

    describe('Mutationが未定義の場合', () => {
      it('Mutationが未定義でも正常なSchemaがビルドされる', async () => {
        const pg = getPGBuilder()
        pg.query('someQuery', (f) => f.string().resolve(() => 'hi'))
        const schema = pg.build()
        const query = `
          query {
            someQuery
          }
        `
        const resp = await graphql({ schema, source: query, contextValue: {} })
        expect(resp).toEqual({ data: { someQuery: 'hi' } })
      })
    })

    describe('Queryが未定義の場合', () => {
      it('GraphQL.jsの実装上Queryは最低1つ必要なのでエラーが返る。', async () => {
        const pg = getPGBuilder()
        pg.mutation('someMutation', (f) => f.string().resolve(() => 'hi'))
        const schema = pg.build()
        const query = `
          mutation {
            someMutation
          }
        `
        const resp = await graphql({ schema, source: query })
        expect(resp).toEqual({
          errors: [new GraphQLError('Type Query must define one or more fields.')],
        })
      })
    })
  })

  describe('pgfy', () => {
    let dmmf: DMMF.Document
    beforeAll(async () => {
      const datamodel = /* Prisma */ `
        datasource db {
          provider = "postgresql"
          url      = env("DATABASE_URL")
        }

        model Model1 {
          id            Int        @id @default(autoincrement())
          string        String
          json          Json
          int           Int
          float         Float
          boolean       Boolean
          bigInt        BigInt
          dateTime      DateTime
          bytes         Bytes
          decimal       Decimal
          nullable      String?
          list          String[]
          // NOTE: PrismaにはnullableなListという概念がないため省略
          // nullableList
          enum          SomeEnum
          enumList      SomeEnum2[]
          enumNullable  SomeEnum3?
          oneToOne      Model2?
          oneToMany     Model3[]
        }

        model Model2 {
          id            Int     @id @default(autoincrement())
          model1        Model1  @relation(fields: [model1Id], references: [id])
          model1Id      Int
        }

        model Model3 {
          id            Int     @id @default(autoincrement())
          model1        Model1  @relation(fields: [model1Id], references: [id])
          model1Id      Int
        }

        enum SomeEnum {
          AAA
          BBB
          CCC
        }

        enum SomeEnum2 {
          Aaa
          Bbb
          Ccc
        }

        enum SomeEnum3 {
          aaa
          bbb
          ccc
        }
      `
      dmmf = await getDMMF({ datamodel })
    })

    type SomeEnumValuesType = ['AAA', 'BBB', 'CCC']
    type SomeEnum2ValuesType = ['Aaa', 'Bbb', 'Ccc']
    type SomeEnum3ValuesType = ['aaa', 'bbb', 'ccc']
    type Model1FieldMapType = {
      id: PGField<number>
      string: PGField<string>
      json: PGField<string>
      int: PGField<number>
      float: PGField<number>
      boolean: PGField<boolean>
      bigInt: PGField<bigint>
      dateTime: PGField<Date>
      bytes: PGField<Buffer>
      decimal: PGField<Prisma.Decimal>
      nullable: PGField<string | null>
      list: PGField<string[]>
      enum: PGField<PGEnum<SomeEnumValuesType>>
      enumList: PGField<Array<PGEnum<SomeEnum2ValuesType>>>
      enumNullable: PGField<PGEnum<SomeEnum3ValuesType> | null>
      oneToOne: PGField<PGModel<Model2FieldMapType> | null>
      oneToMany: PGField<Array<PGModel<Model3FieldMapType>>>
    }
    type Model2FieldMapType = {
      id: PGField<number>
      model1: PGField<PGModel<Model1FieldMapType>>
      model1Id: PGField<number>
    }
    type Model3FieldMapType = {
      id: PGField<number>
      model1: PGField<PGModel<Model1FieldMapType>>
      model1Id: PGField<number>
    }

    type PGfyResponseEnums = {
      SomeEnum: PGEnum<SomeEnumValuesType>
      SomeEnum2: PGEnum<SomeEnum2ValuesType>
      SomeEnum3: PGEnum<SomeEnum3ValuesType>
    }

    type PGfyResponseModels = {
      Model1: PGModel<Model1FieldMapType>
      Model2: PGModel<Model2FieldMapType>
      Model3: PGModel<Model3FieldMapType>
    }

    interface PGfyResponse {
      enums: PGfyResponseEnums
      models: PGfyResponseModels
    }

    it('PrismaのEnumとModelに対応するPGEnumとPGModelが生成される。またbuild時に参照されるようにcacheに設定される。', async () => {
      const pg = getPGBuilder<any>()
      const result = pg.pgfy<PGfyResponse>(dmmf.datamodel)

      const expectSomeEnum = {
        kind: 'enum',
        name: 'SomeEnum',
        values: ['AAA', 'BBB', 'CCC'],
      }
      const expectSomeEnum2 = {
        kind: 'enum',
        name: 'SomeEnum2',
        values: ['Aaa', 'Bbb', 'Ccc'],
      }
      const expectSomeEnum3 = {
        kind: 'enum',
        name: 'SomeEnum3',
        values: ['aaa', 'bbb', 'ccc'],
      }
      const expectModel1: PGObject<any> = setPGObjectProperties({
        name: 'Model1',
        fieldMap: {
          id: setOutputFieldMethods({
            isId: true,
            isList: false,
            isRequired: true,
            kind: 'scalar',
            type: 'String',
          }),
          string: setOutputFieldMethods({
            isId: false,
            isList: false,
            isRequired: true,
            kind: 'scalar',
            type: 'String',
          }),
          json: setOutputFieldMethods({
            isId: false,
            isList: false,
            isRequired: true,
            kind: 'scalar',
            type: 'Json',
          }),
          int: setOutputFieldMethods({
            isId: false,
            isList: false,
            isRequired: true,
            kind: 'scalar',
            type: 'Int',
          }),
          float: setOutputFieldMethods({
            isId: false,
            isList: false,
            isRequired: true,
            kind: 'scalar',
            type: 'Float',
          }),
          boolean: setOutputFieldMethods({
            isId: false,
            isList: false,
            isRequired: true,
            kind: 'scalar',
            type: 'Boolean',
          }),
          bigInt: setOutputFieldMethods({
            isId: false,
            isList: false,
            isRequired: true,
            kind: 'scalar',
            type: 'BigInt',
          }),
          dateTime: setOutputFieldMethods({
            isId: false,
            isList: false,
            isRequired: true,
            kind: 'scalar',
            type: 'DateTime',
          }),
          bytes: setOutputFieldMethods({
            isId: false,
            isList: false,
            isRequired: true,
            kind: 'scalar',
            type: 'Bytes',
          }),
          decimal: setOutputFieldMethods({
            isId: false,
            isList: false,
            isRequired: true,
            kind: 'scalar',
            type: 'Decimal',
          }),
          nullable: setOutputFieldMethods({
            isId: false,
            isList: false,
            isRequired: false,
            kind: 'scalar',
            type: 'String',
          }),
          list: setOutputFieldMethods({
            isId: false,
            isList: true,
            isRequired: true,
            kind: 'scalar',
            type: 'String',
          }),
          enum: setOutputFieldMethods({
            isId: false,
            isList: false,
            isRequired: true,
            kind: 'enum',
            type: 'SomeEnum',
          }),
          enumList: setOutputFieldMethods({
            isId: false,
            isList: true,
            isRequired: true,
            kind: 'enum',
            type: 'SomeEnum2',
          }),
          enumNullable: setOutputFieldMethods({
            isId: false,
            isList: false,
            isRequired: false,
            kind: 'enum',
            type: 'SomeEnum3',
          }),
          oneToOne: setOutputFieldMethods({
            isId: false,
            isList: false,
            isRequired: false,
            kind: 'object',
            type: expect.any(Function),
          }),
          oneToMany: setOutputFieldMethods({
            isId: false,
            isList: true,
            isRequired: true,
            kind: 'object',
            type: expect.any(Function),
          }),
        },
      })
      const expectModel2: PGObject<any> = setPGObjectProperties({
        name: 'Model2',
        fieldMap: {
          id: setOutputFieldMethods({
            isId: true,
            isList: false,
            isRequired: true,
            kind: 'scalar',
            type: 'String',
          }),
          model1: setOutputFieldMethods({
            isId: false,
            isList: false,
            isRequired: true,
            kind: 'object',
            type: expect.any(Function),
          }),
          model1Id: setOutputFieldMethods({
            isId: false,
            isList: false,
            isRequired: true,
            kind: 'scalar',
            type: 'Int',
          }),
        },
      })
      const expectModel3: PGObject<any> = setPGObjectProperties({
        name: 'Model3',
        fieldMap: {
          id: setOutputFieldMethods({
            isId: true,
            isList: false,
            isRequired: true,
            kind: 'scalar',
            type: 'String',
          }),
          model1: setOutputFieldMethods({
            isId: false,
            isList: false,
            isRequired: true,
            kind: 'object',
            type: expect.any(Function),
          }),
          model1Id: setOutputFieldMethods({
            isId: false,
            isList: false,
            isRequired: true,
            kind: 'scalar',
            type: 'Int',
          }),
        },
      })
      expect(result).toEqual({
        enums: {
          SomeEnum: expectSomeEnum,
          SomeEnum2: expectSomeEnum2,
          SomeEnum3: expectSomeEnum3,
        },
        // NOTE: 各Modelは型としてはPGModelだが、実態はPGModelを包含するPGObjectになっている
        models: {
          Model1: { ...expectModel1, kind: 'model' },
          Model2: { ...expectModel2, kind: 'model' },
          Model3: { ...expectModel3, kind: 'model' },
        },
      })
      expect(pg.cache()).toEqual({
        enum: {
          SomeEnum: expectSomeEnum,
          SomeEnum2: expectSomeEnum2,
          SomeEnum3: expectSomeEnum3,
        },
        object: {
          Model1: expectModel1,
          Model2: expectModel2,
          Model3: expectModel3,
        },
        // NOTE: 各Modelは型としてはPGModelだが、実態はPGModelを包含するPGObjectになっている
        model: {
          Model1: { ...expectModel1, kind: 'model' },
          Model2: { ...expectModel2, kind: 'model' },
          Model3: { ...expectModel3, kind: 'model' },
        },
        input: {},
        query: {},
        mutation: {},
        subscription: {},
      })

      // NOTE: Modelの参照が正しく設定されているかの確認
      const model1OneToOneFieldValueType =
        result.models.Model1.fieldMap.oneToOne.value.type
      expect(
        typeof model1OneToOneFieldValueType === 'function'
          ? model1OneToOneFieldValueType()
          : null,
      ).toEqual({ ...expectModel2, kind: 'object' })
      const model1OneToManyFieldValueType =
        result.models.Model1.fieldMap.oneToMany.value.type
      expect(
        typeof model1OneToManyFieldValueType === 'function'
          ? model1OneToManyFieldValueType()
          : null,
      ).toEqual({ ...expectModel3, kind: 'object' })
      const model2RelationFieldValueType = result.models.Model2.fieldMap.model1.value.type
      expect(
        typeof model2RelationFieldValueType === 'function'
          ? model2RelationFieldValueType()
          : null,
      ).toEqual({ ...expectModel1, kind: 'object' })
      const model3RelationFieldValueType = result.models.Model3.fieldMap.model1.value.type
      expect(
        typeof model3RelationFieldValueType === 'function'
          ? model3RelationFieldValueType()
          : null,
      ).toEqual({ ...expectModel1, kind: 'object' })
    })
  })

  describe('prismaFindArgs', () => {
    describe('通常のqueryの場合', () => {
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      function getObjects() {
        type Context = {
          role: 'Admin' | 'User'
        }
        const pg = getPGBuilder<Context>()
        const pgCache = pg.cache()

        const userModel = pgObjectToPGModel<{
          where?: {
            isDeleted?: boolean
            profile?: {
              isPublic?: boolean
            }
          }
        }>()(
          pg.object('User', (f) => ({
            id: f.id(),
            isDeleted: f.boolean(),
            email: f.string(),
            posts: f.object(() => postModel).list(),
            profie: f.object(() => profileModel),
          })),
          pgCache,
        )

        const profileModel = pgObjectToPGModel()(
          pg.object('Profile', (f) => ({
            id: f.id(),
            age: f.int(),
            isPublic: f.boolean(),
          })),
          pgCache,
        )

        const postModel = pgObjectToPGModel()(
          pg.object('Post', (f) => ({
            id: f.id(),
            title: f.string(),
            comments: f.object(() => commentModel),
          })),
          pgCache,
        )

        const commentModel = pgObjectToPGModel<{
          where?: {
            message?: {
              contains?: string
            }
          }
        }>()(
          pg.object('Comment', (f) => ({
            id: f.id(),
            message: f.string(),
          })),
          pgCache,
        )

        const user = pg.objectFromModel(userModel, (keep, f) => ({
          id: keep.id,
          posts: keep.posts.args((f) => ({
            include: f
              .input(() =>
                pg.input('PostsIncludeInput', (f) => ({
                  _count: f.boolean().nullable(),
                })),
              )
              .nullable(),
            where: f
              .input(() =>
                pg.input('PostsWhereInput', (f) => ({
                  title: f.input(() =>
                    pg.input('PostsWhereTitleInput', (f) => ({
                      equals: f.string().nullable(),
                    })),
                  ),
                })),
              )
              .nullable(),
            orderBy: f
              .input(() =>
                pg.input('PostsOrderByInput', (f) => ({
                  updatedAt: f.string().nullable(),
                })),
              )
              .nullable(),
            cursor: f
              .input(() =>
                pg.input('PostsCursorInput', (f) => ({
                  id: f.int().nullable(),
                })),
              )
              .nullable(),
            take: f.int().nullable(),
            skip: f.int().nullable(),
            distinct: f.string().nullable(),
            unrelated2: f.boolean().nullable(),
          })),
          latestPost: f.object(() => postModel),
        }))

        const profile = pg.objectFromModel(profileModel, (keep) => keep)

        const post = pg.objectFromModel(postModel, (keep, f) => ({
          ...keep,
          comments: f
            .object(() => comment)
            .list()
            .args((f) => ({
              take: f.int().nullable(),
              unrelated3: f.boolean().nullable(),
            })),
        }))

        const comment = pg.objectFromModel(commentModel, (keep) => keep)

        pg.query('users', (f) =>
          f
            .object(() => user)
            .list()
            .args((f) => ({
              select: f.string().list().nullable(),
              include: f
                .input(() =>
                  pg.input('UsersIncludeInput', (f) => ({
                    _count: f.boolean().nullable(),
                  })),
                )
                .nullable(),
              where: f
                .input(() =>
                  pg.input('UsersWhereInput', (f) => ({
                    email: f.input(() =>
                      pg.input('PostsWhereEmailInput', (f) => ({
                        contains: f.string().nullable(),
                      })),
                    ),
                  })),
                )
                .nullable(),
              orderBy: f
                .input(() =>
                  pg.input('UsersOrderByInput', (f) => ({
                    name: f.string().nullable(),
                    email: f.string().nullable(),
                  })),
                )
                .list()
                .nullable(),
              cursor: f
                .input(() =>
                  pg.input('UsersCursorInput', (f) => ({
                    id: f.int().nullable(),
                  })),
                )
                .nullable(),
              take: f.int().nullable(),
              skip: f.int().nullable(),
              distinct: f.string().nullable(),
              unrelated: f.boolean().nullable(),
            }))
            .resolve(() => {
              return [
                {
                  id: 'id',
                  email: 'email',
                  posts: [],
                  profile: {
                    id: 'id',
                    age: 20,
                  },
                },
              ]
            }),
        )

        const paramsRef = getResolveParamsRef(pgCache)

        const schema = pg.build()

        return { pg, schema, paramsRef, user, profile, post, comment }
      }
      it('GraphQLResolveInfoからPrismaのFindManyArgsなどに渡す引数が生成され、指定した型で返る', async () => {
        const query = `
        query(
          $usersIncludeInput: UsersIncludeInput,
          $usersWhereInput: UsersWhereInput,
          $usersOrderByInput: [UsersOrderByInput],
          $postsCursorInput: PostsCursorInput,
          $postsTake: Int,
          $postsSkip: Int,
          $postsDistinct: String
        ) {
          users (
            include: $usersIncludeInput,
            where: $usersWhereInput,
            orderBy: $usersOrderByInput,
            cursor: { id: 10 },
            take: 10,
            skip: 1,
            distinct: "email",
            unrelated: false,
          ) {
            id
            posts (
              include: { _count: true },
              where: { title: { equals: "prisma" } },
              orderBy: { updatedAt: "desc" },
              cursor: $postsCursorInput,
              take: $postsTake,
              skip: $postsSkip,
              distinct: $postsDistinct,
              unrelated2: false,
            ) {
              title
              comments(
                take: 10,
                unrelated3: false,
              ) {
                id
                message
              }
            }
            latestPost {
              title
            }
          }
        }
      `
        const { pg, schema, paramsRef, user } = getObjects()

        await graphql({
          schema,
          source: query,
          variableValues: {
            usersIncludeInput: { _count: true },
            usersWhereInput: { email: { contains: 'prisma' } },
            usersOrderByInput: [{ name: 'desc' }, { email: 'asc' }],
            postsCursorInput: { id: 10 },
            postsTake: 10,
            postsSkip: 1,
            postsDistinct: 'title',
          },
          contextValue: {},
        })

        type SomeType = {
          someArgs: string
        }
        // NOTE: 本来はジェネリクスにPrismaが生成する`UserFindManyArgs`などを指定する
        const result = pg.prismaFindArgs<SomeType>(user, paramsRef.value)

        expect(result).toEqual({
          include: {
            _count: true,
            posts: {
              include: {
                _count: true,
                comments: {
                  take: 10,
                },
              },
              where: {
                title: {
                  equals: 'prisma',
                },
              },
              orderBy: {
                updatedAt: 'desc',
              },
              cursor: {
                id: 10,
              },
              take: 10,
              skip: 1,
              distinct: 'title',
            },
          },
          where: {
            email: {
              contains: 'prisma',
            },
          },
          orderBy: [{ name: 'desc' }, { email: 'asc' }],
          cursor: {
            id: 10,
          },
          take: 10,
          skip: 1,
          distinct: 'email',
        })

        expectType<{
          someArgs: string
        }>(result)
      })

      it('各Fieldで設定されたdefault値を考慮したargsが設定される', async () => {
        type Context = {
          role: 'Admin' | 'User'
        }
        const pg = getPGBuilder<Context>()
        const pgCache = pg.cache()

        let paramsValue: ResolveParams<any, any, any, any> = null as any

        const userModel = pgObjectToPGModel()(
          pg.object('User', (f) => ({
            id: f.id(),
            email: f.string(),
            posts: f.object(() => postModel).list(),
          })),
          pgCache,
        )

        const postModel = pgObjectToPGModel()(
          pg.object('Post', (f) => ({
            id: f.id(),
            title: f.string(),
            comment: f.object(() => commentModel),
            signature: f.string(),
          })),
          pgCache,
        )

        const commentModel = pgObjectToPGModel()(
          pg.object('Comment', (f) => ({
            id: f.id(),
            message: f.string(),
            signature: f.string(),
          })),
          pgCache,
        )

        const comment = pg.objectFromModel(commentModel, (keep) => keep)

        const post = pg.objectFromModel(postModel, (keep, f) => ({
          ...keep,
          comment: f
            .object(() => comment)
            .args((f) => ({
              where: f
                .input(() =>
                  pg.input('CommentWhereInput', (f) => ({
                    someText: f.input(() =>
                      pg.input('CommentsWhereTextInput', (f) => ({
                        inner: f.input(() =>
                          pg.input('CommentsWhereTextInnerInput', (f) => ({
                            equals: f.string().default('defaultText'),
                          })),
                        ),
                      })),
                    ),
                    someList: f
                      .input(() =>
                        pg.input('CommentWhereListInput', (f) => ({
                          equals: f.string().default('defaultList'),
                        })),
                      )
                      .list()
                      .default([]),
                    someNoDefault: f
                      .input(() =>
                        pg.input('CommentWhereNoDefaultInput', (f) => ({
                          equals: f.string(),
                        })),
                      )
                      .nullable(),
                    someOverride: f.input(() =>
                      pg.input('CommentWhereOverrideInput', (f) => ({
                        equals: f.string().default('default'),
                      })),
                    ),
                  })),
                )
                .nullable(),
            })),
        }))

        const user = pg.objectFromModel(userModel, (keep, f) => ({
          ...keep,
          posts: f
            .object(() => post)
            .args((f) => ({
              where: f
                .input(() =>
                  pg.input('PostWhereInput', (f) => ({
                    someText: f.input(() =>
                      pg.input('PostWhereTextInput', (f) => ({
                        inner: f.input(() =>
                          pg.input('PostWhereTextInnerInput', (f) => ({
                            equals: f.string().default('defaultText'),
                          })),
                        ),
                      })),
                    ),
                    someList: f
                      .input(() =>
                        pg.input('PostWhereListInput', (f) => ({
                          equals: f.string().default('defaultList'),
                        })),
                      )
                      .list()
                      .default([]),
                    someNoDefault: f
                      .input(() =>
                        pg.input('PostWhereNoDefaultInput', (f) => ({
                          equals: f.string(),
                        })),
                      )
                      .nullable(),
                    someOverride: f.input(() =>
                      pg.input('PostWhereOverrideInput', (f) => ({
                        equals: f.string().default('default'),
                      })),
                    ),
                  })),
                )
                .nullable(),
            }))
            .list(),
        }))

        pg.query('users', (f) =>
          f
            .object(() => user)
            .list()
            .args((f) => ({
              where: f
                .input(() =>
                  pg.input('UserWhereInput', (f) => ({
                    someText: f.input(() =>
                      pg.input('UserWhereTextInput', (f) => ({
                        inner: f.input(() =>
                          pg.input('UserWhereTextInnerInput', (f) => ({
                            equals: f.string().default('defaultText'),
                          })),
                        ),
                      })),
                    ),
                    someList: f
                      .input(() =>
                        pg.input('UserWhereListInput', (f) => ({
                          equals: f.string().default('defaultList'),
                        })),
                      )
                      .list()
                      .default([]),
                    someNoDefault: f
                      .input(() =>
                        pg.input('UserWhereNoDefaultInput', (f) => ({
                          equals: f.string(),
                        })),
                      )
                      .nullable(),
                    someOverride: f.input(() =>
                      pg.input('UserWhereOverrideInput', (f) => ({
                        equals: f.string().default('default'),
                      })),
                    ),
                  })),
                )
                .nullable(),
            }))
            .resolve((params) => {
              paramsValue = params
              return [
                {
                  id: 'id',
                  email: 'email',
                  posts: [],
                  latestPost: {
                    id: 'id',
                    title: 'title',
                    comment: {
                      id: 'id',
                      message: 'message',
                      signature: 'signature',
                    },
                    signature: 'signature',
                  },
                },
              ]
            }),
        )

        const schema = pg.build()

        const query = `
          query {
            users (
              where: {
                someOverride: {
                  equals: "override",
                }
              }
            ) {
              email
              posts (
                where: {
                  someOverride: {
                    equals: "override",
                  }
                }
              ) {
                title
                signature
                comment (
                  where: {
                    someOverride: {
                      equals: "override",
                    }
                  }
                ) {
                  message
                  signature
                }
              }
            }
          }
        `

        await graphql({
          schema,
          source: query,
          contextValue: {},
        })

        type SomeType = {
          someArgs: string
        }
        // NOTE: 本来はジェネリクスにPrismaが生成する`UserFindManyArgs`などを指定する
        const result = pg.prismaFindArgs<SomeType>(user, paramsValue)

        expect(result).toEqual({
          include: {
            posts: {
              include: {
                comment: {
                  where: {
                    someText: {
                      inner: {
                        equals: 'defaultText',
                      },
                    },
                    someList: [],
                    someOverride: {
                      equals: 'override',
                    },
                  },
                },
              },
              where: {
                someText: {
                  inner: {
                    equals: 'defaultText',
                  },
                },
                someList: [],
                someOverride: {
                  equals: 'override',
                },
              },
            },
          },
          where: {
            someText: {
              inner: {
                equals: 'defaultText',
              },
            },
            someList: [],
            someOverride: {
              equals: 'override',
            },
          },
        })
      })

      it('PGObjectに設定されたPrisma用の権限ルールに従ってPrismaのwhere句が設定される', async () => {
        const query = `
        query {
          users (
            where: { email: { contains: "@test.com" } },
            take: 10,
          ) {
            posts {
              comments {
                id
                message
              }
            }
          }
        }
      `

        const { pg, paramsRef, schema, user, comment } = getObjects()

        user.prismaAuth(({ ctx, allow }) => {
          allow('read', { isDeleted: false, profile: { isPublic: true } })
          if (ctx.role === 'Admin') {
            allow('read')
          }
        })
        comment.prismaAuth(({ ctx, allow, deny }) => {
          allow('read')
          deny('read', { message: { contains: '[system message]' } })
          if (ctx.role === 'User') {
            deny('read', { message: { contains: 'f-word' } })
          }
        })

        await graphql({
          schema,
          source: query,
          contextValue: { role: 'User' },
        })

        const userResult = pg.prismaFindArgs(user, paramsRef.value)

        expect(userResult).toEqual({
          include: {
            posts: {
              include: {
                comments: {
                  where: {
                    AND: [
                      {
                        NOT: {
                          message: {
                            contains: 'f-word',
                          },
                        },
                      },
                      {
                        NOT: {
                          message: {
                            contains: '[system message]',
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
          take: 10,
          where: {
            AND: [
              {
                email: {
                  contains: '@test.com',
                },
              },
              {
                OR: [
                  {
                    isDeleted: false,
                    profile: {
                      isPublic: true,
                    },
                  },
                ],
              },
            ],
          },
        })

        await graphql({
          schema,
          source: query,
          contextValue: { role: 'Admin' },
        })

        const adminResult = pg.prismaFindArgs(user, paramsRef.value)

        expect(adminResult).toEqual({
          include: {
            posts: {
              include: {
                comments: {
                  where: {
                    AND: [
                      {
                        NOT: {
                          message: {
                            contains: '[system message]',
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
          take: 10,
          where: {
            email: {
              contains: '@test.com',
            },
          },
        })
      })

      it('QueryのReturnTypeとrootとして指定されたPGObjectが異なる場合例外が発生する', async () => {
        const query = `
        query {
          users {
            id
          }
        }
      `
        const { pg, schema, paramsRef, post } = getObjects()
        await graphql({
          schema,
          source: query,
          contextValue: {},
        })

        expect(() => {
          pg.prismaFindArgs(post, paramsRef.value)
        }).toThrow('A mismatch of type. RootType: Post, TypeInResolverInfo: User')
      })
    })

    describe('第三引数にdefaultのargsを指定した場合', () => {
      it('defaultのargsがマージされて返る', async () => {
        const pg = getPGBuilder<any>()
        const pgCache = pg.cache()

        let paramsValue: ResolveParams<any, any, any, any> = null as any

        const userModel = pgObjectToPGModel()(
          pg.object('User', (f) => ({
            id: f.id(),
            name: f.string(),
            date: f.dateTime(),
            somePosts: f.object(() => postModel).list(),
            profile: f.object(() => profileModel),
          })),
          pgCache,
        )

        const postModel = pgObjectToPGModel()(
          pg.object('Post', (f) => ({
            id: f.id(),
            title: f.string(),
          })),
          pgCache,
        )

        const profileModel = pgObjectToPGModel()(
          pg.object('Profile', (f) => ({
            id: f.id(),
            content: f.string(),
          })),
        )

        const user = pg.objectFromModel(userModel, (keep, f) => ({
          ...keep,
          somePosts: keep.somePosts.args((f) => ({
            orderBy: f
              .input(() =>
                pg.input('PostOrderByInput', (f) => ({
                  id: f.string().nullable(),
                })),
              )
              .nullable(),
          })),
        }))

        pg.query('users', (f) =>
          f
            .object(() => user)
            .args((f) => ({
              where: f
                .input(() =>
                  pg.input('UsersWhereInput', (f) => ({
                    name: f.input(() =>
                      pg.input('UsersWhereNameInput', (f) => ({
                        contains: f.string().nullable(),
                      })),
                    ),
                  })),
                )
                .nullable(),
              orderBy: f
                .input(() =>
                  pg.input('UserOrderByInput', (f) => ({
                    id: f.id().nullable(),
                    name: f.string().nullable(),
                  })),
                )
                .list()
                .nullable(),
            }))
            .resolve((params) => {
              paramsValue = params
              return {
                id: '1',
                somePosts: [],
              }
            }),
        )

        const schema = pg.build()

        const nestedQuery = `
        query {
          users ( 
            where: {
              name: {
                contains: "xxx"
              }
            }
            orderBy: [{ id: "asc" }, { name: "asc" }]
            ) {
              id
              somePosts ( orderBy: { id: "asc" } ) {
                id
              }
          }
        }`
        await graphql({
          schema,
          source: nestedQuery,
          contextValue: { role: 'User' },
        })

        const nestedResult = pg.prismaFindArgs(user, paramsValue, {
          where: {
            name: {
              equals: 'xxxXXX',
            },
          },
          orderBy: [
            {
              date: 'desc',
            },
          ],
          include: {
            somePosts: {
              where: {
                title: {
                  contains: 'yyyYYY',
                },
              },
            },
            profile: {
              where: {
                content: {
                  contains: 'zzzZZZ',
                },
              },
            },
          },
        })

        expect(nestedResult).toEqual({
          include: {
            somePosts: {
              orderBy: {
                id: 'asc',
              },
              where: {
                title: {
                  contains: 'yyyYYY',
                },
              },
            },
          },
          where: {
            name: {
              equals: 'xxxXXX',
              contains: 'xxx',
            },
          },
          orderBy: [
            {
              id: 'asc',
            },
            {
              name: 'asc',
            },
          ],
        })

        const notNestedQuery = `
        query {
          users ( 
            where: {
              name: {
                contains: "xxx"
              }
            }
            orderBy: [{ id: "asc" }, { name: "asc" }]
            ) {
              id
          }
        }`
        await graphql({
          schema,
          source: notNestedQuery,
          contextValue: { role: 'User' },
        })

        const notNestedResult = pg.prismaFindArgs(user, paramsValue, {
          where: {
            name: {
              equals: 'xxxXXX',
            },
          },
          orderBy: [
            {
              date: 'desc',
            },
          ],
          include: {
            somePosts: {
              where: {
                title: {
                  contains: 'yyyYYY',
                },
              },
            },
          },
        })

        expect(notNestedResult).toEqual({
          where: {
            name: {
              equals: 'xxxXXX',
              contains: 'xxx',
            },
          },
          orderBy: [
            {
              id: 'asc',
            },
            {
              name: 'asc',
            },
          ],
        })
      })
    })

    describe('PGConnectionObjectがqueryに含まれている場合', () => {
      it('PGConnectionObjectを考慮してargsが生成され、resolve時に必要な情報がContextのCacheに設定される', async () => {
        const query = `
          query {
            users ( where: { name: { equals: "xxx" } } ) {
              edges {
                cursor
                node {
                  name
                  somePosts ( where: { title: { equals: "yyy" } } ){
                    edges {
                      cursor
                      node {
                        title
                        someComments ( where: { message: { equals: "zzz" } } ){
                          edges {
                            cursor
                            node {
                              message
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `

        const pg = getPGBuilder<{ role: 'Admin' | 'User' }>()
        const pgCache = pg.cache()

        let paramsValue: ResolveParams<any, any, any, any> = null as any

        const userModel = pgObjectToPGModel()(
          pg.object('User', (f) => ({
            id: f.id(),
            name: f.string(),
            somePosts: f.object(() => postModel).list(),
          })),
          pgCache,
        )

        const postModel = pgObjectToPGModel()(
          pg.object('Post', (f) => ({
            id: f.id(),
            title: f.string(),
            someComments: f.object(() => commentModel).list(),
          })),
          pgCache,
        )

        const commentModel = pgObjectToPGModel()(
          pg.object('Comment', (f) => ({
            id: f.id(),
            message: f.string(),
          })),
          pgCache,
        )

        const user = pg.objectFromModel(userModel, (keep, f) => ({
          ...keep,
          somePosts: f
            .object(() => postConnection)
            .args((f) => ({
              where: f
                .input(() =>
                  pg.input('PostsWhereInput', (f) => ({
                    title: f.input(() =>
                      pg.input('PostsWhereTitleInput', (f) => ({
                        equals: f.string().nullable(),
                      })),
                    ),
                  })),
                )
                .nullable(),
            })),
        }))

        const post = pg.objectFromModel(postModel, (keep, f) => ({
          ...keep,
          someComments: f
            .object(() => commentConnection)
            .args((f) => ({
              where: f
                .input(() =>
                  pg.input('CommentsWhereInput', (f) => ({
                    message: f.input(() =>
                      pg.input('CommentsWhereMessageInput', (f) => ({
                        equals: f.string().nullable(),
                      })),
                    ),
                  })),
                )
                .nullable(),
            })),
        }))

        const comment = pg.objectFromModel(commentModel, (keep, f) => keep)

        const userConnection = pg.relayConnection(user)
        const postConnection = pg.relayConnection(post)
        const commentConnection = pg.relayConnection(comment)

        pg.query('users', (f) =>
          f
            .object(() => userConnection)
            .args((f) => ({
              where: f
                .input(() =>
                  pg.input('UsersWhereInput', (f) => ({
                    name: f.input(() =>
                      pg.input('UsersWhereNameInput', (f) => ({
                        equals: f.string().nullable(),
                      })),
                    ),
                  })),
                )
                .nullable(),
            }))
            .resolve((params) => {
              paramsValue = params
              return []
            }),
        )

        const schema = pg.build()

        await graphql({
          schema,
          source: query,
          contextValue: { role: 'User' },
        })

        const result = pg.prismaFindArgs(userConnection, paramsValue)

        expect(result).toEqual({
          include: {
            somePosts: {
              include: {
                someComments: {
                  where: {
                    message: {
                      equals: 'zzz',
                    },
                  },
                },
              },
              where: {
                title: {
                  equals: 'yyy',
                },
              },
            },
          },
          where: {
            name: {
              equals: 'xxx',
            },
          },
        })

        expect(paramsValue.context.__cache.prismaFindArgs).toEqual({
          '31:773': {
            include: {
              somePosts: {
                include: {
                  someComments: {
                    where: {
                      message: {
                        equals: 'zzz',
                      },
                    },
                  },
                },
                where: {
                  title: {
                    equals: 'yyy',
                  },
                },
              },
            },
            where: {
              name: {
                equals: 'xxx',
              },
            },
          },
          '187:725': {
            include: {
              someComments: {
                where: {
                  message: {
                    equals: 'zzz',
                  },
                },
              },
            },
            where: {
              title: {
                equals: 'yyy',
              },
            },
          },
          '378:659': {
            where: {
              message: {
                equals: 'zzz',
              },
            },
          },
        })
      })
    })

    describe('relayArgsを指定した場合', () => {
      it('relayArgsのfirst, afterに対応した結果が返る', async () => {
        const query = `
        query {
          users ( 
            first: 2
            after: "eyAiaWQiOiAyfQ=="
            orderBy: { posts: { id: "asc" } }
            ) {
            edges {
              cursor
              node {
                id
                name
              }
            }
          }
        }`

        const pg = getPGBuilder<{ role: 'Admin' | 'User' }>()
        const pgCache = pg.cache()

        let paramsValue: ResolveParams<any, any, any, any> = null as any

        const userModel = pgObjectToPGModel()(
          pg.object('User', (f) => ({
            id: f.id(),
            name: f.string(),
          })),
          pgCache,
        )

        const userConnection = pg.relayConnection(
          pg.objectFromModel(userModel, (keep, f) => keep),
        )

        const userRelayArgs = pg.relayArgs()

        pg.query('users', (f) =>
          f
            .object(() => userConnection)
            .args((f) => ({
              ...userRelayArgs,
              orderBy: f.input(() =>
                pg.input('UsersOrderByInput', (f) => ({
                  posts: f
                    .input(() =>
                      pg.input('PostsOrderByInput', (f) => ({
                        id: f.id().nullable(),
                      })),
                    )
                    .nullable(),
                })),
              ),
            }))
            .resolve((params) => {
              paramsValue = params
              return []
            }),
        )

        const schema = pg.build()

        await graphql({
          schema,
          source: query,
          contextValue: { role: 'User' },
        })

        const result = pg.prismaFindArgs(userConnection, paramsValue)

        expect(result).toEqual({
          skip: 1,
          take: 3,
          cursor: {
            id: 2,
          },
          orderBy: {
            posts: {
              id: 'asc',
            },
          },
        })
      })

      it('relayArgsのlast, beforeに対応した結果が返る', async () => {
        const query = `
        query {
          users ( 
            last: 2
            before: "eyAiaWQiOiAyfQ=="
            orderBy: [{ id: "asc" }, { posts: { id: "asc" } }]
            ) {
            edges {
              cursor
              node {
                id
                name
              }
            }
          }
        }`

        const pg = getPGBuilder<{ role: 'Admin' | 'User' }>()
        const pgCache = pg.cache()

        let paramsValue: ResolveParams<any, any, any, any> = null as any

        const userModel = pgObjectToPGModel()(
          pg.object('User', (f) => ({
            id: f.id(),
            name: f.string(),
          })),
          pgCache,
        )

        const userConnection = pg.relayConnection(
          pg.objectFromModel(userModel, (keep, f) => keep),
        )

        const userRelayArgs = pg.relayArgs()

        pg.query('users', (f) =>
          f
            .object(() => userConnection)
            .args((f) => ({
              ...userRelayArgs,
              orderBy: f
                .input(() =>
                  pg.input('UsersOrderByInput', (f) => ({
                    id: f.id().nullable(),
                    posts: f
                      .input(() =>
                        pg.input('PostsOrderByInput', (f) => ({
                          id: f.id().nullable(),
                        })),
                      )
                      .nullable(),
                  })),
                )
                .list(),
            }))
            .resolve((params) => {
              paramsValue = params
              return []
            }),
        )

        const schema = pg.build()

        await graphql({
          schema,
          source: query,
          contextValue: { role: 'User' },
        })

        const result = pg.prismaFindArgs(userConnection, paramsValue)

        expect(result).toEqual({
          skip: 1,
          take: 3,
          cursor: {
            id: 2,
          },
          orderBy: [{ id: 'desc' }, { posts: { id: 'desc' } }],
        })
      })

      it('relayArgsのfirstのみに対応した結果が返る', async () => {
        const query = `
        query {
          users ( 
            first: 2
            orderBy: { id: "asc" }
            ) {
            edges {
              cursor
              node {
                id
                name
              }
            }
          }
        }`

        const pg = getPGBuilder<{ role: 'Admin' | 'User' }>()
        const pgCache = pg.cache()

        let paramsValue: ResolveParams<any, any, any, any> = null as any

        const userModel = pgObjectToPGModel()(
          pg.object('User', (f) => ({
            id: f.id(),
            name: f.string(),
          })),
          pgCache,
        )

        const userConnection = pg.relayConnection(
          pg.objectFromModel(userModel, (keep, f) => keep),
        )
        const userRelayArgs = pg.relayArgs()

        pg.query('users', (f) =>
          f
            .object(() => userConnection)
            .args((f) => ({
              ...userRelayArgs,
              orderBy: f.input(() =>
                pg.input('UsersOrderByInput', (f) => ({
                  id: f.id().nullable(),
                })),
              ),
            }))
            .resolve((params) => {
              paramsValue = params
              return []
            }),
        )

        const schema = pg.build()

        await graphql({
          schema,
          source: query,
          contextValue: { role: 'User' },
        })

        const result = pg.prismaFindArgs(userConnection, paramsValue)

        expect(result).toEqual({
          take: 3,
          orderBy: {
            id: 'asc',
          },
        })
      })
      it('relayArgsのlastのみに対応した結果が返る', async () => {
        const query = `
        query {
          users ( 
            last: 2
            orderBy: { id: "asc" }
            ) {
            edges {
              cursor
              node {
                id
                name
              }
            }
          }
        }`

        const pg = getPGBuilder<{ role: 'Admin' | 'User' }>()
        const pgCache = pg.cache()

        let paramsValue: ResolveParams<any, any, any, any> = null as any

        const userModel = pgObjectToPGModel()(
          pg.object('User', (f) => ({
            id: f.id(),
            name: f.string(),
          })),
          pgCache,
        )

        const userConnection = pg.relayConnection(
          pg.objectFromModel(userModel, (keep, f) => keep),
        )
        const userRelayArgs = pg.relayArgs()

        pg.query('users', (f) =>
          f
            .object(() => userConnection)
            .args((f) => ({
              ...userRelayArgs,
              orderBy: f.input(() =>
                pg.input('UsersOrderByInput', (f) => ({
                  id: f.id().nullable(),
                })),
              ),
            }))
            .resolve((params) => {
              paramsValue = params
              return []
            }),
        )

        const schema = pg.build()

        await graphql({
          schema,
          source: query,
          contextValue: { role: 'User' },
        })

        const result = pg.prismaFindArgs(userConnection, paramsValue)

        expect(result).toEqual({
          take: 3,
          orderBy: {
            id: 'desc',
          },
        })
      })
      it('relayArgsのorderByが未定義の場合にエラーが返る', async () => {
        const query = `
        query {
          users ( 
            first: 2
            after: "eyAiaWQiOiAyfQ=="
            ) {
            edges {
              cursor
              node {
                id
                name
              }
            }
          }
        }`

        const pg = getPGBuilder<{ role: 'Admin' | 'User' }>()
        const pgCache = pg.cache()

        let paramsValue: ResolveParams<any, any, any, any> = null as any

        const userModel = pgObjectToPGModel()(
          pg.object('User', (f) => ({
            id: f.id(),
            name: f.string(),
          })),
          pgCache,
        )

        const userConnection = pg.relayConnection(
          pg.objectFromModel(userModel, (keep, f) => keep),
        )
        const userRelayArgs = pg.relayArgs()

        pg.query('users', (f) =>
          f
            .object(() => userConnection)
            .args((f) => ({
              ...userRelayArgs,
              orderBy: f
                .input(() =>
                  pg.input('UsersOrderByInput', (f) => ({
                    id: f.id().nullable(),
                  })),
                )
                .nullable(),
            }))
            .resolve((params) => {
              paramsValue = params
              return []
            }),
        )

        const schema = pg.build()

        await graphql({
          schema,
          source: query,
          contextValue: { role: 'User' },
        })

        expect(() => pg.prismaFindArgs(userConnection, paramsValue)).toThrow(
          'Cannot paginate without `orderBy`',
        )
      })
    })
  })

  describe('dataloader', () => {
    it('dataloderによって処理がバッチ化される。', async () => {
      const users = [
        {
          id: '1',
          posts: [],
          latestPost: null,
        },
        {
          id: '2',
          posts: [],
          latestPost: null,
        },
      ]

      const posts = [
        {
          id: '1',
          title: 'xxx',
          userId: '1',
        },
        {
          id: '2',
          title: 'yyy',
          userId: '1',
        },
        {
          id: '3',
          title: 'zzz',
          userId: '2',
        },
      ]

      const pg = getPGBuilder<any>()

      const user = pg.object('User', (f) => ({
        id: f.id(),
        posts: f.object(() => post).list(),
        latestPost: f.object(() => post).nullable(),
      }))

      const post = pg.object('Post', (f) => ({
        id: f.id(),
        title: f.string(),
        userId: f.string(),
      }))

      const spy = jest.fn()

      pg.resolver(user, {
        latestPost: (params) => {
          return pg.dataloader(params, (sourceList) => {
            spy()
            const userPosts = sourceList.map((x) =>
              posts.filter((p) => p.userId === x.id),
            )
            const latestPost = userPosts.map(
              (x) => _.maxBy(x, (post) => Number(post.id)) ?? null,
            )
            return latestPost
          })
        },
      })

      pg.query('findUsers', (f) =>
        f
          .object(() => user)
          .list()
          .resolve(() => users),
      )

      pg.mutation('createUsers', (f) =>
        f
          .object(() => user)
          .list()
          .resolve(() => users),
      )

      const schemaResult = pg.build()

      const query = `
      query {
        findUsers {
          latestPost {
            id
          }
        }
      }
      `

      const queryResp = await graphql({
        schema: schemaResult,
        source: query,
        contextValue: {},
      })
      if (queryResp.errors !== undefined) {
        console.log(queryResp)
      }

      expect(spy.mock.calls.length).toBe(1)
      expect(queryResp).toEqual({
        data: {
          findUsers: [
            {
              latestPost: {
                id: '2',
              },
            },
            {
              latestPost: {
                id: '3',
              },
            },
          ],
        },
      })
    })
  })

  describe('relayConnection', () => {
    it('Relay方式に対応したPGObjectが作成される', () => {
      const pg = getPGBuilder<any>()
      const post = pg.object('Post', (f) => ({
        id: f.id(),
        uuid: f.id(),
        title: f.string(),
      }))
      const postConnection = pg.relayConnection(post)

      const expectConnection = setPGObjectProperties({
        name: 'PostConnection',
        fieldMap: {
          edges: setOutputFieldMethods({
            kind: 'object',
            isRequired: true,
            isList: true,
            isId: false,
            resolve: expect.any(Function),
            type: expect.any(Function),
          }),
          pageInfo: setOutputFieldMethods({
            kind: 'object',
            isRequired: true,
            isList: false,
            isId: false,
            resolve: expect.any(Function),
            type: expect.any(Function),
          }),
        },
        value: {
          isRelayConnection: true,
        },
      })

      const expectPostEdge = setPGObjectProperties({
        name: 'PostEdge',
        fieldMap: {
          cursor: setOutputFieldMethods({
            kind: 'scalar',
            isRequired: true,
            isList: false,
            isId: false,
            resolve: expect.any(Function),
            type: 'String',
          }),
          node: setOutputFieldMethods({
            kind: 'object',
            isRequired: true,
            isList: false,
            isId: false,
            resolve: expect.any(Function),
            type: expect.any(Function),
          }),
        },
      })

      const expectPageInfo = setPGObjectProperties({
        name: 'PageInfo',
        fieldMap: {
          hasNextPage: setOutputFieldMethods({
            kind: 'scalar',
            isRequired: true,
            isList: false,
            isId: false,
            type: 'Boolean',
          }),
          hasPreviousPage: setOutputFieldMethods({
            kind: 'scalar',
            isRequired: true,
            isList: false,
            isId: false,
            type: 'Boolean',
          }),
        },
      })

      expect(postConnection).toEqual(expectConnection)
      const edge = (postConnection.fieldMap.edges.value.type as Function)()
      expect(edge).toEqual(expectPostEdge)
      const cursorResolve = edge.fieldMap.cursor.value.resolve
      expect(cursorResolve({ id: 1 })).toEqual('eyJpZCI6MX0=')
      const pageInfo = (postConnection.fieldMap.pageInfo.value.type as Function)()
      expect(pageInfo).toEqual(expectPageInfo)
      expect(pg.cache().object.PostConnection).toEqual(expectConnection)
    })

    it('内部のFieldに設定されたresolverが期待通りに動作する', async () => {
      function getSchema(resolveValue: any): {
        schema: GraphQLSchema
        totalCountFindArgs: {
          users: any
          posts: any
        }
      } {
        const totalCountFindArgs = {
          users: null,
          posts: null,
        }
        const pg = getPGBuilder<{ role: 'Admin' | 'User' }>()
        const pgCache = pg.cache()

        const userModel = pgObjectToPGModel()(
          pg.object('User', (f) => ({
            id: f.id(),
            name: f.string(),
            posts: f.object(() => postModel).list(),
          })),
          pgCache,
        )
        const user = pg.objectFromModel(userModel, (keep, f) => ({
          ...keep,
          posts: f
            .object(() => postConnection)
            .args((f) => ({
              ...pg.relayArgs(),
              where: f
                .input(() =>
                  pg.input('PostsWhereInput', (f) => ({
                    title: f.input(() =>
                      pg.input('PostsWhereTitleInput', (f) => ({
                        equals: f.string().nullable(),
                      })),
                    ),
                  })),
                )
                .nullable(),
            })),
        }))
        const userConnection = pg.relayConnection(user, {
          totalCount: (params, findArgs) => {
            totalCountFindArgs.users = findArgs
            return params.source.length
          },
        })

        const postModel = pgObjectToPGModel()(
          pg.object('Post', (f) => ({
            id: f.id(),
            title: f.string(),
          })),
          pgCache,
        )
        const post = pg.objectFromModel(postModel, (keep, f) => keep)
        const postConnection = pg.relayConnection(post, {
          totalCount: (params, findArgs) => {
            totalCountFindArgs.posts = findArgs
            return params.source.length
          },
        })

        pg.query('users', (f) =>
          f
            .object(() => userConnection)
            .args((f) => ({
              ...pg.relayArgs(),
              where: f
                .input(() =>
                  pg.input('UsersWhereInput', (f) => ({
                    name: f.input(() =>
                      pg.input('UsersWhereNameInput', (f) => ({
                        equals: f.string().nullable(),
                      })),
                    ),
                  })),
                )
                .nullable(),
            }))
            .resolve((params) => {
              pg.prismaFindArgs(userConnection, params, {
                orderBy: { id: 'desc' },
                include: {
                  posts: {
                    orderBy: { id: 'desc' },
                  },
                },
              })
              return resolveValue
            }),
        )

        return {
          schema: pg.build(),
          totalCountFindArgs,
        }
      }
      const query = `
        query (
          $usersWhereInput: UsersWhereInput
          $postsWhereInput: PostsWhereInput
        ) {
          users ( where: $usersWhereInput, first: 1 ) {
            totalCount
            edges {
              cursor
              node {
                name
                posts ( where: $postsWhereInput, after: "xxx" ){
                  totalCount
                  edges {
                    cursor
                    node {
                      title
                    }
                  }
                  pageInfo {
                    hasNextPage
                    hasPreviousPage
                  }
                }
              }
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
            }
          }
        }
      `

      const { schema, totalCountFindArgs } = getSchema([
        {
          id: 'u1',
          name: 'user1',
          posts: [
            {
              id: 'p1',
              title: 'title1',
            },
          ],
        },
        {
          id: 'u2',
          name: 'user2',
          posts: [],
        },
      ])

      const resp = await graphql({
        schema,
        source: query,
        variableValues: {
          usersWhereInput: {
            name: { equals: 'xxx' },
          },
          postsWhereInput: null,
        },
        contextValue: {},
      })

      expect(resp.errors).toEqual(undefined)
      expect(resp.data).toEqual({
        users: {
          totalCount: 2,
          edges: [
            {
              cursor: 'eyJpZCI6InUxIn0=',
              node: {
                name: 'user1',
                posts: {
                  totalCount: 1,
                  edges: [
                    {
                      cursor: 'eyJpZCI6InAxIn0=',
                      node: { title: 'title1' },
                    },
                  ],
                  pageInfo: {
                    hasNextPage: false,
                    hasPreviousPage: true,
                  },
                },
              },
            },
          ],
          pageInfo: {
            hasNextPage: true,
            hasPreviousPage: false,
          },
        },
      })

      // NOTE: totalCount取得用に渡されるargs
      expect(totalCountFindArgs).toEqual({
        posts: {
          orderBy: {
            id: 'desc',
          },
        },
        users: {
          include: {
            posts: {
              orderBy: {
                id: 'desc',
              },
            },
          },
          orderBy: {
            id: 'desc',
          },
          take: 2,
          where: {
            name: {
              equals: 'xxx',
            },
          },
        },
      })
    })

    describe('optionsを指定した場合', () => {
      it('totalCountフィールドが追加され、指定したメソッドでcursorが計算される', () => {
        const pg = getPGBuilder<any>()
        const user = pg.object('User', (f) => ({
          id: f.id(),
          posts: f.object(() => postConnection),
        }))
        const post = pg.object('Post', (f) => ({
          id: f.id(),
          uuid: f.id(),
          title: f.string(),
        }))
        const postConnection = pg.relayConnection(post, {
          connectionSource: user,
          totalCount: (params, nodeFindArgs) => {
            return { source: params.source, nodeFindArgs } as any
          },
          cursor: (node) => ({ uuid: node.uuid }),
        })

        const expectConnection = setPGObjectProperties({
          name: 'PostConnection',
          fieldMap: {
            totalCount: setOutputFieldMethods({
              kind: 'scalar',
              isRequired: true,
              isList: false,
              isId: false,
              resolve: expect.any(Function),
              type: 'Int',
            }),
            edges: setOutputFieldMethods({
              kind: 'object',
              isRequired: true,
              isList: true,
              isId: false,
              resolve: expect.any(Function),
              type: expect.any(Function),
            }),
            pageInfo: setOutputFieldMethods({
              kind: 'object',
              isRequired: true,
              isList: false,
              isId: false,
              resolve: expect.any(Function),
              type: expect.any(Function),
            }),
          },
          value: {
            isRelayConnection: true,
          },
        })

        const expectPostEdge = setPGObjectProperties({
          name: 'PostEdge',
          fieldMap: {
            cursor: setOutputFieldMethods({
              kind: 'scalar',
              isRequired: true,
              isList: false,
              isId: false,
              resolve: expect.any(Function),
              type: 'String',
            }),
            node: setOutputFieldMethods({
              kind: 'object',
              isRequired: true,
              isList: false,
              isId: false,
              resolve: expect.any(Function),
              type: expect.any(Function),
            }),
          },
        })

        expect(postConnection).toEqual(expectConnection)
        const totalCountResolve = postConnection.fieldMap.totalCount?.value.resolve
        expect(
          totalCountResolve?.([], null, {}, {
            fieldNodes: [{}],
          } as any),
        ).toEqual({
          source: [],
          nodeFindArgs: {},
        })
        const edge = (postConnection.fieldMap.edges.value.type as Function)()
        expect(edge).toEqual(expectPostEdge)
        const cursorResolve = edge.fieldMap.cursor.value.resolve
        expect(cursorResolve({ uuid: 1 })).toEqual('eyJ1dWlkIjoxfQ==')
      })
    })
  })

  describe('relayArgs', () => {
    it('Relay方式に必要なArgsが返る', () => {
      const pg = getPGBuilder<any>()
      const args = pg.relayArgs()

      expect(args).toEqual({
        first: setInputFieldMethods({
          kind: 'scalar',
          isRequired: false,
          isList: false,
          isId: false,
          type: 'Int',
        }),
        after: setInputFieldMethods({
          kind: 'scalar',
          isRequired: false,
          isList: false,
          isId: false,
          type: 'String',
        }),
        last: setInputFieldMethods({
          kind: 'scalar',
          isRequired: false,
          isList: false,
          isId: false,
          type: 'Int',
        }),
        before: setInputFieldMethods({
          kind: 'scalar',
          isRequired: false,
          isList: false,
          isId: false,
          type: 'String',
        }),
      })
    })

    describe('optionsを指定した場合', () => {
      it('defaultとvalidationが設定されたArgsが返る', () => {
        const pg = getPGBuilder<any>()
        const args = pg.relayArgs({
          default: 10,
          max: 1000,
        })

        expect(args).toEqual({
          first: setInputFieldMethods({
            kind: 'scalar',
            isRequired: false,
            isList: false,
            isId: false,
            type: 'Int',
            default: 10,
            validatorBuilder: expect.any(Function),
          }),
          after: setInputFieldMethods({
            kind: 'scalar',
            isRequired: false,
            isList: false,
            isId: false,
            type: 'String',
          }),
          last: setInputFieldMethods({
            kind: 'scalar',
            isRequired: false,
            isList: false,
            isId: false,
            type: 'Int',
            default: 10,
            validatorBuilder: expect.any(Function),
          }),
          before: setInputFieldMethods({
            kind: 'scalar',
            isRequired: false,
            isList: false,
            isId: false,
            type: 'String',
          }),
        })

        const firstValidation = args.first.value.validatorBuilder?.(z, {})
        expect(JSON.stringify(firstValidation)).toEqual(
          JSON.stringify(z.number().max(1000)),
        )

        const lastValidation = args.last.value.validatorBuilder?.(z, {})
        expect(JSON.stringify(lastValidation)).toEqual(
          JSON.stringify(z.number().max(1000)),
        )
      })
    })
  })
})

describe('PGObject', () => {
  describe('prismaAuth', () => {
    it('TPrismaFindManyArgsで指定された型でPrismaの権限ルールを設定できる', () => {
      type TContext = { role: 'Admin' | 'Manager' }
      type TPrismaFindManyArgs = { where?: { status: string } }

      const pg = getPGBuilder<TContext>()
      const object: PGObject<
        {
          title: PGOutputField<string>
          detail: PGOutputField<string>
          status: PGOutputField<string>
        },
        TContext,
        TPrismaFindManyArgs
      > = pg
        .object('Post', (f) => ({
          title: f.string(),
          detail: f.string(),
          status: f.string(),
        }))
        .prismaAuth(({ ctx, allow, deny }) => {
          allow('read', { status: 'published' })
          deny('read', ['detail'], { status: 'draft' })
          if (ctx.role === 'Admin') {
            allow('read')
          }
        })

      function getAbility(ctx: TContext): PrismaAbility<any> {
        const { can, cannot, build } = new AbilityBuilder(PrismaAbility)
        const allowFn = (
          action: string,
          conditionOrFields: any,
          condition?: TPrismaFindManyArgs['where'],
        ): void => {
          if (Array.isArray(conditionOrFields)) {
            can(action, 'Post' as any, conditionOrFields, condition as any)
          } else {
            can(action, 'Post' as any, conditionOrFields)
          }
        }
        const denyFun = (
          action: string,
          conditionOrFields: any,
          condition?: TPrismaFindManyArgs['where'],
        ): void => {
          if (Array.isArray(conditionOrFields)) {
            cannot(action, 'Post' as any, conditionOrFields, condition as any)
          } else {
            cannot(action, 'Post' as any, conditionOrFields)
          }
        }
        object.value.prismaAuthBuilder?.({ ctx, allow: allowFn, deny: denyFun })
        return build()
      }

      const managerAbility = getAbility({ role: 'Manager' })
      expect(
        managerAbility.can(
          'read',
          subject('Post', {
            status: 'published',
          }),
        ),
      ).toBeTruthy()
      expect(
        managerAbility.can(
          'read',
          subject('Post', {
            status: 'xxx',
          }),
        ),
      ).toBeFalsy()
      expect(
        managerAbility.can(
          'read',
          subject('Post', {
            status: 'draft',
          }),
          'detail',
        ),
      ).toBeFalsy()

      const adminAbility = getAbility({ role: 'Admin' })
      expect(
        adminAbility.can(
          'read',
          subject('Post', {
            status: 'draft',
          }),
        ),
      ).toBeTruthy()
    })
  })

  describe('checkPrismaPermission', () => {
    it('Prismaの権限ルールに沿って参照権限があるか確認する。', async () => {
      type TContext = { role: 'Admin' | 'LoginUser' }
      type TPrismaFindManyArgs = { where: { status: string } }

      const pg = getPGBuilder<TContext>()
      const loginUserContext: TContext = { role: 'LoginUser' }
      const adminContext: TContext = { role: 'Admin' }

      const user = pg
        .object('User', (f) => ({
          name: f.string(),
          config: f.string().nullable(),
        }))
        .prismaAuth(({ ctx, allow, deny }) => {
          allow('read', ['name'])
          if (ctx.role === 'Admin') {
            allow('read')
          }
        })

      const comment = pg
        .object('Comment', (f) => ({
          message: f.string(),
          config: f.string().list(),
          latestMessage: f.string(),
        }))
        .prismaAuth(({ ctx, allow, deny }) => {
          allow('read')
          deny('read', ['config'])
          if (ctx.role === 'Admin') {
            allow('read')
          }
        })

      const model = pgObjectToPGModel<TPrismaFindManyArgs>()(
        pg.object('Post', (f) => ({
          id: f.id(),
          title: f.string(),
          detail: f.string(),
          user: f.object(() => user),
          comments: f.object(() => comment).list(),
          status: f.string().nullable(),
          config: f.string().nullable(),
        })),
      )

      const post = pg
        .objectFromModel(model, (keep) => keep)
        .prismaAuth(({ ctx, allow, deny }) => {
          deny('read', { status: 'draft' })
          allow('read', ['title', 'user', 'comments'], { status: 'draft' })
          allow('read', { status: 'published' })
          deny('read', ['config'], { status: 'published' })
          deny('read', ['id'])
          if (ctx.role === 'Admin') {
            allow('read')
          }
        })

      expect(
        post.checkPrismaPermission(loginUserContext, 'read', {
          title: 'aaa',
          detail: 'Text1',
          user: {
            name: 'xxx',
            config: 'config1',
          },
          comments: [
            {
              message: 'message1',
              config: ['config2'],
            },
            {
              message: 'message2',
              config: ['config3'],
            },
          ],
          status: 'published',
        }),
      ).toEqual({
        hasPermission: false,
        permittedValue: {
          title: 'aaa',
          detail: 'Text1',
          user: {
            name: 'xxx',
            config: null,
          },
          comments: [
            {
              message: 'message1',
              config: [],
            },
            {
              message: 'message2',
              config: [],
            },
          ],
          status: 'published',
        },
      })

      expect(
        post.checkPrismaPermission(loginUserContext, 'read', {
          title: 'aaa',
          detail: 'Text1',
          status: 'published',
        }),
      ).toEqual({
        hasPermission: true,
        permittedValue: {
          title: 'aaa',
          detail: 'Text1',
          status: 'published',
        },
      })

      expect(() =>
        post.checkPrismaPermission(loginUserContext, 'read', {
          id: '1',
          title: 'aaa',
          detail: 'Text1',
          status: 'published',
        }),
      ).toThrow('Prisma permission denied. Field: Post.id')

      expect(
        post.checkPrismaPermission(adminContext, 'read', {
          id: '1',
          title: 'aaa',
          detail: 'Text1',
          user: {
            name: 'xxx',
            config: 'config1',
          },
          comments: [
            {
              message: 'message1',
              config: ['config2'],
            },
            {
              message: 'message2',
              config: ['config3'],
              latestMessage: 'message3',
            },
          ],
          status: 'published',
          config: 'config4',
        }),
      ).toEqual({
        hasPermission: true,
        permittedValue: {
          id: '1',
          title: 'aaa',
          detail: 'Text1',
          user: {
            name: 'xxx',
            config: 'config1',
          },
          comments: [
            {
              message: 'message1',
              config: ['config2'],
            },
            {
              message: 'message2',
              config: ['config3'],
              latestMessage: 'message3',
            },
          ],
          status: 'published',
          config: 'config4',
        },
      })
    })
  })
})

function getResolveParamsRef(readonlyPGCache: ReadonlyDeep<PGCache>): {
  value: ResolveParams<any, any, any, any>
} {
  const paramsRef = { value: null as any }
  const pgCache = readonlyPGCache as PGCache
  pgCache.query = Object.entries(pgCache.query).reduce<PGCache['query']>(
    (acc, [name, pgQuery]) => {
      const originalResolve = pgQuery.field.value.resolve
      acc[name] = {
        ...pgQuery,
        field: pgQuery.field.resolve((params) => {
          paramsRef.value = params
          return originalResolve?.(
            params.source,
            params.args,
            params.context,
            params.info,
          ) as any
        }),
      }
      return acc
    },
    {},
  )
  return paramsRef
}

describe('PGOutputField', () => {
  describe('auth', () => {
    it('定義した関数がauthCheckerにセットされる', () => {
      const pg = getPGBuilder<{ user: { roles: Array<'Admin' | 'LoginUser'> } }>()

      const post = pg.object('Post', (f) => ({
        id: f.id().auth(({ ctx }) => ctx.user.roles.includes('Admin')),
      }))

      expect(
        post.fieldMap.id.value.authChecker?.({
          ctx: {
            user: {
              roles: ['Admin'],
            },
          },
          args: undefined as never,
        }),
      ).toEqual(true)
    })
  })
  describe('accessControlWrapper', () => {
    it('authCheckerにセットされたルールに沿った権限制御がされる', async () => {
      const users = [
        {
          id: '1',
          age: 28,
          posts: [
            {
              id: '1',
              title: 'xxx',
              userId: '1',
              config: 'xxx',
            },
            {
              id: '2',
              title: 'yyy',
              userId: '1',
              config: 'yyy',
            },
          ],
          latestPost: null,
        },
        {
          id: '2',
          age: 30,
          posts: [],
          latestPost: null,
        },
      ]

      const pg = getPGBuilder<{ user: { roles: Array<'LoginUser' | 'Admin'> } }>()

      const user = pg.object('User', (f) => ({
        id: f.id(),
        age: f
          .int()
          .nullable()
          .auth(({ ctx }) => true),
        posts: f
          .object(() => post)
          .list()
          .auth(({ ctx }) => ctx.user.roles.includes('Admin')),
        latestPost: f
          .object(() => post)
          .nullable()
          .auth(({ ctx }) => true),
      }))

      const post = pg.object('Post', (f) => ({
        id: f.id(),
        title: f.string().auth(({ ctx }) => true),
        userId: f.string(),
        config: f
          .string()
          .nullable()
          .auth(({ ctx }) => ctx.user.roles.includes('Admin')),
      }))

      pg.resolver(user, {
        latestPost: ({ source }) => {
          return _.maxBy(source.posts, (post) => Number(post.id)) ?? null
        },
      })

      pg.query('findUsers', (f) =>
        f
          .object(() => user)
          .list()
          .resolve(() => users),
      )

      const schemaResult = pg.build()

      const query = `
      query {
        findUsers {
          id
          age
          posts {
            id
            title
            userId
            config
          }
          latestPost {
            id
            title
            userId
            config
          }
        }
      }
      `

      const loginUserQueryResp = await graphql({
        schema: schemaResult,
        source: query,
        contextValue: { user: { roles: ['LoginUser'] } },
      })
      if (loginUserQueryResp.errors !== undefined) {
        console.log(loginUserQueryResp)
      }

      expect(loginUserQueryResp).toEqual({
        data: {
          findUsers: [
            {
              id: '1',
              age: 28,
              posts: [],
              latestPost: {
                id: '2',
                title: 'yyy',
                userId: '1',
                config: null,
              },
            },
            {
              id: '2',
              age: 30,
              posts: [],
              latestPost: null,
            },
          ],
        },
      })

      const adminQueryResp = await graphql({
        schema: schemaResult,
        source: query,
        contextValue: { user: { roles: ['Admin'] } },
      })
      if (adminQueryResp.errors !== undefined) {
        console.log(adminQueryResp)
      }

      expect(adminQueryResp).toEqual({
        data: {
          findUsers: [
            {
              id: '1',
              age: 28,
              posts: [
                {
                  id: '1',
                  title: 'xxx',
                  userId: '1',
                  config: 'xxx',
                },
                {
                  id: '2',
                  title: 'yyy',
                  userId: '1',
                  config: 'yyy',
                },
              ],
              latestPost: {
                id: '2',
                title: 'yyy',
                userId: '1',
                config: 'yyy',
              },
            },
            {
              id: '2',
              age: 30,
              posts: [],
              latestPost: null,
            },
          ],
        },
      })
    })

    it('権限がないnon-nullableなfieldを参照できずエラーが返る', async () => {
      const users = [
        {
          id: '1',
          config: 'xxx',
        },
      ]

      const pg = getPGBuilder<{ user: { roles: Array<'LoginUser' | 'Admin'> } }>()

      const user = pg.object('User', (f) => ({
        id: f.id(),
        config: f.string().auth(({ ctx }) => ctx.user.roles.includes('Admin')),
      }))

      pg.query('findUsers', (f) =>
        f
          .object(() => user)
          .list()
          .resolve(() => users),
      )

      const schemaResult = pg.build()

      const query = `
      query {
        findUsers {
          id
          config
        }
      }
      `

      const loginUserQueryResp = await graphql({
        schema: schemaResult,
        source: query,
        contextValue: { user: { roles: ['LoginUser'] } },
      })

      expect(loginUserQueryResp.data).toEqual(null)

      const originalErrors = loginUserQueryResp.errors?.[0].originalError
      expect(originalErrors).toBeInstanceOf(PGError)
      expect(originalErrors?.message).toEqual(
        'GraphQL permission denied. Field: User.config',
      )
      expect((originalErrors as PGError).code).toEqual('AuthError')
    })
  })
})

describe('PGInputField', () => {
  describe('validation', () => {
    it('定義した関数がvalidatorBuilderにセットされる', () => {
      const pg = getPGBuilder<{ user: { roles: Array<'Admin' | 'LoginUser'> } }>()

      const someInput = pg.input('SomeInput', (f) => ({
        id: f
          .id()
          .nullable()
          .validation((z, ctx) =>
            ctx.user.roles.includes('Admin') ? z.string().min(5) : z.null(),
          ),
      }))

      const validator = someInput.fieldMap.id.value.validatorBuilder?.(z, {
        user: {
          roles: ['Admin'],
        },
      })

      expect(validator?.parse('abcde')).toEqual('abcde')
      expect(() => validator?.parse('abcd')).toThrow()
    })

    it('validationBuilderにセットされたルールに沿ったバリデートがされる', async () => {
      const pg = getPGBuilder<{ user: { roles: Array<'Admin' | 'LoginUser'> } }>()
      const users = [
        {
          id: '1',
          name: 'xyz',
          age: 28,
          latestPost: {
            title: '123456',
          },
        },
        {
          id: '2',
          name: 'abcdefg',
          age: 18,
          latestPost: {
            title: '1234567',
          },
        },
      ]

      const user = pg.object('User', (f) => ({
        id: f.id(),
        name: f.string(),
        age: f.int(),
        latestPost: f
          .object(() => post)
          .args((f) => ({
            titleName: f
              .string()
              .nullable()
              .validation((z, ctx) => z.string().max(6)),
          }))
          .nullable()
          .resolve(({ source, args }) => {
            return args.titleName === source.latestPost.title ? source.latestPost : null
          }),
      }))

      const post = pg.object('Post', (f) => ({
        title: f.string(),
      }))

      const userProfileInput = pg.input('UserProfileInput', (f) => ({
        age: f
          .int()
          .nullable()
          .validation((z, ctx) =>
            ctx.user.roles.includes('Admin') ? z.number().min(20) : z.null(),
          ),
      }))

      pg.query('findUsers', (f) =>
        f
          .object(() => user)
          .list()
          .args((f) => ({
            name: f.string().validation((z, ctx) => z.string().max(6)),
            profile: f.input(() => userProfileInput).nullable(),
          }))
          .resolve(({ args }) => {
            return users.filter((x) => args.name === x.name) ?? []
          }),
      )

      const schemaResult = pg.build()

      const adminNormalQuery = `
      query {
        findUsers(
          name: "xyz"
          profile: {
            age: 28
          }
        ) {
          id
          name
          age
          latestPost(
            titleName: "123456"
          ){
            title
          }
        }
      }
      `

      const adminNormalQueryResp = await graphql({
        schema: schemaResult,
        source: adminNormalQuery,
        contextValue: { user: { roles: ['Admin'] } },
      })

      expect(adminNormalQueryResp).toEqual({
        data: {
          findUsers: [
            {
              id: '1',
              name: 'xyz',
              age: 28,
              latestPost: {
                title: '123456',
              },
            },
          ],
        },
      })

      const adminIrregularQuery = `
      query {
        findUsers(
          name: "abcdefg"
          profile: {
            age: 18
          }
        ) {
          id
          name
          age
          latestPost(
            titleName: "1234567"
          ){
            title
          }
        }
      }
      `

      const adminIrregularQueryResp = await graphql({
        schema: schemaResult,
        source: adminIrregularQuery,
        contextValue: { user: { roles: ['Admin'] } },
      })

      expect(adminIrregularQueryResp.data).toEqual(null)

      const adminIrregularQueryOriginalErrors =
        adminIrregularQueryResp.errors?.[0].originalError
      expect(adminIrregularQueryOriginalErrors).toBeInstanceOf(PGError)
      expect(adminIrregularQueryOriginalErrors?.message).toEqual('Invalid args.')
      expect((adminIrregularQueryOriginalErrors as PGError).code).toEqual(
        'ValidationError',
      )
      expect((adminIrregularQueryOriginalErrors as PGError).detail).toEqual(
        '[' +
          '{"path":"findUsers.name","issues":[{"code":"too_big","maximum":6,"type":"string","inclusive":true,"message":"String must contain at most 6 character(s)","path":[]}]},' +
          '{"path":"findUsers.profile.age","issues":[{"code":"too_small","minimum":20,"type":"number","inclusive":true,"message":"Number must be greater than or equal to 20","path":[]}]},' +
          '{"path":"findUsers.latestPost.titleName","issues":[{"code":"too_big","maximum":6,"type":"string","inclusive":true,"message":"String must contain at most 6 character(s)","path":[]}]}' +
          ']',
      )

      const loginUserNormalQuery = `
      query {
        findUsers(
          name: "xyz"
        ) {
          id
          name
          age
        }
      }
      `

      const loginUserNormalQueryResp = await graphql({
        schema: schemaResult,
        source: loginUserNormalQuery,
        contextValue: { user: { roles: ['LoginUser'] } },
      })

      expect(loginUserNormalQueryResp).toEqual({
        data: {
          findUsers: [
            {
              id: '1',
              name: 'xyz',
              age: 28,
            },
          ],
        },
      })

      const loginUserIrregularQuery = `
      query {
        findUsers(
          name: "xyz"
          profile: {
            age: 28
          }
        ) {
          id
          name
          age
        }
      }
      `

      const loginUserIrregularQueryResp = await graphql({
        schema: schemaResult,
        source: loginUserIrregularQuery,
        contextValue: { user: { roles: ['LoginUser'] } },
      })

      expect(loginUserIrregularQueryResp.data).toEqual(null)

      const loginUserIrregularQueryOriginalErrors =
        loginUserIrregularQueryResp.errors?.[0].originalError
      expect(loginUserIrregularQueryOriginalErrors).toBeInstanceOf(PGError)
      expect(loginUserIrregularQueryOriginalErrors?.message).toEqual('Invalid args.')
      expect((loginUserIrregularQueryOriginalErrors as PGError).code).toEqual(
        'ValidationError',
      )
      expect((loginUserIrregularQueryOriginalErrors as PGError).detail).toEqual(
        '[{"path":"findUsers.profile.age","issues":[{"code":"invalid_type","expected":"null","received":"number","path":[],"message":"Expected null, received number"}]}]',
      )
    })
  })
})

describe('PGInput', () => {
  describe('validation', () => {
    it('定義した関数がvalidatorBuilderにセットされる', () => {
      const pg = getPGBuilder<{ user: { roles: Array<'Admin' | 'LoginUser'> } }>()

      const findUser = pg
        .input('FindUser', (f) => ({
          password: f.string(),
          confirmPassword: f.string(),
        }))
        .validation((z, ctx) =>
          z.any().refine((args: any) => {
            return ctx.user.roles.includes('Admin')
              ? true
              : args.password === args.confirmPassword
          }),
        )

      const validator = findUser.value.validatorBuilder?.(z, {
        user: {
          roles: ['LoginUser'],
        },
      })
      expect(
        validator?.parse({
          password: 'xxx',
          confirmPassword: 'xxx',
        }),
      ).toEqual({
        password: 'xxx',
        confirmPassword: 'xxx',
      })
      expect(() =>
        validator?.parse({
          password: 'xxx',
          confirmPassword: 'yyy',
        }),
      ).toThrow()
    })

    it('validationBuilderにセットされたルールに沿ったバリデートがされる', async () => {
      const pg = getPGBuilder<{ user: { roles: Array<'Admin' | 'LoginUser'> } }>()

      const contents = [
        {
          id: '1',
          name: 'bbb',
          password: 'xyz',
        },
        {
          id: '2',
          name: 'aaa',
          password: 'abc',
        },
        {
          id: '3',
          name: 'aaa',
          password: 'abc',
        },
      ]

      const content = pg.object('Content', (f) => ({
        id: f.id(),
        name: f.string(),
        password: f.string(),
        confirmPassword: f.string(),
      }))

      const contentInput = pg
        .input('ContentInput', (f) => ({
          id: f.id(),
          password: f.string(),
          confirmPassword: f.string(),
        }))
        .validation((z, ctx) =>
          z.any().refine((args: any) => {
            return ctx.user.roles.includes('Admin')
              ? true
              : args.password === args.confirmPassword
          }),
        )

      const orderByInput = pg
        .input('OrderByInput', (f) => ({
          id: f.string().nullable(),
          name: f.string().nullable(),
        }))
        .validation((z, ctx) =>
          z.any().refine((args: any) => {
            return args.id != null || args.name != null
          }),
        )

      pg.query('findContents', (f) =>
        f
          .object(() => content)
          .list()
          .args((f) => ({
            passCheck: f.input(() => contentInput).nullable(),
            orderBy: f
              .input(() => orderByInput)
              .list()
              .nullable(),
          }))
          .resolve(({ args }) => {
            const resultContents =
              args.passCheck == null
                ? contents
                : contents.filter(
                    (x) =>
                      args.passCheck?.id === x.id &&
                      args.passCheck?.password === x.password,
                  ) ?? []

            if (args.orderBy?.[0].id != null) {
              resultContents.sort(function (a, b) {
                if (a.id < b.id) {
                  return args.orderBy?.[0].id === 'asc' ? -1 : 1
                }
                if (a.id > b.id) {
                  return args.orderBy?.[0].id === 'asc' ? 1 : -1
                }
                if (a.id === b.id) {
                  const nameA = a.name.toUpperCase()
                  const nameB = b.name.toUpperCase()
                  if (nameA < nameB) {
                    return args.orderBy?.[1].name === 'asc' ? -1 : 1
                  }
                  if (nameA > nameB) {
                    return args.orderBy?.[1].name === 'asc' ? 1 : -1
                  }
                }
                return 0
              })
            }
            if (args.orderBy?.[0].name != null) {
              resultContents.sort(function (a, b) {
                const nameA = a.name.toUpperCase()
                const nameB = b.name.toUpperCase()
                if (nameA < nameB) {
                  return args.orderBy?.[0].name === 'asc' ? -1 : 1
                }
                if (nameA > nameB) {
                  return args.orderBy?.[0].name === 'asc' ? 1 : -1
                }
                if (nameA === nameB) {
                  if (a.id < b.id) {
                    return args.orderBy?.[1].id === 'asc' ? -1 : 1
                  } else {
                    return args.orderBy?.[1].id === 'asc' ? 1 : -1
                  }
                }
                return 0
              })
            }
            return resultContents
          }),
      )

      const schemaResult = pg.build()

      const adminFindAllQuery = `
      query {
        findContents(
          orderBy: [
            { name: "asc" },
            { id: "asc" }
          ]
        ) {
          id
          name
        }
      }
      `

      const adminFindAllQueryResp = await graphql({
        schema: schemaResult,
        source: adminFindAllQuery,
        contextValue: { user: { roles: ['Admin'] } },
      })

      expect(adminFindAllQueryResp).toEqual({
        data: {
          findContents: [
            {
              id: '2',
              name: 'aaa',
            },
            {
              id: '3',
              name: 'aaa',
            },
            {
              id: '1',
              name: 'bbb',
            },
          ],
        },
      })

      const adminNormalQuery = `
      query {
        findContents(
          passCheck: {
            id: "1"
            password: "xyz"
            confirmPassword: ""
          }
        ) {
          id
        }
      }
      `

      const adminNormalQueryResp = await graphql({
        schema: schemaResult,
        source: adminNormalQuery,
        contextValue: { user: { roles: ['Admin'] } },
      })

      expect(adminNormalQueryResp).toEqual({
        data: {
          findContents: [
            {
              id: '1',
            },
          ],
        },
      })

      const loginUserNormalQuery = `
      query {
        findContents(
          passCheck: {
            id: "1"
            password: "xyz"
            confirmPassword: "xyz"
          }
        ) {
          id
        }
      }
      `

      const loginUserNormalQueryResp = await graphql({
        schema: schemaResult,
        source: loginUserNormalQuery,
        contextValue: { user: { roles: ['LoginUser'] } },
      })

      expect(loginUserNormalQueryResp).toEqual({
        data: {
          findContents: [
            {
              id: '1',
            },
          ],
        },
      })

      const loginUserIrregularQuery = `
      query {
        findContents(
          passCheck: {
            id: "1"
            password: "xyz"
            confirmPassword: "abc"
          }
        ) {
          id
        }
      }
      `

      const loginUserIrregularQueryResp = await graphql({
        schema: schemaResult,
        source: loginUserIrregularQuery,
        contextValue: { user: { roles: ['LoginUser'] } },
      })

      expect(loginUserIrregularQueryResp.data).toEqual(null)

      const loginUserIrregularQueryOriginalErrors =
        loginUserIrregularQueryResp.errors?.[0].originalError
      expect(loginUserIrregularQueryOriginalErrors).toBeInstanceOf(PGError)
      expect(loginUserIrregularQueryOriginalErrors?.message).toEqual('Invalid args.')
      expect((loginUserIrregularQueryOriginalErrors as PGError).code).toEqual(
        'ValidationError',
      )
      expect((loginUserIrregularQueryOriginalErrors as PGError).detail).toEqual(
        '[{"path":"findContents.passCheck","issues":[{"code":"custom","message":"Invalid input","path":[]}]}]',
      )
    })
  })
})
