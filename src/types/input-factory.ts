import { z } from 'zod'
import {
  PGField,
  PGFieldValue,
  TypeOfPGFieldMap,
  TypeOfPGFieldType,
  TypeOfPGModelBase,
} from './common'

export interface PGInputFieldMap2 {
  [name: string]: PGInputField2<any, any>
}

export interface PGInput2<TFieldMap extends PGInputFieldMap2, TContext = any> {
  name: string
  fieldMap: TFieldMap
  kind: 'input'
  value: {
    validatorBuilder?: (value: TypeOfPGFieldMap<TFieldMap>, context: TContext) => boolean
  }
  validation: (
    validatorBuilder?: (value: TypeOfPGFieldMap<TFieldMap>, context: TContext) => boolean,
  ) => this
}

export interface PGInputField2<T, TSchema extends z.ZodSchema = z.ZodAny, TContext = any>
  extends PGField<T> {
  value: PGFieldValue & {
    validatorBuilder?: (schema: TSchema, context: TContext) => z.ZodSchema
  }
  nullable: () => PGInputField2<T | null | undefined, TSchema, TContext>
  list: () => PGInputField2<
    T extends null | undefined ? null | undefined : T[],
    TSchema,
    TContext
  >
  default: (
    value: T extends PGInput2<any> | Function
      ? never
      : T extends Array<PGInput2<any>> | Function[]
      ? []
      : Exclude<TypeOfPGFieldType<T>, undefined>,
  ) => this
  validation: (
    validatorBuilder: (schema: TSchema, context: TContext) => z.ZodSchema,
  ) => this
}

type PGInputFactoryField =
  | (() => PGInputFactoryWrapper<any>)
  | PGInputFactoryWrapper<any>
  | PGInputFactoryUnion<any>
  | PGInputFactory<any>

type TypeOfPGInputFactoryMapField<T extends PGInputFactoryField> = T extends () => any
  ? ReturnType<T>
  : T

export interface PGInputFactoryFieldMap {
  [name: string]: PGInputFactoryField
}

type PGEditInputFactoryFieldMap<
  TFieldMap extends PGInputFactoryFieldMap | PGInputFactoryFieldMap[] | null | undefined,
> = {
  [P in keyof ExtractPGInputFactoryFieldMap<TFieldMap>]: TypeOfPGInputFactoryMapField<
    ExtractPGInputFactoryFieldMap<TFieldMap>[P]
  >
}

export interface PGInputFactoryUnion<
  TFactoryMap extends {
    __default: PGInputFactoryField
  } & PGInputFactoryFieldMap,
> {
  factoryMap: TFactoryMap
  // NOTE: 実装側でも`T extends () => any ? ReturnType<T> : T`をすれば良さそう。
  select: <TName extends keyof TFactoryMap>(
    name: TName,
  ) => TypeOfPGInputFactoryMapField<TFactoryMap[TName]>
}

export interface PGInputFactoryBase<
  T extends PGInputFactory<any> | PGInputFactoryWrapper<any>,
  TSchema extends z.ZodSchema = z.ZodSchema,
> {
  nullish: () => T extends PGInputFactory<infer U>
    ? PGInputFactory<U | null | undefined, TSchema>
    : T extends PGInputFactoryWrapper<infer U>
    ? PGInputFactoryWrapper<U | null | undefined>
    : never
  nullable: () => T extends PGInputFactory<infer U>
    ? PGInputFactory<U | null, TSchema>
    : T extends PGInputFactoryWrapper<infer U>
    ? PGInputFactoryWrapper<U | null>
    : never
  optional: () => T extends PGInputFactory<infer U>
    ? PGInputFactory<U | undefined, TSchema>
    : T extends PGInputFactoryWrapper<infer U>
    ? PGInputFactoryWrapper<U | undefined>
    : never
  list: () => T extends PGInputFactory<infer U>
    ? ExcludeNullish<U> extends any[]
      ? this
      : PGInputFactory<Array<ExcludeNullish<U>> | ExtractNullish<T>>
    : T extends PGInputFactoryWrapper<infer U>
    ? ExcludeNullish<U> extends any[]
      ? this
      : ExcludeNullish<U> extends PGInputFactoryFieldMap
      ? PGInputFactoryWrapper<Array<ExcludeNullish<U>> | ExtractNullish<T>>
      : never
    : never
}

