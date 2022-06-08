import { ResolverFn } from 'graphql-subscriptions'
import { Simplify } from 'type-fest'
import { IsAny, IsNever } from 'type-fest/source/set-return-type'
import { PGConfig, PGTypeConfig, PGTypes } from './builder'
import {
  ExcludeNullish,
  ExtractNullish,
  NeverWithNote,
  PGEnum,
  PGField,
  PGFieldMap,
  PGFieldValue,
  PGResolveParams,
  PGSubscribeParams,
  ResolveResponse,
  TypeOfPGField,
  TypeOfPGFieldMap,
} from './common'
import {
  PGInputField,
  PGInputFieldBuilder,
  PGInputFieldMap,
  PGRelayInputFieldMap,
} from './input'

export interface PGObject<
  T extends PGOutputFieldMap,
  TOptions extends PGObjectOptions<Types> = any,
  Types extends PGTypes = any,
> {
  name: string
  fieldMap: T
  kind: 'object'
  prismaModelName?: keyof ReturnType<Types['GeneratedType']>['models']
  copy: (name: string) => this
  update: <SetT extends PGEditOutputFieldMap<T>>(
    callback: (f: T, b: PGOutputFieldBuilder<Types>) => SetT,
  ) => PGObject<{ [P in keyof SetT]: Exclude<SetT[P], undefined> }, TOptions, Types>
  modify: (
    callback: (f: PGModifyOutputFieldMap<T>) => Partial<PGModifyOutputFieldMap<T>>,
  ) => this
  prismaModel: <
    TSetPrismaModelName extends keyof ReturnType<Types['GeneratedType']>['models'],
  >(
    name: TSetPrismaModelName,
  ) => PGObject<
    T,
    UpdatePGOptions<TOptions, 'PrismaModelName', TSetPrismaModelName>,
    Types
  >
}

export interface PGObjectOptions<Types extends PGTypes> {
  PrismaModelName: keyof ReturnType<Types['GeneratedType']>['models'] | undefined
}

export interface PGObjectOptionsDefault<Types extends PGTypes>
  extends PGObjectOptions<Types> {
  PrismaModelName: undefined
}

export interface PGOutputField<
  T,
  TSource = any,
  TOptions extends PGOuptutFieldOptions = any,
  Types extends PGTypes = any,
> extends PGField<T> {
  value: PGFieldValue & {
    args?: PGInputFieldMap
    resolve?: (
      params: PGResolveParams<
        TSource,
        TypeOfPGFieldMap<Exclude<TOptions['Args'], undefined>>,
        TypeOfPGFieldMap<Exclude<TOptions['PrismaArgs'], undefined>>,
        Types['Context'],
        TypeOfPGField<PGField<T>>
      >,
    ) => ResolveResponse<TypeOfPGField<PGField<T>>>
    subscribe?: ResolverFn
    authChecker?: (x: {
      ctx: Types['Context']
      args: TypeOfPGFieldMap<Exclude<TOptions['Args'], undefined>>
    }) => boolean | Promise<boolean>
    isPrismaRelation?: boolean
  }
  nullable: CheckCallability<
    () => PGOutputField<T | null, TSource, TOptions, Types>,
    IsAny<TSource>
  >
  list: CheckCallability<
    () => ExcludeNullish<T> extends any[]
      ? this
      : PGOutputField<
          Array<ExcludeNullish<T>> | ExtractNullish<T>,
          TSource,
          TOptions,
          Types
        >,
    IsAny<TSource>
  >
  args: CheckCallability<
    <TSetArgs extends PGInputFieldMap>(
      callback: (b: PGInputFieldBuilder<Types>) => TSetArgs,
    ) => PGOutputField<
      T,
      TSource,
      UpdatePGOptions<TOptions, 'Args', MergerArgs<TOptions['Args'], TSetArgs>>,
      Types
    >,
    IsAny<TSource>
  >
  prismaArgs: CheckCallability<
    <TSetPrismaArgs extends PGInputFieldMap>(
      callback: (b: PGInputFieldBuilder<Types>) => TSetPrismaArgs,
    ) => PGOutputField<
      T,
      TSource,
      UpdatePGOptions<
        TOptions,
        'PrismaArgs',
        MergerArgs<TOptions['PrismaArgs'], TSetPrismaArgs>
      >,
      Types
    >,
    IsAny<TSource>
  >
  prismaRelayArgs: CheckCallability<
    (
      callback: (f: PGRelayInputFieldMap<Types>) => PGRelayInputFieldMap<Types>,
    ) => PGOutputField<
      T,
      TSource,
      UpdatePGOptions<
        TOptions,
        'PrismaArgs',
        MergePrismaRelayArgs<TOptions['PrismaArgs'], GetPrismaModelName<T, Types>, Types>
      >,
      Types
    >,
    IsAny<TSource>
  >
  resolve: (
    callback: (
      params: PGResolveParams<
        TSource,
        TypeOfPGFieldMap<Exclude<TOptions['Args'], undefined>>,
        MergeDefaultPrismaArgs<
          TypeOfPGFieldMap<Exclude<TOptions['PrismaArgs'], undefined>>,
          GetPrismaModelName<T, Types>,
          Types
        >,
        Types['Context'],
        TypeOfPGField<PGField<T>>
      >,
    ) => ResolveResponse<TypeOfPGField<PGField<T>>>,
  ) => this
  subscribe: (
    callback: (
      params: PGSubscribeParams<
        TSource,
        TypeOfPGFieldMap<Exclude<TOptions['Args'], undefined>>,
        Types['Context'],
        TypeOfPGField<PGField<T>>
      >,
    ) => {
      pubSubIter: AsyncIterator<any>
      filter?: () => boolean | Promise<boolean>
    },
  ) => this
  auth: (
    checker: (x: {
      ctx: Types['Context']
      args: TypeOfPGFieldMap<Exclude<TOptions['Args'], undefined>>
    }) => boolean | Promise<boolean>,
  ) => this
}

