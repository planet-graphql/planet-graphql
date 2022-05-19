import { GraphQLFieldResolver } from 'graphql'
import { ResolverFn } from 'graphql-subscriptions'
import { PartialDeep } from 'type-fest'
import { IsAny } from 'type-fest/source/set-return-type'
import { PGConfig, PGTypeConfig, PGTypes } from './builder'
import {
  PGEnum,
  PGField,
  PGFieldMap,
  PGFieldValue,
  ResolveParams,
  ResolveResponse,
  TypeOfPGField,
  TypeOfPGFieldMap,
} from './common'
import { PGInputFieldBuilder, PGInputFieldMap } from './input'

type CheckPrismaPermissionFn<TContext, TValue> = {
  (ctx: TContext, action: string, value: TValue, condition?: TValue): {
    hasPermission: boolean
    permittedValue: TValue
  }
  (ctx: TContext, action: string, value: TValue[], condition?: TValue[]): {
    hasPermission: boolean
    permittedValue: TValue[]
  }
}

export interface PrismaFindManyArgsBase {
  select?: any | null
  include?: any | null
  where?: any
  orderby?: any | any[]
  cursor?: any
  take?: number
  skip?: number
  distinct?: any | any[]
}

type NamesOfPGFieldMap<T extends PGOutputFieldMap> = Array<
  IsAny<T> extends true ? any : keyof T
>

type PrismaAuthFn<TPrismaWhere, TField> = {
  (action: string, condition?: TPrismaWhere): void
  (action: string, fields: TField, condition?: TPrismaWhere): void
}

type PrismaAuthBuilder<TContext, TPrismaWhere, TField> = (params: {
  ctx: TContext
  allow: PrismaAuthFn<TPrismaWhere, TField>
  deny: PrismaAuthFn<TPrismaWhere, TField>
}) => void

export interface PGObject<
  TFieldMap extends PGOutputFieldMap,
  Types extends PGTypes = any,
  TPrismaWhere = any,
> {
  name: string
  fieldMap: TFieldMap
  kind: 'object'
  value: {
    prismaAuthBuilder?: PrismaAuthBuilder<
      Types['Context'],
      TPrismaWhere,
      NamesOfPGFieldMap<TFieldMap>
    >
    isRelayConnection?: boolean
  }
  prismaAuth: (
    builder: PrismaAuthBuilder<
      Types['Context'],
      TPrismaWhere,
      NamesOfPGFieldMap<TFieldMap>
    >,
  ) => this
  checkPrismaPermission: CheckPrismaPermissionFn<
    Types['Context'],
    PartialDeep<TypeOfPGFieldMap<TFieldMap>>
  >
}

export type RelayConnectionTotalCountFn<TSource, TContext, TPrismaFindMany> = (
  params: ResolveParams<number, TSource, never, TContext>,
  nodeFindArgs: TPrismaFindMany,
) => number

type PGConnectionObjectFieldBase<TObject extends PGObject<any>> = {
  edges: PGOutputField<
    Array<
      () => PGObject<{
        cursor: PGOutputField<string>
        node: PGOutputField<() => TObject>
      }>
    >
  >
  pageInfo: PGOutputField<
    () => PGObject<{
      hasNextPage: PGOutputField<boolean>
      hasPreviousPage: PGOutputField<boolean>
    }>
  >
}

export type PGConnectionObject<
  TObject extends PGObject<any>,
  Types extends PGTypes = any,
> = PGObject<PGConnectionObjectFieldBase<TObject>, Types>

export type PGConnectionObjectWithTotalCount<
  TObject extends PGObject<any>,
  Types extends PGTypes = any,
> = PGObject<
  PGConnectionObjectFieldBase<TObject> & {
    totalCount: PGOutputField<number>
  },
  Types
>

export interface PGOutputField<
  T,
  TArgs extends PGInputFieldMap | undefined = undefined,
  Types extends PGTypes = any,
> extends PGField<T> {
  value: PGFieldValue & {
    args?: TArgs
    resolve?: GraphQLFieldResolver<any, any>
    subscribe?: ResolverFn
    authChecker?: <CheckerTArgs extends TArgs>(x: {
      ctx: Types['Context']
      args: TypeOfPGFieldMap<Exclude<CheckerTArgs, undefined>>
    }) => boolean | Promise<boolean>
  }
  nullable: () => PGOutputField<T | null, TArgs, Types>
  list: () => PGOutputField<T extends null ? null : T[], TArgs, Types>
  args: <SetTArgs extends PGInputFieldMap>(
    x: (f: PGInputFieldBuilder<Types>) => SetTArgs,
  ) => PGOutputField<T, SetTArgs, Types>
  resolve: (
    x: (
      params: ResolveParams<
        TypeOfPGField<PGField<T>>,
        any,
        TypeOfPGFieldMap<Exclude<TArgs, undefined>>,
        Types['Context']
      >,
    ) => ResolveResponse<TypeOfPGField<PGField<T>>>,
  ) => this
  subscribe: (
    x: (
      params: ResolveParams<
        TypeOfPGField<PGField<T>>,
        any,
        TypeOfPGFieldMap<Exclude<TArgs, undefined>>,
        Types['Context']
      >,
    ) => {
      pubSubIter: AsyncIterator<any>
      filter?: () => boolean | Promise<boolean>
    },
  ) => this
  auth: (
    // NOTE: 直接TArgsを使うと型エラーが発生するため、CheckTArgsを挟んでいる
    checker: <CheckerTArgs extends TArgs>(x: {
      ctx: Types['Context']
      args: TypeOfPGFieldMap<Exclude<CheckerTArgs, undefined>>
    }) => boolean | Promise<boolean>,
  ) => this
}

export interface PGOutputFieldMap {
  [name: string]: PGOutputField<any, PGInputFieldMap | undefined, any>
}

export type PGEditOutputFieldMap<TModel extends PGFieldMap> =
  | { [P in keyof TModel]?: PGOutputField<any, any> }
  | { [name: string]: PGOutputField<any, any> }

export type PGOutputFieldBuilder<Types extends PGTypes<PGTypeConfig, PGConfig>> = {
  [P in keyof Types['ScalarMap']]: () => PGOutputField<
    Types['ScalarMap'][P]['output'],
    undefined,
    Types
  >
} & {
  object: <T extends Function>(type: T) => PGOutputField<T, undefined, Types>
  enum: <T extends PGEnum<any>>(type: T) => PGOutputField<T, undefined, Types>
}
