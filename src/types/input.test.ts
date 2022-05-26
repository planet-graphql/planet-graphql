import { Decimal } from '@prisma/client/runtime'
import { expectType, TypeEqual } from 'ts-expect'
import { JsonValue } from 'type-fest'
import { PGTypes } from './builder'
import { PGEnum } from './common'
import { PGInputFieldBuilder, PGInputField, PGInput } from './input'

describe('PGInputField', () => {
  describe('list', () => {
    it('Arrays any T other than null and undefined', () => {
      type InputField = PGInputField<string | null | undefined, 'string', PGTypes>
      type T = ReturnType<InputField['list']>
      expectType<
        TypeEqual<T, PGInputField<string[] | null | undefined, 'string', PGTypes>>
      >(true)
    })

    describe('already arrayed', () => {
      it('Does not change anything', () => {
        type InputField = PGInputField<string[] | null | undefined, 'string', PGTypes>
        type T = ReturnType<InputField['list']>
        expectType<
          TypeEqual<T, PGInputField<string[] | null | undefined, 'string', PGTypes>>
        >(true)
      })
    })
  })
  describe('default', () => {
    describe('T is primitive or scalar', () => {
      it('Accepts T', () => {
        type InputField = PGInputField<string, 'string', PGTypes>
        type T = Parameters<InputField['default']>
        expectType<TypeEqual<T, [string]>>(true)
      })
    })

    describe('T is PGEnum', () => {
      it('Accepts members of the enum', () => {
        type InputField = PGInputField<PGEnum<['A', 'B']>, 'input', PGTypes>
        type T = Parameters<InputField['default']>
        expectType<TypeEqual<T, ['A' | 'B']>>(true)
      })
    })

    describe('T is a function (PGInput)', () => {
      it('Does not accept anything, because we want users to set default for each PGInputFields of PGInput', () => {
        type InputField = PGInputField<() => PGInput<any>, 'input', PGTypes>
        type T = Parameters<InputField['default']>
        expectType<TypeEqual<T, [never]>>(true)
      })

      describe('T is arrayed', () => {
        it('Accepts only []', () => {
          type InputField = PGInputField<[() => PGInput<any>], 'input', PGTypes>
          type T = Parameters<InputField['default']>
          expectType<TypeEqual<T, [[]]>>(true)
        })
      })
    })

    describe('T is nullish', () => {
      it('Accepts null, but not undefined', () => {
        type InputField = PGInputField<string | null | undefined, 'string', PGTypes>
        type T = Parameters<InputField['default']>
        expectType<TypeEqual<T, [string | null]>>(true)
      })
    })
  })
})

describe('PGInputFieldBuilder', () => {
  it('Returns a type created for the argument PGTypes', () => {
    expectType<
      TypeEqual<
        PGInputFieldBuilder<PGTypes>,
        {
          id: () => PGInputField<string, 'id', PGTypes>
          string: () => PGInputField<string, 'string', PGTypes>
          boolean: () => PGInputField<boolean, 'boolean', PGTypes>
          int: () => PGInputField<number, 'int', PGTypes>
          bigInt: () => PGInputField<bigint, 'bigInt', PGTypes>
          float: () => PGInputField<number, 'float', PGTypes>
          dateTime: () => PGInputField<Date, 'dateTime', PGTypes>
          json: () => PGInputField<JsonValue, 'json', PGTypes>
          bytes: () => PGInputField<Buffer, 'bytes', PGTypes>
          decimal: () => PGInputField<Decimal, 'decimal', PGTypes>
          input: <T extends Function>(type: T) => PGInputField<T, 'input', PGTypes>
          enum: <T extends PGEnum<any>>(type: T) => PGInputField<T, 'enum', PGTypes>
        }
      >
    >(true)
  })
})
