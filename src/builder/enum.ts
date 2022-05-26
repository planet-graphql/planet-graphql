import { PGBuilder, PGCache, PGTypes } from '../types/builder'
import { PGEnum } from '../types/common'
import { setCache } from './utils'

export const createEnumBuilder: <Types extends PGTypes>(
  cache: PGCache,
) => PGBuilder<Types>['enum'] =
  (cache) =>
  (name, ...values) => {
    if (cache.enum[name] !== undefined) return cache.enum[name] as PGEnum<any>
    const pgEnum = createEnum(name, ...values)
    setCache(cache, pgEnum)
    return pgEnum
  }

export function createEnum<T extends string[]>(name: string, ...values: T): PGEnum<T> {
  const pgEnum: PGEnum<T> = {
    name,
    values,
    kind: 'enum' as const,
  }
  return pgEnum
}
