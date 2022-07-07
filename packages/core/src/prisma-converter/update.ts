import { PGError } from '../builder/utils'
import { createPGObject } from '../objects/pg-object'
import { convertDMMFModelToPGObject } from './utils'
import type { PGBuilder, PGTypes } from '../types/builder'
import type { PGEnum } from '../types/common'
import type { PGObject } from '../types/output'
import type { PGPrismaConverter } from '../types/prisma-converter'
import type { DMMF } from '@prisma/generator-helper'

export const getUpdateFunction: <Types extends PGTypes>(
  builder: PGBuilder<Types>,
  dmmf: DMMF.Document,
  pgEnums: Record<string, PGEnum<any>>,
  objectRef: Record<string, PGObject<any>>,
) => PGPrismaConverter<Types>['update'] =
  (builder, dmmf, pgEnums, objectRef) => (config) => {
    const dmmfModel = dmmf.datamodel.models.find((x) => x.name === config.name)
    if (dmmfModel === undefined) {
      throw new PGError(
        `"${config.name}" does not exist in the DMMF generated from the Prisma schema`,
        'Error',
      )
    }
    const basePGObject = convertDMMFModelToPGObject(
      dmmfModel,
      pgEnums,
      objectRef,
      builder,
    )
    const definedObject = createPGObject<any, any, any>(
      config.name,
      config.fields(basePGObject.value.fieldMap, builder.utils.outputFieldBuilder),
      builder.cache(),
      builder.utils.outputFieldBuilder,
      builder.utils.inputFieldBuilder,
      config.interfaces,
      config.isTypeOf,
    )
    definedObject.prismaModel(config.name)
    return definedObject
  }
