import { getConvertInputsFunction } from './convert-inputs'
import { getConvertOutputsFunction } from './convert-outputs'
import { getUpdateFunction } from './update'
import { convertDMMFEnumToPGEnum } from './utils'
import type { PGEnum } from '../types/common'
import type { PGObject } from '../types/output'
import type { InitPGPrismaConverter, PGPrismaConverter } from '../types/prisma-converter'

export const getInternalPGPrismaConverter: InitPGPrismaConverter = (builder, dmmf) => {
  const pgEnumMap = [
    ...dmmf.schema.enumTypes.prisma,
    ...(dmmf.schema.enumTypes.model ?? []),
  ].reduce<Record<string, PGEnum<any>>>((acc, dmmfEnum) => {
    const pgEnum = convertDMMFEnumToPGEnum(dmmfEnum)
    acc[pgEnum.name] = pgEnum
    return acc
  }, {})

  const objectRef: Record<string, PGObject<any>> = {}
  const converter: PGPrismaConverter<any> = {
    convertOutputs: getConvertOutputsFunction(builder, dmmf, pgEnumMap, objectRef),
    convertInputs: getConvertInputsFunction(builder, dmmf, pgEnumMap),
    update: getUpdateFunction(builder, dmmf, pgEnumMap, objectRef),
  }
  return converter as any
}