export interface PGOuptutFieldOptions {
  Args: PGInputFieldMap | undefined
  PrismaArgs: PGInputFieldMap | undefined
}

export interface PGOutputFieldOptionsDefault {
  Args: undefined
  PrismaArgs: undefined
}

export interface PGOutputFieldMap {
  [name: string]: PGOutputField<any>
}

export type PGEditOutputFieldMap<TModel extends PGFieldMap> =
  | { [P in keyof TModel]?: PGOutputField<any> }
  | { [name: string]: PGOutputField<any> }

export type PGModifyOutputFieldMap<T extends PGOutputFieldMap> = {
  [P in keyof T]: T[P] extends PGOutputField<infer U, any, infer V, infer W>
    ? PGOutputField<U, TypeOfPGFieldMap<T>, V, W>
    : never
}

export type UpdatePGOptions<
  TCurrentOptions,
  TKeyName extends keyof TCurrentOptions,
  TSet,
> = { [P in keyof TCurrentOptions]: P extends TKeyName ? TSet : TCurrentOptions[P] }

export type GetPrismaModelName<T, Types extends PGTypes> = (
  ExcludeNullish<T> extends Array<infer U> ? U : ExcludeNullish<T>
) extends () => PGObject<any, infer U, Types>
  ? U['PrismaModelName']
  : undefined

export type MergerArgs<
  TArgs extends PGInputFieldMap | undefined,
  TSetArgs extends PGInputFieldMap,
> = TArgs extends PGInputFieldMap
  ? Simplify<{ [P in keyof TArgs]: TArgs[P] } & { [P in keyof TSetArgs]: TSetArgs[P] }>
  : TSetArgs

export type MergeDefaultPrismaArgs<
  T,
  TPrismaModelName extends keyof ReturnType<Types['GeneratedType']>['models'] | undefined,
  Types extends PGTypes,
> = GetPrismaArgType<TPrismaModelName, Types, 'include'> extends infer U
  ? U extends undefined
    ? T
    : IsNever<T> extends true
    ? { include: U }
    : Simplify<T & { include: U }>
  : never

export type MergePrismaRelayArgs<
  TPrismaArgs extends PGInputFieldMap | undefined,
  TPrismaModelName extends keyof ReturnType<Types['GeneratedType']>['models'] | undefined,
  Types extends PGTypes,
> = TPrismaArgs & {
  take: PGInputField<number, 'int', Types>
  skip: PGInputField<number, 'int', Types>
  cursor: PGInputField<
    GetPrismaArgType<TPrismaModelName, Types, 'cursor'>,
    'input',
    Types
  >
  orderBy: PGInputField<
    GetPrismaArgType<TPrismaModelName, Types, 'orderBy'>,
    'input',
    Types
  >
}

export type GetPrismaArgType<
  TPrismaModelName extends keyof ReturnType<Types['GeneratedType']>['models'] | undefined,
  Types extends PGTypes,
  TPrismaArgName extends keyof PrismaArgsBase,
> = TPrismaModelName extends keyof ReturnType<Types['GeneratedType']>['models']
  ? ReturnType<Types['GeneratedType']>['models'][TPrismaModelName][TPrismaArgName]
  : undefined

export type CheckCallability<
  T,
  IsTypeChangeable extends boolean,
> = IsTypeChangeable extends true
  ? T
  : NeverWithNote<'Cannot call because it is not allowed to call a method that changes the PGObject type in the PGObject.modify() method'>

export interface PrismaArgsBase {
  select: any
  include: any
  where: any
  orderBy: any | any[]
  cursor: any
  take: number
  skip: number
  distinct: any | any[]
}

export type PGOutputFieldBuilder<Types extends PGTypes<PGTypeConfig, PGConfig>> =
  Simplify<
    {
      [P in keyof Types['ScalarMap'] as string extends P
        ? never
        : P]: () => PGOutputField<
        Types['ScalarMap'][P]['output'],
        any,
        PGOutputFieldOptionsDefault,
        Types
      >
    } & {
      object: <T extends Function>(
        type: T,
      ) => PGOutputField<T, any, PGOutputFieldOptionsDefault, Types>
      relation: <T extends Function>(
        type: T,
      ) => PGOutputField<T, any, PGOutputFieldOptionsDefault, Types>
      enum: <T extends PGEnum<any>>(
        type: T,
      ) => PGOutputField<T, any, PGOutputFieldOptionsDefault, Types>
    }
  >
