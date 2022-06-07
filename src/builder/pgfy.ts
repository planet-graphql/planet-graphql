import { DMMF } from '@prisma/generator-helper'
import { createPGObject } from '../objects/pg-object'
import { createOutputField } from '../objects/pg-output-field'
import { PGBuilder, PGCache, PGfyResponseType, PGTypes } from '../types/builder'
import { PGEnum, PGFieldKindAndType } from '../types/common'
import { PGInputFieldBuilder } from '../types/input'
import { PGObject, PGOutputFieldBuilder, PGOutputFieldMap } from '../types/output'
import { getScalarTypeName } from './build'
import { createEnumBuilder } from './enum'
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
    const enums = datamodel.enums.reduce<PGfyResponseType['enums']>((acc, x) => {
      const pgEnum = createEnumBuilder(cache)(x.name, ...x.values.map((v) => v.name))
      acc[x.name] = pgEnum
      return acc
    }, {})
    const objects = datamodel.models.reduce<PGfyResponseType['objects']>((acc, x) => {
      const pgObject = convertToPGObject(x, enums, objectRef)
      setCache(cache, pgObject)
      objectRef[x.name] = pgObject
      acc[x.name] = pgObject
      return acc
    }, {})
    const resp: PGfyResponseType = {
      enums,
      objects,
      models: {},
    }
    return resp
  }
