import { Decimal } from '@prisma/client/runtime'
import { GraphQLString, GraphQLBoolean, GraphQLInt, GraphQLFloat } from 'graphql'
import {
  GraphQLBigInt,
  GraphQLByte,
  GraphQLDateTime,
  GraphQLJSONObject,
} from 'graphql-scalars'
import { expectType } from 'tsd'
import { getPGBuilder } from '..'
import { PGGraphQLDecimal } from '../lib/pg-decimal-scalar'
import { PGGraphQLID } from '../lib/pg-id-scalar'
import { PGInputField } from '../types/input'
import { PGObject, PGOutputField } from '../types/output'
import {
  setInputFieldMethods,
  setOutputFieldMethods,
  setPGObjectProperties,
} from './test-utils'

describe('object', () => {
  it('Creates a new PGObject & Set it to the Build Cache', () => {
    const pg = getPGBuilder()()
    const userRole = pg.enum('UserRole', 'USER', 'MANAGER', 'ADMIN')

    const post = pg.object('Post', (f) => ({
      id: f.id(),
      title: f.string(),
      ref: f.object(() => someObject),
    }))

    const someObject = pg.object('SomeObject', (f) => ({
      someID: f.id().args((f) => ({ arg: f.string() })),
      someString: f.string().args((f) => ({ arg: f.string() })),
      someBoolean: f.boolean().args((f) => ({ arg: f.string() })),
      someInt: f.int().args((f) => ({ arg: f.string() })),
      someBigInt: f.bigInt().args((f) => ({ arg: f.string() })),
      someFloat: f.float().args((f) => ({ arg: f.string() })),
      someDateTime: f.dateTime().args((f) => ({ arg: f.string() })),
      someJson: f.json().args((f) => ({ arg: f.string() })),
      someByte: f.bytes().args((f) => ({ arg: f.string() })),
      someDecimal: f.decimal().args((f) => ({ arg: f.string() })),
      someObject: f.object(() => post).args((f) => ({ arg: f.string() })),
      someEnum: f.enum(userRole).args((f) => ({ arg: f.string() })),
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
        type: GraphQLString,
      }),
    }

    const expectValue = setPGObjectProperties({
      name: 'SomeObject',
      fieldMap: {
        someID: setOutputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: false,
          type: PGGraphQLID,
          args: expectSomeArgs,
        }),
        someString: setOutputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: false,
          type: GraphQLString,
          args: expectSomeArgs,
        }),
        someBoolean: setOutputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: false,
          type: GraphQLBoolean,
          args: expectSomeArgs,
        }),
        someInt: setOutputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: false,
          type: GraphQLInt,
          args: expectSomeArgs,
        }),
        someBigInt: setOutputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: false,
          type: GraphQLBigInt,
          args: expectSomeArgs,
        }),
        someFloat: setOutputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: false,
          type: GraphQLFloat,
          args: expectSomeArgs,
        }),
        someDateTime: setOutputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: false,
          type: GraphQLDateTime,
          args: expectSomeArgs,
        }),
        someJson: setOutputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: false,
          type: GraphQLJSONObject,
          args: expectSomeArgs,
        }),
        someByte: setOutputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: false,
          type: GraphQLByte,
          args: expectSomeArgs,
        }),
        someDecimal: setOutputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: false,
          type: PGGraphQLDecimal,
          args: expectSomeArgs,
        }),
        someObject: setOutputFieldMethods({
          kind: 'object',
          isRequired: true,
          isList: false,
          type: expect.any(Function),
          args: expectSomeArgs,
        }),
        someEnum: setOutputFieldMethods({
          kind: 'enum',
          isRequired: true,
          isList: false,
          type: userRole,
          args: expectSomeArgs,
        }),
        someScalarList: setOutputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: true,
          type: GraphQLString,
        }),
        someNullableScalar: setOutputFieldMethods({
          kind: 'scalar',
          isRequired: false,
          isList: false,
          type: GraphQLString,
        }),
        someNullableScalarList: setOutputFieldMethods({
          kind: 'scalar',
          isRequired: false,
          isList: true,
          type: GraphQLString,
        }),
        someEnumList: setOutputFieldMethods({
          kind: 'enum',
          isRequired: true,
          isList: true,
          type: userRole,
        }),
        someNullableEnum: setOutputFieldMethods({
          kind: 'enum',
          isRequired: false,
          isList: false,
          type: userRole,
        }),
        someNullableEnumList: setOutputFieldMethods({
          kind: 'enum',
          isRequired: false,
          isList: true,
          type: userRole,
        }),
        someObjectList: setOutputFieldMethods({
          kind: 'object',
          isRequired: true,
          isList: true,
          type: expect.any(Function),
        }),
        someNullableObject: setOutputFieldMethods({
          kind: 'object',
          isRequired: false,
          isList: false,
          type: expect.any(Function),
        }),
        someNullableObjectList: setOutputFieldMethods({
          kind: 'object',
          isRequired: false,
          isList: true,
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
        someDecimal: PGOutputField<Decimal, ExpectArgsType>
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

  it('Returns an existing resource because a resource with the same name cannot be created', () => {
    const pg = getPGBuilder()()
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
            type: PGGraphQLID,
          }),
        },
      }),
    )
  })
})
