import { GraphQLID } from 'graphql'
import { GraphQLURL } from 'graphql-scalars'
import { expectType } from 'ts-expect'
import { z } from 'zod'
import type { PGScalarMap } from './builder'
import type { PGScalar } from './common'
import type { GraphQLScalarType } from 'graphql';
import type { TypeEqual } from 'ts-expect';

describe('PGScalarMap', () => {
  it('Convert PGScalar and PGScalarLike to PGScalarMap', () => {
    const idScalar: PGScalar<z.ZodString, string, number> = {
      scalar: GraphQLID,
      schema: () => z.string(),
    }
    const scalars = {
      url: {
        scalar: GraphQLURL,
        schema: () => z.string(),
      },
      id: idScalar,
    }

    type T = PGScalarMap<typeof scalars>

    expectType<
      TypeEqual<
        T,
        {
          url: {
            schema: z.ZodString
            input: string
            output: string
            scalar: GraphQLScalarType<any, any>
          }
          id: {
            schema: z.ZodString
            input: string
            output: number
            scalar: GraphQLScalarType<any, any>
          }
        }
      >
    >(true)
  })
})
