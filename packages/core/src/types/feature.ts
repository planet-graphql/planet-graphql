import type { PGBuilder, PGCache, PGTypes } from './builder'
import type { PGOutputField } from './output'
import type { GraphQLResolveInfo } from 'graphql'
import type { Promisable } from 'type-fest'

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
  beforeResolve?: (
    params: PGFeatureBeforeResolveParams<Types>,
  ) => Promisable<PGFeatureBeforeResolveResponse<TResolveResponseExtentions, Types>>
  beforeConvertToGraphQLFieldConfig?: (
    field: PGOutputField<any>,
    fieldName: string,
    sourceTypeName: string,
    builder: PGBuilder<PGTypes>,
  ) => PGOutputField<any>
}
