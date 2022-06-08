import { Decimal } from '@prisma/client/runtime'
import { expectType, TypeEqual } from 'ts-expect'
import { JsonValue } from 'type-fest'
import { PGTypes } from './builder'
import { PGEnum } from './common'
import { PGInputField } from './input'
import {
  PGOutputFieldOptionsDefault,
  PGOutputField,
  PGOutputFieldBuilder,
  UpdatePGOptions,
} from './output'

describe('PGOutputField', () => {
  describe('list', () => {
    it('Arrays any T other than null and undefined', () => {
      type InputField = PGOutputField<string | null>
      type T = ReturnType<InputField['list']>
      expectType<TypeEqual<T, PGOutputField<string[] | null>>>(true)
    })

    describe('already arrayed', () => {
      it('Does not change anything', () => {
        type InputField = PGOutputField<string[] | null>
        type T = ReturnType<InputField['list']>
        expectType<TypeEqual<T, PGOutputField<string[] | null>>>(true)
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
          id: () => PGOutputField<string, any, PGOutputFieldOptionsDefault, PGTypes>
          string: () => PGOutputField<string, any, PGOutputFieldOptionsDefault, PGTypes>
          boolean: () => PGOutputField<boolean, any, PGOutputFieldOptionsDefault, PGTypes>
          int: () => PGOutputField<number, any, PGOutputFieldOptionsDefault, PGTypes>
          bigInt: () => PGOutputField<bigint, any, PGOutputFieldOptionsDefault, PGTypes>
          float: () => PGOutputField<number, any, PGOutputFieldOptionsDefault, PGTypes>
          dateTime: () => PGOutputField<Date, any, PGOutputFieldOptionsDefault, PGTypes>
          json: () => PGOutputField<JsonValue, any, PGOutputFieldOptionsDefault, PGTypes>
          bytes: () => PGOutputField<Buffer, any, PGOutputFieldOptionsDefault, PGTypes>
          decimal: () => PGOutputField<Decimal, any, PGOutputFieldOptionsDefault, PGTypes>
          object: <T extends Function>(
            type: T,
          ) => PGOutputField<T, any, PGOutputFieldOptionsDefault, PGTypes>
          relation: <T extends Function>(
            type: T,
          ) => PGOutputField<T, any, PGOutputFieldOptionsDefault, PGTypes>
          enum: <T extends PGEnum<any>>(
            type: T,
          ) => PGOutputField<T, any, PGOutputFieldOptionsDefault, PGTypes>
        }
      >
    >(true)
  })
})

describe('UpdatePGOutputFieldOptions', () => {
  type T = UpdatePGOptions<
    PGOutputFieldOptionsDefault,
    'Args',
    { id: PGInputField<string, 'id', PGTypes> }
  >
  expectType<
    TypeEqual<
      T,
      {
        Args: {
          id: PGInputField<string, 'id', PGTypes>
        }
        PrismaArgs: undefined
      }
    >
  >(true)
})
