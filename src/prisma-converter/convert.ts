import { DMMF } from '@prisma/generator-helper'
import _ from 'lodash'
import { setCache } from '../builder/utils'
import { createPGInputFactory } from '../objects/pg-input-factory'
import { PGBuilder, PGCache, PGTypes } from '../types/builder'
import { PGEnum } from '../types/common'
import { PGInputFactory, PGInputFactoryFieldMap } from '../types/input-factory'
import { PGObject } from '../types/output'
import { PGPrismaConverter } from '../types/prisma-converter'
import {
  convertDMMFArgsToPGInputFactoryFieldMap,
  convertDMMFModelToPGObject,
} from './utils'

export const getConvertFunction: <Types extends PGTypes>(
  builder: PGBuilder<Types>,
  dmmf: DMMF.Document,
  pgEnumMap: Record<string, PGEnum<any>>,
  pgObjectRef: Record<string, PGObject<any> | (() => PGObject<any>)>,
) => PGPrismaConverter<Types>['convert'] =
  (builder, dmmf, pgEnumMap, pgObjectRef) => (updatedObjectRef) => {
    const updatedObjectNames = Object.keys(updatedObjectRef ?? {})
    const pgObjectMapFromDmmf = convertToPGObjectMap(
      dmmf.datamodel.models,
      updatedObjectNames,
      pgEnumMap,
      pgObjectRef,
      builder,
    )
    setPGObjectRef(
      pgObjectRef,
      pgObjectMapFromDmmf,
      (updatedObjectRef ?? {}) as Record<string, () => PGObject<any>>,
    )
    setObjectRefIntoCache(builder.cache(), pgObjectRef)
    setPGEnumMapIntoCache(builder.cache(), pgEnumMap)
    const pgInputFactoryMap = convertToPGInputFactoryMap(dmmf.schema, pgEnumMap)

    const getters = {
      objects: (name: string) => {
        const ref = pgObjectRef[name]
        return typeof ref === 'function' ? ref() : ref
      },
      relations: (name: string) => {
        const tmap = _.mapValues(pgObjectRef, (ref) =>
          typeof ref === 'function' ? ref : () => ref,
        )
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete tmap[name]
        return tmap
      },
      inputs: (name: string) => pgInputFactoryMap[name],
      enums: (name: string) => pgEnumMap[name],
    }
    return getters as any
  }

export function convertToPGObjectMap<Types extends PGTypes>(
  dmmfModels: DMMF.Model[],
  omitModelNames: string[],
  pgEnumMap: Record<string, PGEnum<any>>,
  pgObjectRef: Record<string, PGObject<any> | (() => PGObject<any>)>,
  builder: PGBuilder<Types>,
): Record<string, PGObject<any>> {
  const objectMap = dmmfModels.reduce<Record<string, PGObject<any>>>((acc, dmmfModel) => {
    if (omitModelNames.includes(dmmfModel.name)) {
      return acc
    }
    const pgObject = convertDMMFModelToPGObject(
      dmmfModel,
      pgEnumMap,
      pgObjectRef,
      builder,
    )
    acc[pgObject.name] = pgObject
    return acc
  }, {})
  return objectMap
}

export function convertToPGInputFactoryMap(
  dmmfSchema: DMMF.Schema,
  pgEnumMap: Record<string, PGEnum<any>>,
): Record<string, PGInputFactory<any>> {
  const inputFactoryFieldMapRef: Record<string, PGInputFactoryFieldMap> = {}
  for (const inputType of dmmfSchema.inputObjectTypes.prisma) {
    const fieldMap = convertDMMFArgsToPGInputFactoryFieldMap(
      inputType.fields,
      inputFactoryFieldMapRef,
      pgEnumMap,
    )
    inputFactoryFieldMapRef[inputType.name] = fieldMap
  }
  const pgInputFactoryMap = dmmfSchema.outputObjectTypes.prisma
    .filter((x) => x.name === 'Query' || x.name === 'Mutation')
    .flatMap((x) => x.fields)
    .reduce<Record<string, PGInputFactory<any>>>((acc, dmmfSchemaField) => {
      const fieldMap = convertDMMFArgsToPGInputFactoryFieldMap(
        dmmfSchemaField.args,
        inputFactoryFieldMapRef,
        pgEnumMap,
      )
      const inputFactory = createPGInputFactory(fieldMap)
      acc[dmmfSchemaField.name] = inputFactory
      return acc
    }, {})

  return pgInputFactoryMap
}

export function setPGObjectRef(
  pgObjectRef: Record<string, PGObject<any> | (() => PGObject<any>)>,
  pgObjectMapFromDmmf: Record<string, PGObject<any>>,
  updatedObjectRef: Record<string, () => PGObject<any>>,
): void {
  for (const [, x] of Object.entries(pgObjectMapFromDmmf)) {
    pgObjectRef[x.name] = x
  }
  for (const [name, x] of Object.entries(updatedObjectRef)) {
    pgObjectRef[name] = x
  }
}

export function setObjectRefIntoCache(
  cache: PGCache,
  pgObjectRef: Record<string, PGObject<any> | (() => PGObject<any>)>,
): void {
  for (const [name, ref] of Object.entries(pgObjectRef)) {
    setCache(
      cache,
      typeof ref === 'function'
        ? {
            name,
            kind: 'objectRef',
            ref,
          }
        : ref,
    )
  }
}

export function setPGEnumMapIntoCache(
  cache: PGCache,
  pgEnumMap: Record<string, PGEnum<any>>,
): void {
  for (const [, x] of Object.entries(pgEnumMap)) {
    setCache(cache, x)
  }
}
