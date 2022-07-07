import type { PGConfig, PGTypeConfig, PGTypes } from './builder'
import type {
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
  TypeOfPGFieldMap,
  TypeOfPGFieldType,
} from './common'
import type {
  PGInputField,
  PGInputFieldBuilder,
  PGInputFieldMap,
  PGRelayInputFieldMap,
} from './input'
import type { ResolverFn } from 'graphql-subscriptions'
import type { Simplify, UnionToIntersection } from 'type-fest'
import type { IsAny, IsNever } from 'type-fest/source/set-return-type'

export interface PGObject<
  T extends PGOutputFieldMap,
  TInterfaces extends Array<PGInterface<any>> | undefined = any,
  TOptions extends PGObjectOptions<Types> = any,
  Types extends PGTypes = any,
> {
  name: string
  kind: 'object'
  value: {
    fieldMap: T
    interfaces?: TInterfaces
    isTypeOf?: (value: any) => boolean
    prismaModelName?: keyof Types['Prisma']['Args']
  }
  copy: <
    TUpdate extends ConvertPGInterfacesToFieldMap<TInterfaces>,
    TOriginal extends T,
  >(config: {
    name: string
    fields: (f: TOriginal, b: PGOutputFieldBuilder<Types>) => TUpdate
  }) => PGObject<TUpdate, TInterfaces, TOptions, Types>
  modify: (
    callback: (f: PGModifyOutputFieldMap<T>) => Partial<PGModifyOutputFieldMap<T>>,
  ) => this
  prismaModel: <TSetPrismaModelName extends keyof Types['Prisma']['Args']>(
    name: TSetPrismaModelName,
  ) => PGObject<
    T,
    TInterfaces,
    UpdatePGOptions<TOptions, 'PrismaModelName', TSetPrismaModelName>,
    Types
  >
}

