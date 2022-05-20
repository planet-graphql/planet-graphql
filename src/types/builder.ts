import { PrismaAbility } from '@casl/prisma'
import { DMMF } from '@prisma/client/runtime'
import DataLoader from 'dataloader'
import {
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLSchema,
} from 'graphql'
import { ReadonlyDeep } from 'type-fest'
import { IsUnknown } from 'type-fest/source/set-return-type'
import { z } from 'zod'
import { ResolveTree } from '../lib/graphql-parse-resolve-info'
import { DefaultScalars } from '../lib/scalars'
import {
  PGEnum,
  PGField,
  PGFieldMap,
  PGModel,
  PGQueryArgsType,
  PGScalar,
  PGScalarLike,
  PGSelectorType,
  ResolveParams,
  ResolveResponse,
  TypeOfPGField,
  TypeOfPGFieldMap,
  TypeOfPGModelBase,
} from './common'
import {
  PGEditInputFieldMap,
  PGInput,
  PGInputField,
  PGInputFieldBuilder,
  PGInputFieldMap,
} from './input'
import {
  PGConnectionObject,
  PGConnectionObjectWithTotalCount,
  PGEditOutputFieldMap,
  PGObject,
  PGOutputField,
  PGOutputFieldBuilder,
  PGOutputFieldMap,
  PrismaFindManyArgsBase,
  RelayConnectionTotalCountFn,
} from './output'

export interface PGConfig {
  scalars: { [name: string]: PGScalarLike }
}

export interface PGfyResponseType {
  models: Record<string, PGModel<any>>
  enums: Record<string, PGEnum<any>>
}

