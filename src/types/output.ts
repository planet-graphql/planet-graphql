import { GraphQLFieldResolver } from 'graphql'
import { ResolverFn } from 'graphql-subscriptions'
import { Simplify } from 'type-fest'
import { PGConfig, PGTypeConfig, PGTypes } from './builder'
import {
  ExcludeNullish,
  ExtractNullish,
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
  TFieldMap extends PGOutputFieldMap,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Types extends PGTypes = any,
> {
  name: string
  fieldMap: TFieldMap
  kind: 'object'
}

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
  list: () => ExcludeNullish<T> extends any[]
    ? this
    : PGOutputField<Array<ExcludeNullish<T>> | ExtractNullish<T>, TArgs, Types>
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
    checker: (x: {
      ctx: Types['Context']
      args: TypeOfPGFieldMap<Exclude<TArgs, undefined>>
    }) => boolean | Promise<boolean>,
  ) => this
}

export interface PGOutputFieldMap {
  [name: string]: PGOutputField<any, PGInputFieldMap | undefined, any>
}

export type PGEditOutputFieldMap<TModel extends PGFieldMap> =
  | { [P in keyof TModel]?: PGOutputField<any, any> }
  | { [name: string]: PGOutputField<any, any> }

export type PGOutputFieldBuilder<Types extends PGTypes<PGTypeConfig, PGConfig>> =
  Simplify<
    {
      [P in keyof Types['ScalarMap'] as string extends P
        ? never
        : P]: () => PGOutputField<Types['ScalarMap'][P]['output'], undefined, Types>
    } & {
      object: <T extends Function>(type: T) => PGOutputField<T, undefined, Types>
      enum: <T extends PGEnum<any>>(type: T) => PGOutputField<T, undefined, Types>
    }
  >
