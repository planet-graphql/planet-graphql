import { GraphQLFieldResolver } from 'graphql'
import { ResolverFn } from 'graphql-subscriptions'
import { Simplify } from 'type-fest'
import { IsAny } from 'type-fest/source/set-return-type'
import { PGConfig, PGTypeConfig, PGTypes } from './builder'
import {
  ExcludeNullish,
  ExtractNullish,
  NeverWithNote,
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

export interface PGObject<
  T extends PGOutputFieldMap,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Types extends PGTypes = any,
> {
  name: string
  fieldMap: T
  kind: 'object'
  copy: (name: string) => this
  update: <SetT extends PGEditOutputFieldMap<T>>(
    callback: (f: T, b: PGOutputFieldBuilder<Types>) => SetT,
  ) => PGObject<{ [P in keyof SetT]: Exclude<SetT[P], undefined> }, Types>
  modify: (callback: (f: PGModifyOutputFieldMap<T>) => T) => this
}

export interface PGOutputField<
  T,
  TSource = any,
  TArgs extends PGInputFieldMap | undefined = any,
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
  nullable: CheckCallability<
    () => PGOutputField<T | null, TSource, TArgs, Types>,
    IsAny<TSource>
  >
  list: CheckCallability<
    () => ExcludeNullish<T> extends any[]
      ? this
      : PGOutputField<
          Array<ExcludeNullish<T>> | ExtractNullish<T>,
          TSource,
          TArgs,
          Types
        >,
    IsAny<TSource>
  >
  args: CheckCallability<
    <SetTArgs extends PGInputFieldMap>(
      b: (f: PGInputFieldBuilder<Types>) => SetTArgs,
    ) => PGOutputField<T, TSource, SetTArgs, Types>,
    IsAny<TSource>
  >
  resolve: (
    callback: (
      params: ResolveParams<
        TypeOfPGField<PGField<T>>,
        TSource,
        TypeOfPGFieldMap<Exclude<TArgs, undefined>>,
        Types['Context']
      >,
    ) => ResolveResponse<TypeOfPGField<PGField<T>>>,
  ) => this
  subscribe: (
    callback: (
      params: ResolveParams<
        TypeOfPGField<PGField<T>>,
        TSource,
        TypeOfPGFieldMap<Exclude<TArgs, undefined>>,
        Types['Context']
      >,
    ) => {
      pubSubIter: AsyncIterator<any>
      filter?: () => boolean | Promise<boolean>
    },
  ) => this
  auth: (
    checker: (x: {
      ctx: Types['Context']
      args: TypeOfPGFieldMap<Exclude<TArgs, undefined>>
    }) => boolean | Promise<boolean>,
  ) => this
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

export type CheckCallability<
  T,
  IsTypeChangeable extends boolean,
> = IsTypeChangeable extends true
  ? T
  : NeverWithNote<'Cannot call because it is not allowed to call a method that changes the PGObject type in the PGObject.modify() method'>

export type PGOutputFieldBuilder<Types extends PGTypes<PGTypeConfig, PGConfig>> =
  Simplify<
    {
      [P in keyof Types['ScalarMap'] as string extends P
        ? never
        : P]: () => PGOutputField<Types['ScalarMap'][P]['output'], any, undefined, Types>
    } & {
      object: <T extends Function>(type: T) => PGOutputField<T, any, undefined, Types>
      enum: <T extends PGEnum<any>>(type: T) => PGOutputField<T, any, undefined, Types>
    }
  >
