import { graphql } from 'graphql'
import { expectType, TypeEqual } from 'ts-expect'
import { getPGBuilder } from '..'
import { createInputField } from '../objects/pg-input-field'
import { modifyArgValueOfNullableOrOptionalField } from './optional-args'

describe('optionalArgsFeature', () => {
  it('Modify arg value of Nullable or Optional field', async () => {
    const pg = getPGBuilder()()

    let args
    pg.query('someQuery', (b) =>
      b
        .string()
        .args((b) => ({
          nullable: b.string().nullable(),
          optional: b.string().optional(),
          nullish: b.string().nullish(),
        }))
        .resolve((params) => {
          expectType<
            TypeEqual<
              typeof params.args,
              {
                nullable: string | null
                optional: string | undefined
                nullish: string | null | undefined
              }
            >
          >(true)
          args = params.args
          return ''
        }),
    )

    const query = `query {
      someQuery(optional: null)
    }`

    await graphql({
      schema: pg.build(),
      source: query,
      contextValue: {},
    })

    expect(args).toEqual({
      nullable: null,
      optional: undefined,
    })
  })
})

describe('modifyArgValueOfNullableOrOptionalField', () => {
  describe('An InputField is optional but an arg is null', () => {
    it('Change arg value to undefined', () => {
      const fieldMap = {
        arg: createInputField({ kind: 'scalar', type: 'string' }).optional(),
      }
      const args = {
        arg: null,
      }
      const result = modifyArgValueOfNullableOrOptionalField(fieldMap, args)
      expect(result).toEqual({ arg: undefined })
    })
  })

  describe('An InputField is nullable but an arg is undefined', () => {
    it('Change arg value to null', () => {
      const fieldMap = {
        arg: createInputField({ kind: 'scalar', type: 'string' }).nullable(),
      }
      const args = {
        arg: undefined,
      }
      const result = modifyArgValueOfNullableOrOptionalField(fieldMap, args)
      expect(result).toEqual({ arg: null })
    })
  })

  describe('An arg is object', () => {
    it('Recursively modify arg value', () => {
      const pg = getPGBuilder()()
      const input = pg.input('Some', (b) => ({
        inner: b.input(() =>
          pg.input('Inner', () => ({
            nullable: b.string().nullable(),
            optional: b.string().optional(),
          })),
        ),
      }))
      const fieldMap = input.fieldMap
      const args = {
        inner: {
          nullable: undefined,
          optional: null,
        },
      }
      const result = modifyArgValueOfNullableOrOptionalField(fieldMap, args)
      expect(result).toEqual({ inner: { nullable: null, optional: undefined } })
    })
  })
})
