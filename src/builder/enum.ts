import { createPGEnum } from '../objects/pg-enum'
import { PGBuilder, PGCache, PGTypes } from '../types/builder'
import { setCache } from './utils'

export const createEnumBuilder: <Types extends PGTypes>(
  cache: PGCache,
) => PGBuilder<Types>['enum'] =
  (cache) =>
  (name, ...values) => {
    const pgEnum = createPGEnum(name, ...values)
    setCache(cache, pgEnum)
    return pgEnum
  }
