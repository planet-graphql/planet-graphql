import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLString } from 'graphql'
import {
  GraphQLBigInt,
  GraphQLByte,
  GraphQLDateTime,
  GraphQLJSONObject,
} from 'graphql-scalars'
import { z } from 'zod'
import { PGGraphQLDecimal } from './pg-decimal-scalar'
import { PGGraphQLID } from './pg-id-scalar'

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
  json: {
    scalar: GraphQLJSONObject,
    schema: () => z.any(),
  },
  bytes: {
    scalar: GraphQLByte,
    schema: () => z.any(),
  },
  decimal: {
    scalar: PGGraphQLDecimal,
    schema: () => z.any(),
  },
}
