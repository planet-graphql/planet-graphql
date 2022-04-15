import { AbilityBuilder, subject } from '@casl/ability'
import { accessibleBy, PrismaAbility } from '@casl/prisma'
import { Prisma } from '@prisma/client'
import { DMMF } from '@prisma/client/runtime'
import DataLoader from 'dataloader'
import {
  GraphQLArgumentConfig,
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLEnumValueConfigMap,
  GraphQLFieldConfig,
  GraphQLFieldConfigArgumentMap,
  GraphQLFieldConfigMap,
  GraphQLFieldResolver,
  GraphQLFloat,
  GraphQLInputFieldConfig,
  GraphQLInputFieldConfigMap,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql'
import { GraphQLBigInt, GraphQLDateTime, GraphQLJSON, GraphQLByte } from 'graphql-scalars'
import { ResolverFn, withFilter } from 'graphql-subscriptions'
import _ from 'lodash'
import { JsonValue, PartialDeep, ReadonlyDeep, RequireAtLeastOne } from 'type-fest'
import { IsAny } from 'type-fest/source/set-return-type'
import { z as Zod } from 'zod'
import {
  FieldsByTypeName,
  parseResolveInfo,
  ResolveTree,
} from './graphql-parse-resolve-info'
import { PGGraphQLDecimal } from './pg-decimal-scalar'
import { PGGraphQLID } from './pg-id-scalar'

export class PGError extends Error {
  constructor(message: string, public code: string, public detail?: any) {
    super(message)
    this.name = 'PGError'
    this.code = code
    this.detail = JSON.stringify(detail)
  }
}

// FIXME: 本来はPartialDeepでネストしたObjectもPartialにする必要がある
type ResolveResponse<
  T,
  Partialized = T extends Array<infer U> ? Array<Partial<U>> : Partial<T>,
> = Partialized | Promise<Partialized>

type PGScalar =
  | 'ID'
  | 'String'
  | 'Boolean'
  | 'Int'
  | 'BigInt'
  | 'Float'
  | 'DateTime'
  | 'Json'
  | 'Bytes'
  | 'Decimal'

type CreatePGFieldTypeArg = PGScalar | Function | PGEnum<any> | PGInput<any>

type PGFieldType =
  | string
  | boolean
  | number
  | bigint
  | Date
  | Buffer
  | Prisma.Decimal
  | PGEnum<any>
  | PGModelBase<any>
  | Function // NOTE: 実際は、() => PGModel<any>
  | PGFieldType[]

type TypeOfPGFieldType<
  T extends PGFieldType | null | undefined,
  // NOTE:
  // 3回で再帰を中断するようにCountを持つことで以下のエラーの発生を抑制している。
  // `Type instantiation is excessively deep and possibly infinite.ts(2589)`
  // なぜ効果があるのか詳細は不明。VSCodeの型補完の速度にも良い影響がある気がする。
  Count extends any[] = [],
> = Count['length'] extends 3
  ? never
  : T extends () => any
  ? TypeOfPGFieldType<ReturnType<T>, [...Count, 1]>
  : T extends any[]
  ? Array<TypeOfPGFieldType<T[0], [...Count, 1]>>
  : T extends PGEnum<any>
  ? TypeOfPGEnum<T>
  : T extends PGModelBase<any>
  ? T extends PGConnectionObject<infer U>
    ? Array<TypeOfPGModelBase<U>>
    : TypeOfPGModelBase<T>
  : T

export interface PGFieldValue {
  kind: string
  isRequired: boolean
  isList: boolean
  isId: boolean
  type: string | Function
  default?: any
}

export interface PGField<T extends PGFieldType | null | undefined> {
  value: PGFieldValue
  __type: T
}

export interface PGInputField<T extends PGFieldType | null | undefined, TContext = any>
  extends PGField<T> {
  value: PGFieldValue & {
    validatorBuilder?: (z: typeof Zod, context: TContext) => Zod.ZodTypeAny
  }
  nullable: () => PGInputField<T | null | undefined, TContext>
  list: () => PGInputField<T extends null | undefined ? null | undefined : T[], TContext>
  default: (
    value: T extends PGInput<any> | Function
      ? never
      : T extends Array<PGInput<any>> | Function[]
      ? []
      : Exclude<TypeOfPGFieldType<T>, undefined>,
  ) => PGInputField<T, TContext>
  validation: (
    validatorBuilder: (z: typeof Zod, context: TContext) => Zod.ZodTypeAny,
  ) => PGInputField<T, TContext>
}

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

type TypeOfPGField<T extends PGField<any>> = TypeOfPGFieldType<T['__type']>

export interface PGEnum<TFieldValues extends string[]> {
  name: string
  values: TFieldValues
  kind: 'enum'
}

type TypeOfPGEnum<T extends PGEnum<any>> = T['values'][number]

export interface PGFieldMap {
  [name: string]: PGField<any>
}

export interface PGInputFieldMap {
  [name: string]: PGInputField<any>
}

export interface PGOutputFieldMap {
  [name: string]: PGOutputField<any, PGInputFieldMap | undefined>
}

type TypeOfPGFieldMap<T extends PGFieldMap> = {
  [P in keyof T]: TypeOfPGField<T[P]>
}

export interface PGModelBase<TFieldMap extends PGFieldMap> {
  fieldMap: TFieldMap
}

export type TypeOfPGModelBase<T extends PGModelBase<any>> = TypeOfPGFieldMap<
  T['fieldMap']
>

export interface PGModel<TFieldMap extends PGFieldMap, TPrismaFindManyArgs = {}> {
  name: string
  fieldMap: TFieldMap
  kind: 'model'
  __type: {
    prismaFindManyArgs: TPrismaFindManyArgs
  }
}

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

interface PrismaFindManyArgsBase {
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

type PGConnectionObject<TObject extends PGObject<any>, TContext = any> = PGObject<
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

export interface PGInput<TFieldMap extends PGInputFieldMap, TContext = any> {
  name: string
  fieldMap: TFieldMap
  kind: 'input'
  value: {
    validatorBuilder?: (z: typeof Zod, context: TContext) => Zod.ZodTypeAny
  }
  validation: (
    validatorBuilder?: (z: typeof Zod, context: TContext) => Zod.ZodTypeAny,
  ) => PGInput<TFieldMap, TContext>
}

interface PGSchemaObject {
  name: string
  field: PGOutputField<any, PGInputFieldMap | undefined>
  kind: 'query' | 'mutation' | 'subscription'
}

export interface PGfyResponseType {
  models: Record<string, PGModel<any>>
  enums: Record<string, PGEnum<any>>
}

type IsObject<T> = T extends any[]
  ? false
  : T extends Date
  ? false
  : T extends Buffer
  ? false
  : T extends Prisma.Decimal
  ? false
  : T extends object
  ? true
  : false

type TypeToScalarName<T> = T extends string
  ? 'String'
  : T extends number
  ? 'Int' | 'Float'
  : T extends boolean
  ? 'Boolean'
  : T extends bigint
  ? 'BigInt'
  : T extends Date
  ? 'DateTime'
  : T extends Buffer
  ? 'Bytes'
  : T extends Prisma.Decimal
  ? 'Decimal'
  : never

type ScalarNameToType<T> = T extends 'String' | 'Json'
  ? string
  : T extends 'Int' | 'Float'
  ? number
  : T extends 'Boolean'
  ? boolean
  : T extends 'BigInt'
  ? bigint
  : T extends 'DateTime'
  ? Date
  : T extends 'Bytes'
  ? Buffer
  : T extends 'Decimal'
  ? Prisma.Decimal
  : never

export interface InputFieldBuilder<TContext> {
  id: () => PGInputField<string, TContext>
  string: () => PGInputField<string, TContext>
  boolean: () => PGInputField<boolean, TContext>
  int: () => PGInputField<number, TContext>
  bigInt: () => PGInputField<bigint, TContext>
  float: () => PGInputField<number, TContext>
  dateTime: () => PGInputField<Date, TContext>
  json: () => PGInputField<string, TContext>
  byte: () => PGInputField<Buffer, TContext>
  decimal: () => PGInputField<Prisma.Decimal, TContext>
  input: <T extends Function>(type: T) => PGInputField<T, TContext>
  enum: <T extends PGEnum<any>>(type: T) => PGInputField<T, TContext>
}

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
  decimal: () => PGOutputField<Prisma.Decimal, undefined, TContext>
  object: <T extends Function>(type: T) => PGOutputField<T, undefined, TContext>
  enum: <T extends PGEnum<any>>(type: T) => PGOutputField<T, undefined, TContext>
}

type PGEditOutputFieldMap<TModel extends PGFieldMap> =
  | { [P in keyof TModel]?: PGOutputField<any, any> }
  | { [name: string]: PGOutputField<any, any> }

type PGEditInputFieldMap<TModel extends PGFieldMap> =
  | { [P in keyof TModel]?: PGInputField<any> }
  | { [name: string]: PGInputField<any> }

export interface ResolveParams<TResolve, TSource, TArgs, TContext> {
  source: TSource
  args: TArgs
  context: TContext
  info: GraphQLResolveInfo
  __type: TResolve
}

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
  ) => PGSchemaObject
  mutation: <TOutput extends PGOutputField<any, any>>(
    name: string,
    field: (f: OutputFieldBuilder<TContext>) => TOutput,
  ) => PGSchemaObject
  subscription: <TOutput extends PGOutputField<any, any>>(
    name: string,
    fields: (f: OutputFieldBuilder<TContext>) => TOutput,
  ) => PGSchemaObject
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

