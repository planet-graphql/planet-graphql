import { Promisable, Simplify } from 'type-fest'
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

export interface PGInput<T extends PGInputFieldMap, Types extends PGTypes = any> {
  name: string
  kind: 'input'
  value: {
    fieldMap: T
    validator?: (
      value: TypeOfPGFieldMap<T>,
      context: Types['Context'],
    ) => Promisable<boolean>
  }
  copy: (name: string) => this
  update: <SetT extends PGEditInputFieldMap<T>>(
    editFieldMap: (f: T, b: PGInputFieldBuilder<Types>) => SetT,
  ) => PGInput<{ [P in keyof SetT]: Exclude<SetT[P], undefined> }, Types>
  validation: (
    validator?: (
      value: TypeOfPGFieldMap<T>,
      context: Types['Context'],
    ) => Promisable<boolean>,
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
) => z.ZodSchema

export interface PGInputField<
  T,
  TypeName extends string = any,
  Types extends PGTypes = any,
> extends PGField<T> {
  value: PGFieldValue & {
    isPrisma?: boolean
    validator?: PGInputFieldValidator<TypeName, Types>
  }
  nullable: <IsNullable extends boolean = true>(
    isNullable?: IsNullable,
  ) => IsNullable extends false
    ? PGInputField<Exclude<T, null>, TypeName, Types>
    : PGInputField<T | null, TypeName, Types>
  optional: <IsOptional extends boolean = true>(
    isOptional?: IsOptional,
  ) => IsOptional extends false
    ? PGInputField<Exclude<T, undefined>, TypeName, Types>
    : PGInputField<T | undefined, TypeName, Types>
  nullish: <IsNullish extends boolean = true>(
    isNullish?: IsNullish,
  ) => IsNullish extends false
    ? PGInputField<Exclude<T, null | undefined>, TypeName, Types>
    : PGInputField<T | null | undefined, TypeName, Types>
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
  validation: (validator: PGInputFieldValidator<TypeName, Types>) => this
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

export type PGRelayInputFieldMap<Types extends PGTypes> = {
  first: PGInputField<number | undefined, 'int', Types>
  after: PGInputField<string | undefined, 'string', Types>
  last: PGInputField<number | undefined, 'int', Types>
  before: PGInputField<string | undefined, 'string', Types>
}
