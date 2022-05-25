import { Decimal } from '@prisma/client/runtime'
import { expectType, TypeEqual } from 'ts-expect'
import { JsonValue } from 'type-fest'
import { PGTypes } from './builder'
import { PGEnum } from './common'
import { PGOutputField, PGOutputFieldBuilder } from './output'

describe('PGOutputField', () => {
  describe('list', () => {
    it('Arrays any T other than null and undefined', () => {
      type InputField = PGOutputField<string | null, undefined, PGTypes>
      type T = ReturnType<InputField['list']>
      expectType<TypeEqual<T, PGOutputField<string[] | null, undefined, PGTypes>>>(true)
    })

    describe('already arrayed', () => {
      it('Does not change anything', () => {
        type InputField = PGOutputField<string[] | null, undefined, PGTypes>
        type T = ReturnType<InputField['list']>
        expectType<TypeEqual<T, PGOutputField<string[] | null, undefined, PGTypes>>>(true)
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
          id: () => PGOutputField<string, undefined, PGTypes>
          string: () => PGOutputField<string, undefined, PGTypes>
          boolean: () => PGOutputField<boolean, undefined, PGTypes>
          int: () => PGOutputField<number, undefined, PGTypes>
          bigInt: () => PGOutputField<bigint, undefined, PGTypes>
          float: () => PGOutputField<number, undefined, PGTypes>
          dateTime: () => PGOutputField<Date, undefined, PGTypes>
          json: () => PGOutputField<JsonValue, undefined, PGTypes>
          bytes: () => PGOutputField<Buffer, undefined, PGTypes>
          decimal: () => PGOutputField<Decimal, undefined, PGTypes>
          object: <T extends Function>(type: T) => PGOutputField<T, undefined, PGTypes>
          enum: <T extends PGEnum<any>>(type: T) => PGOutputField<T, undefined, PGTypes>
        }
      >
    >(true)
  })
})
