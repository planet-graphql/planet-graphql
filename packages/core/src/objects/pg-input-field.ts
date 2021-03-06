import _ from 'lodash'
import { getGraphQLFieldConfigType } from './util'
import type { GraphqlTypeRef, PGBuilder, PGTypes } from '../types/builder'
import type { PGFieldKindAndType } from '../types/common'
import type { PGInputField, PGRelayInputFieldMap } from '../types/input'
import type { GraphQLInputFieldConfig } from 'graphql'

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
    nullable: (isNullable) => {
      field.value.isNullable = isNullable ?? true
      return field
    },
    optional: (isOptional) => {
      field.value.isOptional = isOptional ?? true
      return field
    },
    nullish: (isNullish) => {
      field.value.isOptional = isNullish ?? true
      field.value.isNullable = isNullish ?? true
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
  builder: PGBuilder<any>,
  graphqlTypeRef: GraphqlTypeRef,
): GraphQLInputFieldConfig {
  return {
    type: getGraphQLFieldConfigType(field, builder, graphqlTypeRef),
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

export function getRelayInputFieldMap<
  Types extends PGTypes,
>(): PGRelayInputFieldMap<Types> {
  return {
    first: createInputField<number, 'int', Types>({
      kind: 'scalar',
      type: 'int',
    }).optional(),
    after: createInputField<string, 'string', Types>({
      kind: 'scalar',
      type: 'string',
    }).optional(),
    last: createInputField<number, 'int', Types>({
      kind: 'scalar',
      type: 'int',
    }).optional(),
    before: createInputField<string, 'string', Types>({
      kind: 'scalar',
      type: 'string',
    }).optional(),
  }
}
