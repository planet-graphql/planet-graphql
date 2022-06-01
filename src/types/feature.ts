import { GraphQLResolveInfo } from 'graphql'
import { Promisable } from 'type-fest'
import { PGCache, PGTypes } from './builder'
import { PGOutputField } from './output'

export type GraphQLResolveParams<Types extends PGTypes> = {
  source: any
  args: any
  context: Types['Context']
  info: GraphQLResolveInfo
}

export type PGFeatureBeforeResolveParams<Types extends PGTypes> = {
  resolveParams: GraphQLResolveParams<Types>
  field: PGOutputField<unknown>
  isRootField: boolean
  cache: PGCache
}

export type PGFeatureBeforeResolveCallNextResponse<
  TExtentions extends object,
  Types extends PGTypes,
> = {
  isCallNext: true
  updatedResolveParams?: GraphQLResolveParams<Types> & TExtentions
}

export type PGFeatureBeforeResolveNotCallNextResponse = {
  isCallNext: false
  resolveValue?: any
  resolveError?: any
}

export type PGFeatureBeforeResolveResponse<
  TExtentions extends object,
  Types extends PGTypes,
> =
  | PGFeatureBeforeResolveCallNextResponse<TExtentions, Types>
  | PGFeatureBeforeResolveNotCallNextResponse

export interface PGFeature<
  TResolveResponseExtentions extends object = object,
  Types extends PGTypes = PGTypes,
> {
  name: string
  cacheKey?: (params: GraphQLResolveParams<Types>) => string
  beforeResolve: (
    params: PGFeatureBeforeResolveParams<Types>,
  ) => Promisable<PGFeatureBeforeResolveResponse<TResolveResponseExtentions, Types>>
}
