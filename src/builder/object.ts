import { withFilter } from 'graphql-subscriptions'
import _ from 'lodash'
import { PGBuilder, PGCache, PGTypes } from '../types/builder'
import { PGScalarLike, PGEnum, PGFieldKindAndType } from '../types/common'
import { PGInputFieldBuilder } from '../types/input'
import {
  PGModifyOutputFieldMap,
  PGObject,
  PGOutputField,
  PGOutputFieldBuilder,
  PGOutputFieldMap,
} from '../types/output'
import { setCache } from './utils'

export const createObjectBuilder: <Types extends PGTypes>(
  cache: PGCache,
  outputFieldBuilder: PGOutputFieldBuilder<Types>,
  inputFieldBuilder: PGInputFieldBuilder<Types>,
) => PGBuilder<Types>['object'] =
  (cache, outputFieldBuilder, inputFieldBuilder) => (name, fieldMap) => {
    const pgObject = createPGObject(
      name,
      fieldMap(outputFieldBuilder),
      cache,
      outputFieldBuilder,
      inputFieldBuilder,
    )
    setCache(cache, pgObject)
    return pgObject
  }

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
      const newFieldMap = c(clonedFieldMap, outputFieldBuilder) as any
      const updated = createPGObject(
        name,
        newFieldMap,
        cache,
        outputFieldBuilder,
        inputFieldBuilder,
      )
      setCache(cache, updated)
      return updated
    },
    modify: (c) => {
      const newFieldMap = c(pgObject.fieldMap as PGModifyOutputFieldMap<any>)
      pgObject.fieldMap = newFieldMap
      return pgObject
    },
  }
  return pgObject
}

export function createPGOutputFieldBuilder<Types extends PGTypes>(
  scalarMap: {
    [name: string]: PGScalarLike
  },
  inputFieldBuilder: PGInputFieldBuilder<Types>,
): PGOutputFieldBuilder<Types> {
  const scalarFieldBuilder = Object.keys(scalarMap).reduce<{
    [name: string]: () => PGOutputField<any>
  }>((acc, key) => {
    acc[key] = () => createOutputField({ kind: 'scalar', type: key }, inputFieldBuilder)
    return acc
  }, {})
  return {
    ...(scalarFieldBuilder as any),
    enum: (type: PGEnum<any>) =>
      createOutputField({ kind: 'enum', type }, inputFieldBuilder),
    object: (type: Function) =>
      createOutputField({ kind: 'object', type }, inputFieldBuilder),
  }
}

export function createOutputField<T, Types extends PGTypes>(
  kindAndType: PGFieldKindAndType,
  inputFieldBuilder: PGInputFieldBuilder<Types>,
): PGOutputField<T, any, undefined, Types> {
  const field: PGOutputField<any> = {
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
      field.value.isOptional = true
      field.value.isNullable = true
      return field
    },
    args: (x) => {
      field.value.args = x(inputFieldBuilder)
      return field
    },
    resolve: (x) => {
      field.value.resolve = (source, args, context, info) =>
        x({ source, args, context, info, __type: undefined })
      return field
    },
    subscribe: (x) => {
      field.value.subscribe = withFilter(
        (source, args, context, info) => {
          const { pubSubIter } = x({ source, args, context, info, __type: undefined })
          return pubSubIter
        },
        (source, args, context, info) => {
          const { filter } = x({ source, args, context, info, __type: undefined })
          return filter !== undefined ? filter() : true
        },
      )
      return field
    },
    auth: (checker) => {
      field.value.authChecker = checker
      return field
    },
    __type: undefined as any,
  }
  return field
}
