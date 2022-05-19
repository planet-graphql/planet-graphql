import { Decimal } from '@prisma/client/runtime'
import { GraphQLString, GraphQLInt, GraphQLFloat, GraphQLBoolean } from 'graphql'
import {
  GraphQLBigInt,
  GraphQLByte,
  GraphQLDateTime,
  GraphQLJSONObject,
} from 'graphql-scalars'
import { expectType } from 'tsd'
import { JsonValue } from 'type-fest'
import { getPGBuilder } from '..'
import { PGGraphQLDecimal } from '../lib/pg-decimal-scalar'
import { PGInputField, PGInput } from '../types/input'
import { setInputFieldMethods } from './test-utils'

describe('queryArgsBuilder', () => {
  it('Allows specifying selectors according to the specified type & Returns a PGInputFieldMap according to the contents of the Selector', () => {
    const pg = getPGBuilder()()
    type SomeType = {
      string: string
      int: number
      float: number
      boolean: boolean
      bigint: bigint
      date: Date
      buffer: Buffer
      decimal: Decimal
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
        type: GraphQLString,
      }),
      int: setInputFieldMethods({
        kind: 'scalar',
        isRequired: false,
        isList: false,
        type: GraphQLInt,
      }),
      float: setInputFieldMethods({
        kind: 'scalar',
        isRequired: false,
        isList: false,
        type: GraphQLFloat,
      }),
      boolean: setInputFieldMethods({
        kind: 'scalar',
        isRequired: false,
        isList: false,
        type: GraphQLBoolean,
      }),
      bigint: setInputFieldMethods({
        kind: 'scalar',
        isRequired: false,
        isList: false,
        type: GraphQLBigInt,
      }),
      date: setInputFieldMethods({
        kind: 'scalar',
        isRequired: false,
        isList: false,
        type: GraphQLDateTime,
      }),
      buffer: setInputFieldMethods({
        kind: 'scalar',
        isRequired: false,
        isList: false,
        type: GraphQLByte,
      }),
      decimal: setInputFieldMethods({
        kind: 'scalar',
        isRequired: false,
        isList: false,
        type: PGGraphQLDecimal,
      }),
      json: setInputFieldMethods({
        kind: 'scalar',
        isRequired: false,
        isList: false,
        type: GraphQLJSONObject,
      }),
      object: setInputFieldMethods({
        kind: 'object',
        isRequired: false,
        isList: false,
        type: expect.any(Function),
      }),
      nestedObject: setInputFieldMethods({
        kind: 'object',
        isRequired: false,
        isList: false,
        type: expect.any(Function),
      }),
      array: setInputFieldMethods({
        kind: 'scalar',
        isRequired: false,
        isList: true,
        type: GraphQLString,
      }),
      arrayObject: setInputFieldMethods({
        kind: 'object',
        isRequired: false,
        isList: true,
        type: expect.any(Function),
      }),
    }

    expect(queryArgs).toEqual(expectValue)
    expect((queryArgs.object.value.type as Function)().name).toEqual('PrefixObjectInput')
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
            type: GraphQLString,
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
            type: GraphQLString,
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
            type: GraphQLString,
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
      decimal: PGInputField<Decimal | null | undefined>
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
