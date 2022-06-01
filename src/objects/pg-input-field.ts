import { GraphQLInputFieldConfig } from 'graphql'
import _ from 'lodash'
import { GraphqlTypeRef, PGCache, PGTypes } from '../types/builder'
import { PGFieldKindAndType } from '../types/common'
import { PGInputField } from '../types/input'
import { getGraphQLFieldConfigType } from './util'

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

export function convertToGraphQLInputFieldConfig(
  field: PGInputField<any>,
  cache: PGCache,
  graphqlTypeRef: GraphqlTypeRef,
): GraphQLInputFieldConfig {
  return {
    type: getGraphQLFieldConfigType(field, cache, graphqlTypeRef),
    defaultValue: getInputFieldDefaultValue(field),
  }
}

export function getInputFieldDefaultValue(field: PGInputField<any>): any {
  if (field.value.default !== undefined) {
    return field.value.default
  }
  if (field.value.kind !== 'object') {
    return undefined
  }
  const pgInput = field.value.type()
  const defaultValue = _.mapValues(pgInput.fieldMap, (field) =>
    getInputFieldDefaultValue(field),
  )
  return Object.values(defaultValue).every((x) => x === undefined)
    ? undefined
    : defaultValue
}
