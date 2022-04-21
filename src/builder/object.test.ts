import { Decimal } from '@prisma/client/runtime'
import { expectType } from 'tsd'
import { getPGBuilder } from '..'
import { InputFieldBuilder, PGInputField } from '../types/input'
import { PGObject, PGOutputField } from '../types/output'
import {
  setInputFieldMethods,
  setOutputFieldMethods,
  setPGObjectProperties,
} from './test-utils'

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
