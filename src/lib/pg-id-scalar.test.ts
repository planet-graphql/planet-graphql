import { parseValue } from 'graphql'
import { PGGraphQLID } from './pg-id-scalar'

describe('PGGraphQLID', () => {
  describe('BigInt対応', () => {
    it('serialize', () => {
      function serialize(value: unknown): string {
        return PGGraphQLID.serialize(value)
      }

      expect(serialize(BigInt(123))).toBe('123')
      expect(serialize(BigInt(0))).toBe('0')
      expect(serialize(BigInt(-1))).toBe('-1')
    })
  })

  // NOTE:
  // 以下からコピーしてchaiからjest形式に調整
  // https://github.com/graphql/graphql-js/blob/main/src/type/__tests__/scalars-test.ts#L533
  describe('Original', () => {
    it('parseValue', () => {
      function parseValue(value: unknown): string {
        return PGGraphQLID.parseValue(value)
      }

      expect(parseValue('')).toBe('')
      expect(parseValue('1')).toBe('1')
      expect(parseValue('foo')).toBe('foo')
      expect(parseValue(1)).toBe('1')
      expect(parseValue(0)).toBe('0')
      expect(parseValue(-1)).toBe('-1')

      // Maximum and minimum safe numbers in JS
      expect(parseValue(9_007_199_254_740_991)).toBe('9007199254740991')
      expect(parseValue(-9_007_199_254_740_991)).toBe('-9007199254740991')

      // eslint-disable-next-line unicorn/no-useless-undefined
      expect(() => parseValue(undefined)).toThrow('ID cannot represent value: undefined')
      expect(() => parseValue(null)).toThrow('ID cannot represent value: null')
      expect(() => parseValue(0.1)).toThrow('ID cannot represent value: 0.1')
      expect(() => parseValue(Number.NaN)).toThrow('ID cannot represent value: NaN')
      expect(() => parseValue(Number.POSITIVE_INFINITY)).toThrow(
        'ID cannot represent value: Inf',
      )
      expect(() => parseValue(false)).toThrow('ID cannot represent value: false')
      expect(() => parseValue(['1'])).toThrow("ID cannot represent value: [ '1' ]")
      expect(() => parseValue({ value: '1' })).toThrow(
        "ID cannot represent value: { value: '1' }",
      )
    })

    it('parseLiteral', () => {
      function parseLiteral(str: string): string {
        // eslint-disable-next-line unicorn/no-useless-undefined
        return PGGraphQLID.parseLiteral(parseValue(str), undefined)
      }

      expect(parseLiteral('""')).toBe('')
      expect(parseLiteral('"1"')).toBe('1')
      expect(parseLiteral('"foo"')).toBe('foo')
      expect(parseLiteral('"""foo"""')).toBe('foo')
      expect(parseLiteral('1')).toBe('1')
      expect(parseLiteral('0')).toBe('0')
      expect(parseLiteral('-1')).toBe('-1')

      // Support arbitrary long numbers even if they can't be represented in JS
      expect(parseLiteral('90071992547409910')).toBe('90071992547409910')
      expect(parseLiteral('-90071992547409910')).toBe('-90071992547409910')

      expect(() => parseLiteral('null')).toThrow(
        'ID cannot represent a non-string and non-integer value: null',
      )
      expect(() => parseLiteral('0.1')).toThrow(
        'ID cannot represent a non-string and non-integer value: 0.1',
      )
      expect(() => parseLiteral('false')).toThrow(
        'ID cannot represent a non-string and non-integer value: false',
      )
      expect(() => parseLiteral('["1"]')).toThrow(
        'ID cannot represent a non-string and non-integer value: ["1"]',
      )
      expect(() => parseLiteral('{ value: "1" }')).toThrow(
        'ID cannot represent a non-string and non-integer value: {value: "1"}',
      )
      expect(() => parseLiteral('ENUM_VALUE')).toThrow(
        'ID cannot represent a non-string and non-integer value: ENUM_VALUE',
      )
      expect(() => parseLiteral('$var')).toThrow(
        'ID cannot represent a non-string and non-integer value: $var',
      )
    })

    it('serialize', () => {
      function serialize(value: unknown): string {
        return PGGraphQLID.serialize(value)
      }

      expect(serialize('string')).toBe('string')
      expect(serialize('false')).toBe('false')
      expect(serialize('')).toBe('')
      expect(serialize(123)).toBe('123')
      expect(serialize(0)).toBe('0')
      expect(serialize(-1)).toBe('-1')

      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      const valueOf = () => 'valueOf ID'
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      const toJSON = () => 'toJSON ID'

      const valueOfAndToJSONValue = { valueOf, toJSON }
      expect(serialize(valueOfAndToJSONValue)).toBe('valueOf ID')

      const onlyToJSONValue = { toJSON }
      expect(serialize(onlyToJSONValue)).toBe('toJSON ID')

      const badObjValue = {
        _id: false,
        valueOf() {
          return this._id
        },
      }
      expect(() => serialize(badObjValue)).toThrow(
        'ID cannot represent value: { _id: false, valueOf: [Function: valueOf] }',
      )

      expect(() => serialize(true)).toThrow('ID cannot represent value: true')

      expect(() => serialize(3.14)).toThrow('ID cannot represent value: 3.14')

      expect(() => serialize({})).toThrow('ID cannot represent value: {}')

      expect(() => serialize(['abc'])).toThrow("ID cannot represent value: [ 'abc' ]")
    })
  })
})
