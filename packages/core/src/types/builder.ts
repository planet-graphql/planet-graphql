import type { DefaultScalars } from '../objects/pg-scalar'
import type {
  PGEnum,
  PGScalar,
  PGScalarLike,
  PGResolveParams,
  ResolveResponse,
  TypeOfPGFieldMap,
  TypeOfPGUnion,
} from './common'
import type { PGInput, PGInputFieldBuilder, PGInputFieldMap } from './input'
import type { PGArgBuilder } from './input-factory'
import type {
  ConvertPGInterfacesToFieldMap,
  PGInterface,
  PGObject,
  PGObjectOptionsDefault,
  PGOutputField,
  PGOutputFieldBuilder,
  PGOutputFieldMap,
  PGUnion,
  PrismaArgsBase,
} from './output'
import type {
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLUnionType,
} from 'graphql'
import type { Simplify } from 'type-fest'
import type { IsUnknown } from 'type-fest/source/set-return-type'
import type { z } from 'zod'

export interface PGConfig {
  scalars: { [name: string]: PGScalarLike }
}

export type PGfyResponseType<T extends PGBuilder> = T extends PGBuilder<infer U>
  ? {
      enums: Record<string, PGEnum<any>>
      objects: Record<string, PGObject<any, any, any, U>>
      inputs: Record<string, PGArgBuilder<any, U>>
    }
  : any

export interface PGTypeConfig {
  Context?: object
  Prisma?: {
    Args: { [key: string]: PrismaArgsBase }
  }
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

export type InitPGBuilder = <TypeConfig extends PGTypeConfig = PGTypeConfig>() => <
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
  object: <
    T extends PGOutputFieldMap,
    TInterfaces extends Array<PGInterface<any>> | undefined = undefined,
  >(config: {
    name: string
    fields: (b: PGOutputFieldBuilder<Types>) => T
    interfaces?: TInterfaces
    isTypeOf?: (
      value: TypeOfPGFieldMap<T & ConvertPGInterfacesToFieldMap<TInterfaces>>,
    ) => boolean
  }) => PGObject<
    Simplify<T & ConvertPGInterfacesToFieldMap<TInterfaces>>,
    TInterfaces,
    PGObjectOptionsDefault<Types>,
    Types
  >
  union: <T extends Array<PGObject<any>>>(config: {
    name: string
    types: T
    resolveType?: (value: TypeOfPGUnion<PGUnion<T>>) => T[number] | null
  }) => PGUnion<T>
  interface: <T extends PGOutputFieldMap>(config: {
    name: string
    fields: (b: PGOutputFieldBuilder<Types>) => T
  }) => PGInterface<T>
  enum: <T extends string[], U extends [...T]>(config: {
    name: string
    values: U
  }) => PGEnum<U>
  input: <T extends PGInputFieldMap>(config: {
    name: string
    fields: (b: PGInputFieldBuilder<Types>) => T
  }) => PGInput<T, Types>
  query: <TOutput extends PGOutputField<any>>(config: {
    name: string
    field: (b: PGOutputFieldBuilder<Types>) => TOutput
  }) => PGRootFieldConfig
  mutation: <TOutput extends PGOutputField<any>>(config: {
    name: string
    field: (b: PGOutputFieldBuilder<Types>) => TOutput
  }) => PGRootFieldConfig
  subscription: <TOutput extends PGOutputField<any>>(config: {
    name: string
    field: (b: PGOutputFieldBuilder<Types>) => TOutput
  }) => PGRootFieldConfig
  build: (rootFieldConfigs: PGRootFieldConfig[]) => GraphQLSchema
  dataloader: <TResolve, TSource>(
    params: PGResolveParams<TSource, any, any, any, TResolve>,
    batchLoadFn: (sourceList: readonly TSource[]) => ResolveResponse<TResolve[]>,
  ) => ResolveResponse<TResolve>
  cache: () => PGCache
  utils: {
    inputFieldBuilder: PGInputFieldBuilder<Types>
    outputFieldBuilder: PGOutputFieldBuilder<Types>
  }
}

export type PGObjectRef = {
  name: string
  kind: 'objectRef'
  ref: () => PGObject<PGOutputFieldMap>
}

export interface PGCache {
  scalar: { [name: string]: PGScalarLike }
  object: { [name: string]: PGObject<PGOutputFieldMap> }
  objectRef: { [name: string]: PGObjectRef }
  union: { [name: string]: PGUnion<Array<PGObject<any>>> }
  interface: { [name: string]: PGInterface<PGOutputFieldMap> }
  input: { [name: string]: PGInput<PGInputFieldMap> }
  enum: { [name: string]: PGEnum<string[]> }
}

export type GraphqlTypeRef = () => {
  enums: { [name: string]: GraphQLEnumType }
  objects: { [name: string]: GraphQLObjectType }
  interfaces: { [name: string]: GraphQLInterfaceType }
  unions: { [name: string]: GraphQLUnionType }
  inputs: { [name: string]: GraphQLInputObjectType }
}