export interface PGObjectOptions<Types extends PGTypes> {
  PrismaModelName: keyof Types['Prisma']['Args'] | undefined
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
        TypeOfPGFieldType<T>
      >,
    ) => ResolveResponse<TypeOfPGFieldType<T>>
    subscribe?: ResolverFn
    authChecker?: (x: {
      ctx: Types['Context']
      args: TypeOfPGFieldMap<Exclude<TOptions['Args'], undefined>>
    }) => boolean | Promise<boolean>
    isPrismaRelation?: boolean
    relay?: {
      isRelay?: boolean
      totalCount?: (
        params: PGResolveParams<
          TSource,
          TypeOfPGFieldMap<Exclude<TOptions['Args'], undefined>>,
          TypeOfPGFieldMap<Exclude<TOptions['PrismaArgs'], undefined>>,
          Types['Context'],
          number
        >,
      ) => ResolveResponse<number>
      cursor?: (node: any) => object
      orderBy?: object | object[]
    }
  }
  nullable: MethodGuard<
    <IsNullable extends boolean = true>(
      isNullable?: IsNullable,
    ) => IsNullable extends false
      ? PGOutputField<Exclude<T, null>, TSource, TOptions, Types>
      : PGOutputField<T | null, TSource, TOptions, Types>,
    IsAny<TSource>,
    TypeChangeMethodNote
  >
  list: MethodGuard<
    () => ExcludeNullish<T> extends any[]
      ? this
      : PGOutputField<
          Array<ExcludeNullish<T>> | ExtractNullish<T>,
          TSource,
          TOptions,
          Types
        >,
    IsAny<TSource>,
    TypeChangeMethodNote
  >
  args: MethodGuard<
    <TSetArgs extends PGInputFieldMap>(
      callback: (b: PGInputFieldBuilder<Types>) => TSetArgs,
    ) => PGOutputField<
      T,
      TSource,
      UpdatePGOptions<TOptions, 'Args', MergerArgs<TOptions['Args'], TSetArgs>>,
      Types
    >,
    IsAny<TSource>,
    TypeChangeMethodNote
  >
  prismaArgs: MethodGuard<
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
    IsAny<TSource>,
    TypeChangeMethodNote
  >
  relay: MethodGuard<
    () => PGOutputField<
      Array<ExcludeNullish<T>> | ExtractNullish<T>,
      TSource,
      UpdatePGOptions<
        UpdatePGOptions<
          UpdatePGOptions<
            TOptions,
            'Args',
            MergerArgs<
              TOptions['Args'],
              {
                first: PGInputField<number | undefined, 'int', Types>
                after: PGInputField<string | undefined, 'string', Types>
                last: PGInputField<number | undefined, 'int', Types>
                before: PGInputField<string | undefined, 'string', Types>
              }
            >
          >,
          'PrismaArgs',
          MergePrismaRelayArgs<
            TOptions['PrismaArgs'],
            GetPrismaModelName<T, Types>,
            Types
          >
        >,
        'IsRelay',
        true
      >,
      Types
    >,
    TOptions['IsRelay'] extends false ? true : false,
    'Already called relay() method'
  >
  relayArgs: MethodGuard<
    (callback: (f: PGRelayInputFieldMap<Types>) => PGRelayInputFieldMap<Types>) => this,
    TOptions['IsRelay'],
    RelayMethodNote
  >
  relayTotalCount: MethodGuard<
    (
      callback: (
        params: PGResolveParams<
          TSource,
          TypeOfPGFieldMap<Exclude<TOptions['Args'], undefined>>,
          TypeOfPGFieldMap<Exclude<TOptions['PrismaArgs'], undefined>>,
          Types['Context'],
          number
        >,
      ) => ResolveResponse<number>,
    ) => this,
    TOptions['IsRelay'],
    RelayMethodNote
  >
  relayCursor: MethodGuard<
    (
      callcback: (
        node: TypeOfPGFieldType<T> extends Array<infer U> ? U : never,
      ) => GetPrismaArgType<GetPrismaModelName<T, Types>, Types, 'cursor'>,
    ) => this,
    TOptions['IsRelay'],
    RelayMethodNote
  >
  relayOrderBy: MethodGuard<
    (args: GetPrismaArgType<GetPrismaModelName<T, Types>, Types, 'orderBy'>) => this,
    TOptions['IsRelay'],
    RelayMethodNote
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
        TypeOfPGFieldType<T>
      >,
    ) => ResolveResponse<TypeOfPGFieldType<T>>,
  ) => this
  subscribe: (
    callback: (
      params: PGSubscribeParams<
        TSource,
        TypeOfPGFieldMap<Exclude<TOptions['Args'], undefined>>,
        Types['Context'],
        TypeOfPGFieldType<T>
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

export interface PGUnion<T extends Array<PGObject<any>>> {
  name: string
  kind: 'union'
  value: {
    types: T
    resolveType?: (value: any) => PGObject<any> | null
  }
}

export interface PGInterface<T extends PGOutputFieldMap> {
  name: string
  kind: 'interface'
  value: {
    fieldMap: T
  }
}

export interface PGOuptutFieldOptions {
  Args: PGInputFieldMap | undefined
  PrismaArgs: PGInputFieldMap | undefined
  IsRelay: boolean
}

export interface PGOutputFieldOptionsDefault {
  Args: undefined
  PrismaArgs: undefined
  IsRelay: false
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

export type ConvertPGInterfacesToFieldMap<T extends Array<PGInterface<any>> | undefined> =
  T extends Array<PGInterface<any>>
    ? UnionToIntersection<T[number]['value']['fieldMap']>
    : {}

export type UpdatePGOptions<
  TCurrentOptions,
  TKeyName extends keyof TCurrentOptions,
  TSet,
> = { [P in keyof TCurrentOptions]: P extends TKeyName ? TSet : TCurrentOptions[P] }

export type GetPrismaModelName<T, Types extends PGTypes> = (
  ExcludeNullish<T> extends Array<infer U> ? U : ExcludeNullish<T>
) extends () => PGObject<any, any, infer U, Types>
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
  TPrismaModelName extends keyof Types['Prisma']['Args'] | undefined,
  Types extends PGTypes,
> = GetPrismaArgType<TPrismaModelName, Types, 'include'> extends infer U
  ? U extends undefined
    ? T
    : IsNever<T> extends true
    ? { include: U | undefined }
    : Simplify<T & { include: U | undefined }>
  : never

export type MergePrismaRelayArgs<
  TPrismaArgs extends PGInputFieldMap | undefined,
  TPrismaModelName extends keyof Types['Prisma']['Args'] | undefined,
  Types extends PGTypes,
> = {
  take: PGInputField<number | undefined, 'int', Types>
  skip: PGInputField<number | undefined, 'int', Types>
  cursor: PGInputField<
    GetPrismaArgType<TPrismaModelName, Types, 'cursor'> | undefined,
    'input',
    Types
  >
  orderBy: PGInputField<
    GetPrismaArgType<TPrismaModelName, Types, 'orderBy'>,
    'input',
    Types
  > extends infer U
    ? TPrismaArgs extends undefined
      ? U
      : Simplify<TPrismaArgs & U>
    : never
}

export type GetPrismaArgType<
  TPrismaModelName extends keyof Types['Prisma']['Args'] | undefined,
  Types extends PGTypes,
  TPrismaArgName extends keyof PrismaArgsBase,
> = TPrismaModelName extends keyof Types['Prisma']['Args']
  ? Types['Prisma']['Args'][TPrismaModelName][TPrismaArgName]
  : undefined

export type MethodGuard<
  T,
  IsCallable extends boolean,
  TNote extends string,
> = IsCallable extends true ? T : NeverWithNote<TNote>

export type TypeChangeMethodNote =
  'Cannot call because it is not allowed to call a method that changes the PGObject type in the PGObject.modify() method'

export type RelayMethodNote = 'relay() method must be called in advance'

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
