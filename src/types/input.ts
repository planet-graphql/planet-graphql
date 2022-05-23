import { IsAny } from 'type-fest/source/set-return-type'
import { z } from 'zod'
import { PGConfig, PGTypeConfig, PGTypes } from './builder'
import {
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
> = IsAny<TypeName> extends true
  ? z.ZodAny
  : TypeName extends keyof Types['ScalarMap']
  ? Types['ScalarMap'][TypeName]['schema']
  : z.ZodAny

export interface PGInputField<
  T,
  TypeName extends string = any,
  Types extends PGTypes = any,
> extends PGField<T> {
  value: PGFieldValue & {
    validatorBuilder?: (
      schema: GetSchemaType<TypeName, Types>,
      context: Types['Context'],
    ) => z.ZodSchema
  }
  nullable: () => PGInputField<T | null, TypeName, Types>
  optional: () => PGInputField<T | undefined, TypeName, Types>
  nullish: () => PGInputField<T | null | undefined, TypeName, Types>
  list: () => PGInputField<
    T extends null | undefined ? null | undefined : T[],
    TypeName,
    Types
  >
  default: (
    value: T extends PGInput<any> | Function
      ? never
      : T extends Array<PGInput<any>> | Function[]
      ? []
      : Exclude<TypeOfPGFieldType<T>, undefined>,
  ) => this
  validation: (
    validatorBuilder: (
      schema: GetSchemaType<TypeName, Types>,
      context: Types['Context'],
    ) => z.ZodSchema,
  ) => this
}

export interface PGInputFieldMap {
  [name: string]: PGInputField<any>
}

export type PGEditInputFieldMap<TModel extends PGFieldMap> =
  | { [P in keyof TModel]?: PGInputField<any> }
  | { [name: string]: PGInputField<any> }

export type PGInputFieldBuilder<Types extends PGTypes<PGTypeConfig, PGConfig>> = {
  [P in keyof Types['ScalarMap']]: () => PGInputField<
    Types['ScalarMap'][P]['input'],
    P extends string ? P : any,
    Types
  >
} & {
  input: <T extends Function>(type: T) => PGInputField<T, 'input', Types>
  enum: <T extends PGEnum<any>>(type: T) => PGInputField<T, 'enum', Types>
}
