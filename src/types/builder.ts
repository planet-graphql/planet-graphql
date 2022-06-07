import { DMMF } from '@prisma/client/runtime'
import {
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
} from 'graphql'
import { ReadonlyDeep } from 'type-fest'
import { IsUnknown } from 'type-fest/source/set-return-type'
import { z } from 'zod'
import { DefaultScalars } from '../lib/scalars'
import {
  PGEnum,
  PGFieldMap,
  PGModel,
  PGScalar,
  PGScalarLike,
  PGResolveParams,
  ResolveResponse,
} from './common'
import { PGInput, PGInputFieldBuilder, PGInputFieldMap } from './input'
import {
  PGObject,
  PGOutputField,
  PGOutputFieldBuilder,
  PGOutputFieldMap,
  PrismaArgsBase,
} from './output'

export interface PGConfig {
  scalars: { [name: string]: PGScalarLike }
}

export interface PGfyResponseType {
  models: Record<string, PrismaArgsBase>
  objects: Record<string, PGObject<any>>
  enums: Record<string, PGEnum<any>>
}

export interface PGTypeConfig {
  Context: object
  GeneratedType: PGfyResponseType
}

export type PGScalarMap<T extends PGConfig['scalars']> = {
  [P in keyof T]: T[P] extends PGScalar<infer TSchema, infer TInput, infer TOutput>
    ? {
        schema: TSchema
        input: IsUnknown<TInput> extends true ? z.infer<TSchema> : TInput
        output: IsUnknown<TOutput> extends true ? z.infer<TSchema> : TOutput
        scalar: GraphQLScalarType<any>
      }
    : never
}

export type PGTypes<
  TypeConfig extends PGTypeConfig = PGTypeConfig,
  Config extends PGConfig = PGConfig,
> = TypeConfig & {
  ScalarMap: PGScalarMap<typeof DefaultScalars & Config['scalars']>
}

export type InitPGBuilder = <TypeConfig extends PGTypeConfig>() => <
  Config extends PGConfig,
>(
  config?: Config,
) => PGBuilder<PGTypes<TypeConfig, Config>>

export interface PGRootFieldConfig {
  name: string
  field: PGOutputField<any, PGInputFieldMap | undefined>
  kind: 'query' | 'mutation' | 'subscription'
}

export interface PGBuilder<
  Types extends PGTypes<PGTypeConfig, PGConfig> = PGTypes<PGTypeConfig, PGConfig>,
> {
  object: <T extends PGOutputFieldMap>(
    name: string,
    fieldMap: (b: PGOutputFieldBuilder<Types>) => T,
  ) => PGObject<T, any, Types>
  enum: <T extends string[]>(name: string, ...values: T) => PGEnum<T>
  input: <T extends PGInputFieldMap>(
    name: string,
    fieldMap: (b: PGInputFieldBuilder<Types>) => T,
  ) => PGInput<T, Types>
  query: <TOutput extends PGOutputField<any>>(
    name: string,
    field: (b: PGOutputFieldBuilder<Types>) => TOutput,
  ) => PGRootFieldConfig
  mutation: <TOutput extends PGOutputField<any>>(
    name: string,
    field: (b: PGOutputFieldBuilder<Types>) => TOutput,
  ) => PGRootFieldConfig
  subscription: <TOutput extends PGOutputField<any>>(
    name: string,
    fields: (b: PGOutputFieldBuilder<Types>) => TOutput,
  ) => PGRootFieldConfig
  build: () => GraphQLSchema
  pgfy: (datamodel: DMMF.Datamodel) => Types['GeneratedType']
  dataloader: <TResolve, TSource>(
    params: PGResolveParams<TSource, any, any, any, TResolve>,
    batchLoadFn: (sourceList: readonly TSource[]) => ResolveResponse<TResolve[]>,
  ) => ResolveResponse<TResolve>
  cache: () => ReadonlyDeep<PGCache>
}

export interface PGCache {
  scalar: { [name: string]: PGScalarLike }
  model: { [name: string]: PGModel<PGFieldMap> }
  object: { [name: string]: PGObject<PGOutputFieldMap> }
  input: { [name: string]: PGInput<PGInputFieldMap> }
  enum: { [name: string]: PGEnum<string[]> }
  query: { [name: string]: PGRootFieldConfig }
  mutation: { [name: string]: PGRootFieldConfig }
  subscription: { [name: string]: PGRootFieldConfig }
}

export type GraphqlTypeRef = () => {
  enums: { [name: string]: GraphQLEnumType }
  objects: { [name: string]: GraphQLObjectType }
  inputs: { [name: string]: GraphQLInputObjectType }
}
