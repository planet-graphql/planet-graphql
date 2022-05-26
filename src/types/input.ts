import { Simplify } from 'type-fest'
import { z } from 'zod'
import { PGConfig, PGTypeConfig, PGTypes } from './builder'
import {
  ExcludeNullish,
  ExtractNullish,
  PGEnum,
  PGField,
  PGFieldMap,
  PGFieldValue,
  TypeOfPGFieldMap,
  TypeOfPGFieldType,
} from './common'

export interface PGInput<TFieldMap extends PGInputFieldMap, Types extends PGTypes = any> {
  name: string
  fieldMap: TFieldMap
  kind: 'input'
  value: {
    validatorBuilder?: (
      value: TypeOfPGFieldMap<TFieldMap>,
      context: Types['Context'],
    ) => boolean
  }
  validation: (
    validatorBuilder?: (
      value: TypeOfPGFieldMap<TFieldMap>,
      context: Types['Context'],
    ) => boolean,
  ) => this
}

export type GetSchemaType<
  TypeName extends string,
  Types extends PGTypes,
> = TypeName extends keyof Types['ScalarMap']
  ? Types['ScalarMap'][TypeName]['schema']
  : z.ZodAny

export type PGInputFieldValidator<TypeName extends string, Types extends PGTypes> = (
  schema: GetSchemaType<TypeName, Types>,
  context: Types['Context'],
) => z.ZodSchema

export interface PGInputField<
  T,
  TypeName extends string = any,
  Types extends PGTypes = any,
> extends PGField<T> {
  value: PGFieldValue & {
    validatorBuilder?: PGInputFieldValidator<TypeName, Types>
  }
  nullable: () => PGInputField<T | null, TypeName, Types>
  optional: () => PGInputField<T | undefined, TypeName, Types>
  nullish: () => PGInputField<T | null | undefined, TypeName, Types>
  list: () => ExcludeNullish<T> extends any[]
    ? this
    : PGInputField<Array<ExcludeNullish<T>> | ExtractNullish<T>, TypeName, Types>
  default: (
    value: T extends Function
      ? never
      : T extends Function[]
      ? []
      : Exclude<TypeOfPGFieldType<T>, undefined>,
  ) => this
  validation: (validatorBuilder: PGInputFieldValidator<TypeName, Types>) => this
}

export interface PGInputFieldMap {
  [name: string]: PGInputField<any>
}

export type PGEditInputFieldMap<TModel extends PGFieldMap> =
  | { [P in keyof TModel]?: PGInputField<any> }
  | { [name: string]: PGInputField<any> }

export type PGInputFieldBuilder<Types extends PGTypes<PGTypeConfig, PGConfig>> = Simplify<
  {
    [P in keyof Types['ScalarMap'] as string extends P ? never : P]: P extends string
      ? () => PGInputField<Types['ScalarMap'][P]['input'], P, Types>
      : never
  } & {
    input: <T extends Function>(type: T) => PGInputField<T, 'input', Types>
    enum: <T extends PGEnum<any>>(type: T) => PGInputField<T, 'enum', Types>
  }
>
