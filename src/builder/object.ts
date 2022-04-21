import { PGBuilder, PGCache } from '../types/builder'
import { PGObject } from '../types/output'
import { createPGObject, outputFieldBuilder, setCache } from './utils'

export const object: (cache: PGCache) => PGBuilder<any>['object'] =
  (cache) => (name, fieldMap) => {
    if (cache.object[name] !== undefined) return cache.object[name] as PGObject<any>
    const pgObject = createPGObject(name, fieldMap(outputFieldBuilder))
    setCache(cache, pgObject)
    return pgObject
  }
