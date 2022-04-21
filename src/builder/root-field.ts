import { PGBuilder, PGCache, PGRootFieldConfig } from '../types/builder'
import { outputFieldBuilder, setCache } from './utils'

export const rootFieldBuilder: (
  cache: PGCache,
  kind: PGRootFieldConfig['kind'],
) => PGBuilder<any>['query' | 'mutation' | 'subscription'] = (cache, kind) => {
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
