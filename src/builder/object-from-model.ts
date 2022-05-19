import { PGBuilder, PGCache, PGTypes } from '../types/builder'
import { PGOutputFieldBuilder } from '../types/output'
import { createPGObject, setCache } from './utils'

export const objectFromModel: <Types extends PGTypes>(
  cache: PGCache,
  outputFieldBuilder: PGOutputFieldBuilder<Types>,
) => PGBuilder<Types>['objectFromModel'] =
  (cache, outputFieldBuilder) => (model, editFieldMap) => {
    const pgFieldMap = editFieldMap(
      cache.object[model.name].fieldMap as any,
      outputFieldBuilder,
    )
    const pgObject = createPGObject(model.name, pgFieldMap as any)
    setCache(cache, pgObject, true)
    return pgObject
  }
