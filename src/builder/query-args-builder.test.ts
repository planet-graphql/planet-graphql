import { Decimal } from '@prisma/client/runtime'
import { expectType } from 'tsd'
import { JsonValue } from 'type-fest'
import { getPGBuilder } from '..'
import { PGInputField, PGInput } from '../types/input'
import { setInputFieldMethods } from './test-utils'

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
