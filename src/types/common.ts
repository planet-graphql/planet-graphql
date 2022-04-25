import { Decimal } from '@prisma/client/runtime'
import { GraphQLResolveInfo } from 'graphql'
import { JsonValue, PartialDeep, Promisable, RequireAtLeastOne } from 'type-fest'
import { IsAny } from 'type-fest/source/set-return-type'
import { PGInput, PGInputField } from './input'
import { PGConnectionObject, PGObject } from './output'

export type PGScalar =
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

export type PGFieldType =
  | string
  | boolean
  | number
  | bigint
  | Date
  | Buffer
  | Decimal
  | PGEnum<any>
  | PGModelBase<any>
  | Function // NOTE: 実際は、() => PGModel<any>
  | PGFieldType[]

export type TypeOfPGFieldType<T extends PGFieldType | null | undefined> =
  IsAny<T> extends true
    ? any
    : T extends () => any
    ? TypeOfPGFieldType<ReturnType<T>>
    : T extends any[]
    ? Array<TypeOfPGFieldType<T[0]>>
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

export type TypeOfPGField<T extends PGField<any>> = TypeOfPGFieldType<T['__type']>

export interface PGEnum<TFieldValues extends string[]> {
  name: string
  values: TFieldValues
  kind: 'enum'
}

export type TypeOfPGEnum<T extends PGEnum<any>> = T['values'][number]

export interface PGFieldMap {
  [name: string]: PGField<any>
}

export type TypeOfPGFieldMap<T extends PGFieldMap> = {
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

export type IsObject<T> = T extends any[]
  ? false
  : T extends Date
  ? false
  : T extends Buffer
  ? false
  : T extends Decimal
  ? false
  : T extends object
  ? true
  : false

export type TypeToScalarName<T> = T extends string
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
  : T extends Decimal
  ? 'Decimal'
  : never

export type ScalarNameToType<T> = T extends 'String' | 'Json'
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
  ? Decimal
  : never

export type FieldBuilderArgsType =
  | PGScalar
  | PGEnum<any>
  | (() => PGObject<any> | PGInput<any>)

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

export type InnerPGQueryArgsType<T> = T extends Array<infer U>
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

export type PGQueryArgsType<T> = IsObject<T> extends true
  ? {
      [P in keyof T]: InnerPGQueryArgsType<T[P]>
    }
  : InnerPGQueryArgsType<T>

export interface ResolveParams<TResolve, TSource, TArgs, TContext> {
  source: TSource
  args: TArgs
  context: TContext
  info: GraphQLResolveInfo
  __type: TResolve
}

export type ResolveResponse<T> = Promisable<
  T extends Array<infer U> ? Array<PartialDeep<U>> : PartialDeep<T>
>
