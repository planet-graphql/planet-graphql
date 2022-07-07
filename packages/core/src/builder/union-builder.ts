import { createPGUnion } from '../objects/pg-union'
import { setCache } from './utils'
import type { PGTypes, PGCache, PGBuilder } from '../types/builder'

export const createUnionBuilder: <Types extends PGTypes>(
  cache: PGCache,
) => PGBuilder<Types>['union'] = (cache) => (config) => {
  const pgUnion = createPGUnion(config.name, config.types, config.resolveType)
  setCache(cache, pgUnion)
  return pgUnion
}
