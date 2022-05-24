import { z } from 'zod'
import { getPGBuilder } from '..'
import { setInputFieldMethods } from './test-utils'

describe('relayArgs', () => {
  it('Returns an InputFieldMap required for Relay', () => {
    const pg = getPGBuilder()()
    const args = pg.relayArgs()

    expect(args).toEqual({
      first: setInputFieldMethods({
        kind: 'scalar',
        isRequired: false,
        isList: false,
        type: 'int',
      }),
      after: setInputFieldMethods({
        kind: 'scalar',
        isRequired: false,
        isList: false,
        type: 'string',
      }),
      last: setInputFieldMethods({
        kind: 'scalar',
        isRequired: false,
        isList: false,
        type: 'int',
      }),
      before: setInputFieldMethods({
        kind: 'scalar',
        isRequired: false,
        isList: false,
        type: 'string',
      }),
    })
  })

  describe('Options are specified', () => {
    it('Returns an InputFieldMap configured with default and validation', () => {
      const pg = getPGBuilder()()
      const args = pg.relayArgs({
        default: 10,
        max: 1000,
      })

      expect(args).toEqual({
        first: setInputFieldMethods({
          kind: 'scalar',
          isRequired: false,
          isList: false,
          type: 'int',
          default: 10,
          validatorBuilder: expect.any(Function),
        }),
        after: setInputFieldMethods({
          kind: 'scalar',
          isRequired: false,
          isList: false,
          type: 'string',
        }),
        last: setInputFieldMethods({
          kind: 'scalar',
          isRequired: false,
          isList: false,
          type: 'int',
          default: 10,
          validatorBuilder: expect.any(Function),
        }),
        before: setInputFieldMethods({
          kind: 'scalar',
          isRequired: false,
          isList: false,
          type: 'string',
        }),
      })

      const firstValidation = args.first.value.validatorBuilder?.(z.number(), {})
      expect(JSON.stringify(firstValidation)).toEqual(
        JSON.stringify(z.number().max(1000)),
      )

      const lastValidation = args.last.value.validatorBuilder?.(z.number(), {})
      expect(JSON.stringify(lastValidation)).toEqual(JSON.stringify(z.number().max(1000)))
    })
  })
})
