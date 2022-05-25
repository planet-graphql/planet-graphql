import { Decimal } from '@prisma/client/runtime'
import { JsonValue } from 'type-fest'
import { getPGBuilder } from '..'
import { mergeDefaultInputField } from './test-utils'

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
      string: mergeDefaultInputField({
        kind: 'scalar',
        isOptional: true,
        isNullable: true,
        type: 'string',
      }),
      int: mergeDefaultInputField({
        kind: 'scalar',
        isOptional: true,
        isNullable: true,
        type: 'int',
      }),
      float: mergeDefaultInputField({
        kind: 'scalar',
        isOptional: true,
        isNullable: true,
        type: 'float',
      }),
      boolean: mergeDefaultInputField({
        kind: 'scalar',
        isOptional: true,
        isNullable: true,
        type: 'boolean',
      }),
      bigint: mergeDefaultInputField({
        kind: 'scalar',
        isOptional: true,
        isNullable: true,
        type: 'bigInt',
      }),
      date: mergeDefaultInputField({
        kind: 'scalar',
        isOptional: true,
        isNullable: true,
        type: 'dateTime',
      }),
      buffer: mergeDefaultInputField({
        kind: 'scalar',
        isOptional: true,
        isNullable: true,
        type: 'bytes',
      }),
      decimal: mergeDefaultInputField({
        kind: 'scalar',
        isOptional: true,
        isNullable: true,
        type: 'decimal',
      }),
      json: mergeDefaultInputField({
        kind: 'scalar',
        isOptional: true,
        isNullable: true,
        type: 'json',
      }),
      object: mergeDefaultInputField({
        kind: 'object',
        isOptional: true,
        isNullable: true,
        type: expect.any(Function),
      }),
      nestedObject: mergeDefaultInputField({
        kind: 'object',
        isOptional: true,
        isNullable: true,
        type: expect.any(Function),
      }),
      array: mergeDefaultInputField({
        kind: 'scalar',
        isOptional: true,
        isNullable: true,
        isList: true,
        type: 'string',
      }),
      arrayObject: mergeDefaultInputField({
        kind: 'object',
        isOptional: true,
        isNullable: true,
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
          string: mergeDefaultInputField({
            kind: 'scalar',
            isOptional: true,
            isNullable: true,
            type: 'string',
          }),
        },
        value: {},
        kind: 'input',
        validation: expect.any(Function),
      },
      PrefixNestedObjectInput: {
        name: 'PrefixNestedObjectInput',
        fieldMap: {
          inner: mergeDefaultInputField({
            kind: 'object',
            isOptional: true,
            isNullable: true,
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
          string: mergeDefaultInputField({
            kind: 'scalar',
            isOptional: true,
            isNullable: true,
            type: 'string',
          }),
        },
        value: {},
        kind: 'input',
        validation: expect.any(Function),
      },
      PrefixArrayObjectInput: {
        name: 'PrefixArrayObjectInput',
        fieldMap: {
          string: mergeDefaultInputField({
            kind: 'scalar',
            isOptional: true,
            isNullable: true,
            type: 'string',
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

    // expectType<{
    //   string: PGInputField<string | null | undefined>
    //   int: PGInputField<number | null | undefined>
    //   float: PGInputField<number | null | undefined>
    //   boolean: PGInputField<boolean | null | undefined>
    //   bigint: PGInputField<bigint | null | undefined>
    //   date: PGInputField<Date | null | undefined>
    //   buffer: PGInputField<Buffer | null | undefined>
    //   decimal: PGInputField<Decimal | null | undefined>
    //   json: PGInputField<string | null | undefined>
    //   object: PGInputField<
    //     | PGInput<{
    //         string: PGInputField<string | null | undefined>
    //       }>
    //     | null
    //     | undefined
    //   >
    //   nestedObject: PGInputField<
    //     | PGInput<{
    //         inner: PGInputField<
    //           | PGInput<{
    //               string: PGInputField<string | null | undefined>
    //             }>
    //           | null
    //           | undefined
    //         >
    //       }>
    //     | null
    //     | undefined
    //   >
    //   array: PGInputField<string[] | null | undefined>
    //   arrayObject: PGInputField<
    //     | Array<
    //         PGInput<{
    //           string: PGInputField<string | null | undefined>
    //         }>
    //       >
    //     | null
    //     | undefined
    //   >
    // }>(queryArgs)
  })
})
