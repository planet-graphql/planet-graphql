import { setCache } from './utils'
import type { PGBuilder, PGCache, PGRootFieldConfig, PGTypes } from '../types/builder'
import type { PGOutputFieldBuilder } from '../types/output'

export const createRootFieldBuilder: <Types extends PGTypes>(
  cache: PGCache,
  outputFieldBuilder: PGOutputFieldBuilder<Types>,
  kind: PGRootFieldConfig['kind'],
) => PGBuilder<Types>['query' | 'mutation' | 'subscription'] = (
  cache,
  outputFieldBuilder,
  kind,
) => {
  return (config) => {
    const pgField = config.field(outputFieldBuilder)
    const resolver: PGRootFieldConfig = {
      name: config.name,
      field: pgField,
      kind,
    }
    setCache(cache, resolver)
    return resolver
  }
}
