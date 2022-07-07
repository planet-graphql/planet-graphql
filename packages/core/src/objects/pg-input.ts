import { GraphQLInputObjectType } from 'graphql'
import _ from 'lodash'
import { setCache } from '../builder/utils'
import { convertToGraphQLInputFieldConfig, createInputField } from './pg-input-field'
import type { PGTypes, PGCache, GraphqlTypeRef, PGBuilder } from '../types/builder'
import type { PGInputFieldMap, PGInputFieldBuilder, PGInput } from '../types/input'

export function createPGInput<T extends PGInputFieldMap, Types extends PGTypes>(
  name: string,
  fieldMap: T,
  cache: PGCache,
  inputFieldBuilder: PGInputFieldBuilder<Types>,
): PGInput<T> {
  const pgInput: PGInput<T> = {
    name,
    value: {
      fieldMap,
    },
    kind: 'input' as const,
    copy: (name) => {
      const newFieldMap = _.mapValues(pgInput.value.fieldMap, (field) => {
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
      const clonedFieldMap = _.mapValues(pgInput.value.fieldMap, (field) => {
        const clonedValue = _.cloneDeep(field.value)
        const newField = createInputField(clonedValue)
        newField.value = clonedValue
        return newField
      })
      const newFieldMap = c(clonedFieldMap as any, inputFieldBuilder)
      const updated = createPGInput(name, newFieldMap as any, cache, inputFieldBuilder)
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

export function convertToGraphQLInputObject(
  pgInput: PGInput<PGInputFieldMap>,
  builder: PGBuilder<any>,
  graphqlTypeRef: GraphqlTypeRef,
): GraphQLInputObjectType {
  return new GraphQLInputObjectType({
    name: pgInput.name,
    fields: () =>
      _.mapValues(pgInput.value.fieldMap, (field) =>
        convertToGraphQLInputFieldConfig(field, builder, graphqlTypeRef),
      ),
  })
}
