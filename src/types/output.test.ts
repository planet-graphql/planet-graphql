import { Decimal } from '@prisma/client/runtime'
import { expectType, TypeEqual } from 'ts-expect'
import { JsonValue } from 'type-fest'
import { PGTypes } from './builder'
import { PGEnum } from './common'
import { PGOutputField, PGOutputFieldBuilder } from './output'

describe('PGOutputField', () => {
  describe('list', () => {
    it('Arrays any T other than null and undefined', () => {
      type InputField = PGOutputField<string | null, any, undefined, PGTypes>
      type T = ReturnType<InputField['list']>
      expectType<TypeEqual<T, PGOutputField<string[] | null, any, undefined, PGTypes>>>(
        true,
      )
    })

    describe('already arrayed', () => {
      it('Does not change anything', () => {
        type InputField = PGOutputField<string[] | null, any, undefined, PGTypes>
        type T = ReturnType<InputField['list']>
        expectType<TypeEqual<T, PGOutputField<string[] | null, any, undefined, PGTypes>>>(
          true,
        )
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
          id: () => PGOutputField<string, any, undefined, PGTypes>
          string: () => PGOutputField<string, any, undefined, PGTypes>
          boolean: () => PGOutputField<boolean, any, undefined, PGTypes>
          int: () => PGOutputField<number, any, undefined, PGTypes>
          bigInt: () => PGOutputField<bigint, any, undefined, PGTypes>
          float: () => PGOutputField<number, any, undefined, PGTypes>
          dateTime: () => PGOutputField<Date, any, undefined, PGTypes>
          json: () => PGOutputField<JsonValue, any, undefined, PGTypes>
          bytes: () => PGOutputField<Buffer, any, undefined, PGTypes>
          decimal: () => PGOutputField<Decimal, any, undefined, PGTypes>
          object: <T extends Function>(
            type: T,
          ) => PGOutputField<T, any, undefined, PGTypes>
          enum: <T extends PGEnum<any>>(
            type: T,
          ) => PGOutputField<T, any, undefined, PGTypes>
        }
      >
    >(true)
  })
})
