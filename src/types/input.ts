import { z as Zod } from 'zod'
import { PGConfig, PGTypeConfig, PGTypes } from './builder'
import { PGEnum, PGField, PGFieldMap, PGFieldValue, TypeOfPGFieldType } from './common'

export interface PGInput<TFieldMap extends PGInputFieldMap, Types extends PGTypes = any> {
  name: string
  fieldMap: TFieldMap
  kind: 'input'
  value: {
    validatorBuilder?: (z: typeof Zod, context: Types['Context']) => Zod.ZodTypeAny
  }
  validation: (
    validatorBuilder?: (z: typeof Zod, context: Types['Context']) => Zod.ZodTypeAny,
  ) => this
}

export interface PGInputField<T, Types extends PGTypes = any> extends PGField<T> {
  value: PGFieldValue & {
    validatorBuilder?: (z: typeof Zod, context: Types['Context']) => Zod.ZodTypeAny
  }
  nullable: () => PGInputField<T | null | undefined, Types>
  list: () => PGInputField<T extends null | undefined ? null | undefined : T[], Types>
  default: (
    value: T extends PGInput<any> | Function
      ? never
      : T extends Array<PGInput<any>> | Function[]
      ? []
      : Exclude<TypeOfPGFieldType<T>, undefined>,
  ) => PGInputField<T, Types>
  validation: (
    validatorBuilder: (z: typeof Zod, context: Types['Context']) => Zod.ZodTypeAny,
  ) => PGInputField<T, Types>
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
    Types
  >
} & {
  input: <T extends Function>(type: T) => PGInputField<T, Types>
  enum: <T extends PGEnum<any>>(type: T) => PGInputField<T, Types>
}