export interface PGTypeConfig {
  Context: object
  PGGeneratedType: PGfyResponseType
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
    fieldMap: (x: PGOutputFieldBuilder<Types>) => T,
  ) => PGObject<T, Types>
  objectFromModel: <
    TModel extends PGFieldMap,
    TPrismaFindMany,
    T extends PGEditOutputFieldMap<TModel>,
  >(
    model: PGModel<TModel, TPrismaFindMany>,
    editFieldMap: (
      keep: { [P in keyof TModel]: PGOutputField<TypeOfPGField<TModel[P]>> },
      f: PGOutputFieldBuilder<Types>,
    ) => T,
  ) => PGObject<{ [P in keyof T]: Exclude<T[P], undefined> }, Types, TPrismaFindMany>
  enum: <T extends string[]>(name: string, ...values: T) => PGEnum<T>
  input: <T extends PGInputFieldMap>(
    name: string,
    fieldMap: (x: PGInputFieldBuilder<Types>) => T,
  ) => PGInput<T, Types>
  inputFromModel: <TModel extends PGFieldMap, T extends PGEditInputFieldMap<TModel>>(
    name: string,
    model: PGModel<TModel>,
    editFieldMap: (
      keep: {
        // NOTE:
        // A nullable fields must also be given an undefined type when converted to input.
        // This is because an Input field which value is not specified in a query is undefined in graphql.js.
        [P in keyof TModel]: TModel[P] extends PGField<infer U>
          ? null extends U
            ? PGInputField<U | undefined>
            : PGInputField<U>
          : never
      },
      x: PGInputFieldBuilder<Types>,
    ) => T,
  ) => PGInput<{ [P in keyof T]: Exclude<T[P], undefined> }, Types>
  resolver: <T extends PGOutputFieldMap>(
    object: PGObject<T>,
    fieldMap: {
      [P in keyof T]?: (
        params: ResolveParams<
          TypeOfPGField<T[P]>,
          TypeOfPGModelBase<PGObject<T>>,
          TypeOfPGFieldMap<Exclude<T[P]['value']['args'], undefined>>,
          Types['Context']
        >,
      ) => ResolveResponse<TypeOfPGField<T[P]>>
    },
  ) => PGObject<T, Types>
  query: <TOutput extends PGOutputField<any, any>>(
    name: string,
    field: (f: PGOutputFieldBuilder<Types>) => TOutput,
  ) => PGRootFieldConfig
  mutation: <TOutput extends PGOutputField<any, any>>(
    name: string,
    field: (f: PGOutputFieldBuilder<Types>) => TOutput,
  ) => PGRootFieldConfig
  subscription: <TOutput extends PGOutputField<any, any>>(
    name: string,
    fields: (f: PGOutputFieldBuilder<Types>) => TOutput,
  ) => PGRootFieldConfig
  build: () => GraphQLSchema
  pgfy: (datamodel: DMMF.Datamodel) => Types['PGGeneratedType']
  queryArgsBuilder: <T extends { [key: string]: any }>(
    inputNamePrefix: string,
  ) => <U extends PGSelectorType<T>>(selector: U) => PGQueryArgsType<U>
  prismaFindArgs: <T = any>(
    rootType: PGObject<any>,
    params: ResolveParams<any, any, any, any>,
    defaultArgs?: Partial<T>,
  ) => T
  dataloader: <TResolve, TSource, TArgs>(
    params: ResolveParams<TResolve, TSource, TArgs, Types['Context']>,
    batchLoadFn: (sourceList: readonly TSource[]) => ResolveResponse<TResolve[]>,
  ) => ResolveResponse<TResolve>
  relayConnection: <
    T extends PGOutputFieldMap,
    TPrismaFindMany extends PrismaFindManyArgsBase,
    TConnectionSource extends PGOutputFieldMap,
    TotalCountFn extends
      | RelayConnectionTotalCountFn<
          TypeOfPGFieldMap<TConnectionSource>,
          Types['Context'],
          TPrismaFindMany
        >
      | undefined,
  >(
    object: PGObject<T, Types, TPrismaFindMany>,
    options?: {
      connectionSource?: PGObject<TConnectionSource>
      totalCount?: TotalCountFn
      cursor?: (
        node: TypeOfPGFieldMap<T>,
      ) => Exclude<TPrismaFindMany['cursor'], undefined>
    },
  ) => TotalCountFn extends undefined
    ? PGConnectionObject<PGObject<T, Types, TPrismaFindMany>>
    : PGConnectionObjectWithTotalCount<PGObject<T, Types, TPrismaFindMany>>
  relayArgs: (options?: { default?: number; max?: number }) => {
    first: PGInputField<number | null | undefined, Types>
    after: PGInputField<string | null | undefined, Types>
    last: PGInputField<number | null | undefined, Types>
    before: PGInputField<string | null | undefined, Types>
  }
  cache: () => ReadonlyDeep<PGCache>
}

export interface PGCache {
  model: { [name: string]: PGModel<PGFieldMap> }
  object: { [name: string]: PGObject<PGOutputFieldMap> }
  input: { [name: string]: PGInput<PGInputFieldMap> }
  enum: { [name: string]: PGEnum<string[]> }
  query: { [name: string]: PGRootFieldConfig }
  mutation: { [name: string]: PGRootFieldConfig }
  subscription: { [name: string]: PGRootFieldConfig }
}

export interface ContextCache {
  loader: {
    [key: string]: DataLoader<any, any>
  }
  auth: {
    [typeAndFieldName: string]:
      | {
          hasAuth: boolean
          unAuthReturnValue: null | []
        }
      | undefined
  }
  prismaAbility: {
    [key: string]: PrismaAbility<any> | null | undefined
  }
  rootResolveInfo: {
    raw: GraphQLResolveInfo | null
    parsed: ResolveTree | null
  }
  prismaFindArgs: {
    [loc: string]: any | undefined
  }
}

export type GetGraphqlTypeRefFn = () => {
  enums: { [name: string]: GraphQLEnumType }
  objects: { [name: string]: GraphQLObjectType }
  inputs: { [name: string]: GraphQLInputObjectType }
}
