import type { PGUnion } from './output'
import type { Decimal } from 'decimal.js'
import type { GraphQLResolveInfo, GraphQLScalarType } from 'graphql'
import type { PartialDeep, Promisable } from 'type-fest'
import type { IsAny } from 'type-fest/source/set-return-type'
import type { z } from 'zod'

export type ExcludeNullish<T> = Exclude<T, null | undefined>
export type ExtractNullish<T> = Extract<T, null | undefined>
export type AnyWithNote<Note extends string> = { [key: string]: any } & Note
export type NeverWithNote<Note extends string> = { [key: string]: never } & Note

export interface PGScalarLike {
  scalar: GraphQLScalarType<any>
  schema: () => z.ZodSchema
}

export interface PGScalar<
  TSchema extends z.ZodSchema,
  TInput = z.infer<TSchema>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  TOutput = TInput,
> {
  scalar: GraphQLScalarType<any>
  schema: () => TSchema
}

// From Prisma Client
export type PGInputDecimal = Decimal
export type PGDecimal = {
  d: number[]
  e: number
  s: number
}

// From Prisma Client
type PGJsonObject = { [Key in string]?: PGJson }
type PGJsonArray = PGJson[]
export type PGJson = string | number | boolean | PGJsonObject | PGJsonArray | null
type PGInputJsonObject = { readonly [Key in string]?: PGInputJson | null }
type PGInputJsonArray = ReadonlyArray<PGInputJson | null>
export type PGInputJson = string | number | boolean | PGInputJsonObject | PGInputJsonArray

export type PGFieldKindAndType =
  | {
      kind: 'scalar'
      type: string
    }
  | {
      kind: 'enum'
      type: PGEnum<any>
    }
  | {
      kind: 'object'
      type: Function
    }

export type TypeOfPGFieldType<T> = IsAny<T> extends true
  ? any
  : T extends () => any
  ? TypeOfPGFieldType<ReturnType<T>>
  : T extends any[]
  ? Array<TypeOfPGFieldType<T[0]>>
  : T extends PGEnum<any>
  ? TypeOfPGEnum<T>
  : T extends PGModelBase<any>
  ? TypeOfPGModelBase<T>
  : T extends PGUnion<any>
  ? TypeOfPGUnion<T>
  : T

export type PGFieldValue = {
  isOptional: boolean
  isNullable: boolean
  isList: boolean
  default?: any
} & PGFieldKindAndType

export interface PGField<T> {
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

export type TypeOfPGUnion<T extends PGUnion<any>> = TypeOfPGModelBase<
  T['value']['types'][number]
>

export interface PGFieldMap {
  [name: string]: PGField<any>
}

export type TypeOfPGFieldMap<T extends PGFieldMap> = {
  [P in keyof T]: TypeOfPGField<T[P]>
}

export interface PGModelBase<TFieldMap extends PGFieldMap> {
  value: {
    fieldMap: TFieldMap
  }
}

export type TypeOfPGModelBase<T extends PGModelBase<any>> = TypeOfPGFieldMap<
  T['value']['fieldMap']
>

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface PGResolveParams<TSource, TArgs, TPrismaArgs, TContext, TResolve> {
  source: IsAny<TSource> extends true
    ? AnyWithNote<'The type is not fixed as it is currently being created & If you need the fixed type, consider using the modify() method of PGObject'>
    : TSource
  args: TArgs
  prismaArgs: TPrismaArgs
  context: TContext
  info: GraphQLResolveInfo
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface PGSubscribeParams<TSource, TArgs, TContext, TResolve> {
  source: IsAny<TSource> extends true
    ? AnyWithNote<'The type is not fixed as it is currently being created & If you need the fixed type, consider using the modify() method of PGObject'>
    : TSource
  args: TArgs
  context: TContext
  info: GraphQLResolveInfo
}

export type ResolveResponse<T> = Promisable<
  T extends Array<infer U> ? Array<PartialDeep<U>> : PartialDeep<T>
>

export type RequiredNonNullable<T> = {
  [P in keyof T]-?: Exclude<T[P], null | undefined>
}