// NOTE:
// 1. JsonValueを'Json'に変換するためにTがJsonValueを含むかどうか`JsonValue extends T`で判定する。
//   - 特別扱いするために一番最初に判定を行う必要がある。
//   - その上でJsonValue以外の型を含んでいるかどうかを`Exclude<T, JsonValue> extends never`で判定する。
//   - neverでなければJsonValue以外の型を含んでいるので`'Json' | PGSelectorType<Exclude<T, JsonValue>>`で再帰する
// 2. TがArrayかどうかを`T extends any[]`で判定する
// 3. TがObjectかどうかを`IsObject<T>`で判定する
//   - 真の場合は`RequireAtLeastOne`で囲うことで、1つ以上のプロパティの指定を必須にする
// 4. JsonValueでもなく、ArrayでもObjectでもない場合は、型に対応するScalarに変換する
export type PGSelectorType<T> = JsonValue extends T
  ? Exclude<T, JsonValue> extends never
    ? 'Json'
    : 'Json' | PGSelectorType<Exclude<T, JsonValue>>
  : T extends any[]
  ? [PGSelectorType<T[0]>]
  : IsObject<T> extends true
  ? RequireAtLeastOne<{
      [P in keyof T]: PGSelectorType<T[P]>
    }>
  : TypeToScalarName<T>

type InnerPGQueryArgsType<T> = T extends Array<infer U>
  ? U extends string
    ? PGInputField<Array<ScalarNameToType<U>> | null | undefined>
    : PGInputField<
        Array<PGInput<{ [P in keyof U]: InnerPGQueryArgsType<U[P]> }>> | null | undefined
      >
  : T extends string
  ? PGInputField<ScalarNameToType<T> | null | undefined>
  : PGInputField<
      PGInput<{ [P in keyof T]: InnerPGQueryArgsType<T[P]> }> | null | undefined
    >

type PGQueryArgsType<T> = IsObject<T> extends true
  ? {
      [P in keyof T]: InnerPGQueryArgsType<T[P]>
    }
  : InnerPGQueryArgsType<T>

export interface PGCache {
  model: { [name: string]: PGModel<PGFieldMap> }
  object: { [name: string]: PGObject<PGOutputFieldMap> }
  input: { [name: string]: PGInput<PGInputFieldMap> }
  enum: { [name: string]: PGEnum<string[]> }
  query: { [name: string]: PGSchemaObject }
  mutation: { [name: string]: PGSchemaObject }
  subscription: { [name: string]: PGSchemaObject }
}

