import { PrismaAbility } from '@casl/prisma'
import { DMMF } from '@prisma/client/runtime'
import DataLoader from 'dataloader'
import {
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLResolveInfo,
  GraphQLSchema,
} from 'graphql'
import { ReadonlyDeep } from 'type-fest'
import { ResolveTree } from '../lib/graphql-parse-resolve-info'
import {
  PGEnum,
  PGField,
  PGFieldMap,
  PGModel,
  PGQueryArgsType,
  PGSelectorType,
  ResolveParams,
  ResolveResponse,
  TypeOfPGField,
  TypeOfPGFieldMap,
  TypeOfPGModelBase,
} from './common'
import {
  InputFieldBuilder,
  PGEditInputFieldMap,
  PGInput,
  PGInputField,
  PGInputFieldMap,
} from './input'
import {
  OutputFieldBuilder,
  PGConnectionObject,
  PGEditOutputFieldMap,
  PGObject,
  PGOutputField,
  PGOutputFieldMap,
  PrismaFindManyArgsBase,
} from './output'

export interface PGRootFieldConfig {
  name: string
  field: PGOutputField<any, PGInputFieldMap | undefined>
  kind: 'query' | 'mutation' | 'subscription'
}

export interface PGfyResponseType {
  models: Record<string, PGModel<any>>
  enums: Record<string, PGEnum<any>>
}

export type PGRootFieldBuilder<TContext, TOutput extends PGOutputField<any, any>> = (
  name: string,
  field: (f: OutputFieldBuilder<TContext>) => TOutput,
) => PGRootFieldConfig

export interface PGBuilder<TContext> {
  object: <T extends PGOutputFieldMap>(
    name: string,
    fieldMap: (x: OutputFieldBuilder<TContext>) => T,
  ) => PGObject<T, TContext>
  objectFromModel: <
    TModel extends PGFieldMap,
    TPrismaFindMany,
    T extends PGEditOutputFieldMap<TModel>,
  >(
    model: PGModel<TModel, TPrismaFindMany>,
    editFieldMap: (
      keep: { [P in keyof TModel]: PGOutputField<TypeOfPGField<TModel[P]>> },
      f: OutputFieldBuilder<TContext>,
    ) => T,
  ) => PGObject<{ [P in keyof T]: Exclude<T[P], undefined> }, TContext, TPrismaFindMany>
  enum: <T extends string[]>(name: string, ...values: T) => PGEnum<T>
  input: <T extends PGInputFieldMap>(
    name: string,
    fieldMap: (x: InputFieldBuilder<TContext>) => T,
  ) => PGInput<T, TContext>
  inputFromModel: <TModel extends PGFieldMap, T extends PGEditInputFieldMap<TModel>>(
    name: string,
    model: PGModel<TModel>,
    editFieldMap: (
      keep: {
        // NOTE:
        // nullableなfieldはinputに変換する際にundefined型も付与する必要がある
        // (クエリで値が設定されないfieldはgraphql.js上undefinedになるため)
        // そのためPGFieldのTにnullが含まれるかどうかで分岐をして、nullが含まれる場合はundefined型を付与している
        [P in keyof TModel]: TModel[P] extends PGField<infer U>
          ? null extends U
            ? PGInputField<U | undefined>
            : PGInputField<U>
          : never
      },
      x: InputFieldBuilder<TContext>,
    ) => T,
  ) => PGInput<{ [P in keyof T]: Exclude<T[P], undefined> }, TContext>
  resolver: <T extends PGOutputFieldMap>(
    object: PGObject<T>,
    fieldMap: {
      [P in keyof T]?: (
        params: ResolveParams<
          TypeOfPGField<T[P]>,
          TypeOfPGModelBase<PGObject<T>>,
          TypeOfPGFieldMap<Exclude<T[P]['value']['args'], undefined>>,
          TContext
        >,
      ) => ResolveResponse<TypeOfPGField<T[P]>>
    },
  ) => PGObject<T, TContext>
  query: <TOutput extends PGOutputField<any, any>>(
    name: string,
    field: (f: OutputFieldBuilder<TContext>) => TOutput,
  ) => PGRootFieldConfig
  mutation: <TOutput extends PGOutputField<any, any>>(
    name: string,
    field: (f: OutputFieldBuilder<TContext>) => TOutput,
  ) => PGRootFieldConfig
  subscription: <TOutput extends PGOutputField<any, any>>(
    name: string,
    fields: (f: OutputFieldBuilder<TContext>) => TOutput,
  ) => PGRootFieldConfig
  build: () => GraphQLSchema
  pgfy: <T extends PGfyResponseType = PGfyResponseType>(datamodel: DMMF.Datamodel) => T
  queryArgsBuilder: <T extends { [key: string]: any }>(
    inputNamePrefix: string,
  ) => <U extends PGSelectorType<T>>(selector: U) => PGQueryArgsType<U>
  prismaFindArgs: <T = any>(
    rootType: PGObject<any>,
    params: ResolveParams<any, any, any, any>,
    defaultArgs?: Partial<T>,
  ) => T
  dataloader: <TResolve, TSource, TArgs>(
    params: ResolveParams<TResolve, TSource, TArgs, TContext>,
    batchLoadFn: (sourceList: readonly TSource[]) => ResolveResponse<TResolve[]>,
  ) => ResolveResponse<TResolve>
  // FIXME: options.totalCountが指定された場合は、PGConnectionObjectのFieldMapのTotalCountのオプショナルを外すようにしたい
  relayConnection: <
    T extends PGOutputFieldMap,
    TPrismaFindMany extends PrismaFindManyArgsBase,
    TConnectionSource extends PGOutputFieldMap,
  >(
    object: PGObject<T, TContext, TPrismaFindMany>,
    options?: {
      connectionSource?: PGObject<TConnectionSource>
      totalCount?: (
        params: ResolveParams<
          number,
          TypeOfPGFieldMap<TConnectionSource>,
          never,
          TContext
        >,
        nodeFindArgs: TPrismaFindMany,
      ) => number
      cursor?: (
        node: TypeOfPGFieldMap<T>,
      ) => Exclude<TPrismaFindMany['cursor'], undefined>
    },
  ) => PGConnectionObject<PGObject<T, TContext, TPrismaFindMany>>
  relayArgs: (options?: { default?: number; max?: number }) => {
    first: PGInputField<number | null | undefined, TContext>
    after: PGInputField<string | null | undefined, TContext>
    last: PGInputField<number | null | undefined, TContext>
    before: PGInputField<string | null | undefined, TContext>
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
