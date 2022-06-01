import { GraphQLObjectType } from 'graphql'
import _ from 'lodash'
import { setCache } from '../builder/utils'
import { PGTypes, PGCache, GraphqlTypeRef } from '../types/builder'
import { PGInputFieldBuilder } from '../types/input'
import {
  PGOutputFieldMap,
  PGOutputFieldBuilder,
  PGObject,
  PGModifyOutputFieldMap,
} from '../types/output'
import { convertToGraphQLFieldConfig, createOutputField } from './pg-output-field'

export function createPGObject<TFieldMap extends PGOutputFieldMap, Types extends PGTypes>(
  name: string,
  fieldMap: TFieldMap,
  cache: PGCache,
  outputFieldBuilder: PGOutputFieldBuilder<Types>,
  inputFieldBuilder: PGInputFieldBuilder<Types>,
): PGObject<TFieldMap> {
  const pgObject: PGObject<TFieldMap> = {
    name,
    fieldMap,
    kind: 'object',
    copy: (name) => {
      const newFieldMap = _.mapValues(pgObject.fieldMap, (field) => {
        const clonedValue = _.cloneDeep(field.value)
        const newField = createOutputField(clonedValue, inputFieldBuilder)
        newField.value = clonedValue
        return newField
      })
      const copy = createPGObject(
        name,
        newFieldMap,
        cache,
        outputFieldBuilder,
        inputFieldBuilder,
      )
      setCache(cache, copy)
      return copy as PGObject<any>
    },
    update: (c) => {
      const clonedFieldMap = _.mapValues(pgObject.fieldMap, (field) => {
        const clonedValue = _.cloneDeep(field.value)
        const newField = createOutputField(clonedValue, inputFieldBuilder)
        newField.value = clonedValue
        return newField
      }) as any
      const newFieldMap = c(clonedFieldMap, outputFieldBuilder)
      const updated = createPGObject(
        name,
        newFieldMap as any,
        cache,
        outputFieldBuilder,
        inputFieldBuilder,
      )
      setCache(cache, updated)
      return updated
    },
    modify: (c) => {
      c(pgObject.fieldMap as PGModifyOutputFieldMap<any>)
      return pgObject
    },
    prismaModel: (name) => {
      pgObject.prismaModelName = name
      return pgObject
    },
  }
  return pgObject
}

export function convertToGraphQLObject(
  pgObject: PGObject<PGOutputFieldMap>,
  cache: PGCache,
  graphqlTypeRef: GraphqlTypeRef,
): GraphQLObjectType {
  return new GraphQLObjectType({
    name: pgObject.name,
    fields: () =>
      _.mapValues(pgObject.fieldMap, (field) =>
        convertToGraphQLFieldConfig(field, cache, graphqlTypeRef),
      ),
  })
}
