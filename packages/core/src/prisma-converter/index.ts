import { getConvertBuildersFunction } from './convert-builders'
import { getConvertTypesFunction } from './convert-types'
import { getRedefineFunction } from './redefine'
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
    convertTypes: getConvertTypesFunction(builder, dmmf, pgEnumMap, objectRef),
    convertBuilders: getConvertBuildersFunction(builder, dmmf, pgEnumMap),
    redefine: getRedefineFunction(builder, dmmf, pgEnumMap, objectRef),
  }
  return converter as any
}
