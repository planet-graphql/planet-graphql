import { z } from 'zod'
import { getPGBuilder } from '..'
import { setInputFieldMethods } from './test-utils'

describe('relayArgs', () => {
  it('Returns an InputFieldMap required for Relay', () => {
    const pg = getPGBuilder<any>()
    const args = pg.relayArgs()

    expect(args).toEqual({
      first: setInputFieldMethods({
        kind: 'scalar',
        isRequired: false,
        isList: false,
        isId: false,
        type: 'Int',
      }),
      after: setInputFieldMethods({
        kind: 'scalar',
        isRequired: false,
        isList: false,
        isId: false,
        type: 'String',
      }),
      last: setInputFieldMethods({
        kind: 'scalar',
        isRequired: false,
        isList: false,
        isId: false,
        type: 'Int',
      }),
      before: setInputFieldMethods({
        kind: 'scalar',
        isRequired: false,
        isList: false,
        isId: false,
        type: 'String',
      }),
    })
  })

  describe('Options are specified', () => {
    it('Returns an InputFieldMap configured with default and validation', () => {
      const pg = getPGBuilder<any>()
      const args = pg.relayArgs({
        default: 10,
        max: 1000,
      })

      expect(args).toEqual({
        first: setInputFieldMethods({
          kind: 'scalar',
          isRequired: false,
          isList: false,
          isId: false,
          type: 'Int',
          default: 10,
          validatorBuilder: expect.any(Function),
        }),
        after: setInputFieldMethods({
          kind: 'scalar',
          isRequired: false,
          isList: false,
          isId: false,
          type: 'String',
        }),
        last: setInputFieldMethods({
          kind: 'scalar',
          isRequired: false,
          isList: false,
          isId: false,
          type: 'Int',
          default: 10,
          validatorBuilder: expect.any(Function),
        }),
        before: setInputFieldMethods({
          kind: 'scalar',
          isRequired: false,
          isList: false,
          isId: false,
          type: 'String',
        }),
      })

      const firstValidation = args.first.value.validatorBuilder?.(z, {})
      expect(JSON.stringify(firstValidation)).toEqual(
        JSON.stringify(z.number().max(1000)),
      )

      const lastValidation = args.last.value.validatorBuilder?.(z, {})
      expect(JSON.stringify(lastValidation)).toEqual(JSON.stringify(z.number().max(1000)))
    })
  })
})
