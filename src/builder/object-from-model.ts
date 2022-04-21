import { PGBuilder, PGCache } from '../types/builder'
import { createPGObject, outputFieldBuilder, setCache } from './utils'

export const objectFromModel: (cache: PGCache) => PGBuilder<any>['objectFromModel'] =
  (cache) => (model, editFieldMap) => {
    const pgFieldMap = editFieldMap(
      cache.object[model.name].fieldMap as any,
      outputFieldBuilder,
    )
    const pgObject = createPGObject(model.name, pgFieldMap as any)
    setCache(cache, pgObject, true)
    return pgObject
  }
