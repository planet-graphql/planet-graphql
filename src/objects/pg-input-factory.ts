import { PGTypes } from '../types/builder'
import {
  PGEditInputFactoryFieldMap,
  PGInputFactoryField,
  PGInputFactory,
  PGInputFactoryFieldMap,
  PGInputFactoryUnion,
  PGInputFactoryWrapper,
} from '../types/input-factory'
import { createInputField } from './pg-input-field'

export function createPGInputFactoryUnion<
  TFactoryMap extends {
    __default: PGInputFactoryField
  } & PGInputFactoryFieldMap,
>(factoryMap: TFactoryMap): PGInputFactoryUnion<TFactoryMap> {
  const pgInputFactoryUnion: PGInputFactoryUnion<TFactoryMap> = {
    value: {
      factoryMap,
    },
    select: (name) => {
      const selectedField = factoryMap[name]
      return typeof selectedField === 'function'
        ? selectedField()
        : (selectedField as any)
    },
  }
  return pgInputFactoryUnion
}

export function createPGInputFactoryWrapper<
  T extends PGInputFactoryFieldMap,
  Types extends PGTypes,
>(fieldMap: T): PGInputFactoryWrapper<T, Types> {
  const pgInputFactoryWrapper: PGInputFactoryWrapper<any> = {
    value: {
      fieldMap,
      kind: 'object',
      type: Function,
      isOptional: false,
      isNullable: false,
      isList: false,
    },
    nullish: () => {
      pgInputFactoryWrapper.value.isNullable = true
      pgInputFactoryWrapper.value.isOptional = true
      return pgInputFactoryWrapper
    },
    nullable: () => {
      pgInputFactoryWrapper.value.isNullable = true
      return pgInputFactoryWrapper
    },
    optional: () => {
      pgInputFactoryWrapper.value.isOptional = true
      return pgInputFactoryWrapper
    },
    list: () => {
      pgInputFactoryWrapper.value.isList = true
      return pgInputFactoryWrapper
    },
    default: (value) => {
      pgInputFactoryWrapper.value.default = value
      return pgInputFactoryWrapper
    },
    validation: (builder) => {
      pgInputFactoryWrapper.value.validator = builder
      return pgInputFactoryWrapper
    },
    edit: (e) => {
      const editFieldMap = Object.entries(fieldMap).reduce<{
        [name: string]:
          | PGInputFactoryWrapper<any>
          | PGInputFactoryUnion<any>
          | PGInputFactory<any, any>
      }>((acc, [key, value]) => {
        acc[key] = typeof value === 'function' ? value() : value
        return acc
      }, {})
      const result = e(editFieldMap as PGEditInputFactoryFieldMap<any>)
      pgInputFactoryWrapper.value.fieldMap = result
      return pgInputFactoryWrapper as any
    },
    // TODO: Implement the build method.
    build: () => {
      return createInputField({
        kind: 'object',
        type: Function,
      }) as any
    },
  }
  return pgInputFactoryWrapper
}
