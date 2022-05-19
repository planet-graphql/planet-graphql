import DataLoader from 'dataloader'
import { GraphQLResolveInfo } from 'graphql'
import { PartialDeep } from 'type-fest'
import { PGBuilder } from '../types/builder'
import { getCtxCache } from './utils'

function getLoaderKey(path: GraphQLResolveInfo['path'], key = ''): string {
  if (path.prev === undefined) return key.slice(0, -1)
  if (path.typename === undefined) return getLoaderKey(path.prev, key)
  key = `${path.typename}:${path.key}-${key}`
  return getLoaderKey(path.prev, key)
}

export const dataloader: PGBuilder['dataloader'] = async (params, batchLoadFn) => {
  const loaderCache = getCtxCache(params.context)
  const loaderKey = getLoaderKey(params.info.path)
  let loader = loaderCache.loader[loaderKey]
  if (loader === undefined) {
    loader = new DataLoader<
      typeof params['source'],
      PartialDeep<typeof params['__type']>
    >(async (sourceList) => await batchLoadFn(sourceList))
    loaderCache.loader[loaderKey] = loader
  }
  return await loader.load(params.source)
}
