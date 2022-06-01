import { Decimal } from '@prisma/client/runtime'
import { GraphQLResolveInfo, GraphQLScalarType } from 'graphql'
import { JsonValue, PartialDeep, Promisable, RequireAtLeastOne } from 'type-fest'
import { IsAny } from 'type-fest/source/set-return-type'
import { z } from 'zod'
import { PGInput, PGInputField } from './input'

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
      // NOTE: () => PGObject<any> | PGInput<any>
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
  [P in keyof T]-?: Exclude<T, null | undefined>
}
