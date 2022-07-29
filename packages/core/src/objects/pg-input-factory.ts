import { createInputField } from './pg-input-field'
import type { PGBuilder, PGTypes } from '../types/builder'
import type { PGInput, PGInputField, PGInputFieldMap } from '../types/input'
import type {
  PGEditArgBuilderFieldMap,
  PGArgBuilderField,
  PGArgBuilderFieldMap,
  PGArgBuilderUnion,
  PGArgBuilder,
} from '../types/input-factory'

export function buildPGArgBuilderInWrap(
  argBuilder: PGArgBuilder<any>,
  builder: PGBuilder<any>,
  inputRef: Record<string, PGInput<any> | null>,
): PGInputField<any> {
  inputRef[argBuilder.name] = null
  const pgInputFieldMap = buildPGArgBuilder(argBuilder, builder, inputRef)
  inputRef[argBuilder.name] = builder.input({
    name: argBuilder.name,
    fields: () => pgInputFieldMap,
  })
  return createInputField({
    kind: 'object',
    type: () => inputRef[argBuilder.name],
  })
}

export function buildPGArgBuilder(
  argBuilder: PGArgBuilder<any>,
  builder: PGBuilder<any>,
  inputRef: Record<string, PGInput<any> | null>,
): PGInputFieldMap {
  return Object.entries(argBuilder.value.fieldMap as PGArgBuilderFieldMap).reduce<{
    [name: string]: PGInputField<any>
  }>((acc, [key, argBuilder]) => {
    acc[key] = convertPGArgBuilderFieldToPGInputField(argBuilder, builder, inputRef)
    return acc
  }, {})
}

export function convertPGArgBuilderFieldToPGInputField(
  field: PGArgBuilderField,
  builder: PGBuilder<any>,
  inputRef: Record<string, PGInput<any> | null>,
): PGInputField<any> {
  if (typeof field === 'function' || 'fieldMap' in field.value) {
    const pgArgBuilder = (
      typeof field === 'function' ? field() : field
    ) as PGArgBuilder<any>
    if (inputRef[pgArgBuilder.name] === undefined) {
      const newPGInput = builder.input({
        name: pgArgBuilder.name,
        fields: () => {
          const pgInputField = buildPGArgBuilderInWrap(pgArgBuilder, builder, inputRef)
          return (pgInputField.value.type as Function)().value.fieldMap
        },
      })
      if (pgArgBuilder.value.validator !== undefined)
        newPGInput.validation(pgArgBuilder.value.validator)
      inputRef[pgArgBuilder.name] = newPGInput
    }

    const newPGInputField = createInputField({
      kind: 'object',
      type: () => inputRef[pgArgBuilder.name],
    })
    if (pgArgBuilder.value.isOptional) newPGInputField.optional()
    if (pgArgBuilder.value.isNullable) newPGInputField.nullable()
    if (pgArgBuilder.value.isList) newPGInputField.list()
    if (pgArgBuilder.value.default !== undefined)
      newPGInputField.default(pgArgBuilder.value.default)

    return newPGInputField
  }
  if ('builderMap' in field.value) {
    return convertPGArgBuilderFieldToPGInputField(
      (field as PGArgBuilderUnion<any>).value.builderMap.__default,
      builder,
      inputRef,
    )
  }
  return field as PGInputField<any>
}

export function createPGArgBuilderUnion<
  TBuilderMap extends {
    __default: PGArgBuilderField
  } & PGArgBuilderFieldMap,
>(builderMap: TBuilderMap): PGArgBuilderUnion<TBuilderMap> {
  const pgArgBuilderUnion: PGArgBuilderUnion<TBuilderMap> = {
    value: {
      builderMap,
    },
    select: (name) => {
      const selectedField = builderMap[name]
      return typeof selectedField === 'function'
        ? selectedField()
        : (selectedField as any)
    },
  }
  return pgArgBuilderUnion
}

export function createPGArgBuilder<T extends PGArgBuilderFieldMap, Types extends PGTypes>(
  name: string,
  fieldMap: T,
  builder: PGBuilder<Types>,
): PGArgBuilder<T, Types> {
  const pgArgBuilder: PGArgBuilder<any> = {
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
      pgArgBuilder.value.isNullable = isNullish ?? true
      pgArgBuilder.value.isOptional = isNullish ?? true
      return pgArgBuilder
    },
    nullable: (isNullable) => {
      pgArgBuilder.value.isNullable = isNullable ?? true
      return pgArgBuilder
    },
    optional: (isOptional) => {
      pgArgBuilder.value.isOptional = isOptional ?? true
      return pgArgBuilder
    },
    list: () => {
      pgArgBuilder.value.isList = true
      return pgArgBuilder
    },
    default: (value) => {
      pgArgBuilder.value.default = value
      return pgArgBuilder
    },
    validation: (builder) => {
      pgArgBuilder.value.validator = builder
      return pgArgBuilder
    },
    edit: (c, name) => {
      const fieldMap = Object.entries(pgArgBuilder.value.fieldMap).reduce<{
        [name: string]: PGArgBuilder<any> | PGArgBuilderUnion<any> | PGInputField<any>
      }>((acc, [key, value]) => {
        acc[key] = typeof value === 'function' ? value() : value
        return acc
      }, {})
      const editedFieldMap = c(fieldMap as PGEditArgBuilderFieldMap<any>)

      const editedPGArgBuilder: PGArgBuilder<any> = createPGArgBuilder(
        name ?? pgArgBuilder.name,
        editedFieldMap as any,
        builder,
      )
      if (pgArgBuilder.value.isNullable) editedPGArgBuilder.nullable()
      if (pgArgBuilder.value.isOptional) editedPGArgBuilder.optional()
      if (pgArgBuilder.value.isList) editedPGArgBuilder.list()
      if (pgArgBuilder.value.default !== undefined)
        editedPGArgBuilder.default(pgArgBuilder.value.default)
      if (pgArgBuilder.value.validator !== undefined)
        editedPGArgBuilder.validation(pgArgBuilder.value.validator)
      return editedPGArgBuilder as any
    },
    build: (options) => {
      const inputRef: Record<string, PGInput<any> | null> = {}
      const result =
        options?.wrap === true
          ? (buildPGArgBuilderInWrap(pgArgBuilder, builder, inputRef) as any)
          : buildPGArgBuilder(pgArgBuilder, builder, inputRef)
      return result
    },
  }
  return pgArgBuilder
}
