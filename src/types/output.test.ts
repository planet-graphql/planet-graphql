import { Decimal } from '@prisma/client/runtime'
import { expectType, TypeEqual } from 'ts-expect'
import { JsonValue } from 'type-fest'
import { PGTypes } from './builder'
import { PGEnum } from './common'
import { PGOutputField, PGOutputFieldBuilder } from './output'

describe('PGOutputField', () => {
  describe('list', () => {
    it('Arrays any T other than null and undefined', () => {
      type InputField = PGOutputField<string | null, any, undefined, undefined, PGTypes>
      type T = ReturnType<InputField['list']>
      expectType<
        TypeEqual<T, PGOutputField<string[] | null, any, undefined, undefined, PGTypes>>
      >(true)
    })

    describe('already arrayed', () => {
      it('Does not change anything', () => {
        type InputField = PGOutputField<
          string[] | null,
          any,
          undefined,
          undefined,
          PGTypes
        >
        type T = ReturnType<InputField['list']>
        expectType<
          TypeEqual<T, PGOutputField<string[] | null, any, undefined, undefined, PGTypes>>
        >(true)
      })
    })
  })
})

describe('PGOutputFieldBuilder', () => {
  it('Returns a type created for the argument PGTypes', () => {
    type T = PGOutputFieldBuilder<PGTypes>
    expectType<
      TypeEqual<
        T,
        {
          id: () => PGOutputField<string, any, undefined, undefined, PGTypes>
          string: () => PGOutputField<string, any, undefined, undefined, PGTypes>
          boolean: () => PGOutputField<boolean, any, undefined, undefined, PGTypes>
          int: () => PGOutputField<number, any, undefined, undefined, PGTypes>
          bigInt: () => PGOutputField<bigint, any, undefined, undefined, PGTypes>
          float: () => PGOutputField<number, any, undefined, undefined, PGTypes>
          dateTime: () => PGOutputField<Date, any, undefined, undefined, PGTypes>
          json: () => PGOutputField<JsonValue, any, undefined, undefined, PGTypes>
          bytes: () => PGOutputField<Buffer, any, undefined, undefined, PGTypes>
          decimal: () => PGOutputField<Decimal, any, undefined, undefined, PGTypes>
          object: <T extends Function>(
            type: T,
          ) => PGOutputField<T, any, undefined, undefined, PGTypes>
          relation: <T extends Function>(
            type: T,
          ) => PGOutputField<T, any, undefined, undefined, PGTypes>
          enum: <T extends PGEnum<any>>(
            type: T,
          ) => PGOutputField<T, any, undefined, undefined, PGTypes>
        }
      >
    >(true)
  })
})
