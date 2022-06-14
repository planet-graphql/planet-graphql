import { graphql } from 'graphql'
import { expectType, TypeEqual } from 'ts-expect'
import { z } from 'zod'
import { getPGBuilder } from '..'
import { createBuilderCache, PGError } from '../builder/utils'
import { DefaultScalars } from '../lib/scalars'
import { createInputField } from '../objects/pg-input-field'
import { SomePGTypes } from '../types/test.util'
import { modifyArgValueOfNullableOrOptionalField, validateArgs } from './validation'

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

describe('optionalArgsFeature', () => {
  it('Validates args with schema', async () => {
    const pg = getPGBuilder<SomePGTypes<{ role: 'User' | 'Admin' }>>()()
    pg.query('someQuery', (b) =>
      b
        .string()
        .args((b) => ({
          a: b.string().validation((schema) => schema.max(1)),
          b: b.input(() =>
            pg
              .input('SomeInput', (b) => ({
                b1: b.int().validation((schema) => schema.positive()),
                b2: b.string(),
              }))
              .validation((value) => String(value.b1) === value.b2),
          ),
        }))
        .resolve(() => ''),
    )
    const query = `
      query {
        someQuery (
          a: "xx"
          b: { b1: -1, b2: "yy" }
        )
      }
    `

    const resp = await graphql({
      schema: pg.build(),
      source: query,
      contextValue: {},
    })

    const errors =
      '[' +
      '{"path":"someQuery.a","issues":[{"code":"too_big","maximum":1,"type":"string","inclusive":true,"message":"String must contain at most 1 character(s)","path":[]}]},' +
      '{"path":"someQuery.b","issues":[]},' +
      '{"path":"someQuery.b.b1","issues":[{"code":"too_small","minimum":0,"type":"number","inclusive":false,"message":"Number must be greater than 0","path":[]}]}' +
      ']'

    expect(resp.errors?.[0].originalError).toEqual(
      new PGError('Invalid args.', 'ValidationError', errors),
    )
  })
})

describe('validateArgs', () => {
  it('Validates args with validator set in PGInputField', async () => {
    const fieldMap = {
      arg: createInputField({ kind: 'scalar', type: 'string' }).validation(() =>
        z.string().max(1),
      ),
    }
    const cache = createBuilderCache(DefaultScalars)
    const result = await validateArgs('prefix', fieldMap, { arg: 'xx' }, cache, {})
    expect(result).toEqual([
      {
        path: 'prefix.arg',
        issues: [
          {
            code: 'too_big',
            inclusive: true,
            maximum: 1,
            message: 'String must contain at most 1 character(s)',
            path: [],
            type: 'string',
          },
        ],
      },
    ])
  })

  it('Validate args with validator set in PGInput', async () => {
    const pg = getPGBuilder()()
    const input = pg
      .input('SomeInput', (b) => ({
        a: b.string(),
        b: b.string(),
      }))
      .validation((value) => value.a === value.b)
    const fieldMap = {
      arg: createInputField({ kind: 'object', type: () => input }),
    }
    const result = await validateArgs(
      'prefix',
      fieldMap,
      { arg: { a: 'x1', b: 'x2' } },
      pg.cache(),
      {},
    )
    expect(result).toEqual([
      {
        path: 'prefix.arg',
        issues: [],
      },
    ])
  })

  it('Validate args with validator set in PGInputField inside PGInput', async () => {
    const pg = getPGBuilder()()
    const input = pg.input('SomeInput', (b) => ({
      a: b.string().validation((schema) => schema.max(1)),
    }))
    const fieldMap = {
      arg: createInputField({ kind: 'object', type: () => input }),
    }
    const result = await validateArgs(
      'prefix',
      fieldMap,
      { arg: { a: 'xx' } },
      pg.cache(),
      {},
    )
    expect(result).toEqual([
      {
        path: 'prefix.arg.a',
        issues: [
          {
            code: 'too_big',
            inclusive: true,
            maximum: 1,
            message: 'String must contain at most 1 character(s)',
            path: [],
            type: 'string',
          },
        ],
      },
    ])
  })

  describe('Args are null or undefined', () => {
    it('Skips validation as the correctness of null and undefined is guaranteed by the optionalArgsFeature', async () => {
      const fieldMap = {
        optional: createInputField({ kind: 'scalar', type: 'string' }).optional(),
        nullable: createInputField({ kind: 'scalar', type: 'string' }).nullable(),
      }
      const cache = createBuilderCache(DefaultScalars)
      const result = await validateArgs(
        'prefix',
        fieldMap,
        { optional: undefined, nullable: null },
        cache,
        {},
      )
      expect(result).toEqual([])
    })
  })
})
