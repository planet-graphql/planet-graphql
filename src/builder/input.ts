import _ from 'lodash'
import { PGBuilder, PGCache, PGTypes } from '../types/builder'
import { PGEnum, PGFieldKindAndType, PGScalarLike } from '../types/common'
import {
  PGInput,
  PGInputField,
  PGInputFieldBuilder,
  PGInputFieldMap,
} from '../types/input'
import { setCache } from './utils'

export const createInputBuilder: <Types extends PGTypes>(
  cache: PGCache,
  inputFieldBuilder: PGInputFieldBuilder<Types>,
) => PGBuilder<Types>['input'] = (cache, inputFieldBuilder) => (name, fieldMap) => {
  const pgInput = createPGInput(
    name,
    fieldMap(inputFieldBuilder),
    cache,
    inputFieldBuilder,
  )
  setCache(cache, pgInput)
  return pgInput
}

export function createPGInput<T extends PGInputFieldMap, Types extends PGTypes>(
  name: string,
  fieldMap: T,
  cache: PGCache,
  inputFieldBuilder: PGInputFieldBuilder<Types>,
): PGInput<T> {
  const pgInput: PGInput<T> = {
    name,
    fieldMap,
    value: {},
    kind: 'input' as const,
    copy: (name) => {
      const newFieldMap = _.mapValues(pgInput.fieldMap, (field) => {
        const clonedValue = _.cloneDeep(field.value)
        const newField = createInputField(clonedValue)
        newField.value = clonedValue
        return newField
      })
      const copy = createPGInput(name, newFieldMap, cache, inputFieldBuilder)
      setCache(cache, copy)
      return copy as PGInput<any>
    },
    update: (c) => {
      const clonedFieldMap = _.mapValues(pgInput.fieldMap, (field) => {
        const clonedValue = _.cloneDeep(field.value)
        const newField = createInputField(clonedValue)
        newField.value = clonedValue
        return newField
      }) as any
      const newFieldMap = c(clonedFieldMap, inputFieldBuilder) as any
      const updated = createPGInput(name, newFieldMap, cache, inputFieldBuilder)
      setCache(cache, updated)
      return updated
    },
    validation: (validator) => {
      pgInput.value.validator = validator
      return pgInput
    },
  }
  return pgInput
}

export function createPGInputFieldBuilder<Types extends PGTypes>(scalarMap: {
  [name: string]: PGScalarLike
}): PGInputFieldBuilder<Types> {
  const scalarFieldBuilder = Object.keys(scalarMap).reduce<{
    [name: string]: () => PGInputField<any>
  }>((acc, key) => {
    acc[key] = () => createInputField({ kind: 'scalar', type: key })
    return acc
  }, {})
  return {
    ...(scalarFieldBuilder as any),
    enum: (type: PGEnum<any>) => createInputField({ kind: 'enum', type }),
    input: (type: Function) => createInputField({ kind: 'object', type }),
  }
}

export function createInputField<T, TypeName extends string, Types extends PGTypes>(
  kindAndType: PGFieldKindAndType,
): PGInputField<T, TypeName, Types> {
  const field: PGInputField<any> = {
    value: {
      ...kindAndType,
      isOptional: false,
      isNullable: false,
      isList: false,
    },
    list: () => {
      field.value.isList = true
      return field
    },
    nullable: () => {
      field.value.isNullable = true
      return field
    },
    optional: () => {
      field.value.isOptional = true
      return field
    },
    nullish: () => {
      field.value.isOptional = true
      field.value.isNullable = true
      return field
    },
    default: (value: any) => {
      field.value.default = value
      return field
    },
    validation: (validator) => {
      field.value.validator = validator
      return field
    },
    __type: undefined as any,
  }
  return field
}
