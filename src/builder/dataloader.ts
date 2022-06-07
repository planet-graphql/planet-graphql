import DataLoader from 'dataloader'
import { GraphQLResolveInfo } from 'graphql'
import { PGBuilder } from '../types/builder'
import { getContextCache } from './utils'

function getLoaderKey(path: GraphQLResolveInfo['path'], key = ''): string {
  if (path.prev === undefined) return key.slice(0, -1)
  if (path.typename === undefined) return getLoaderKey(path.prev, key)
  key = `${path.typename}:${path.key}-${key}`
  return getLoaderKey(path.prev, key)
}

export const dataloader: PGBuilder['dataloader'] = async (params, batchLoadFn) => {
  const loaderCache = getContextCache<DataLoader<any, any>>(params.context, 'dataloader')
  const loaderKey = getLoaderKey(params.info.path)
  let loader = loaderCache[loaderKey]
  if (loader === undefined) {
    loader = new DataLoader<typeof params['source'], any>(
      async (sourceList) => await batchLoadFn(sourceList as any[]),
    )
    loaderCache[loaderKey] = loader
  }
  return await loader.load(params.source)
}
