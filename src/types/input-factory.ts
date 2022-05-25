import { z } from 'zod'
import { PGTypes } from './builder'
import { TypeOfPGModelBase } from './common'
import { GetSchemaType, PGInput, PGInputField } from './input'

type PGInputFactoryField =
  | (() => PGInputFactoryWrapper<any>)
  | PGInputFactoryWrapper<any>
  | PGInputFactoryUnion<any>
  | PGInputFactory<any, any>

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
  TypeName extends string = any,
  Types extends PGTypes = any,
> {
  nullish: () => T extends PGInputFactory<infer U>
    ? PGInputFactory<U | null | undefined, TypeName, Types>
    : T extends PGInputFactoryWrapper<infer U>
    ? PGInputFactoryWrapper<U | null | undefined, Types>
    : never
  nullable: () => T extends PGInputFactory<infer U>
    ? PGInputFactory<U | null, TypeName, Types>
    : T extends PGInputFactoryWrapper<infer U>
    ? PGInputFactoryWrapper<U | null, Types>
    : never
  optional: () => T extends PGInputFactory<infer U>
    ? PGInputFactory<U | undefined, TypeName, Types>
    : T extends PGInputFactoryWrapper<infer U>
    ? PGInputFactoryWrapper<U | undefined, Types>
    : never
  list: () => T extends PGInputFactory<infer U>
    ? ExcludeNullish<U> extends any[]
      ? this
      : PGInputFactory<Array<ExcludeNullish<U>> | ExtractNullish<T>, TypeName, Types>
    : T extends PGInputFactoryWrapper<infer U>
    ? ExcludeNullish<U> extends any[]
      ? this
      : ExcludeNullish<U> extends PGInputFactoryFieldMap
      ? PGInputFactoryWrapper<Array<ExcludeNullish<U>> | ExtractNullish<T>, Types>
      : never
    : never
}

export interface PGInputFactory<
  T,
  TypeName extends string = string,
  Types extends PGTypes = any,
> extends PGInputFactoryBase<PGInputFactory<T>, TypeName, Types> {
  default: (value: Exclude<T extends any[] ? [] : T, undefined>) => this
  validation: (
    builder: (
      schema: GetSchemaType<TypeName, Types>,
      context: Types['Context'],
    ) => z.ZodSchema,
  ) => this
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
  Types extends PGTypes = any,
> extends PGInputFactoryBase<PGInputFactoryWrapper<TFieldMap>, any, Types> {
  fieldMap: TFieldMap
  default: (
    value: TFieldMap extends any[] ? [] : TFieldMap extends null ? null : never,
  ) => this
  validation: (
    builder: (
      value: Exclude<
        ConvertPGInputFactoryFieldMapField<this> extends PGInputField<infer U, any>
          ? U extends Array<infer V>
            ? V extends PGInput<any>
              ? TypeOfPGModelBase<V>
              : V
            : U extends PGInput<any>
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
        ? PGInputFactoryWrapper<[U] | ExtractNullish<TFieldMap>, Types>
        : PGInputFactoryWrapper<U | ExtractNullish<TFieldMap>, Types>
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
    ? PGInput<{
        [P in keyof ExtractPGInputFactoryFieldMap<U>]: ConvertPGInputFactoryFieldMapField<
          ExtractPGInputFactoryFieldMap<U>[P]
        > extends infer R
          ? Cast<R, PGInputField<any, any, any>>
          : PGInputField<any, any, any>
      }> extends PGInput<infer TFieldMap>
      ? ExcludeNullish<U> extends any[]
        ? PGInputField<[PGInput<TFieldMap>] | ExtractNullish<U>, 'input', V>
        : PGInputField<PGInput<TFieldMap> | ExtractNullish<U>, 'input', V>
      : never
    : T extends PGInputFactory<infer U, infer V, infer W>
    ? PGInputField<U, V, W>
    : never
