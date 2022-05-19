import { PGBuilder, PGCache, PGTypes } from '../types/builder'
import { PGEnum } from '../types/common'
import { setCache } from './utils'

export const createEnum: <Types extends PGTypes>(
  cache: PGCache,
) => PGBuilder<Types>['enum'] =
  (cache) =>
  (name, ...values) => {
    if (cache.enum[name] !== undefined) return cache.enum[name] as PGEnum<any>
    const pgEnum = {
      name,
      values,
      kind: 'enum' as const,
    }
    setCache(cache, pgEnum)
    return pgEnum
  }
