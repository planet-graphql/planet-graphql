import _ from 'lodash'
import { setCache } from '../builder/utils'
import { convertDMMFModelToPGObject } from './utils'
import type { PGBuilder, PGCache, PGTypes } from '../types/builder'
import type { PGEnum } from '../types/common'
import type { PGObject } from '../types/output'
import type { PGPrismaConverter } from '../types/prisma-converter'
import type { DMMF } from '@prisma/generator-helper'

export const getConvertTypesFunction: <Types extends PGTypes>(
  builder: PGBuilder<Types>,
  dmmf: DMMF.Document,
  pgEnumMap: Record<string, PGEnum<any>>,
  pgObjectRef: Record<string, PGObject<any> | (() => PGObject<any>)>,
) => PGPrismaConverter<Types>['convertTypes'] =
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

    const getters = {
      objects: _.mapValues(pgObjectRef, (x) => (typeof x === 'function' ? x() : x)),
      enums: pgEnumMap,
      getRelations: (name: string) => {
        const tmap = _.mapValues(pgObjectRef, (ref) =>
          typeof ref === 'function' ? ref : () => ref,
        )
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete tmap[name]
        return tmap
      },
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
