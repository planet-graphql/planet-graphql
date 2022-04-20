import { Decimal } from '@prisma/client/runtime'
import { expectType } from 'tsd'
import { JsonValue, RequireAtLeastOne } from 'type-fest'
import { PGSelectorType } from './common'

describe('PGSelectorType', () => {
  it("JsonValue type is converted to 'Json'", () => {
    const selector: PGSelectorType<{
      json: JsonValue
      jsonArray: JsonValue[]
      jsonScalarUnion: JsonValue | Date | Buffer
      jsonJsonArrayUnion: JsonValue | JsonValue[]
      jsonObjectUnion: JsonValue | { date: Date }
    }> = {
      json: 'Json',
    }

    expectType<
      RequireAtLeastOne<{
        json: 'Json'
        jsonArray: ['Json']
        jsonScalarUnion: 'Json' | 'DateTime' | 'Bytes'
        // NOTE:
        // Since "JsonValue" contains "JsonValue[]" itself, the converted type
        // becomes "Json" instead of "Json | Json[]".
        jsonJsonArrayUnion: 'Json'
        jsonObjectUnion: 'Json' | { date: 'DateTime' }
      }>
    >(selector)
  })

  it('Each types are converted to the corresponding literals', () => {
    const selector: PGSelectorType<{
      base: {
        required: boolean
        optional?: boolean
        null: null
      }
      scalar: {
        string: string
        number: number
        boolean: boolean
        bigint: bigint
        date: Date
        buffer: Buffer
        decimal: Decimal
      }
      array: {
        scalarArray: string[]
      }
      union: {
        scalarUnion: string | number | boolean | bigint | Date | Buffer | Decimal
        nullUnion: string | null
      }
      json: {
        json: JsonValue
        jsonArray: JsonValue[]
        jsonScalarUnion: JsonValue | Date | Buffer
        jsonObjectUnion: JsonValue | { date: Date }
      }
      object: {
        depth1: {
          string: string
        }
        depth2: {
          inner: {
            string: string
          }
        }
      }
      complex: {
        arrayObject: Array<{ string: string }>
        scalarArrayUnion: string | string[]
        scalarObjectUnion: string | { string: string }
        objectArrayUnion: { string: string } | string[]
        objectObjectUnion: { string: string } | { number: number }
        objectArrayObjectUnion: { string: string } | Array<{ string: string }>
      }
    }> = {
      base: {
        required: 'Boolean',
      },
    }

    expectType<
      RequireAtLeastOne<{
        base: RequireAtLeastOne<{
          required: 'Boolean'
          optional?: 'Boolean'
          null: never
        }>
        scalar: RequireAtLeastOne<{
          string: 'String'
          number: 'Int' | 'Float'
          boolean: 'Boolean'
          bigint: 'BigInt'
          date: 'DateTime'
          buffer: 'Bytes'
          decimal: 'Decimal'
        }>
        array: RequireAtLeastOne<{
          scalarArray: ['String']
        }>
        union: RequireAtLeastOne<{
          scalarUnion:
            | 'String'
            | 'Int'
            | 'Float'
            | 'Boolean'
            | 'BigInt'
            | 'DateTime'
            | 'Bytes'
            | 'Decimal'
          nullUnion: 'String'
        }>
        json: RequireAtLeastOne<{
          json: 'Json'
          jsonArray: ['Json']
          jsonScalarUnion: 'Json' | 'DateTime' | 'Bytes'
          jsonObjectUnion: 'Json' | { date: 'DateTime' }
        }>
        object: RequireAtLeastOne<{
          depth1: {
            string: 'String'
          }
          depth2: {
            inner: {
              string: 'String'
            }
          }
        }>
        complex: RequireAtLeastOne<{
          arrayObject: [{ string: 'String' }]
          scalarArrayUnion: 'String' | ['String']
          scalarObjectUnion: 'String' | { string: 'String' }
          objectArrayUnion: { string: 'String' } | ['String']
          objectObjectUnion: { string: 'String' } | { number: 'Int' | 'Float' }
          objectArrayObjectUnion: { string: 'String' } | [{ string: 'String' }]
        }>
      }>
    >(selector)
  })
})
