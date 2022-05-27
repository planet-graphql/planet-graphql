import { DMMF } from '@prisma/generator-helper'
import { PGBuilder, PGCache, PGfyResponseType, PGTypes } from '../types/builder'
import { PGEnum, PGFieldKindAndType, PGModel } from '../types/common'
import { PGInputFieldBuilder } from '../types/input'
import { PGObject, PGOutputFieldBuilder, PGOutputFieldMap } from '../types/output'
import { getScalarTypeName } from './build'
import { createEnumBuilder } from './enum'
import { createOutputField, createPGObject } from './object'
import { PGError, setCache } from './utils'

export const pgfy: <Types extends PGTypes>(
  cache: PGCache,
  inputFieldBuilder: PGInputFieldBuilder<Types>,
  outputFieldBuilder: PGOutputFieldBuilder<Types>,
) => PGBuilder<Types>['pgfy'] =
  (cache, inputFieldBuilder, outputFieldBuilder) => (datamodel: DMMF.Datamodel) => {
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
        if (x.isList) {
          field = field.list()
        }
        if (!x.isRequired) {
          field = field.nullable()
        }
        acc[x.name] = field
        return acc
      }, {})
      return createPGObject(
        model.name,
        fieldMap,
        cache,
        outputFieldBuilder,
        inputFieldBuilder,
      )
    }
    const objectRef: { [name: string]: PGObject<any> } = {}
    const enums = datamodel.enums.reduce<PGfyResponseType['enums']>((acc, x) => {
      const pgEnum = createEnumBuilder(cache)(x.name, ...x.values.map((v) => v.name))
      acc[x.name] = pgEnum
      return acc
    }, {})
    const models = datamodel.models.reduce<PGfyResponseType['models']>((acc, x) => {
      const pgObject = convertToPGObject(x, enums, objectRef)
      setCache(cache, pgObject)
      objectRef[x.name] = pgObject
      const pgModel: PGModel<any> = {
        ...pgObject,
        kind: 'model',
        __type: undefined as any,
      }
      setCache(cache, pgModel)
      acc[x.name] = pgModel
      return acc
    }, {})
    const resp: PGfyResponseType = {
      enums,
      models,
    }
    return resp
  }
