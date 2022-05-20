import { PGBuilder, PGCache, PGRootFieldConfig, PGTypes } from '../types/builder'
import { PGOutputFieldBuilder } from '../types/output'
import { setCache } from './utils'

export const rootFieldBuilder: <Types extends PGTypes>(
  cache: PGCache,
  outputFieldBuilder: PGOutputFieldBuilder<Types>,
  kind: PGRootFieldConfig['kind'],
) => PGBuilder<Types>['query' | 'mutation' | 'subscription'] = (
  cache,
  outputFieldBuilder,
  kind,
) => {
  return (name, field) => {
    if (cache[kind][name] !== undefined) return cache[kind][name]
    const pgField = field(outputFieldBuilder)
    const resolver: PGRootFieldConfig = {
      name,
      field: pgField,
      kind,
    }
    setCache(cache, resolver)
    return resolver
  }
}
