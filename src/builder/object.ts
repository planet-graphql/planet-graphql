import { PGBuilder, PGCache, PGTypes } from '../types/builder'
import { PGObject, PGOutputFieldBuilder } from '../types/output'
import { createPGObject, setCache } from './utils'

export const object: <Types extends PGTypes>(
  cache: PGCache,
  outputFieldBuilder: PGOutputFieldBuilder<Types>,
) => PGBuilder<Types>['object'] = (cache, outputFieldBuilder) => (name, fieldMap) => {
  if (cache.object[name] !== undefined) return cache.object[name] as PGObject<any>
  const pgObject = createPGObject(name, fieldMap(outputFieldBuilder))
  setCache(cache, pgObject)
  return pgObject
}
