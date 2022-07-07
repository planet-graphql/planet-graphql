import { createPGEnum } from '../objects/pg-enum'
import { setCache } from './utils'
import type { PGBuilder, PGCache, PGTypes } from '../types/builder'

export const createEnumBuilder: <Types extends PGTypes>(
  cache: PGCache,
) => PGBuilder<Types>['enum'] = (cache) => (config) => {
  const pgEnum = createPGEnum(config.name, config.values)
  setCache(cache, pgEnum)
  return pgEnum
}
