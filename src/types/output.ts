import { Decimal } from '@prisma/client/runtime'
import { GraphQLFieldResolver } from 'graphql'
import { ResolverFn } from 'graphql-subscriptions'
import { PartialDeep } from 'type-fest'
import { IsAny } from 'type-fest/source/set-return-type'
import {
  PGEnum,
  PGField,
  PGFieldMap,
  PGFieldType,
  PGFieldValue,
  ResolveParams,
  ResolveResponse,
  TypeOfPGField,
  TypeOfPGFieldMap,
} from './common'
import { InputFieldBuilder, PGInputFieldMap } from './input'

type PrismaAuthFn<TPrismaWhere, TFields> = {
  (action: string, condition?: TPrismaWhere): void
  (action: string, fields: TFields, condition?: TPrismaWhere): void
}

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

export interface PGObject<
  TFieldMap extends PGOutputFieldMap,
  TContext = any,
  TPrismaFindMany extends PrismaFindManyArgsBase = PrismaFindManyArgsBase,
  TPrismaWhere = Exclude<TPrismaFindMany['where'], undefined>,
  TField = IsAny<TFieldMap> extends true ? any : keyof TFieldMap,
  TAuthBuilder = (params: {
    ctx: TContext
    allow: PrismaAuthFn<TPrismaWhere, TField[]>
    deny: PrismaAuthFn<TPrismaWhere, TField[]>
  }) => void,
> {
  name: string
  fieldMap: TFieldMap
  kind: 'object'
  value: {
    prismaAuthBuilder?: TAuthBuilder
    isRelayConnection?: boolean
  }
  prismaAuth: (builder: TAuthBuilder) => PGObject<TFieldMap, TContext, TPrismaWhere>
  checkPrismaPermission: CheckPrismaPermissionFn<
    TContext,
    PartialDeep<TypeOfPGFieldMap<TFieldMap>>
  >
}

export type PGConnectionObject<TObject extends PGObject<any>, TContext = any> = PGObject<
  {
    totalCount?: PGOutputField<number>
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
  },
  TContext
>

export interface PGOutputField<
  T extends PGFieldType | null,
  TArgs extends PGInputFieldMap | undefined = undefined,
  TContext = any,
> extends PGField<T> {
  value: PGFieldValue & {
    args?: TArgs
    resolve?: GraphQLFieldResolver<any, any>
    subscribe?: ResolverFn
    authChecker?: <CheckerTArgs extends TArgs>(x: {
      ctx: TContext
      args: TypeOfPGFieldMap<Exclude<CheckerTArgs, undefined>>
    }) => boolean | Promise<boolean>
  }
  nullable: () => PGOutputField<T | null, TArgs, TContext>
  list: () => PGOutputField<T extends null ? null : T[], TArgs, TContext>
  args: <SetTArgs extends PGInputFieldMap>(
    x: (f: InputFieldBuilder<TContext>) => SetTArgs,
  ) => PGOutputField<T, SetTArgs, TContext>
  resolve: (
    x: (
      params: ResolveParams<
        TypeOfPGField<PGField<T>>,
        any,
        TypeOfPGFieldMap<Exclude<TArgs, undefined>>,
        TContext
      >,
    ) => ResolveResponse<TypeOfPGField<PGField<T>>>,
  ) => PGOutputField<T, TArgs, TContext>
  subscribe: (
    x: (
      params: ResolveParams<
        TypeOfPGField<PGField<T>>,
        any,
        TypeOfPGFieldMap<Exclude<TArgs, undefined>>,
        TContext
      >,
    ) => {
      pubSubIter: AsyncIterator<any>
      filter?: () => boolean | Promise<boolean>
    },
  ) => PGOutputField<T, TArgs, TContext>
  auth: (
    // NOTE: 直接TArgsを使うと型エラーが発生するため、CheckTArgsを挟んでいる
    checker: <CheckerTArgs extends TArgs>(x: {
      ctx: TContext
      args: TypeOfPGFieldMap<Exclude<CheckerTArgs, undefined>>
    }) => boolean | Promise<boolean>,
  ) => PGOutputField<T, TArgs, TContext>
}

export interface PGOutputFieldMap {
  [name: string]: PGOutputField<any, PGInputFieldMap | undefined>
}

export type PGEditOutputFieldMap<TModel extends PGFieldMap> =
  | { [P in keyof TModel]?: PGOutputField<any, any> }
  | { [name: string]: PGOutputField<any, any> }

export interface OutputFieldBuilder<TContext> {
  id: () => PGOutputField<string, undefined, TContext>
  string: () => PGOutputField<string, undefined, TContext>
  boolean: () => PGOutputField<boolean, undefined, TContext>
  int: () => PGOutputField<number, undefined, TContext>
  bigInt: () => PGOutputField<bigint, undefined, TContext>
  float: () => PGOutputField<number, undefined, TContext>
  dateTime: () => PGOutputField<Date, undefined, TContext>
  json: () => PGOutputField<string, undefined, TContext>
  byte: () => PGOutputField<Buffer, undefined, TContext>
  decimal: () => PGOutputField<Decimal, undefined, TContext>
  object: <T extends Function>(type: T) => PGOutputField<T, undefined, TContext>
  enum: <T extends PGEnum<any>>(type: T) => PGOutputField<T, undefined, TContext>
}
