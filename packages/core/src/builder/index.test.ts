import { GraphQLURL } from 'graphql-scalars'
import { expectType } from 'ts-expect'
import { z } from 'zod'
import { getPGBuilder } from '..'
import { mergeDefaultOutputField, mergeDefaultPGObject } from '../test-utils'
import { getPGBuilderWithConfig } from '.'
import type { PGBuilder, PGConfig, PGTypeConfig, PGTypes } from '../types/builder'
import type { GraphQLScalarType } from 'graphql'
import type { TypeEqual } from 'ts-expect'

describe('getPGBuilderWithConfig', () => {
  it('Returns a configured PGBuidler', () => {
    const pg = getPGBuilderWithConfig()({
      scalars: {
        url: {
          scalar: GraphQLURL,
          schema: () => z.string().url(),
        },
      },
    })
    const someObject = pg.object({
      name: 'SomeObject',
      fields: (b) => ({
        url: b.url(),
      }),
    })

    type T = typeof pg
    expectType<
      TypeEqual<
        T,
        PGBuilder<
          PGTypes<
            PGTypeConfig,
            {
              scalars: {
                url: {
                  scalar: GraphQLScalarType<unknown, unknown>
                  schema: () => z.ZodString
                }
              }
            }
          >
        >
      >
    >(true)
    expect(someObject).toEqual(
      mergeDefaultPGObject({
        name: 'SomeObject',
        value: {
          fieldMap: {
            url: mergeDefaultOutputField({
              type: 'url',
            }),
          },
        },
      }),
    )
  })
})
describe('getPGBuider', () => {
  it('Returns a PGBuilder', () => {
    const pg = getPGBuilder<{ Context: { userId: string } }>()

    type T = typeof pg
    expectType<
      TypeEqual<
        T,
        PGBuilder<
          PGTypes<
            {
              Context: {
                userId: string
              }
            },
            PGConfig
          >
        >
      >
    >(true)
  })
})
