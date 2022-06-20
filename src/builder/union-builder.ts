import { createPGUnion } from '../objects/pg-union'
import { PGTypes, PGCache, PGBuilder } from '../types/builder'
import { setCache } from './utils'

export const createUnionBuilder: <Types extends PGTypes>(
  cache: PGCache,
) => PGBuilder<Types>['union'] = (cache) => (config) => {
  const pgUnion = createPGUnion(config.name, config.types, config.resolveType)
  setCache(cache, pgUnion)
  return pgUnion
}
