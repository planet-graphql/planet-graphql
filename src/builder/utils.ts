import { withFilter } from 'graphql-subscriptions'
import _ from 'lodash'
import { ContextCache, PGCache, PGRootFieldConfig, PGTypes } from '../types/builder'
import { PGEnum, PGFieldKindAndType, PGModel, PGScalarLike } from '../types/common'
import { PGInput, PGInputField, PGInputFieldBuilder } from '../types/input'
import {
  PGObject,
  PGOutputField,
  PGOutputFieldBuilder,
  PGOutputFieldMap,
} from '../types/output'

export class PGError extends Error {
  constructor(message: string, public code: string, public detail?: any) {
    super(message)
    this.name = 'PGError'
    this.code = code
    this.detail = JSON.stringify(detail)
  }
}

export function setCache(
  cache: PGCache,
  value: PGModel<any> | PGObject<any> | PGInput<any> | PGEnum<any> | PGRootFieldConfig,
  overwrite = false,
): void {
  if (overwrite || cache[value.kind][value.name] === undefined) {
    cache[value.kind][value.name] = value
  }
}

export function getCtxCache(context: any): ContextCache {
  if (!_.isPlainObject(context)) {
    throw new PGError('Context must be a plain object.', 'Error')
  }

  if (context.__cache === undefined) {
    const contextCache: ContextCache = {
      loader: {},
      auth: {},
      rootResolveInfo: {
        raw: null,
        parsed: null,
      },
      prismaFindArgs: {},
    }
    context.__cache = contextCache
  }
  return context.__cache
}

export function createOutputField<T, Types extends PGTypes>(
  kindAndType: PGFieldKindAndType,
  inputFieldBuilder: PGInputFieldBuilder<Types>,
): PGOutputField<T, undefined, Types> {
  const field: PGOutputField<any, any, Types> = {
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

export function createInputField<T, TypeName extends string>(
  kindAndType: PGFieldKindAndType,
): PGInputField<T, TypeName> {
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
      field.value.validatorBuilder = validator
      return field
    },
    __type: undefined as any,
  }
  return field
}

export function createPGObject<TFieldMap extends PGOutputFieldMap>(
  name: string,
  fieldMap: TFieldMap,
): PGObject<TFieldMap> {
  const pgObject: PGObject<TFieldMap> = {
    name,
    fieldMap,
    kind: 'object',
  }
  return pgObject
}

// TODO: test
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

// TODO: test
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
