import { DMMF } from '@prisma/generator-helper'
import _ from 'lodash'
import { PGError } from '../builder/utils'
import { createPGEnum } from '../objects/pg-enum'
import {
  createPGInputFactory,
  createPGInputFactoryUnion,
} from '../objects/pg-input-factory'
import { createInputField } from '../objects/pg-input-field'
import { createPGObject } from '../objects/pg-object'
import { createOutputField } from '../objects/pg-output-field'
import { PGBuilder } from '../types/builder'
import { PGEnum, PGFieldKindAndType } from '../types/common'
import { PGInputField } from '../types/input'
import {
  PGInputFactory,
  PGInputFactoryField,
  PGInputFactoryFieldMap,
  PGInputFactoryUnion,
} from '../types/input-factory'
import { PGObject, PGOutputFieldMap } from '../types/output'

export function convertDMMFModelToPGObject(
  dmmfModel: DMMF.Model,
  pgEnumMap: Record<string, PGEnum<any>>,
  pgObjectRef: Record<string, PGObject<any> | (() => PGObject<any>)>,
  builder: PGBuilder<any>,
): PGObject<any> {
  const fieldMap = dmmfModel.fields.reduce<PGOutputFieldMap>((acc, x) => {
    let kindAndType: PGFieldKindAndType
    switch (x.kind) {
      case 'scalar':
        kindAndType = {
          kind: x.kind,
          type: getScalarTypeName(x.type, x.isId),
        }
        break
      case 'enum':
        kindAndType = { kind: x.kind, type: pgEnumMap[x.type] }
        break
      case 'object':
        kindAndType = {
          kind: x.kind,
          type: () => {
            const ref = pgObjectRef[x.type]
            return typeof ref === 'function' ? ref() : ref
          },
        }
        break
      default:
        throw new PGError(`Unexpected kind '${x.kind}''.`, 'Error')
    }
    let field = createOutputField<any, any>(kindAndType, builder.utils.inputFieldBuilder)
    if (x.kind === 'object') field.value.isPrismaRelation = true
    if (x.isList) field = field.list()
    if (!x.isRequired) field = field.nullable()
    acc[x.name] = field
    return acc
  }, {})
  const pgObject = createPGObject(
    dmmfModel.name,
    fieldMap,
    builder.cache(),
    builder.utils.outputFieldBuilder,
    builder.utils.inputFieldBuilder,
  )
  pgObject.prismaModel(dmmfModel.name)
  return pgObject
}

export function convertDMMFEnumToPGEnum(dmmfEnum: DMMF.SchemaEnum): PGEnum<any> {
  const pgEnum = createPGEnum<any>(dmmfEnum.name, dmmfEnum.values)
  return pgEnum
}

export function convertDMMFArgsToPGInputFactoryFieldMap(
  args: DMMF.SchemaArg[],
  fieldMapRef: Record<string, PGInputFactoryFieldMap>,
  pgEnumMap: Record<string, PGEnum<any>>,
): PGInputFactoryFieldMap {
  return args.reduce<PGInputFactoryFieldMap>((acc, arg) => {
    acc[arg.name] = convertDMMFArgToPGInputFactoryField(arg, fieldMapRef, pgEnumMap)
    return acc
  }, {})
}

export function convertDMMFArgToPGInputFactoryField(
  arg: DMMF.SchemaArg,
  fieldMapRef: Record<string, PGInputFactoryFieldMap>,
  pgEnumMap: Record<string, PGEnum<any>>,
): PGInputFactoryField {
  const isUnion = arg.inputTypes.length > 1
  return isUnion
    ? convertToDMMFArgToPGInputFactoryUnion(arg, fieldMapRef, pgEnumMap)
    : convertDMMFArgInputTypeToPGInputFactoryOrPGInputField(
        arg.inputTypes[0],
        fieldMapRef,
        pgEnumMap,
        !arg.isRequired,
        arg.isNullable,
      )
}

export function convertToDMMFArgToPGInputFactoryUnion(
  arg: DMMF.SchemaArg,
  fieldMapRef: Record<string, PGInputFactoryFieldMap>,
  pgEnumMap: Record<string, PGEnum<any>>,
): PGInputFactoryUnion<any> {
  const factoryMap = arg.inputTypes.reduce<PGInputFactoryFieldMap>((acc, inputType) => {
    const inputTypeName = inputType.type as string
    const fieldName = inputType.isList ? `${inputTypeName}List` : inputTypeName
    acc[fieldName] = convertDMMFArgInputTypeToPGInputFactoryOrPGInputField(
      inputType,
      fieldMapRef,
      pgEnumMap,
      !arg.isRequired,
      arg.isNullable,
    )
    return acc
  }, {})
  const union = createPGInputFactoryUnion({
    __default: Object.values(factoryMap)[0],
    ...factoryMap,
  })
  return union
}

export function convertDMMFArgInputTypeToPGInputFactoryOrPGInputField(
  inputType: DMMF.SchemaArgInputType,
  fieldMapRef: Record<string, PGInputFactoryFieldMap>,
  pgEnumMap: Record<string, PGEnum<any>>,
  isOptional: boolean,
  isNullable: boolean,
): (() => PGInputFactory<any>) | PGInputField<any> {
  const isInputFactory = inputType.location === 'inputObjectTypes'
  if (isInputFactory) {
    return () => {
      const inputFactory = createPGInputFactory<any, any>(
        fieldMapRef[inputType.type as string],
      )
      if (inputType.isList) inputFactory.list()
      if (isOptional) inputFactory.optional()
      if (isNullable) inputFactory.nullable()
      return inputFactory
    }
  }

  let fieldkindAndType: PGFieldKindAndType | undefined
  if (inputType.location === 'enumTypes') {
    const pgEnum = pgEnumMap[inputType.type as string]
    fieldkindAndType = {
      kind: 'enum',
      type: pgEnum,
    }
  }
  if (inputType.location === 'scalar') {
    fieldkindAndType = {
      kind: 'scalar',
      type: getScalarTypeName(inputType.type as string, false),
    }
  }
  if (fieldkindAndType === undefined) {
    throw new PGError(`Unexpected inputType: '${JSON.stringify(inputType)}'.`, 'Error')
  }
  const inputField = createInputField(fieldkindAndType)
  if (inputType.isList) inputField.list()
  if (isOptional) inputField.optional()
  if (isNullable) inputField.nullable()
  return inputField
}

export function getScalarTypeName(prismaTypeName: string, isPrismaId: boolean): string {
  if (isPrismaId) return 'id'
  return _.lowerFirst(prismaTypeName)
}
