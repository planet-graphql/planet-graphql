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
  TypeOfPGFieldType,
} from './common'
import { InputFieldBuilder, PGInputField, PGInputFieldMap } from './input'

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

interface PGModel<TPrismaArgs extends PrismaFindManyArgsBase = PrismaFindManyArgsBase> {
  prismaArgs: TPrismaArgs
}

export interface PGObject<
  TFieldMap extends PGOutputFieldMap,
  TPGModel extends PGModel | undefined,
  TContext = any,
> {
  name: string
  fieldMap: TFieldMap
  kind: 'object'
  value: {
    prismaAuthBuilder?: PrismaAuthBuilder<
      TContext,
      Exclude<TPGModel, undefined>['prismaArgs']['where'],
      NamesOfPGFieldMap<TFieldMap>
    >
    isRelayConnection?: boolean
    prismaModel?: TPGModel
  }
  prismaAuth: (
    builder: PrismaAuthBuilder<
      TContext,
      Exclude<TPGModel, undefined>['prismaArgs']['where'],
      NamesOfPGFieldMap<TFieldMap>
    >,
  ) => PGObject<TFieldMap, TPGModel, TContext>
  checkPrismaPermission: CheckPrismaPermissionFn<
    TContext,
    PartialDeep<TypeOfPGFieldMap<TFieldMap>>
  >
  copy: (name: string) => this
  update: <SetTField extends PGEditOutputFieldMap<TFieldMap>>(
    editFieldMap: (f: TFieldMap, b: OutputFieldBuilder<TContext>) => SetTField,
  ) => PGObject<
    { [P in keyof SetTField]: Exclude<SetTField[P], undefined> },
    TPGModel,
    TContext
  >
  modify: <
    MTFieldMap extends {
      [P in keyof TFieldMap]: TFieldMap[P] extends PGOutputField<
        infer U,
        any,
        infer V,
        infer W,
        infer X,
        infer Y
      >
        ? PGOutputField<U, TypeOfPGFieldMap<TFieldMap>, V, W, X, Y>
        : never
    },
  >(
    fieldMap: (f: MTFieldMap) => MTFieldMap,
  ) => PGObject<MTFieldMap, TPGModel, TContext>
}

export interface PGOutputField<
  T extends PGFieldType | null,
  TSource = any,
  TPrismaArgs extends PGInputFieldMap | undefined = undefined,
  TArgs extends PGInputFieldMap | undefined = undefined,
  TContext = any,
  TPGModel extends PGModel | undefined = undefined,
> extends PGField<T> {
  value: PGFieldValue & {
    args?: TArgs
    resolve?: GraphQLFieldResolver<any, any>
    subscribe?: ResolverFn
    authChecker?: <CheckerTArgs extends TArgs>(x: {
      ctx: TContext
      args: TypeOfPGFieldMap<Exclude<CheckerTArgs, undefined>>
    }) => boolean | Promise<boolean>
    prismaFieldName: string
  }
  nullable: () => this extends PGRelayOutputField<any>
    ? PGRelayOutputField<T | null, TSource, TPrismaArgs, TArgs, TContext, TPGModel>
    : PGOutputField<T | null, TSource, TPrismaArgs, TArgs, TContext, TPGModel>
  list: () => PGOutputField<
    T extends null ? null : T[],
    TSource,
    TPrismaArgs,
    TArgs,
    TContext,
    TPGModel
  >
  args: <SetTArgs extends PGInputFieldMap>(
    x: (f: InputFieldBuilder<TContext>) => SetTArgs,
  ) => this extends PGRelayOutputField<any>
    ? PGRelayOutputField<T, TSource, TPrismaArgs, SetTArgs, TContext, TPGModel>
    : PGOutputField<T, TSource, TPrismaArgs, SetTArgs, TContext, TPGModel>
  relay: () => PGRelayOutputField<
    T extends Array<infer U>
      ? U extends () => any
        ? () => PGObject<PGRelayOutputFieldMap<U>, TPGModel>
        : never
      : T extends () => any
      ? () => PGObject<PGRelayOutputFieldMap<T>, TPGModel>
      : never,
    TSource,
    TPrismaArgs & {
      take: PGInputField<number, TContext>
      skip: PGInputField<number, TContext>
      cursor: PGInputField<Exclude<TPGModel, undefined>['prismaArgs']['cursor'], TContext>
      orderBy: PGInputField<
        Exclude<TPGModel, undefined>['prismaArgs']['orderby'],
        TContext
      >
    },
    TArgs,
    TContext,
    TPGModel
  >
  type: <SetT extends () => any>(
    type: SetT,
  ) => this extends PGRelayOutputField<any>
    ? PGRelayOutputField<SetT, TSource, undefined, undefined, TContext, TPGModel>
    : PGOutputField<SetT, TSource, undefined, undefined, TContext, TPGModel>
  prismaArgs: <SetTPrismaArgs extends PGInputFieldMap>(
    x: (b: InputFieldBuilder<TContext>) => SetTPrismaArgs,
  ) => this extends PGRelayOutputField<any>
    ? PGRelayOutputField<T, TSource, SetTPrismaArgs, TArgs, TContext, TPGModel>
    : PGOutputField<T, TSource, SetTPrismaArgs, TArgs, TContext, TPGModel>
  relayPrismaArgs: (
    x: (f: {
      first: PGInputField<number | null | undefined, TContext>
      after: PGInputField<string | null | undefined, TContext>
      last: PGInputField<number | null | undefined, TContext>
      before: PGInputField<string | null | undefined, TContext>
    }) => {
      first: PGInputField<number | null | undefined, TContext>
      after: PGInputField<string | null | undefined, TContext>
      last: PGInputField<number | null | undefined, TContext>
      before: PGInputField<string | null | undefined, TContext>
    },
  ) => this extends PGRelayOutputField<any>
    ? PGRelayOutputField<
        T,
        TSource,
        TPrismaArgs & {
          take: PGInputField<number, TContext>
          skip: PGInputField<number, TContext>
          cursor: PGInputField<
            Exclude<TPGModel, undefined>['prismaArgs']['cursor'],
            TContext
          >
          orderBy: PGInputField<
            Exclude<TPGModel, undefined>['prismaArgs']['orderby'],
            TContext
          >
        },
        TArgs,
        TContext,
        TPGModel
      >
    : PGOutputField<
        T,
        TSource,
        TPrismaArgs & {
          take: PGInputField<number, TContext>
          skip: PGInputField<number, TContext>
          cursor: PGInputField<
            Exclude<TPGModel, undefined>['prismaArgs']['cursor'],
            TContext
          >
          orderBy: PGInputField<
            Exclude<TPGModel, undefined>['prismaArgs']['orderby'],
            TContext
          >
        },
        TArgs,
        TContext,
        TPGModel
      >
  resolve: (
    x: (
      params: ResolveParams<
        TypeOfPGFieldType<T>,
        TSource,
        TypeOfPGFieldMap<Exclude<TArgs, undefined>>,
        TContext,
        <T>(defaultArgs: T) => TypeOfPGFieldMap<Exclude<TPrismaArgs, undefined>> & T
      >,
    ) => ResolveResponse<TypeOfPGField<PGField<T>>>,
  ) => this
  subscribe: (
    x: (
      params: ResolveParams<
        TypeOfPGFieldType<T>,
        TSource,
        TypeOfPGFieldMap<Exclude<TArgs, undefined>>,
        TContext,
        <T>(defaultArgs: T) => TypeOfPGFieldMap<Exclude<TPrismaArgs, undefined>> & T
      >,
    ) => {
      pubSubIter: AsyncIterator<any>
      filter?: () => boolean | Promise<boolean>
    },
  ) => this
  auth: (
    checker: <CheckerTArgs extends TArgs>(x: {
      ctx: TContext
      args: TypeOfPGFieldMap<Exclude<CheckerTArgs, undefined>>
    }) => boolean | Promise<boolean>,
  ) => this
}

