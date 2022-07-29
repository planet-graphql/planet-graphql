import { expectType } from 'ts-expect'
import type { PGTypes } from './builder'
import type { NeverWithNote, PGDecimal, PGEnum, PGJson } from './common'
import type { PGInputField } from './input'
import type {
  PGOutputFieldOptionsDefault,
  PGOutputField,
  PGOutputFieldBuilder,
  UpdatePGOptions,
  PGObject,
  PGInterface,
  ConvertPGInterfacesToFieldMap,
} from './output'
import type { SomePGTypes, SomeUserPrismaArgs } from './test.util'
import type { TypeEqual, TypeOf } from 'ts-expect'

describe('PGOutputField', () => {
  describe('list', () => {
    it('Arrays any T other than null and undefined', () => {
      type OutputField = PGOutputField<string | null>
      type T = ReturnType<OutputField['list']>
      expectType<TypeEqual<T, PGOutputField<string[] | null>>>(true)
    })

    describe('already arrayed', () => {
      it('Does not change anything', () => {
        type OutputField = PGOutputField<string[] | null>
        type T = ReturnType<OutputField['list']>
        expectType<TypeEqual<T, PGOutputField<string[] | null>>>(true)
      })
    })
  })

  describe('relay', () => {
    it('Sets isRelay to true & Adds relay args into args & Adds prisma relay args into prismaArgs', () => {
      type User = PGObject<{}, undefined, { PrismaModelName: 'User' }, SomePGTypes>
      type OutputField = PGOutputField<
        () => User,
        any,
        {
          Args: undefined
          PrismaArgs: undefined
          IsRelay: false
        },
        SomePGTypes
      >
      type T = ReturnType<OutputField['relay']>
      expectType<
        TypeEqual<
          T,
          PGOutputField<
            Array<() => User>,
            any,
            {
              Args: {
                first: PGInputField<number | undefined, 'int', SomePGTypes>
                after: PGInputField<string | undefined, 'string', SomePGTypes>
                last: PGInputField<number | undefined, 'int', SomePGTypes>
                before: PGInputField<string | undefined, 'string', SomePGTypes>
              }
              PrismaArgs: {
                take: PGInputField<number | undefined, 'int', SomePGTypes>
                skip: PGInputField<number | undefined, 'int', SomePGTypes>
                cursor: PGInputField<
                  SomeUserPrismaArgs['cursor'] | undefined,
                  'input',
                  SomePGTypes
                >
                orderBy: PGInputField<SomeUserPrismaArgs['orderBy'], 'input', SomePGTypes>
              }
              IsRelay: true
            },
            SomePGTypes
          >
        >
      >(true)
    })

    describe('already arrayed', () => {
      it('Does not array', () => {
        type User = PGObject<{}, undefined, { PrismaModelName: 'User' }, SomePGTypes>
        type OutputField = PGOutputField<
          Array<() => User>,
          any,
          {
            Args: undefined
            PrismaArgs: undefined
            IsRelay: false
          },
          SomePGTypes
        >
        type T = ReturnType<OutputField['relay']>
        expectType<TypeOf<T, PGOutputField<Array<() => User>, any, any, any>>>(true)
      })
    })

    describe('already relayed', () => {
      it('Does not allow to call', () => {
        type OutputField = PGOutputField<
          string,
          any,
          {
            Args: undefined
            PrismaArgs: undefined
            IsRelay: true
          }
        >
        type T = OutputField['relay']
        expectType<TypeEqual<T, NeverWithNote<'Already called relay() method'>>>(true)
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
          json: () => PGOutputField<PGJson, any, PGOutputFieldOptionsDefault, PGTypes>
          bytes: () => PGOutputField<Buffer, any, PGOutputFieldOptionsDefault, PGTypes>
          decimal: () => PGOutputField<
            PGDecimal,
            any,
            PGOutputFieldOptionsDefault,
            PGTypes
          >
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

describe('ConvertPGInterfacesToFieldMap', () => {
  it('Returns the field types that the object should have to satisfy interfaces', () => {
    type InterfaceA = PGInterface<{
      a: PGOutputField<string>
    }>
    type InterfaceB = PGInterface<{
      b: PGOutputField<string>
    }>

    type T = ConvertPGInterfacesToFieldMap<[InterfaceA, InterfaceB]>

    expectType<
      TypeEqual<
        T,
        {
          a: PGOutputField<string>
        } & {
          b: PGOutputField<string>
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
        IsRelay: false
      }
    >
  >(true)
})
