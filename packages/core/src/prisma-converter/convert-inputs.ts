import _ from 'lodash'
import { createPGArgBuilder } from '../objects/pg-input-factory'
import { convertDMMFArgsToPGArgBuilderFieldMap } from './utils'
import type { PGBuilder, PGTypes } from '../types/builder'
import type { PGEnum } from '../types/common'
import type { PGArgBuilder, PGArgBuilderFieldMap } from '../types/input-factory'
import type { PGPrismaConverter } from '../types/prisma-converter'
import type { DMMF } from '@prisma/generator-helper'

export const getConvertInputsFunction: <Types extends PGTypes>(
  builder: PGBuilder<Types>,
  dmmf: DMMF.Document,
  pgEnumMap: Record<string, PGEnum<any>>,
) => PGPrismaConverter<Types>['convertInputs'] = (builder, dmmf, pgEnumMap) => () => {
  const pgArgBuilderMap = convertToPGArgBuilderMap(builder, dmmf.schema, pgEnumMap)
  return pgArgBuilderMap
}

export function convertToPGArgBuilderMap(
  builder: PGBuilder<any>,
  dmmfSchema: DMMF.Schema,
  pgEnumMap: Record<string, PGEnum<any>>,
): Record<string, PGArgBuilder<any>> {
  const argBuilderFieldMapRef: Record<string, PGArgBuilderFieldMap> = {}
  for (const inputType of dmmfSchema.inputObjectTypes.prisma) {
    const fieldMap = convertDMMFArgsToPGArgBuilderFieldMap(
      inputType.fields,
      argBuilderFieldMapRef,
      pgEnumMap,
      builder,
    )
    argBuilderFieldMapRef[inputType.name] = fieldMap
  }
  const pgArgBuilderMap = dmmfSchema.outputObjectTypes.prisma
    .filter((x) => x.name === 'Query' || x.name === 'Mutation')
    .flatMap((x) => x.fields)
    .reduce<Record<string, PGArgBuilder<any>>>((acc, dmmfSchemaField) => {
      const fieldMap = convertDMMFArgsToPGArgBuilderFieldMap(
        dmmfSchemaField.args,
        argBuilderFieldMapRef,
        pgEnumMap,
        builder,
      )
      const argBuilder = createPGArgBuilder(
        _.upperFirst(dmmfSchemaField.name),
        fieldMap,
        builder,
      )
      acc[dmmfSchemaField.name] = argBuilder
      return acc
    }, {})

  return pgArgBuilderMap
}
