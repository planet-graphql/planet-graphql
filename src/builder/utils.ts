import _ from 'lodash'
import { ContextCache, PGCache, PGConfig, PGRootFieldConfig } from '../types/builder'
import { PGEnum, PGModel } from '../types/common'
import { PGInput } from '../types/input'
import { PGObject } from '../types/output'

export class PGError extends Error {
  constructor(message: string, public code: string, public detail?: any) {
    super(message)
    this.name = 'PGError'
    this.code = code
    this.detail = JSON.stringify(detail)
  }
}

export function createBuilderCache(scalarMap: PGConfig['scalars']): PGCache {
  return {
    scalar: scalarMap,
    model: {},
    object: {},
    input: {},
    enum: {},
    query: {},
    mutation: {},
    subscription: {},
  }
}

export function setCache(
  cache: PGCache,
  value: PGModel<any> | PGObject<any> | PGInput<any> | PGEnum<any> | PGRootFieldConfig,
  overwrite = false,
): void {
  if (overwrite || cache[value.kind][value.name] === undefined) {
    cache[value.kind][value.name] = value
  }
}

export function getCtxCache(context: any): ContextCache {
  if (!_.isPlainObject(context)) {
    throw new PGError('Context must be a plain object.', 'Error')
  }

  if (context.__cache === undefined) {
    const contextCache: ContextCache = {
      loader: {},
      auth: {},
      rootResolveInfo: {
        raw: null,
        parsed: null,
      },
      prismaFindArgs: {},
    }
    context.__cache = contextCache
  }
  return context.__cache
}
