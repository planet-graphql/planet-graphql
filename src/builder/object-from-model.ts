import { PGBuilder, PGCache, PGTypes } from '../types/builder'
import { PGInputFieldBuilder } from '../types/input'
import { PGOutputFieldBuilder } from '../types/output'
import { createPGObject } from './object'
import { setCache } from './utils'

export const objectFromModel: <Types extends PGTypes>(
  cache: PGCache,
  outputFieldBuilder: PGOutputFieldBuilder<Types>,
  inputFieldBuilder: PGInputFieldBuilder<Types>,
) => PGBuilder<Types>['objectFromModel'] =
  (cache, outputFieldBuilder, inputFieldBuilder) => (model, editFieldMap) => {
    const pgFieldMap = editFieldMap(
      cache.object[model.name].fieldMap as any,
      outputFieldBuilder,
    )
    const pgObject = createPGObject(
      model.name,
      pgFieldMap as any,
      cache,
      outputFieldBuilder,
      inputFieldBuilder,
    )
    setCache(cache, pgObject)
    return pgObject
  }
