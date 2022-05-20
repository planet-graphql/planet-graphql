import { DMMF } from '@prisma/generator-helper'
import { PGBuilder, PGCache, PGfyResponseType, PGTypes } from '../types/builder'
import { PGEnum, PGFieldKindAndType, PGModel, PGScalarLike } from '../types/common'
import { PGInputFieldBuilder } from '../types/input'
import { PGObject, PGOutputFieldMap } from '../types/output'
import { getGraphQLScalar } from './build'
import { createEnum } from './enum'
import { createOutputField, createPGObject, PGError, setCache } from './utils'

export const pgfy: <Types extends PGTypes>(
  cache: PGCache,
  inputFieldBuilder: PGInputFieldBuilder<Types>,
  scalarMap: { [name: string]: PGScalarLike },
) => PGBuilder<Types>['pgfy'] =
  (cache, inputFieldBuilder, scalarMap) => (datamodel: DMMF.Datamodel) => {
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
              type: getGraphQLScalar(x.type, x.isId, scalarMap),
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
      return createPGObject(model.name, fieldMap)
    }
    const objectRef: { [name: string]: PGObject<any> } = {}
    const enums = datamodel.enums.reduce<PGfyResponseType['enums']>((acc, x) => {
      const pgEnum = createEnum(cache)(x.name, ...x.values.map((v) => v.name))
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
