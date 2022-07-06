import { GraphQLObjectType } from 'graphql'
import _ from 'lodash'
import { setCache } from '../builder/utils'
import { PGTypes, PGCache, GraphqlTypeRef, PGBuilder } from '../types/builder'
import { PGInputFieldBuilder } from '../types/input'
import {
  PGOutputFieldMap,
  PGOutputFieldBuilder,
  PGObject,
  PGModifyOutputFieldMap,
  PGInterface,
  PGObjectOptionsDefault,
} from '../types/output'
import { convertToGraphQLInterface } from './pg-interface'
import { convertToGraphQLFieldConfig, createOutputField } from './pg-output-field'

export function createPGObject<
  T extends PGOutputFieldMap,
  TInterfaces extends Array<PGInterface<any>>,
  Types extends PGTypes,
>(
  name: string,
  fieldMap: PGOutputFieldMap,
  cache: PGCache,
  outputFieldBuilder: PGOutputFieldBuilder<Types>,
  inputFieldBuilder: PGInputFieldBuilder<Types>,
  interfaces?: TInterfaces,
  isTypeOf?: (value: any) => boolean,
): PGObject<T, TInterfaces, PGObjectOptionsDefault<Types>, Types> {
  const interfacesFieldMap = interfaces?.reduce<PGOutputFieldMap>((acc, x) => {
    return Object.assign(acc, copyOutputFieldMap(x.value.fieldMap, inputFieldBuilder))
  }, {})
  const totalFieldMap = Object.assign(fieldMap, interfacesFieldMap)
  const pgObject: PGObject<T, TInterfaces, PGObjectOptionsDefault<Types>, Types> = {
    name,
    kind: 'object',
    value: {
      fieldMap: totalFieldMap as T,
      interfaces,
      isTypeOf,
    },
    copy: (config) => {
      const orifinalFieldMap = copyOutputFieldMap(
        pgObject.value.fieldMap,
        inputFieldBuilder,
      )
      const appendFieldMap = config.fields(orifinalFieldMap as any, outputFieldBuilder)
      const updatedFieldMap = Object.assign(appendFieldMap, orifinalFieldMap)
      const copy = createPGObject<any, TInterfaces, Types>(
        config.name,
        updatedFieldMap,
        cache,
        outputFieldBuilder,
        inputFieldBuilder,
        pgObject.value.interfaces,
        pgObject.value.isTypeOf,
      )
      setCache(cache, copy)
      return copy
    },
    modify: (c) => {
      c(pgObject.value.fieldMap as PGModifyOutputFieldMap<any>)
      return pgObject
    },
    prismaModel: (name) => {
      pgObject.value.prismaModelName = name
      return pgObject
    },
  }
  return pgObject
}

export function convertToGraphQLObject(
  pgObject: PGObject<PGOutputFieldMap, Array<PGInterface<any>> | undefined>,
  builder: PGBuilder<any>,
  graphqlTypeRef: GraphqlTypeRef,
): GraphQLObjectType {
  return new GraphQLObjectType({
    name: pgObject.name,
    fields: () =>
      _.mapValues(pgObject.value.fieldMap, (field, fieldName) =>
        convertToGraphQLFieldConfig(
          field,
          fieldName,
          pgObject.name,
          builder,
          graphqlTypeRef,
        ),
      ),
    interfaces:
      pgObject.value.interfaces === undefined
        ? undefined
        : () => {
            const { interfaces } = graphqlTypeRef()
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return pgObject.value.interfaces!.map(
              (x) =>
                interfaces[x.name] ??
                convertToGraphQLInterface(x, builder, graphqlTypeRef),
            )
          },
    isTypeOf: pgObject.value.isTypeOf,
  })
}

export function copyOutputFieldMap<Types extends PGTypes>(
  fieldMap: PGOutputFieldMap,
  inputFieldBuilder: PGInputFieldBuilder<Types>,
): PGOutputFieldMap {
  return _.mapValues(fieldMap, (field) => {
    const clonedValue = _.cloneDeep(field.value)
    const newField = createOutputField(clonedValue, inputFieldBuilder)
    newField.value = clonedValue
    return newField
  })
}
