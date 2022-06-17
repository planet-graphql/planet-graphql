import { PGBuilder, PGTypes } from './builder'
import { PGFieldValue, TypeOfPGModelBase } from './common'
import { PGInput, PGInputField } from './input'

export type PGInputFactoryField =
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

export type PGEditInputFactoryFieldMap<
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
  value: {
    factoryMap: TFactoryMap
  }
  // NOTE: 実装側でも`T extends () => any ? ReturnType<T> : T`をすれば良さそう。
  select: <TName extends keyof TFactoryMap>(
    name: TName,
  ) => TypeOfPGInputFactoryMapField<TFactoryMap[TName]>
}

export interface PGInputFactoryBase<
  T extends PGInputFactoryWrapper<any>,
  TypeName extends string = any,
  Types extends PGTypes = any,
> {
  nullish: <IsNullish extends boolean = true>(
    isNullish?: IsNullish,
  ) => IsNullish extends false
    ? T extends PGInputFactory<infer U>
      ? PGInputFactory<Exclude<U, null | undefined>, TypeName, Types>
      : T extends PGInputFactoryWrapper<infer U>
      ? PGInputFactoryWrapper<Exclude<U, null | undefined>, Types>
      : never
    : T extends PGInputFactory<infer U>
    ? PGInputFactory<U | null | undefined, TypeName, Types>
    : T extends PGInputFactoryWrapper<infer U>
    ? PGInputFactoryWrapper<U | null | undefined, Types>
    : never
  nullable: <IsNullable extends boolean = true>(
    isNullable?: IsNullable,
  ) => IsNullable extends false
    ? T extends PGInputFactory<infer U>
      ? PGInputFactory<Exclude<U, null>, TypeName, Types>
      : T extends PGInputFactoryWrapper<infer U>
      ? PGInputFactoryWrapper<Exclude<U, null>, Types>
      : never
    : T extends PGInputFactory<infer U>
    ? PGInputFactory<U | null, TypeName, Types>
    : T extends PGInputFactoryWrapper<infer U>
    ? PGInputFactoryWrapper<U | null, Types>
    : never
  optional: <IsOptinal extends boolean = true>(
    isOptional?: IsOptinal,
  ) => IsOptinal extends false
    ? T extends PGInputFactory<infer U>
      ? PGInputFactory<Exclude<U, undefined>, TypeName, Types>
      : T extends PGInputFactoryWrapper<infer U>
      ? PGInputFactoryWrapper<Exclude<U, undefined>, Types>
      : never
    : T extends PGInputFactory<infer U>
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
  TypeName extends string = any,
  Types extends PGTypes = any,
> extends PGInputField<T, TypeName, Types> {}

type ExcludeNullish<T> = Exclude<T, null | undefined>
type ExtractNullish<T> = Extract<T, null | undefined>
export type ExtractPGInputFactoryFieldMap<
  T extends PGInputFactoryFieldMap | PGInputFactoryFieldMap[] | null | undefined,
> = T extends Array<infer U> ? U : ExcludeNullish<T>

export interface PGInputFactoryWrapper<
  T extends PGInputFactoryFieldMap | PGInputFactoryFieldMap[] | null | undefined,
  Types extends PGTypes = any,
> extends PGInputFactoryBase<PGInputFactoryWrapper<T>, any, Types> {
  value: PGFieldValue & {
    fieldMap: ExtractPGInputFactoryFieldMap<T>
    validator?: (
      value: Exclude<
        ConvertPGInputFactoryFieldMapField<
          PGInputFactoryWrapper<T, Types>
        > extends PGInputField<infer U, any>
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
    ) => boolean
  }
  default: (value: T extends any[] ? [] : T extends null ? null : never) => this
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
      [P in keyof ExtractPGInputFactoryFieldMap<T>]?: PGInputFactoryField
    },
  >(
    // NOTE: 実装側でも`T extends () => any ? ReturnType<T> : T`をすれば良さそう。
    x: (fieldMap: PGEditInputFactoryFieldMap<T>) => TEditedFieldMap,
  ) => {
    [P in keyof TEditedFieldMap]: Exclude<TEditedFieldMap[P], undefined>
  } extends infer U
    ? U extends PGInputFactoryFieldMap
      ? ExcludeNullish<T> extends any[]
        ? PGInputFactoryWrapper<[U] | ExtractNullish<T>, Types>
        : PGInputFactoryWrapper<U | ExtractNullish<T>, Types>
      : never
    : never
  build: <TWrap extends boolean>(
    inputNamePrefix: string,
    builder: PGBuilder<any>,
    wrap?: TWrap,
  ) => Exclude<TWrap, undefined> extends true
    ? ConvertPGInputFactoryFieldMapField<this>
    : {
        [P in keyof ExtractPGInputFactoryFieldMap<T>]: ConvertPGInputFactoryFieldMapField<
          ExtractPGInputFactoryFieldMap<T>[P]
        >
      }
}

type Cast<T, P> = T extends P ? T : P

type ConvertPGInputFactoryFieldMapField<T extends PGInputFactoryField> =
  T extends PGInputFactory<infer U, infer V, infer W>
    ? PGInputField<U, V, W>
    : T extends () => any
    ? ConvertPGInputFactoryFieldMapField<ReturnType<T>>
    : T extends PGInputFactoryUnion<infer U>
    ? ConvertPGInputFactoryFieldMapField<U['__default']>
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
    : never
