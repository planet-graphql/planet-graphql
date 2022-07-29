import _ from 'lodash'
import { PGError } from '../builder/utils'
import { createPGArgBuilder, createPGArgBuilderUnion } from '../objects/pg-arg-builder'
import { createPGEnum } from '../objects/pg-enum'
import { createInputField } from '../objects/pg-input-field'
import { createPGObject } from '../objects/pg-object'
import { createOutputField } from '../objects/pg-output-field'
import type {
  PGArgBuilder,
  PGArgBuilderField,
  PGArgBuilderFieldMap,
  PGArgBuilderUnion,
} from '../types/arg-builder'
import type { PGBuilder } from '../types/builder'
import type { PGEnum, PGFieldKindAndType } from '../types/common'
import type { PGInputField } from '../types/input'
import type { PGObject, PGOutputFieldMap } from '../types/output'
import type { DMMF } from '@prisma/generator-helper'

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

export function convertDMMFArgsToPGArgBuilderFieldMap(
  args: DMMF.SchemaArg[],
  fieldMapRef: Record<string, PGArgBuilderFieldMap>,
  pgEnumMap: Record<string, PGEnum<any>>,
  builder: PGBuilder<any>,
): PGArgBuilderFieldMap {
  return args.reduce<PGArgBuilderFieldMap>((acc, arg) => {
    acc[arg.name] = convertDMMFArgToPGArgBuilderField(
      arg,
      fieldMapRef,
      pgEnumMap,
      builder,
    )
    return acc
  }, {})
}

export function convertDMMFArgToPGArgBuilderField(
  arg: DMMF.SchemaArg,
  fieldMapRef: Record<string, PGArgBuilderFieldMap>,
  pgEnumMap: Record<string, PGEnum<any>>,
  builder: PGBuilder<any>,
): PGArgBuilderField {
  const filteredInputTypes = arg.inputTypes.filter((x) => x.type !== 'Null')
  const filteredArg = {
    ...arg,
    inputTypes: filteredInputTypes,
  }
  const isUnion = filteredInputTypes.length > 1
  return isUnion
    ? convertToDMMFArgToPGArgBuilderUnion(filteredArg, fieldMapRef, pgEnumMap, builder)
    : convertDMMFArgInputTypeToPGArgBuilderOrPGInputField(
        arg.inputTypes[0],
        fieldMapRef,
        pgEnumMap,
        !arg.isRequired,
        arg.isNullable,
        builder,
      )
}

export function convertToDMMFArgToPGArgBuilderUnion(
  arg: DMMF.SchemaArg,
  fieldMapRef: Record<string, PGArgBuilderFieldMap>,
  pgEnumMap: Record<string, PGEnum<any>>,
  builder: PGBuilder<any>,
): PGArgBuilderUnion<any> {
  const builderMap = arg.inputTypes.reduce<PGArgBuilderFieldMap>((acc, inputType) => {
    const inputTypeName = inputType.type as string
    const fieldName = inputType.isList ? `${inputTypeName}List` : inputTypeName
    acc[fieldName] = convertDMMFArgInputTypeToPGArgBuilderOrPGInputField(
      inputType,
      fieldMapRef,
      pgEnumMap,
      !arg.isRequired,
      arg.isNullable,
      builder,
    )
    return acc
  }, {})
  const union = createPGArgBuilderUnion({
    __default: Object.values(builderMap)[0],
    ...builderMap,
  })
  return union
}

export function convertDMMFArgInputTypeToPGArgBuilderOrPGInputField(
  inputType: DMMF.SchemaArgInputType,
  fieldMapRef: Record<string, PGArgBuilderFieldMap>,
  pgEnumMap: Record<string, PGEnum<any>>,
  isOptional: boolean,
  isNullable: boolean,
  builder: PGBuilder<any>,
): (() => PGArgBuilder<any>) | PGInputField<any> {
  const isArgBuilder = inputType.location === 'inputObjectTypes'
  if (isArgBuilder) {
    return () => {
      const argBuilder = createPGArgBuilder<any, any>(
        inputType.type as string,
        fieldMapRef[inputType.type as string],
        builder,
      )
      if (inputType.isList) argBuilder.list()
      if (isOptional) argBuilder.optional()
      if (isNullable) argBuilder.nullable()
      return argBuilder
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