export interface PGInputFactory<
  T,
  TSchema extends z.ZodSchema = z.ZodSchema,
  TContext = any,
> extends PGInputFactoryBase<PGInputFactory<T>, TSchema> {
  default: (value: Exclude<T extends any[] ? [] : T, undefined>) => this
  validation: (builder: (schema: TSchema, context: TContext) => z.ZodSchema) => this
  __type: T
}

type ExcludeNullish<T> = Exclude<T, null | undefined>
type ExtractNullish<T> = Extract<T, null | undefined>
type ExtractPGInputFactoryFieldMap<
  T extends PGInputFactoryFieldMap | PGInputFactoryFieldMap[] | null | undefined,
> = Cast<
  ExcludeNullish<T> extends Array<infer U> ? U : ExcludeNullish<T>,
  PGInputFactoryFieldMap
>

export interface PGInputFactoryWrapper<
  TFieldMap extends PGInputFactoryFieldMap | PGInputFactoryFieldMap[] | null | undefined,
  TContext = any,
> extends PGInputFactoryBase<PGInputFactoryWrapper<TFieldMap>, z.ZodAny> {
  fieldMap: TFieldMap
  default: (
    value: TFieldMap extends any[] ? [] : TFieldMap extends null ? null : never,
  ) => this
  validation: (
    builder: (
      value: Exclude<
        ConvertPGInputFactoryFieldMapField<this> extends PGInputField2<infer U, any>
          ? U extends Array<infer V>
            ? V extends PGInput2<any>
              ? TypeOfPGModelBase<V>
              : V
            : U extends PGInput2<any>
            ? TypeOfPGModelBase<U>
            : U
          : never,
        undefined
      >,
    ) => boolean,
  ) => this
  edit: <
    TEditedFieldMap extends {
      [P in keyof ExtractPGInputFactoryFieldMap<TFieldMap>]?: PGInputFactoryField
    },
  >(
    // NOTE: 実装側でも`T extends () => any ? ReturnType<T> : T`をすれば良さそう。
    x: (fieldMap: PGEditInputFactoryFieldMap<TFieldMap>) => TEditedFieldMap,
  ) => {
    [P in keyof TEditedFieldMap]: Exclude<TEditedFieldMap[P], undefined>
  } extends infer U
    ? U extends PGInputFactoryFieldMap
      ? ExcludeNullish<TFieldMap> extends any[]
        ? PGInputFactoryWrapper<[U] | ExtractNullish<TFieldMap>, TContext>
        : PGInputFactoryWrapper<U | ExtractNullish<TFieldMap>, TContext>
      : never
    : never
  build: <TWrap extends boolean>(
    inputNamePrefix: string,
    wrap?: TWrap,
  ) => Exclude<TWrap, undefined> extends true
    ? ConvertPGInputFactoryFieldMapField<this>
    : {
        [P in keyof ExtractPGInputFactoryFieldMap<TFieldMap>]: ConvertPGInputFactoryFieldMapField<
          ExtractPGInputFactoryFieldMap<TFieldMap>[P]
        >
      }
}

type Cast<T, P> = T extends P ? T : P

type ConvertPGInputFactoryFieldMapField<T extends PGInputFactoryField> =
  T extends () => any
    ? ConvertPGInputFactoryFieldMapField<ReturnType<T>>
    : T extends PGInputFactoryWrapper<infer U, infer V>
    ? PGInput2<{
        [P in keyof ExtractPGInputFactoryFieldMap<U>]: ConvertPGInputFactoryFieldMapField<
          ExtractPGInputFactoryFieldMap<U>[P]
        > extends infer R
          ? Cast<R, PGInputField2<any, any, any>>
          : PGInputField2<any, any, any>
      }> extends PGInput2<infer TFieldMap>
      ? ExcludeNullish<U> extends any[]
        ? PGInputField2<[PGInput2<TFieldMap>] | ExtractNullish<U>, z.ZodAny, V>
        : PGInputField2<PGInput2<TFieldMap> | ExtractNullish<U>, z.ZodAny, V>
      : never
    : T extends PGInputFactory<infer U, infer V, infer W>
    ? PGInputField2<U, V, W>
    : never
