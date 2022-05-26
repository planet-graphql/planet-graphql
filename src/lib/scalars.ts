import { Decimal } from '@prisma/client/runtime'
import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLString } from 'graphql'
import { GraphQLBigInt, GraphQLByte, GraphQLDateTime, GraphQLJSON } from 'graphql-scalars'
import { JsonValue } from 'type-fest'
import { z } from 'zod'
import { PGScalar } from '../types/common'
import { PGGraphQLDecimal } from './pg-decimal-scalar'
import { PGGraphQLID } from './pg-id-scalar'

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