export type PGRelayOutputFieldMap<T extends () => any> = {
  edges: PGOutputField<
    Array<
      () => PGObject<
        {
          cursor: PGOutputField<string>
          node: PGOutputField<T>
        },
        undefined
      >
    >
  >
  pageInfo: PGOutputField<
    () => PGObject<
      {
        hasNextPage: PGOutputField<boolean>
        hasPreviousPage: PGOutputField<boolean>
      },
      undefined
    >
  >
}

export interface PGRelayOutputField<
  T extends PGFieldType | null,
  TSource = any,
  TPrismaArgs extends PGInputFieldMap | undefined = undefined,
  TArgs extends PGInputFieldMap | undefined = undefined,
  TContext = any,
  TPGModel extends PGModel | undefined = undefined,
> extends PGOutputField<T, TSource, TPrismaArgs, TArgs, TContext, TPGModel> {
  totalCount: (
    x: (
      params: ResolveParams<
        number,
        TSource,
        never,
        TContext,
        <T>(defaultArgs: T) => TypeOfPGFieldMap<Exclude<TPrismaArgs, undefined>> & T
      >,
      nodeFindArgs: TypeOfPGFieldMap<Exclude<TPrismaArgs, undefined>>,
    ) => number,
  ) => PGRelayOutputField<
    T & { totalCount: PGOutputField<number> },
    TSource,
    TPrismaArgs,
    TArgs,
    TContext,
    TPGModel
  >
  cursor: (
    x: (
      node: TypeOfPGFieldType<T extends PGRelayOutputFieldMap<infer U> ? U : never>,
    ) => Exclude<TPGModel, undefined>['prismaArgs']['cursor'],
  ) => this
  orderBy: (orderByArgs: Exclude<TPGModel, undefined>['prismaArgs']['orderby']) => this
}

export interface PGOutputFieldMap {
  [name: string]: PGOutputField<any, any, any, any, any, any>
}

export type PGEditOutputFieldMap<TModel extends PGFieldMap> =
  | { [P in keyof TModel]?: PGOutputField<any, any, any, any, any, any> }
  | { [name: string]: PGOutputField<any, any, any, any, any, any> }

export interface OutputFieldBuilder<TContext> {
  id: () => PGOutputField<string, any, undefined, undefined, TContext>
  string: () => PGOutputField<string, any, undefined, undefined, TContext>
  boolean: () => PGOutputField<boolean, any, undefined, undefined, TContext>
  int: () => PGOutputField<number, any, undefined, undefined, TContext>
  bigInt: () => PGOutputField<bigint, any, undefined, undefined, TContext>
  float: () => PGOutputField<number, any, undefined, undefined, TContext>
  dateTime: () => PGOutputField<Date, any, undefined, undefined, TContext>
  json: () => PGOutputField<string, any, undefined, undefined, TContext>
  byte: () => PGOutputField<Buffer, any, undefined, undefined, TContext>
  decimal: () => PGOutputField<Decimal, any, undefined, undefined, TContext>
  object: <T extends Function>(
    type: T,
  ) => PGOutputField<T, any, undefined, undefined, TContext>
  enum: <T extends PGEnum<any>>(
    type: T,
  ) => PGOutputField<T, any, undefined, undefined, TContext>
}
