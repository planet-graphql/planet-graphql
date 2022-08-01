import type { PGBuilder, PGTypes } from './builder'
import type { PGFieldValue, TypeOfPGModelBase } from './common'
import type { PGInput, PGInputField } from './input'

export type PGArgBuilderField =
  | (() => PGArgBuilder<any>)
  | PGArgBuilder<any>
  | PGArgBuilderUnion<any>
  | PGInputField<any>

type TypeOfPGArgBuilderMapField<T extends PGArgBuilderField> = T extends () => any
  ? ReturnType<T>
  : T

export interface PGArgBuilderFieldMap {
  [name: string]: PGArgBuilderField
}

export type PGEditArgBuilderFieldMap<
  TFieldMap extends PGArgBuilderFieldMap | PGArgBuilderFieldMap[] | null | undefined,
> = {
  [P in keyof ExtractPGArgBuilderFieldMap<TFieldMap>]: TypeOfPGArgBuilderMapField<
    ExtractPGArgBuilderFieldMap<TFieldMap>[P]
  >
}

export interface PGArgBuilderUnion<
  TBuilderMap extends {
    __default: PGArgBuilderField
  } & PGArgBuilderFieldMap,
> {
  value: {
    builderMap: TBuilderMap
  }
  select: <TName extends keyof TBuilderMap>(
    name: TName,
  ) => TypeOfPGArgBuilderMapField<TBuilderMap[TName]>
}

type ExcludeNullish<T> = Exclude<T, null | undefined>
type ExtractNullish<T> = Extract<T, null | undefined>
export type ExtractPGArgBuilderFieldMap<
  T extends PGArgBuilderFieldMap | PGArgBuilderFieldMap[] | null | undefined,
> = T extends Array<infer U> ? U : ExcludeNullish<T>

export interface PGArgBuilder<
  out T extends PGArgBuilderFieldMap | PGArgBuilderFieldMap[] | null | undefined,
  Types extends PGTypes = any,
> {
  name: string
  value: PGFieldValue & {
    builder: PGBuilder<any>
    fieldMap: ExtractPGArgBuilderFieldMap<T>
    validator?: (value: any) => boolean
  }
  nullish: <IsNullish extends boolean = true>(
    isNullish?: IsNullish,
  ) => IsNullish extends false
    ? PGArgBuilder<Exclude<T, null | undefined>, Types>
    : PGArgBuilder<T | null | undefined, Types>
  nullable: <IsNullable extends boolean = true>(
    isNullable?: IsNullable,
  ) => IsNullable extends false
    ? PGArgBuilder<Exclude<T, null>, Types>
    : PGArgBuilder<T | null, Types>
  optional: <IsOptinal extends boolean = true>(
    isOptional?: IsOptinal,
  ) => IsOptinal extends false
    ? PGArgBuilder<Exclude<T, undefined>, Types>
    : PGArgBuilder<T | undefined, Types>
  list: () => ExcludeNullish<T> extends any[]
    ? this
    : ExcludeNullish<T> extends PGArgBuilderFieldMap
    ? PGArgBuilder<Array<ExcludeNullish<T>> | ExtractNullish<T>, Types>
    : never
  default: (value: T extends any[] ? [] : T extends null ? null : never) => this
  validation: (
    builder: (
      value: Exclude<
        ConvertPGArgBuilderFieldMapField<this> extends PGInputField<infer U, any>
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
    TEditedFieldMap extends
      | {
          [P in keyof ExtractPGArgBuilderFieldMap<T>]?: PGArgBuilderField
        }
      | {
          [name: string]: PGArgBuilderField
        },
  >(
    callback: (f: PGEditArgBuilderFieldMap<T>) => TEditedFieldMap,
    name?: string,
  ) => {
    [P in keyof TEditedFieldMap]: Exclude<TEditedFieldMap[P], undefined>
  } extends infer U
    ? U extends PGArgBuilderFieldMap
      ? ExcludeNullish<T> extends any[]
        ? PGArgBuilder<[U] | ExtractNullish<T>, Types>
        : PGArgBuilder<U | ExtractNullish<T>, Types>
      : never
    : never
  build: <TType extends boolean, TWrap extends boolean>(config?: {
    wrap?: TWrap
    type?: TType
  }) => Exclude<TWrap, undefined> extends true
    ? Exclude<TType, undefined> extends true
      ? ConvertPGArgBuilderFieldMapField<this>
      : any
    : {
        [P in keyof ExtractPGArgBuilderFieldMap<T>]: Exclude<
          TType,
          undefined
        > extends true
          ? ConvertPGArgBuilderFieldMapField<ExtractPGArgBuilderFieldMap<T>[P]>
          : any
      }
}

type Cast<T, P> = T extends P ? T : P

type ConvertPGArgBuilderFieldMapField<T extends PGArgBuilderField> = (
  T extends PGInputField<any>
    ? T
    : T extends () => any
    ? ConvertPGArgBuilderFieldMapField<ReturnType<T>>
    : T extends PGArgBuilderUnion<infer U>
    ? ConvertPGArgBuilderFieldMapField<U['__default']>
    : T extends PGArgBuilder<infer U, infer V>
    ? PGInput<{
        [P in keyof ExtractPGArgBuilderFieldMap<U>]: ConvertPGArgBuilderFieldMapField<
          ExtractPGArgBuilderFieldMap<U>[P]
        >
      }> extends PGInput<infer TFieldMap>
      ? ExcludeNullish<U> extends any[]
        ? PGInputField<[PGInput<TFieldMap>] | ExtractNullish<U>, 'input', V>
        : PGInputField<PGInput<TFieldMap> | ExtractNullish<U>, 'input', V>
      : never
    : never
) extends infer R
  ? Cast<R, PGInputField<any, any, any>>
  : PGInputField<any, any, any>
