import { createPGEnum } from '../objects/pg-enum'
import { PGBuilder, PGCache, PGTypes } from '../types/builder'
import { setCache } from './utils'

export const createEnumBuilder: <Types extends PGTypes>(
  cache: PGCache,
) => PGBuilder<Types>['enum'] = (cache) => (config) => {
  const pgEnum = createPGEnum(config.name, config.values)
  setCache(cache, pgEnum)
  return pgEnum
}
