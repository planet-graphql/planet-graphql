import { Decimal } from '@prisma/client/runtime'
import { z as Zod } from 'zod'
import {
  PGEnum,
  PGField,
  PGFieldMap,
  PGFieldType,
  PGFieldValue,
  TypeOfPGFieldType,
} from './common'

export interface PGInput<TFieldMap extends PGInputFieldMap, TContext = any> {
  name: string
  fieldMap: TFieldMap
  kind: 'input'
  value: {
    validatorBuilder?: (z: typeof Zod, context: TContext) => Zod.ZodTypeAny
  }
  validation: (
    validatorBuilder?: (z: typeof Zod, context: TContext) => Zod.ZodTypeAny,
  ) => PGInput<TFieldMap, TContext>
}

export interface PGInputField<T extends PGFieldType | null | undefined, TContext = any>
  extends PGField<T> {
  value: PGFieldValue & {
    validatorBuilder?: (z: typeof Zod, context: TContext) => Zod.ZodTypeAny
  }
  nullable: () => PGInputField<T | null | undefined, TContext>
  list: () => PGInputField<T extends null | undefined ? null | undefined : T[], TContext>
  default: (
    value: T extends PGInput<any> | Function
      ? never
      : T extends Array<PGInput<any>> | Function[]
      ? []
      : Exclude<TypeOfPGFieldType<T>, undefined>,
  ) => PGInputField<T, TContext>
  validation: (
    validatorBuilder: (z: typeof Zod, context: TContext) => Zod.ZodTypeAny,
  ) => PGInputField<T, TContext>
}

export interface PGInputFieldMap {
  [name: string]: PGInputField<any>
}

export type PGEditInputFieldMap<TModel extends PGFieldMap> =
  | { [P in keyof TModel]?: PGInputField<any> }
  | { [name: string]: PGInputField<any> }

export interface InputFieldBuilder<TContext> {
  id: () => PGInputField<string, TContext>
  string: () => PGInputField<string, TContext>
  boolean: () => PGInputField<boolean, TContext>
  int: () => PGInputField<number, TContext>
  bigInt: () => PGInputField<bigint, TContext>
  float: () => PGInputField<number, TContext>
  dateTime: () => PGInputField<Date, TContext>
  json: () => PGInputField<string, TContext>
  byte: () => PGInputField<Buffer, TContext>
  decimal: () => PGInputField<Decimal, TContext>
  input: <T extends Function>(type: T) => PGInputField<T, TContext>
  enum: <T extends PGEnum<any>>(type: T) => PGInputField<T, TContext>
}
