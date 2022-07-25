import { createInputField } from './pg-input-field'
import type { PGBuilder, PGTypes } from '../types/builder'
import type { PGInput, PGInputField, PGInputFieldMap } from '../types/input'
import type {
  PGEditInputFactoryFieldMap,
  PGInputFactoryField,
  PGInputFactoryFieldMap,
  PGInputFactoryUnion,
  PGInputFactory,
} from '../types/input-factory'

export function buildPGInputFactoryInWrap(
  factory: PGInputFactory<any>,
  builder: PGBuilder<any>,
  inputRef: Record<string, PGInput<any> | null>,
): PGInputField<any> {
  inputRef[factory.name] = null
  const pgInputFieldMap = buildPGInputFactory(factory, builder, inputRef)
  inputRef[factory.name] = builder.input({
    name: factory.name,
    fields: () => pgInputFieldMap,
  })
  return createInputField({
    kind: 'object',
    type: () => inputRef[factory.name],
  })
}

export function buildPGInputFactory(
  factory: PGInputFactory<any>,
  builder: PGBuilder<any>,
  inputRef: Record<string, PGInput<any> | null>,
): PGInputFieldMap {
  return Object.entries(factory.value.fieldMap as PGInputFactoryFieldMap).reduce<{
    [name: string]: PGInputField<any>
  }>((acc, [key, factory]) => {
    acc[key] = convertPGInputFactoryFieldToPGInputField(factory, builder, inputRef)
    return acc
  }, {})
}

export function convertPGInputFactoryFieldToPGInputField(
  field: PGInputFactoryField,
  builder: PGBuilder<any>,
  inputRef: Record<string, PGInput<any> | null>,
): PGInputField<any> {
  if (typeof field === 'function' || 'fieldMap' in field.value) {
    const pgInputFactory = (
      typeof field === 'function' ? field() : field
    ) as PGInputFactory<any>
    if (inputRef[pgInputFactory.name] === undefined) {
      const newPGInput = builder.input({
        name: pgInputFactory.name,
        fields: () => {
          const pgInputField = buildPGInputFactoryInWrap(
            pgInputFactory,
            builder,
            inputRef,
          )
          return (pgInputField.value.type as Function)().value.fieldMap
        },
      })
      if (pgInputFactory.value.validator !== undefined)
        newPGInput.validation(pgInputFactory.value.validator)
      inputRef[pgInputFactory.name] = newPGInput
    }

    const newPGInputField = createInputField({
      kind: 'object',
      type: () => inputRef[pgInputFactory.name],
    })
    if (pgInputFactory.value.isOptional) newPGInputField.optional()
    if (pgInputFactory.value.isNullable) newPGInputField.nullable()
    if (pgInputFactory.value.isList) newPGInputField.list()
    if (pgInputFactory.value.default !== undefined)
      newPGInputField.default(pgInputFactory.value.default)

    return newPGInputField
  }
  if ('factoryMap' in field.value) {
    return convertPGInputFactoryFieldToPGInputField(
      (field as PGInputFactoryUnion<any>).value.factoryMap.__default,
      builder,
      inputRef,
    )
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
>(name: string, fieldMap: T, builder: PGBuilder<Types>): PGInputFactory<T, Types> {
  const pgInputFactory: PGInputFactory<any> = {
    name,
    value: {
      fieldMap,
      builder,
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
    edit: (c, name) => {
      const fieldMap = Object.entries(pgInputFactory.value.fieldMap).reduce<{
        [name: string]: PGInputFactory<any> | PGInputFactoryUnion<any> | PGInputField<any>
      }>((acc, [key, value]) => {
        acc[key] = typeof value === 'function' ? value() : value
        return acc
      }, {})
      const editedFieldMap = c(fieldMap as PGEditInputFactoryFieldMap<any>)

      const editedPGInputFactory: PGInputFactory<any> = createPGInputFactory(
        name ?? pgInputFactory.name,
        editedFieldMap as any,
        builder,
      )
      if (pgInputFactory.value.isNullable) editedPGInputFactory.nullable()
      if (pgInputFactory.value.isOptional) editedPGInputFactory.optional()
      if (pgInputFactory.value.isList) editedPGInputFactory.list()
      if (pgInputFactory.value.default !== undefined)
        editedPGInputFactory.default(pgInputFactory.value.default)
      if (pgInputFactory.value.validator !== undefined)
        editedPGInputFactory.validation(pgInputFactory.value.validator)
      return editedPGInputFactory as any
    },
    build: (options) => {
      const inputRef: Record<string, PGInput<any> | null> = {}
      const result =
        options?.wrap === true
          ? (buildPGInputFactoryInWrap(pgInputFactory, builder, inputRef) as any)
          : buildPGInputFactory(pgInputFactory, builder, inputRef)
      return result
    },
  }
  return pgInputFactory
}
