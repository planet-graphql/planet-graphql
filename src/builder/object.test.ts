import { Decimal } from '@prisma/client/runtime'
import { expectType, TypeEqual } from 'ts-expect'
import { JsonValue } from 'type-fest'
import { getPGBuilder } from '..'
import { PGTypes } from '../types/builder'
import { PGInputField } from '../types/input'
import { PGObject, PGOutputField } from '../types/output'
import {
  mergeDefaultInputField,
  mergeDefaultOutputField,
  setPGObjectProperties,
} from './test-utils'

describe('object', () => {
  it('Creates a new PGObject & Set it to the Build Cache', () => {
    const pg = getPGBuilder()()
    const userRole = pg.enum('UserRole', 'USER', 'MANAGER', 'ADMIN')

    const inner = pg.object('InnerObject', (f) => ({
      id: f.id(),
      title: f.string(),
      ref: f.object(() => object),
    }))

    const object = pg.object('Object', (f) => ({
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
      object: f.object(() => inner),
      enum: f.enum(userRole),
      scalarList: f.string().list(),
      nullableScalar: f.string().nullable(),
      nullableScalarList: f.string().list().nullable(),
      enumList: f.enum(userRole).list(),
      nullableEnum: f.enum(userRole).nullable(),
      nullableEnumList: f.enum(userRole).list().nullable(),
      objectList: f.object(() => inner).list(),
      nullableObject: f.object(() => inner).nullable(),
      nullableObjectList: f
        .object(() => inner)
        .nullable()
        .list(),
      args: f.id().args((f) => ({ arg: f.string() })),
    }))

    const expectValue = setPGObjectProperties({
      name: 'Object',
      fieldMap: {
        id: mergeDefaultOutputField({
          kind: 'scalar',
          type: 'id',
        }),
        string: mergeDefaultOutputField({
          kind: 'scalar',
          type: 'string',
        }),
        boolean: mergeDefaultOutputField({
          kind: 'scalar',
          type: 'boolean',
        }),
        int: mergeDefaultOutputField({
          kind: 'scalar',
          type: 'int',
        }),
        bigInt: mergeDefaultOutputField({
          kind: 'scalar',
          type: 'bigInt',
        }),
        float: mergeDefaultOutputField({
          kind: 'scalar',
          type: 'float',
        }),
        dateTime: mergeDefaultOutputField({
          kind: 'scalar',
          type: 'dateTime',
        }),
        json: mergeDefaultOutputField({
          kind: 'scalar',
          type: 'json',
        }),
        byte: mergeDefaultOutputField({
          kind: 'scalar',
          type: 'bytes',
        }),
        decimal: mergeDefaultOutputField({
          kind: 'scalar',
          type: 'decimal',
        }),
        object: mergeDefaultOutputField({
          kind: 'object',
          type: expect.any(Function),
        }),
        enum: mergeDefaultOutputField({
          kind: 'enum',
          type: userRole,
        }),
        scalarList: mergeDefaultOutputField({
          kind: 'scalar',
          isList: true,
          type: 'string',
        }),
        nullableScalar: mergeDefaultOutputField({
          kind: 'scalar',
          isOptional: true,
          isNullable: true,
          type: 'string',
        }),
        nullableScalarList: mergeDefaultOutputField({
          kind: 'scalar',
          isOptional: true,
          isNullable: true,
          isList: true,
          type: 'string',
        }),
        enumList: mergeDefaultOutputField({
          kind: 'enum',
          isList: true,
          type: userRole,
        }),
        nullableEnum: mergeDefaultOutputField({
          kind: 'enum',
          isOptional: true,
          isNullable: true,
          type: userRole,
        }),
        nullableEnumList: mergeDefaultOutputField({
          kind: 'enum',
          isOptional: true,
          isNullable: true,
          isList: true,
          type: userRole,
        }),
        objectList: mergeDefaultOutputField({
          kind: 'object',
          isList: true,
          type: expect.any(Function),
        }),
        nullableObject: mergeDefaultOutputField({
          kind: 'object',
          isOptional: true,
          isNullable: true,
          type: expect.any(Function),
        }),
        nullableObjectList: mergeDefaultOutputField({
          kind: 'object',
          isOptional: true,
          isNullable: true,
          isList: true,
          type: expect.any(Function),
        }),
        args: mergeDefaultOutputField({
          kind: 'scalar',
          type: 'id',
          args: {
            arg: mergeDefaultInputField({
              kind: 'scalar',
              isNullable: false,
              type: 'string',
            }),
          },
        }),
      },
    })

    expect(object).toEqual(expectValue)
    expect(pg.cache().object.Object).toEqual(expectValue)

    expectType<
      TypeEqual<
        typeof object,
        PGObject<
          {
            id: PGOutputField<string, undefined, PGTypes>
            string: PGOutputField<string, undefined, PGTypes>
            boolean: PGOutputField<boolean, undefined, PGTypes>
            int: PGOutputField<number, undefined, PGTypes>
            bigInt: PGOutputField<bigint, undefined, PGTypes>
            float: PGOutputField<number, undefined, PGTypes>
            dateTime: PGOutputField<Date, undefined, PGTypes>
            json: PGOutputField<JsonValue, undefined, PGTypes>
            byte: PGOutputField<Buffer, undefined, PGTypes>
            decimal: PGOutputField<Decimal, undefined, PGTypes>
            object: PGOutputField<() => typeof inner, undefined, PGTypes>
            enum: PGOutputField<typeof userRole, undefined, PGTypes>
            scalarList: PGOutputField<string[], undefined, PGTypes>
            nullableScalar: PGOutputField<string | null, undefined, PGTypes>
            nullableScalarList: PGOutputField<string[] | null, undefined, PGTypes>
            enumList: PGOutputField<Array<typeof userRole>, undefined, PGTypes>
            nullableEnum: PGOutputField<typeof userRole | null, undefined, PGTypes>
            nullableEnumList: PGOutputField<
              Array<typeof userRole> | null,
              undefined,
              PGTypes
            >
            objectList: PGOutputField<Array<() => typeof inner>, undefined, PGTypes>
            nullableObject: PGOutputField<(() => typeof inner) | null, undefined, PGTypes>
            nullableObjectList: PGOutputField<
              Array<() => typeof inner> | null,
              undefined,
              PGTypes
            >
            args: PGOutputField<
              string,
              { arg: PGInputField<string, 'string', PGTypes> },
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
    pg.object('Object', (f) => ({
      id: f.id(),
    }))
    expect(
      pg.object('Object', (f) => ({
        id: f.id(),
        title: f.string(),
      })),
    ).toEqual(
      setPGObjectProperties({
        name: 'Object',
        fieldMap: {
          id: mergeDefaultOutputField({
            kind: 'scalar',
            isNullable: false,
            type: 'id',
          }),
        },
      }),
    )
  })
})
