import _ from 'lodash'
import { PGBuilder, PGTypes } from '../types/builder'
import { PGInputField } from '../types/input'
import {
  PGEditInputFactoryFieldMap,
  PGInputFactoryField,
  PGInputFactoryFieldMap,
  PGInputFactoryUnion,
  PGInputFactory,
} from '../types/input-factory'
import { createInputField } from './pg-input-field'

export function createBuildFieldMap(
  field: PGInputFactoryField,
  prefix: string,
  name: string,
  builder: PGBuilder,
): PGInputField<any> {
  if (typeof field === 'function' || 'fieldMap' in field.value) {
    const pgInputFactory = (
      typeof field === 'function' ? field() : field
    ) as PGInputFactory<any>

    const newPGInput = builder.input(
      `${prefix}${_.upperFirst(name)}`,
      () => pgInputFactory.build(`${prefix}${_.upperFirst(name)}`, builder) as any,
    )
    if (pgInputFactory.value.validator !== undefined)
      newPGInput.validation(pgInputFactory.value.validator)

    const newPGInputField = createInputField({
      kind: 'object',
      type: () => newPGInput,
    })
    if (pgInputFactory.value.isOptional) newPGInputField.optional()
    if (pgInputFactory.value.isNullable) newPGInputField.nullable()
    if (pgInputFactory.value.isList) newPGInputField.list()
    if (pgInputFactory.value.default !== undefined)
      newPGInputField.default(pgInputFactory.value.default)

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

export function createPGInputFactory<
  T extends PGInputFactoryFieldMap,
  Types extends PGTypes,
>(fieldMap: T): PGInputFactory<T, Types> {
  const pgInputFactory: PGInputFactory<any> = {
    value: {
      fieldMap,
      kind: 'object',
      type: Function,
      isOptional: false,
      isNullable: false,
      isList: false,
    },
    nullish: (isNullish) => {
      pgInputFactory.value.isNullable = isNullish ?? true
      pgInputFactory.value.isOptional = isNullish ?? true
      return pgInputFactory
    },
    nullable: (isNullable) => {
      pgInputFactory.value.isNullable = isNullable ?? true
      return pgInputFactory
    },
    optional: (isOptional) => {
      pgInputFactory.value.isOptional = isOptional ?? true
      return pgInputFactory
    },
    list: () => {
      pgInputFactory.value.isList = true
      return pgInputFactory
    },
    default: (value) => {
      pgInputFactory.value.default = value
      return pgInputFactory
    },
    validation: (builder) => {
      pgInputFactory.value.validator = builder
      return pgInputFactory
    },
    edit: (e) => {
      const editFieldMap = Object.entries(pgInputFactory.value.fieldMap).reduce<{
        [name: string]: PGInputFactory<any> | PGInputFactoryUnion<any> | PGInputField<any>
      }>((acc, [key, value]) => {
        acc[key] = typeof value === 'function' ? value() : value
        return acc
      }, {})
      const result = e(editFieldMap as PGEditInputFactoryFieldMap<any>)
      pgInputFactory.value.fieldMap = result
      return pgInputFactory as any
    },
    build: (name, builder, wrap) => {
      const pgInputFieldMap = Object.entries(
        pgInputFactory.value.fieldMap as PGInputFactoryFieldMap,
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
  return pgInputFactory
}