interface ContextCache {
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

// 実装
function getCtxCache(context: any): ContextCache {
  if (!_.isPlainObject(context)) {
    throw new PGError('Context must be a plain object.', 'Error')
  }

  if (context.__cache === undefined) {
    const contextCache: ContextCache = {
      loader: {},
      auth: {},
      prismaAbility: {},
      rootResolveInfo: {
        raw: null,
        parsed: null,
      },
      prismaFindArgs: {},
    }
    context.__cache = contextCache
  }
  return context.__cache
}

function getLoaderKey(path: GraphQLResolveInfo['path'], key = ''): string {
  if (path.prev === undefined) return key.slice(0, -1)
  if (path.typename === undefined) return getLoaderKey(path.prev, key)
  key = `${path.typename}:${path.key}-${key}`
  return getLoaderKey(path.prev, key)
}

function setCache(
  cache: PGCache,
  value: PGModel<any> | PGObject<any> | PGInput<any> | PGEnum<any> | PGSchemaObject,
  overwrite = false,
): void {
  if (overwrite || cache[value.kind][value.name] === undefined) {
    cache[value.kind][value.name] = value
  }
}

export function getGraphQLScalar(type: string, isId: boolean): GraphQLScalarType {
  if (isId) return PGGraphQLID
  switch (type) {
    case 'String': {
      return GraphQLString
    }
    case 'Boolean': {
      return GraphQLBoolean
    }
    case 'Int': {
      return GraphQLInt
    }
    case 'BigInt': {
      return GraphQLBigInt
    }
    case 'Float': {
      return GraphQLFloat
    }
    case 'DateTime': {
      return GraphQLDateTime
    }
    case 'Json': {
      return GraphQLJSON
    }
    case 'Bytes': {
      return GraphQLByte
    }
    case 'Decimal': {
      return PGGraphQLDecimal
    }
    default: {
      throw new PGError('Unsupported type.', 'BuildError')
    }
  }
}

export const inputFieldBuilder: InputFieldBuilder<any> = {
  id: () => createInputField<string>('ID'),
  string: () => createInputField<string>('String'),
  boolean: () => createInputField<boolean>('Boolean'),
  int: () => createInputField<number>('Int'),
  bigInt: () => createInputField<bigint>('BigInt'),
  float: () => createInputField<number>('Float'),
  dateTime: () => createInputField<Date>('DateTime'),
  json: () => createInputField<string>('Json'),
  byte: () => createInputField<Buffer>('Bytes'),
  decimal: () => createInputField<Prisma.Decimal>('Decimal'),
  input: <T extends Function>(type: T) => createInputField<T>(type),
  enum: <T extends PGEnum<any>>(type: T) => createInputField<T>(type),
}

export const outputFieldBuilder: OutputFieldBuilder<any> = {
  id: () => createOutputField<string>('ID'),
  string: () => createOutputField<string>('String'),
  boolean: () => createOutputField<boolean>('Boolean'),
  int: () => createOutputField<number>('Int'),
  bigInt: () => createOutputField<bigint>('BigInt'),
  float: () => createOutputField<number>('Float'),
  dateTime: () => createOutputField<Date>('DateTime'),
  json: () => createOutputField<string>('Json'),
  byte: () => createOutputField<Buffer>('Bytes'),
  decimal: () => createOutputField<Prisma.Decimal>('Decimal'),
  object: <T extends Function>(type: T) => createOutputField<T>(type),
  enum: <T extends PGEnum<any>>(type: T) => createOutputField<T>(type),
}

export function getPGFieldKind(type: CreatePGFieldTypeArg): DMMF.FieldKind {
  if (typeof type === 'string') {
    return 'scalar'
  }
  if (typeof type === 'object') {
    return type.kind === 'enum' ? 'enum' : 'object'
  }
  if (typeof type === 'function') {
    return 'object'
  }
  throw new PGError('Unsupported type.', 'Error')
}

function createInputField<T extends PGFieldType>(
  type: CreatePGFieldTypeArg,
): PGInputField<T> {
  const field: PGInputField<any> = {
    value: {
      kind: getPGFieldKind(type),
      isRequired: true,
      isList: false,
      isId: type === 'ID',
      type:
        typeof type === 'string'
          ? type === 'ID'
            ? 'String'
            : type
          : typeof type === 'function'
          ? type
          : type.name,
    },
    list: () => {
      field.value.isList = true
      return field
    },
    nullable: () => {
      field.value.isRequired = false
      return field
    },
    default: (value: any) => {
      field.value.default = value
      return field
    },
    validation: (validator) => {
      field.value.validatorBuilder = validator
      return field
    },
    __type: undefined as any,
  }
  return field
}

function createOutputField<T extends PGFieldType | null>(
  type: CreatePGFieldTypeArg,
): PGOutputField<T> {
  const field: PGOutputField<any, any> = {
    value: {
      kind: getPGFieldKind(type),
      isRequired: true,
      isList: false,
      isId: type === 'ID',
      type:
        typeof type === 'string'
          ? type === 'ID'
            ? 'String'
            : type
          : typeof type === 'function'
          ? type
          : type.name,
    },
    list: () => {
      field.value.isList = true
      return field
    },
    nullable: () => {
      field.value.isRequired = false
      return field
    },
    args: (x) => {
      field.value.args = x(inputFieldBuilder)
      return field
    },
    resolve: (x) => {
      field.value.resolve = (source, args, context, info) =>
        x({ source, args, context, info, __type: undefined })
      return field
    },
    subscribe: (x) => {
      field.value.subscribe = withFilter(
        (source, args, context, info) => {
          const { pubSubIter } = x({ source, args, context, info, __type: undefined })
          return pubSubIter
        },
        (source, args, context, info) => {
          const { filter } = x({ source, args, context, info, __type: undefined })
          return filter !== undefined ? filter() : true
        },
      )
      return field
    },
    auth: (checker) => {
      field.value.authChecker = checker
      return field
    },
    __type: undefined as any,
  }
  return field
}

function getPrismaAbility(pgObject: PGObject<any>, ctx: any): PrismaAbility<any> | null {
  const abilityCache = getCtxCache(ctx)
  const cachedAbility = abilityCache.prismaAbility[pgObject.name]
  if (cachedAbility !== undefined) {
    return cachedAbility
  }
  if (pgObject.value.prismaAuthBuilder === undefined) {
    abilityCache.prismaAbility[pgObject.name] = null
    return null
  }

  const { can, cannot, build } = new AbilityBuilder(PrismaAbility)
  const allow = (action: string, conditionOrFields: any, condition?: any): void => {
    if (Array.isArray(conditionOrFields)) {
      can(action, pgObject.name as any, conditionOrFields, condition)
    } else {
      can(action, pgObject.name as any, conditionOrFields)
    }
  }
  const deny = (action: string, conditionOrFields: any, condition?: any): void => {
    if (Array.isArray(conditionOrFields)) {
      cannot(action, pgObject.name as any, conditionOrFields, condition)
    } else {
      cannot(action, pgObject.name as any, conditionOrFields)
    }
  }
  pgObject.value.prismaAuthBuilder({ ctx, allow, deny })
  const ability = build()
  abilityCache.prismaAbility[pgObject.name] = ability
  return ability
}

function createPGObject<TFieldMap extends PGOutputFieldMap>(
  name: string,
  fieldMap: TFieldMap,
): PGObject<TFieldMap> {
  const pgObject: PGObject<TFieldMap> = {
    name,
    fieldMap,
    value: {},
    kind: 'object',
    prismaAuth: (builder) => {
      pgObject.value.prismaAuthBuilder = builder
      return pgObject
    },
    checkPrismaPermission: (ctx, action, value, condition = value) => {
      const ability = getPrismaAbility(pgObject, ctx)
      if (ability === null)
        return {
          hasPermission: true,
          permittedValue: value,
        }
      const listedValue = (Array.isArray(value) ? value : [value]) as any[]
      const listedCondition = (
        Array.isArray(condition) ? condition : [condition]
      ) as any[]
      let hasPermission = true
      const permittedValue = listedValue.map((listedValueElement, index) => {
        return Object.entries(listedValueElement).reduce<{ [key: string]: any }>(
          (acc, [key, fieldValue]) => {
            if (!ability.can(action, subject(name, listedCondition[index]), key)) {
              if (!pgObject.fieldMap[key].value.isRequired) {
                hasPermission = false
                acc[key] = null
                return acc
              }
              if (pgObject.fieldMap[key].value.isList) {
                hasPermission = false
                acc[key] = []
                return acc
              }
              throw new PGError(
                `Prisma permission denied. Field: ${name}.${key}`,
                'PrismaAuthError',
              )
            }
            if (typeof pgObject.fieldMap[key].value.type === 'function') {
              const innerObject = pgObject.fieldMap[key].value.type as Function
              const innerObjectPermission = innerObject().checkPrismaPermission(
                ctx,
                action,
                listedValueElement[key],
                listedCondition[index][key],
              )
              if (innerObjectPermission.hasPermission === false) hasPermission = false
              acc[key] = innerObjectPermission.permittedValue
              return acc
            }
            acc[key] = fieldValue
            return acc
          },
          {},
        ) as Partial<TypeOfPGFieldMap<TFieldMap>>
      })
      return {
        hasPermission,
        permittedValue: (Array.isArray(value)
          ? permittedValue
          : permittedValue[0]) as any,
      }
    },
  }
  return pgObject
}

function getGraphQLEnumType(pgEnum: PGEnum<string[]>): GraphQLEnumType {
  return new GraphQLEnumType({
    name: pgEnum.name,
    values: pgEnum.values.reduce<GraphQLEnumValueConfigMap>((acc, x) => {
      acc[x] = { value: x }
      return acc
    }, {}),
  })
}

type GetGraphqlTypeRefFn = () => {
  enums: { [name: string]: GraphQLEnumType }
  objects: { [name: string]: GraphQLObjectType }
  inputs: { [name: string]: GraphQLInputObjectType }
}

function getGraphQLObjectType(
  cache: PGCache,
  pgObject: PGObject<PGOutputFieldMap>,
  typeRefFn: GetGraphqlTypeRefFn,
): GraphQLObjectType {
  return new GraphQLObjectType({
    name: pgObject.name,
    fields: () =>
      Object.entries(pgObject.fieldMap).reduce<GraphQLFieldConfigMap<any, any>>(
        (acc, [key, field]) => {
          acc[key] = getGraphQLFieldConfig(cache, field, typeRefFn)
          return acc
        },
        {},
      ),
  })
}

function getGraphQLInputObjectType(
  cache: PGCache,
  pgInput: PGInput<PGInputFieldMap>,
  typeRefFn: GetGraphqlTypeRefFn,
): GraphQLInputObjectType {
  return new GraphQLInputObjectType({
    name: pgInput.name,
    fields: () =>
      Object.entries(pgInput.fieldMap).reduce<GraphQLInputFieldConfigMap>(
        (acc, [key, field]) => {
          acc[key] = getGraphQLFieldConfigOnlyType(cache, field, typeRefFn)
          return acc
        },
        {},
      ),
  })
}

export async function argsValidationChecker(
  resolveArgs: [any, any, any, GraphQLResolveInfo],
  cache: PGCache,
): Promise<void> {
  type ValidateError = {
    path: string
    issues: Zod.ZodIssue[]
  }

  async function validateArgsCore(
    argsValue: {
      [str: string]: any
    },
    fieldMap: PGInputFieldMap,
    pathPrefix: string,
  ): Promise<ValidateError[]> {
    const errors = await Promise.all(
      Object.entries(argsValue).map(async ([fieldName, argValue]) => {
        const e: ValidateError[] = []
        const field = fieldMap[fieldName]

        // NOTE: fieldに直接設定されたvalidation
        const validator = field.value.validatorBuilder?.(Zod, ctx)
        const parsed = validator?.safeParse(argValue)
        if (parsed?.success === false) {
          e.push({
            path: `${pathPrefix}.${fieldName}`,
            issues: parsed.error.issues,
          })
        }

        // NOTE: fieldにPGInputが設定されている場合のvalidation
        // TODO: argValue === nullの場合のテストを追加する
        if (typeof field?.value.type === 'function' && argValue !== null) {
          const pgInput = field.value.type() as PGInput<any>

          // NOTE: PGInputに設定されているvalidation
          const validator = pgInput.value.validatorBuilder?.(Zod, ctx)
          const listedArgValue = Array.isArray(argValue) ? argValue : [argValue]
          for (const value of listedArgValue) {
            const parsed = await validator?.safeParseAsync(value)

            if (parsed?.success === false) {
              e.push({
                path: `${pathPrefix}.${fieldName}`,
                issues: parsed.error.issues,
              })
            }

            // NOTE: PGInputの各Fieldに設定されているvalidation
            e.push(
              ...(await validateArgsCore(
                value,
                pgInput.fieldMap,
                `${pathPrefix}.${fieldName}`,
              )),
            )
          }
        }
        return e
      }),
    )
    return errors.flat()
  }

  async function validateArgs(
    rt: ResolveTree,
    fieldMap: PGInputFieldMap,
    pathPrefix: string,
  ): Promise<ValidateError[]> {
    const rootErrors = await validateArgsCore(rt.args, fieldMap, pathPrefix)
    const objectName = Object.keys(rt.fieldsByTypeName)[0]
    if (objectName === undefined) {
      return [...rootErrors]
    }
    const pgObject = cache.object[objectName]
    const innerErrors = await Promise.all(
      Object.entries(rt.fieldsByTypeName[objectName]).map(async ([fieldName, t]) => {
        return await validateArgs(
          t,
          pgObject.fieldMap[fieldName].value.args ?? {},
          `${pathPrefix}.${fieldName}`,
        )
      }),
    )
    return [...rootErrors, ...innerErrors.flat()]
  }

  const ctx = resolveArgs[2]
  const info = resolveArgs[3]
  const tree = parseResolveInfo(info) as ResolveTree
  const queryType = info.parentType.name.toLowerCase() as
    | 'query'
    | 'mutation'
    | 'subscription'
  const resolver = cache[queryType][info.fieldName]

  const errors = await validateArgs(tree, resolver.field.value.args ?? {}, tree.name)
  if (errors.length > 0) {
    throw new PGError('Invalid args.', 'ValidationError', errors)
  }
}

export async function accessControlWrapper(
  resolveArgs: [any, any, any, GraphQLResolveInfo],
  cache: PGCache,
  resolve: GraphQLFieldResolver<any, any>,
): Promise<any> {
  function getAuthCacheKey(info: GraphQLResolveInfo): string {
    return `${info.parentType.name}:${info.fieldName}`
  }

  function getUnAuthReturnValue(info: GraphQLResolveInfo): null | [] {
    const x = info.returnType.toString()
    const isNullable = !x.endsWith('!')
    if (isNullable) {
      return null
    }
    const isList = x.startsWith('[')
    if (isList) {
      return []
    }
    throw new PGError(
      `GraphQL permission denied. Field: ${parentTypeName}.${info.fieldName}`,
      'AuthError',
    )
  }

  const args = resolveArgs[1]
  const ctx = resolveArgs[2]
  const info = resolveArgs[3]
  const ctxCache = getCtxCache(ctx)
  const authCacheKey = getAuthCacheKey(info)
  const authCache = ctxCache.auth[authCacheKey]
  if (authCache !== undefined) {
    return authCache.hasAuth ? resolve(...resolveArgs) : authCache.unAuthReturnValue
  }

  const parentTypeName = info.parentType.name
  const field =
    parentTypeName === 'Query' ||
    parentTypeName === 'Mutation' ||
    parentTypeName === 'Subscription'
      ? cache[parentTypeName.toLowerCase() as 'query' | 'mutation' | 'subscription'][
          info.fieldName
        ].field
      : cache.object[parentTypeName].fieldMap[info.fieldName]
  const hasAuth =
    field.value.authChecker === undefined ||
    (await field.value.authChecker({ ctx, args }))
  const unAuthReturnValue = hasAuth ? null : getUnAuthReturnValue(info)

  ctxCache.auth[authCacheKey] = {
    hasAuth,
    unAuthReturnValue,
  }
  return hasAuth ? resolve(...resolveArgs) : unAuthReturnValue
}

const defaultResolver: GraphQLFieldResolver<any, any> = (source, args, context, info) => {
  return source[info.fieldName]
}

function getInputFieldDefaultValue(field: PGField<any>): any {
  if (!('default' in field)) return undefined
  if (field.value.default !== undefined) return field.value.default
  if (field.value.kind !== 'object') return undefined
  const pgInput = (field.value.type as Function)()
  const defaultValue = Object.entries(pgInput.fieldMap).reduce<{ [name: string]: any }>(
    (acc, [key, field]) => {
      acc[key] = getInputFieldDefaultValue(field as PGInputField<any, any>)
      return acc
    },
    {},
  )
  return Object.values(defaultValue).every((x) => x === undefined)
    ? undefined
    : defaultValue
}

function getGraphQLFieldConfigOnlyType<
  T extends PGOutputField<any, any> | PGInputField<any>,
>(
  cache: PGCache,
  field: T,
  typeRefFn: GetGraphqlTypeRefFn,
): T extends PGInputField<any>
  ? GraphQLInputFieldConfig | GraphQLArgumentConfig
  : GraphQLFieldConfig<any, any> {
  const { enums, objects, inputs } = typeRefFn()
  let type
  switch (field.value.kind) {
    case 'enum': {
      if (typeof field.value.type === 'function') {
        throw new TypeError('Unexpected type with enum.')
      }
      type = enums[field.value.type]
      break
    }
    case 'scalar': {
      if (typeof field.value.type === 'function') {
        throw new TypeError('Unexpected type with scalar.')
      }
      type = getGraphQLScalar(field.value.type, field.value.isId)
      break
    }
    case 'object': {
      if (typeof field.value.type === 'string') {
        throw new TypeError('Unexpected type with object.')
      }
      const pgInputOrPgOutput = field.value.type()
      if ('default' in field) {
        // NOTE:
        // ?? でundefinedを考慮しているのは、`field.value.type()`を実行して
        // 初めて作成されるPGObject/PGInputを考慮している。具体的には以下のようなパターン
        // ```ts
        // pg.mutation('createUser', (f) =>
        //   f
        //     .object(() => user)
        //     .args(f) => ({
        //       input: f.input(() =>
        //         pg.input('CreateUserInput', (f) => (f) => ({
        //           name: f.string(),
        //         })),
        //       ),
        //     }))
        //     ...
        // )
        // ```
        if (inputs[pgInputOrPgOutput.name] !== undefined) {
          type = inputs[pgInputOrPgOutput.name]
        } else {
          type = getGraphQLInputObjectType(cache, pgInputOrPgOutput, typeRefFn)
          inputs[pgInputOrPgOutput.name] = type
        }
      } else {
        if (objects[pgInputOrPgOutput.name] !== undefined) {
          type = objects[pgInputOrPgOutput.name]
        } else {
          type = getGraphQLObjectType(cache, pgInputOrPgOutput, typeRefFn)
          objects[field.value.type().name] = type
        }
      }
      break
    }
    default: {
      throw new PGError('Unexpected kind.', 'BuildError')
    }
  }
  if (field.value.isRequired) {
    type = new GraphQLNonNull(type)
  }
  if (field.value.isList) {
    type = field.value.isRequired
      ? new GraphQLNonNull(new GraphQLList(type))
      : new GraphQLList(type)
  }
  return { type, defaultValue: getInputFieldDefaultValue(field) } as any
}

function getGraphQLFieldConfig(
  cache: PGCache,
  field: PGOutputField<any, PGInputFieldMap | undefined>,
  typeRefFn: GetGraphqlTypeRefFn,
): GraphQLFieldConfig<any, any> {
  const fieldConfig: GraphQLFieldConfig<any, any> = getGraphQLFieldConfigOnlyType(
    cache,
    field,
    typeRefFn,
  )
  fieldConfig.args = Object.entries(
    field.value.args ?? {},
  ).reduce<GraphQLFieldConfigArgumentMap>((argsAcc, [argsKey, argsValue]) => {
    argsAcc[argsKey] = getGraphQLFieldConfigOnlyType(cache, argsValue, typeRefFn)
    return argsAcc
  }, {})
  fieldConfig.resolve = async (...params) => {
    if (
      params[3].parentType.name === 'Query' ||
      params[3].parentType.name === 'Mutation' ||
      params[3].parentType.name === 'Subscription'
    ) {
      await argsValidationChecker(params, cache)
      const ctxCache = getCtxCache(params[2])
      ctxCache.rootResolveInfo = {
        raw: params[3],
        parsed: parseResolveInfo(params[3]) as ResolveTree,
      }
    }
    return await accessControlWrapper(
      params,
      cache,
      field.value.resolve ?? defaultResolver,
    )
  }
  fieldConfig.subscribe = field.value.subscribe
  return fieldConfig
}

export function getPGBuilder<TContext>(): PGBuilder<TContext> {
  const cache: PGCache = {
    model: {},
    object: {},
    input: {},
    enum: {},
    query: {},
    mutation: {},
    subscription: {},
  }

  const builder: PGBuilder<TContext> = {
    object: (name, fieldMap) => {
      if (cache.object[name] !== undefined) return cache.object[name] as PGObject<any>
      const pgObject = createPGObject(name, fieldMap(outputFieldBuilder))
      setCache(cache, pgObject)
      return pgObject
    },
    objectFromModel: (model, fields) => {
      const pgFieldMap = fields(
        cache.object[model.name].fieldMap as any,
        outputFieldBuilder,
      )
      const pgObject = createPGObject(model.name, pgFieldMap as any)
      setCache(cache, pgObject, true)
      return pgObject
    },
    enum: (name, ...values) => {
      if (cache.enum[name] !== undefined) return cache.enum[name] as PGEnum<any>
      const pgEnum = {
        name,
        values,
        kind: 'enum' as const,
      }
      setCache(cache, pgEnum)
      return pgEnum
    },
    input: (name, fieldMap) => {
      if (cache.input[name] !== undefined) return cache.input[name] as PGInput<any>
      const pgInput: PGInput<any> = {
        name,
        fieldMap: fieldMap(inputFieldBuilder),
        value: {},
        kind: 'input' as const,
        validation: (builder) => {
          pgInput.value.validatorBuilder = builder
          return pgInput
        },
      }
      setCache(cache, pgInput)
      return pgInput
    },
    inputFromModel: (name, model, fields) => {
      if (cache.input[name] !== undefined) return cache.input[name]
      const inputPGFieldMap = Object.entries(model.fieldMap).reduce<PGInputFieldMap>(
        (acc, [key, value]) => {
          const field: PGInputField<any> = {
            ...value,
            nullable: () => {
              field.value.isRequired = false
              return field
            },
            list: () => {
              field.value.isList = true
              return field
            },
            default: (value: any) => {
              field.value.default = value
              return field
            },
            validation: (validator) => {
              field.value.validatorBuilder = validator
              return field
            },
          }
          acc[key] = field
          return acc
        },
        {},
      )

      const pgFieldMap = fields(inputPGFieldMap as any, inputFieldBuilder)
      const pgInput: PGInput<any> = {
        name,
        fieldMap: pgFieldMap,
        value: {},
        kind: 'input' as const,
        validation: (builder) => {
          pgInput.value.validatorBuilder = builder
          return pgInput
        },
      }
      setCache(cache, pgInput)
      return pgInput
    },
    resolver: (object, resolverMap) => {
      const outputFieldMap = Object.entries(resolverMap).reduce<PGOutputFieldMap>(
        (acc, [key, value]) => {
          const fieldValue: PGOutputField<any, any>['value'] = {
            ...object.fieldMap[key].value,
            resolve: (source, args, context, info) =>
              value({ source, args, context, info }),
          }
          acc[key] = {
            ...object.fieldMap[key],
            value: fieldValue,
          }
          return acc
        },
        {},
      )
      const pgObject = createPGObject(object.name, {
        ...object.fieldMap,
        ...outputFieldMap,
      })
      setCache(cache, pgObject, true)
      return pgObject
    },
    query: (name, field) => {
      if (cache.query[name] !== undefined) return cache.query[name]
      const pgField = field(outputFieldBuilder)
      const resolver: PGSchemaObject = {
        name,
        field: pgField,
        kind: 'query',
      }
      setCache(cache, resolver)
      return resolver
    },
    mutation: (name, field) => {
      if (cache.mutation[name] !== undefined) return cache.mutation[name]
      const pgField = field(outputFieldBuilder)
      const resolver: PGSchemaObject = {
        name,
        field: pgField,
        kind: 'mutation',
      }
      setCache(cache, resolver)
      return resolver
    },
    subscription: (name, field) => {
      if (cache.subscription[name] !== undefined) return cache.subscription[name]
      const pgField = field(outputFieldBuilder)
      const subscriber: PGSchemaObject = {
        name,
        field: pgField,
        kind: 'subscription',
      }
      setCache(cache, subscriber)
      return subscriber
    },
    build: () => {
      const typeRefFn: GetGraphqlTypeRefFn = () => ({
        enums,
        objects,
        inputs,
      })
      const enums = Object.entries(cache.enum).reduce<{
        [name: string]: GraphQLEnumType
      }>((acc, [key, value]) => {
        acc[key] = getGraphQLEnumType(value)
        return acc
      }, {})
      const objects = Object.entries(cache.object).reduce<{
        [name: string]: GraphQLObjectType
      }>((acc, [key, value]) => {
        acc[key] = getGraphQLObjectType(cache, value, typeRefFn)
        return acc
      }, {})
      const inputs = Object.entries(cache.input).reduce<{
        [name: string]: GraphQLInputObjectType
      }>((acc, [key, value]) => {
        acc[key] = getGraphQLInputObjectType(cache, value, typeRefFn)
        return acc
      }, {})
      const query = new GraphQLObjectType({
        name: 'Query',
        fields: Object.entries(cache.query).reduce<GraphQLFieldConfigMap<any, any>>(
          (acc, [key, value]) => {
            acc[key] = getGraphQLFieldConfig(cache, value.field, typeRefFn)
            return acc
          },
          {},
        ),
      })
      const mutation =
        Object.keys(cache.mutation).length > 0
          ? new GraphQLObjectType({
              name: 'Mutation',
              fields: Object.entries(cache.mutation).reduce<
                GraphQLFieldConfigMap<any, any>
              >((acc, [key, value]) => {
                acc[key] = getGraphQLFieldConfig(cache, value.field, typeRefFn)
                return acc
              }, {}),
            })
          : undefined
      const subscription =
        Object.keys(cache.subscription).length > 0
          ? new GraphQLObjectType({
              name: 'Subscription',
              fields: Object.entries(cache.subscription).reduce<
                GraphQLFieldConfigMap<any, any>
              >((acc, [key, value]) => {
                acc[key] = getGraphQLFieldConfig(cache, value.field, typeRefFn)
                return acc
              }, {}),
            })
          : undefined
      return new GraphQLSchema({
        query: query,
        mutation: mutation,
        subscription: subscription,
      })
    },
    pgfy: <T extends PGfyResponseType = PGfyResponseType>(datamodel: DMMF.Datamodel) => {
      function convertToPGObject(
        model: DMMF.Model,
        enums: { [name: string]: PGEnum<any> },
        objectRef: { [name: string]: PGObject<any> },
      ): PGObject<any> {
        const fieldMap = model.fields.reduce<PGOutputFieldMap>((acc, x) => {
          let type: CreatePGFieldTypeArg
          switch (x.kind) {
            case 'scalar':
              type = x.isId ? 'ID' : (x.type as PGScalar)
              break
            case 'enum':
              type = enums[x.type]
              break
            case 'object':
              type = () => objectRef[x.type]
              break
            default:
              throw new PGError(`Unexpected kind '${x.kind}''.`, 'Error')
          }
          let field = createOutputField<any>(type)
          if (x.isList) {
            field = field.list()
          }
          if (!x.isRequired) {
            field = field.nullable()
          }
          acc[x.name] = field
          return acc
        }, {})
        return createPGObject(model.name, fieldMap)
      }
      const objectRef: { [name: string]: PGObject<any> } = {}
      const enums = datamodel.enums.reduce<PGfyResponseType['enums']>((acc, x) => {
        const pgEnum = builder.enum(x.name, ...x.values.map((v) => v.name))
        acc[x.name] = pgEnum
        return acc
      }, {})
      const models = datamodel.models.reduce<PGfyResponseType['models']>((acc, x) => {
        const pgObject = convertToPGObject(x, enums, objectRef)
        setCache(cache, pgObject)
        objectRef[x.name] = pgObject
        const pgModel: PGModel<any> = {
          ...pgObject,
          kind: 'model',
          __type: undefined as any,
        }
        setCache(cache, pgModel)
        acc[x.name] = pgModel
        return acc
      }, {})
      const resp: PGfyResponseType = {
        enums,
        models,
      }
      return resp as T
    },
    queryArgsBuilder: (inputNamePrefix) => (selector) => {
      function createInputFieldMap(prefix: string, s: any): PGInputFieldMap {
        const inputFieldMap = Object.entries(s).reduce<PGInputFieldMap>(
          (acc, [key, value]) => {
            const deArrayValue = Array.isArray(value) ? value[0] : value
            if (typeof deArrayValue === 'string') {
              acc[key] = createInputField<any>(deArrayValue as PGScalar).nullable()
            } else {
              const p = `${prefix}${_.upperFirst(key)}`
              const pgInput: PGInput<any> = {
                name: `${p}Input`,
                fieldMap: createInputFieldMap(p, deArrayValue),
                value: {},
                kind: 'input',
                validation: (builder) => {
                  pgInput.value.validatorBuilder = builder
                  return pgInput
                },
              }
              setCache(cache, pgInput)
              acc[key] = createInputField<any>(() => pgInput).nullable()
            }
            if (Array.isArray(value)) acc[key] = acc[key].list()
            return acc
          },
          {},
        )
        return inputFieldMap
      }
      const result: any = createInputFieldMap(inputNamePrefix, selector)
      return result
    },
    prismaFindArgs: <T>(
      root: PGObject<any>,
      params: ResolveParams<any, any, any, any>,
      defaultArgs: T,
    ) => {
      function getPrismaAuthWhere(pgObject: PGObject<any>, ctx: any): object | null {
        const ability = getPrismaAbility(pgObject, ctx)
        if (ability === null) {
          return null
        }
        return (accessibleBy(ability) as any)[pgObject.name]
      }

      function createArgs(
        rootObject: PGObject<any>,
        fieldsByTypeName: FieldsByTypeName,
        args: ResolveTree['args'],
        dArgs: object | undefined,
        loc: ResolveTree['loc'],
      ): Record<string, any> | true | undefined {
        const returnType = Object.keys(fieldsByTypeName)[0]

        if (rootObject.value.isRelayConnection === true) {
          const edges = fieldsByTypeName[returnType].edges.fieldsByTypeName
          const nodeTree = edges[Object.keys(edges)[0]].node
          const created = createArgs(
            rootObject.fieldMap.edges.value.type().fieldMap.node.value.type(),
            nodeTree.fieldsByTypeName,
            args,
            dArgs,
            nodeTree.loc,
          )
          const ctxCache = getCtxCache(params.context)
          ctxCache.prismaFindArgs[`${loc.start}:${loc.end}`] = created
          return created
        }
        const rootModel = cache.model[rootObject.name]
        const targetArgsName = [
          'select',
          'include',
          'where',
          'orderBy',
          'cursor',
          'take',
          'skip',
          'distinct',
          'first',
          'after',
          'last',
          'before',
        ]
        const pickedArgs = _.pick(args, targetArgsName)
        const mergedArgs = _.mergeWith(
          {},
          _.omit(dArgs, 'include'),
          pickedArgs,
          (defaultValue, value) => {
            if (Array.isArray(defaultValue)) return value
          },
        )
        const { include, where, first, after, last, before, ...rest } = mergedArgs

        if (returnType !== rootModel.name) {
          throw new PGError(
            `A mismatch of type. RootType: ${rootModel.name}, TypeInResolverInfo: ${returnType}`,
            'Error',
          )
        }

        if ((first !== undefined || last !== undefined) && rest.orderBy === undefined) {
          throw new PGError('Cannot paginate without `orderBy`', 'Error')
        }

        const properties = fieldsByTypeName[returnType]
        const includeFromTree = Object.entries(properties).reduce<Record<string, any>>(
          (acc, [key, value]) => {
            const modelField: PGField<any> | undefined = rootModel.fieldMap[key]
            if (modelField !== undefined && modelField.value.kind === 'object') {
              const objectField = rootObject.fieldMap[key]
              const rootName: string =
                typeof objectField.value.type === 'function'
                  ? objectField.value.type().name
                  : objectField.value.type
              acc[key] = createArgs(
                cache.object[rootName],
                value.fieldsByTypeName,
                value.args,
                (dArgs as any)?.include?.[key],
                value.loc,
              )
            }
            return acc
          },
          {},
        )
        const whereList = [where, getPrismaAuthWhere(rootObject, params.context)].filter(
          (x) => !_.isEmpty(x),
        )
        const includeArgs = _.merge(include, includeFromTree)
        const whereArgs = whereList.length > 1 ? { AND: whereList } : whereList[0]

        const resp = _.omitBy(
          {
            ...rest,
            include: _.isEmpty(includeArgs) ? undefined : includeArgs,
            where: whereArgs,
          },
          _.isNil,
        )
        if (first !== undefined) {
          resp.take = Number(first) + 1
          if (after !== undefined) {
            resp.cursor = JSON.parse(Buffer.from(after as string, 'base64').toString())
            resp.skip = 1
          }
        }
        if (last !== undefined) {
          const switchOrderBy: any = (orderBy: any) => {
            if (Array.isArray(orderBy)) return orderBy.map((x) => switchOrderBy(x))
            if (typeof orderBy === 'object')
              return Object.entries(orderBy).reduce<{ [name: string]: any }>(
                (acc, [key, value]) => {
                  acc[key] = switchOrderBy(value)
                  return acc
                },
                {},
              )
            return orderBy === 'asc' ? 'desc' : 'asc'
          }
          resp.orderBy = switchOrderBy(resp.orderBy)
          resp.take = Number(last) + 1
          if (before !== undefined) {
            resp.cursor = JSON.parse(Buffer.from(before as string, 'base64').toString())
            resp.skip = 1
          }
        }
        return _.isEmpty(resp) ? true : resp
      }

      const tree = parseResolveInfo(params.info) as ResolveTree
      return createArgs(
        root,
        tree.fieldsByTypeName,
        tree.args,
        defaultArgs as any,
        tree.loc,
      ) as any
    },
    dataloader: async (params, batchLoadFn) => {
      const loaderCache = getCtxCache(params.context)
      const loaderKey = getLoaderKey(params.info.path)
      let loader = loaderCache.loader[loaderKey]
      if (loader === undefined) {
        loader = new DataLoader<
          typeof params['source'],
          Partial<typeof params['__type']>
        >(async (sourceList) => await batchLoadFn(sourceList))
        loaderCache.loader[loaderKey] = loader
      }
      return await loader.load(params.source)
    },
    relayConnection: (pgObject, options) => {
      function getDefaultCursor(fieldMap: PGOutputFieldMap): (node: any) => any {
        const idFieldEntry = Object.entries(fieldMap).find(
          ([_name, field]) => field.value.isId,
        )
        if (idFieldEntry === undefined) {
          throw new PGError('ID field does not exists.', 'Error')
        }
        const idFieldName = idFieldEntry[0]
        return (node) => ({ [idFieldName]: node[idFieldName] })
      }

      function encodeCursor(cursorObject: any): string {
        return Buffer.from(JSON.stringify(cursorObject)).toString('base64')
      }

      function getParentTree(
        loc: ResolveTree['loc'],
        rootTree: ResolveTree,
      ): ResolveTree | null {
        function findParentSelection(
          loc: ResolveTree['loc'],
          parent: ResolveTree | null,
          childrens: FieldsByTypeName,
        ): ResolveTree | null {
          const objectName = Object.keys(childrens)[0]
          for (const tree of Object.values(childrens[objectName])) {
            if (tree.loc.start === loc.start && tree.loc.end === loc.end) {
              return parent
            }
            const innerObjectName = Object.keys(tree.fieldsByTypeName)?.[0]
            if (innerObjectName !== undefined) {
              const found = findParentSelection(loc, tree, tree.fieldsByTypeName)
              if (found !== null) {
                return found
              }
            }
          }
          return null
        }
        return findParentSelection(loc, rootTree, rootTree.fieldsByTypeName)
      }

      function getParentFieldArgs(
        info: GraphQLResolveInfo,
        context: any,
      ): {
        prisma: any
        raw: {
          first?: number
          after?: string
          last?: number
          before?: string
        }
      } {
        const contextCache = getCtxCache(context)
        const loc = info.fieldNodes[0].loc
        const rootParsedReolveInfo = contextCache.rootResolveInfo.parsed
        if (loc === undefined || rootParsedReolveInfo === null) {
          return { prisma: {}, raw: {} }
        }

        const tree = getParentTree(loc, rootParsedReolveInfo)
        if (tree?.loc === undefined) {
          return { prisma: {}, raw: {} }
        }
        return {
          prisma: contextCache.prismaFindArgs[`${tree.loc.start}:${tree.loc.end}`] ?? {},
          raw: tree.args ?? {},
        }
      }

      const getCusorFn = options?.cursor ?? getDefaultCursor(pgObject.fieldMap)

      const connection = builder.object(`${pgObject.name}Connection`, (f) => ({
        edges: f
          .object(() =>
            builder.object(`${pgObject.name}Edge`, (f) => ({
              cursor: f.string().resolve((params) => {
                return encodeCursor(getCusorFn(params.source))
              }),
              node: f.object(() => pgObject).resolve((params) => params.source),
            })),
          )
          .list()
          .resolve((params) => {
            const args = getParentFieldArgs(params.info, params.context)
            const nodeLength = args.raw.first ?? args.raw.last
            return nodeLength !== undefined
              ? params.source.slice(0, nodeLength)
              : params.source
          }),
        pageInfo: f
          .object(() =>
            builder.object('PageInfo', (f) => ({
              hasNextPage: f.boolean(),
              hasPreviousPage: f.boolean(),
            })),
          )
          .resolve((params) => {
            const args = getParentFieldArgs(params.info, params.context)
            // FIXME: 関数化して外に出して単体テストを行う
            if (args.raw.first !== undefined || args.raw.after !== undefined) {
              return {
                hasNextPage:
                  args.raw.first !== undefined && params.source.length > args.raw.first,
                hasPreviousPage: args.raw.after !== undefined,
              }
            }
            if (args.raw.last !== undefined || args.raw.before !== undefined) {
              return {
                hasNextPage: args.raw.before !== undefined,
                hasPreviousPage:
                  args.raw.last !== undefined && params.source.length > args.raw.last,
              }
            }
            return {
              hasNextPage: false,
              hasPreviousPage: false,
            }
          }),
        ...(options?.totalCount !== undefined
          ? {
              totalCount: f.int().resolve((params) => {
                const args = getParentFieldArgs(params.info, params.context)
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                return options.totalCount!(params, args.prisma)
              }),
            }
          : {}),
      }))
      connection.value.isRelayConnection = true
      return connection
    },
    relayArgs: (options) => {
      const relayArgs = {
        first: createInputField<number>('Int').nullable(),
        after: createInputField<string>('String').nullable(),
        last: createInputField<number>('Int').nullable(),
        before: createInputField<string>('String').nullable(),
      }
      if (options?.default !== undefined) {
        relayArgs.first.default(options.default)
        relayArgs.last.default(options.default)
      }
      if (options?.max !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        relayArgs.first.validation((z) => z.number().max(options.max!))
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        relayArgs.last.validation((z) => z.number().max(options.max!))
      }
      return relayArgs
    },
    cache: () => cache,
  }

  return builder
}
