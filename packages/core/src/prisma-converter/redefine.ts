import { PGError } from '../builder/utils'
import { createPGObject } from '../objects/pg-object'
import { convertDMMFModelToPGObject } from './utils'
import type { PGBuilder, PGTypes } from '../types/builder'
import type { PGEnum } from '../types/common'
import type { PGObject } from '../types/output'
import type { PGPrismaConverter } from '../types/prisma-converter'
import type { DMMF } from '@prisma/generator-helper'

export const getRedefineFunction: <Types extends PGTypes>(
  builder: PGBuilder<Types>,
  dmmf: DMMF.Document,
  pgEnumMap: Record<string, PGEnum<any>>,
  pgObjectRef: Record<string, PGObject<any>>,
) => PGPrismaConverter<Types>['redefine'] =
  (builder, dmmf, pgEnumMap, pgObjectRef) => (config) => {
    const dmmfModel = dmmf.datamodel.models.find((x) => x.name === config.name)
    if (dmmfModel === undefined) {
      throw new PGError(
        `"${config.name}" does not exist in the DMMF generated from the Prisma schema`,
        'Error',
      )
    }
    const basePGObject = convertDMMFModelToPGObject(
      dmmfModel,
      pgEnumMap,
      pgObjectRef,
      builder,
    )
    const redefinedObject = createPGObject<any, any, any>(
      config.name,
      config.fields(basePGObject.value.fieldMap, builder.fieldBuilders.output),
      builder.cache(),
      builder.fieldBuilders.output,
      builder.fieldBuilders.input,
      config.interfaces,
      config.isTypeOf,
    )
    redefinedObject.prismaModel(config.name)
    return redefinedObject
  }
