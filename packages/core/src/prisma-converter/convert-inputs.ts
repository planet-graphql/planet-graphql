import _ from 'lodash'
import { createPGInputFactory } from '../objects/pg-input-factory'
import { convertDMMFArgsToPGInputFactoryFieldMap } from './utils'
import type { PGBuilder, PGTypes } from '../types/builder'
import type { PGEnum } from '../types/common'
import type { PGInputFactory, PGInputFactoryFieldMap } from '../types/input-factory'
import type { PGPrismaConverter } from '../types/prisma-converter'
import type { DMMF } from '@prisma/generator-helper'

export const getConvertInputsFunction: <Types extends PGTypes>(
  builder: PGBuilder<Types>,
  dmmf: DMMF.Document,
  pgEnumMap: Record<string, PGEnum<any>>,
) => PGPrismaConverter<Types>['convertInputs'] = (builder, dmmf, pgEnumMap) => () => {
  const pgInputFactoryMap = convertToPGInputFactoryMap(builder, dmmf.schema, pgEnumMap)
  return pgInputFactoryMap
}

export function convertToPGInputFactoryMap(
  builder: PGBuilder<any>,
  dmmfSchema: DMMF.Schema,
  pgEnumMap: Record<string, PGEnum<any>>,
): Record<string, PGInputFactory<any>> {
  const inputFactoryFieldMapRef: Record<string, PGInputFactoryFieldMap> = {}
  for (const inputType of dmmfSchema.inputObjectTypes.prisma) {
    const fieldMap = convertDMMFArgsToPGInputFactoryFieldMap(
      inputType.fields,
      inputFactoryFieldMapRef,
      pgEnumMap,
      builder,
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
        builder,
      )
      const inputFactory = createPGInputFactory(
        _.upperFirst(dmmfSchemaField.name),
        fieldMap,
        builder,
      )
      acc[dmmfSchemaField.name] = inputFactory
      return acc
    }, {})

  return pgInputFactoryMap
}
