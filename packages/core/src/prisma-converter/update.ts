import { DMMF } from '@prisma/generator-helper'
import { PGError } from '../builder/utils'
import { createPGObject } from '../objects/pg-object'
import { PGBuilder, PGTypes } from '../types/builder'
import { PGEnum } from '../types/common'
import { PGObject } from '../types/output'
import { PGPrismaConverter } from '../types/prisma-converter'
import { convertDMMFModelToPGObject } from './utils'

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
