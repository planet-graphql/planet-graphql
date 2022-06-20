import { DMMF } from '@prisma/generator-helper'
import { createPGEnum } from '../objects/pg-enum'
import {
  createPGInputFactoryUnion,
  createPGInputFactory,
} from '../objects/pg-input-factory'
import { createInputField } from '../objects/pg-input-field'
import { createPGObject } from '../objects/pg-object'
import { createOutputField } from '../objects/pg-output-field'
import { PGBuilder, PGCache, PGfyResponseType, PGTypes } from '../types/builder'
import { PGEnum, PGFieldKindAndType } from '../types/common'
import { PGInputField, PGInputFieldBuilder } from '../types/input'
import {
  PGInputFactoryField,
  PGInputFactoryFieldMap,
  PGInputFactory,
} from '../types/input-factory'
import { PGObject, PGOutputFieldBuilder, PGOutputFieldMap } from '../types/output'
import { getScalarTypeName } from './build'
import { createEnumBuilder } from './enum-builder'
import { PGError, setCache } from './utils'

export const pgfy: <Types extends PGTypes>(
  cache: PGCache,
  inputFieldBuilder: PGInputFieldBuilder<Types>,
  outputFieldBuilder: PGOutputFieldBuilder<Types>,
) => PGBuilder<Types>['pgfy'] =
  (cache, inputFieldBuilder, outputFieldBuilder) => (_, dmmf) => {
    function convertToPGObject(
      model: DMMF.Model,
      enums: { [name: string]: PGEnum<any> },
      objectRef: { [name: string]: PGObject<any> },
    ): PGObject<any> {
      const fieldMap = model.fields.reduce<PGOutputFieldMap>((acc, x) => {
        let kindAndType: PGFieldKindAndType
        switch (x.kind) {
          case 'scalar':
            kindAndType = {
              kind: x.kind,
              type: getScalarTypeName(x.type, x.isId),
            }
            break
          case 'enum':
            kindAndType = { kind: x.kind, type: enums[x.type] }
            break
          case 'object':
            kindAndType = { kind: x.kind, type: () => objectRef[x.type] }
            break
          default:
            throw new PGError(`Unexpected kind '${x.kind}''.`, 'Error')
        }
        let field = createOutputField<any, any>(kindAndType, inputFieldBuilder)
        if (x.kind === 'object') {
          field.value.isPrismaRelation = true
        }
        if (x.isList) {
          field = field.list()
        }
        if (!x.isRequired) {
          field = field.nullable()
        }
        acc[x.name] = field
        return acc
      }, {})
      const pgObject = createPGObject(
        model.name,
        fieldMap,
        cache,
        outputFieldBuilder,
        inputFieldBuilder,
      )
      pgObject.prismaModel(model.name)
      return pgObject
    }
    const objectRef: { [name: string]: PGObject<any> } = {}
    const enums = dmmf.datamodel.enums.reduce<PGfyResponseType<PGBuilder>['enums']>(
      (acc, x) => {
        const pgEnum = createEnumBuilder(cache)(x.name, ...x.values.map((v) => v.name))
        acc[x.name] = pgEnum
        return acc
      },
      {},
    )
    const objects = dmmf.datamodel.models.reduce<PGfyResponseType<PGBuilder>['objects']>(
      (acc, x) => {
        const pgObject = convertToPGObject(x, enums, objectRef)
        setCache(cache, pgObject)
        objectRef[x.name] = pgObject
        acc[x.name] = pgObject
        return acc
      },
      {},
    )

    const inputFactoryFieldMapRef: {
      [name: string]: PGInputFactoryFieldMap
    } = {}

    for (const inputType of dmmf.schema.inputObjectTypes.prisma) {
      convertToPGInputFactory(inputType.name, inputType.fields, inputFactoryFieldMapRef)
    }

    const inputRoots = dmmf.schema.outputObjectTypes.prisma
      .filter((x) => x.name === 'Query' || x.name === 'Mutation')
      .flatMap((x) => x.fields)
      .reduce<PGfyResponseType<PGBuilder>['inputs']>((acc, field) => {
        const pgInputFactory = convertToPGInputFactory(
          field.name,
          field.args,
          inputFactoryFieldMapRef,
        )
        acc[field.name] = pgInputFactory
        return acc
      }, {})

    function convertToPGInputFactoryValue(
      inputType: DMMF.SchemaArgInputType,
      inputFactoryFieldMapRef: { [name: string]: PGInputFactoryFieldMap },
      isList: boolean,
      isOptional: boolean,
      isNullable: boolean,
    ): (() => PGInputFactory<any>) | PGInputField<any> {
      if (inputType.location === 'inputObjectTypes') {
        return () => {
          const inputFactory = createPGInputFactory<any, any>(
            inputFactoryFieldMapRef[inputType.type as string],
          )
          if (isList) inputFactory.list()
          if (isOptional) inputFactory.optional()
          if (isNullable) inputFactory.nullable()
          return inputFactory
        }
      }
      if (inputType.location === 'enumTypes') {
        const enumType = [
          ...dmmf.schema.enumTypes.prisma,
          ...(dmmf.schema.enumTypes.model ?? []),
        ].find((e) => e.name === inputType.type)
        if (enumType === undefined)
          throw new PGError(
            `Unexpected enumType '${inputType.type as string}''.`,
            'Error',
          )
        const enumFactory = createInputField<any, any, any>({
          kind: 'enum',
          type: createPGEnum(enumType.name, ...enumType.values),
        })
        if (isList) enumFactory.list()
        if (isOptional) enumFactory.optional()
        if (isNullable) enumFactory.nullable()
        return enumFactory
      }
      if (inputType.location === 'scalar') {
        const inputFactory = createInputField<any, any, any>({
          kind: 'scalar',
          type: getScalarTypeName(inputType.type as string, false),
        })
        if (isList) inputFactory.list()
        if (isOptional) inputFactory.optional()
        if (isNullable) inputFactory.nullable()
        return inputFactory
      }
      throw new PGError(`Unexpected type '${inputType.type as string}''.`, 'Error')
    }

    function convertToPGInputFactory(
      name: string,
      args: DMMF.SchemaArg[],
      inputFactoryFieldMapRef: { [name: string]: PGInputFactoryFieldMap },
    ): PGInputFactory<any> {
      const fieldMap = args.reduce<PGInputFactoryFieldMap>((acc, arg) => {
        const dominantInputType = arg.inputTypes[0]
        if (arg.inputTypes.length > 1) {
          const factoryMap = arg.inputTypes.reduce<{
            [name: string]: PGInputFactoryField
          }>((innerAcc, inputType) => {
            const fieldName = inputType.isList
              ? `${inputType.type as string}List`
              : (inputType.type as string)
            innerAcc[fieldName] = convertToPGInputFactoryValue(
              inputType,
              inputFactoryFieldMapRef,
              inputType.isList,
              !arg.isRequired,
              arg.isNullable,
            )
            return innerAcc
          }, {})
          acc[arg.name] = createPGInputFactoryUnion({
            __default: factoryMap[dominantInputType.type as string],
            ...factoryMap,
          })
          return acc
        }
        acc[arg.name] = convertToPGInputFactoryValue(
          dominantInputType,
          inputFactoryFieldMapRef,
          dominantInputType.isList,
          !arg.isRequired,
          arg.isNullable,
        )
        return acc
      }, {})
      inputFactoryFieldMapRef[name] = fieldMap
      return createPGInputFactory(fieldMap)
    }

    const resp: PGfyResponseType<PGBuilder> = {
      enums,
      objects,
      inputs: inputRoots,
    }
    return resp as any
  }
