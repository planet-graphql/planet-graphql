import _ from 'lodash'
import { PGBuilder, PGTypes } from '../types/builder'
import { PGInputField } from '../types/input'
import {
  PGEditInputFactoryFieldMap,
  PGInputFactoryField,
  PGInputFactory,
  PGInputFactoryFieldMap,
  PGInputFactoryUnion,
  PGInputFactoryWrapper,
} from '../types/input-factory'
import { createInputField } from './pg-input-field'

export function createBuildFieldMap(
  field: PGInputFactoryField,
  prefix: string,
  name: string,
  builder: PGBuilder,
): PGInputField<any> {
  if (typeof field === 'function' || 'fieldMap' in field.value) {
    const factoryWrapper = (
      typeof field === 'function' ? field() : field
    ) as PGInputFactoryWrapper<any>

    const newPGInput = builder.input(
      `${prefix}${_.upperFirst(name)}`,
      () => factoryWrapper.build(`${prefix}${_.upperFirst(name)}`, builder) as any,
    )
    if (factoryWrapper.value.validator !== undefined)
      newPGInput.validation(factoryWrapper.value.validator)

    const newPGInputField = createInputField({
      kind: 'object',
      type: () => newPGInput,
    })
    if (factoryWrapper.value.isOptional) newPGInputField.optional()
    if (factoryWrapper.value.isNullable) newPGInputField.nullable()
    if (factoryWrapper.value.isList) newPGInputField.list()
    if (factoryWrapper.value.default !== undefined)
      newPGInputField.default(factoryWrapper.value.default)

    return newPGInputField
  }
  if ('factoryMap' in field.value) {
    return createBuildFieldMap(
      (field as PGInputFactoryUnion<any>).value.factoryMap.__default,
      prefix,
      name,
      builder,
    )
  }
  if (field.value.kind === 'enum') {
    const cache = builder.cache()
    if (cache.enum[field.value.type.name] === undefined)
      cache.enum[field.value.type.name] = field.value.type
  }
  return field as PGInputField<any>
}

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
    nullish: (isNullish) => {
      pgInputFactoryWrapper.value.isNullable = isNullish ?? true
      pgInputFactoryWrapper.value.isOptional = isNullish ?? true
      return pgInputFactoryWrapper
    },
    nullable: (isNullable) => {
      pgInputFactoryWrapper.value.isNullable = isNullable ?? true
      return pgInputFactoryWrapper
    },
    optional: (isOptional) => {
      pgInputFactoryWrapper.value.isOptional = isOptional ?? true
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
      const editFieldMap = Object.entries(pgInputFactoryWrapper.value.fieldMap).reduce<{
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
    build: (name, builder, wrap) => {
      const pgInputFieldMap = Object.entries(
        pgInputFactoryWrapper.value.fieldMap as PGInputFactoryFieldMap,
      ).reduce<{
        [name: string]: PGInputField<any>
      }>((acc, [key, factory]) => {
        acc[key] = createBuildFieldMap(factory, name, key, builder)
        return acc
      }, {})
      return wrap === true
        ? (createInputField({
            kind: 'object',
            type: () => builder.input(name, () => pgInputFieldMap),
          }) as any)
        : pgInputFieldMap
    },
  }
  return pgInputFactoryWrapper
}
