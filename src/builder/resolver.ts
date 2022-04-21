import { PGBuilder, PGCache } from '../types/builder'
import { PGOutputField, PGOutputFieldMap } from '../types/output'
import { createPGObject, setCache } from './utils'

export const resolver: (cache: PGCache) => PGBuilder<any>['resolver'] =
  (cache) => (object, fieldMap) => {
    const outputFieldMap = Object.entries(fieldMap).reduce<PGOutputFieldMap>(
      (acc, [key, value]) => {
        const fieldValue: PGOutputField<any, any>['value'] = {
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
    const pgObject = createPGObject(object.name, {
      ...object.fieldMap,
      ...outputFieldMap,
    })
    setCache(cache, pgObject, true)
    return pgObject
  }
