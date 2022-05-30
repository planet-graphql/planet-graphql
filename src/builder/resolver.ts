import { PGBuilder, PGCache, PGTypes } from '../types/builder'
import { PGInputFieldBuilder } from '../types/input'
import { PGOutputField, PGOutputFieldBuilder, PGOutputFieldMap } from '../types/output'
import { createPGObject } from './object'
import { setCache } from './utils'

export const resolver: <Types extends PGTypes>(
  cache: PGCache,
  outputFieldBuilder: PGOutputFieldBuilder<Types>,
  inputFieldBuilder: PGInputFieldBuilder<Types>,
) => PGBuilder<Types>['resolver'] =
  (cache, outputFieldBuilder, inputFieldBuilder) => (object, fieldMap) => {
    const outputFieldMap = Object.entries(fieldMap).reduce<PGOutputFieldMap>(
      (acc, [key, value]) => {
        const fieldValue: PGOutputField<any>['value'] = {
          ...object.fieldMap[key].value,
          resolve: (source, args, context, info) =>
            value({ source, args, context, info }),
        }
        acc[key] = {
          ...object.fieldMap[key],
          value: fieldValue,
        }
        return acc
      },
      {},
    )
    const pgObject = createPGObject(
      object.name,
      {
        ...object.fieldMap,
        ...outputFieldMap,
      },
      cache,
      outputFieldBuilder,
      inputFieldBuilder,
    )
    setCache(cache, pgObject)
    return pgObject
  }
