import { Decimal } from 'decimal.js'
import { parseValue } from 'graphql'
import { PGGraphQLDecimal } from './pg-decimal-scalar'

describe('PGGraphQLDecimal', () => {
  it('serialize', () => {
    function serialize(value: unknown): Decimal {
      return PGGraphQLDecimal.serialize(value)
    }

    expect(serialize(new Decimal('0'))).toEqual(new Decimal('0'))
    expect(serialize(new Decimal('-0.01'))).toEqual(new Decimal('-0.01'))
    expect(() => serialize(null)).toThrow('Decimal cannot represent a value: null')
  })

  it('parseValue', () => {
    function parseValue(value: unknown): string | number | Decimal {
      return PGGraphQLDecimal.parseValue(value)
    }

    expect(parseValue('0')).toEqual(new Decimal('0'))
    expect(parseValue('-0.01')).toEqual(new Decimal('-0.01'))
  })

  it('parseLiteral', () => {
    function parseLiteral(str: string): string | number | Decimal {
      // eslint-disable-next-line unicorn/no-useless-undefined
      return PGGraphQLDecimal.parseLiteral(parseValue(str), undefined)
    }

    expect(parseLiteral('0')).toBe('0')
    expect(parseLiteral('-0.01')).toBe('-0.01')
    expect(() => parseLiteral('null')).toThrow(
      'Decimal cannot represent a non-numeric value: null',
    )
    expect(() => parseLiteral('false')).toThrow(
      'Decimal cannot represent a non-numeric value: false',
    )
  })
})
