import { GraphQLString, GraphQLBoolean, GraphQLInt, GraphQLFloat } from 'graphql'
import { GraphQLJSON, GraphQLByte, GraphQLBigInt, GraphQLDateTime } from 'graphql-scalars'
import { z } from 'zod'
import { PGGraphQLDecimal } from '../lib/pg-decimal-scalar'
import { PGGraphQLID } from '../lib/pg-id-scalar'
import type { PGScalar } from '../types/common'
import type { Decimal } from 'decimal.js'
import type { JsonValue } from 'type-fest/source/basic'

const json: PGScalar<z.ZodAny, JsonValue> = {
  scalar: GraphQLJSON,
  schema: () => z.any(),
}

const bytes: PGScalar<z.ZodAny, Buffer> = {
  scalar: GraphQLByte,
  schema: () => z.any(),
}

const decimal: PGScalar<z.ZodAny, Decimal> = {
  scalar: PGGraphQLDecimal,
  schema: () => z.any(),
}

export const DefaultScalars = {
  id: {
    scalar: PGGraphQLID,
    schema: () => z.string(),
  },
  string: {
    scalar: GraphQLString,
    schema: () => z.string(),
  },
  boolean: {
    scalar: GraphQLBoolean,
    schema: () => z.boolean(),
  },
  int: {
    scalar: GraphQLInt,
    schema: () => z.number().int(),
  },
  bigInt: {
    scalar: GraphQLBigInt,
    schema: () => z.bigint(),
  },
  float: {
    scalar: GraphQLFloat,
    schema: () => z.number(),
  },
  dateTime: {
    scalar: GraphQLDateTime,
    schema: () => z.date(),
  },
  json,
  bytes,
  decimal,
}
