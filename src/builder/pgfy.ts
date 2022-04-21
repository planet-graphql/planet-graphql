import { DMMF } from '@prisma/generator-helper'
import { PGBuilder, PGCache, PGfyResponseType } from '../types/builder'
import { CreatePGFieldTypeArg, PGEnum, PGModel, PGScalar } from '../types/common'
import { PGObject, PGOutputFieldMap } from '../types/output'
import { createEnum } from './enum'
import { createOutputField, createPGObject, PGError, setCache } from './utils'

export const pgfy: (cache: PGCache) => PGBuilder<any>['pgfy'] =
  (cache) =>
  <T extends PGfyResponseType = PGfyResponseType>(datamodel: DMMF.Datamodel) => {
    function convertToPGObject(
      model: DMMF.Model,
      enums: { [name: string]: PGEnum<any> },
      objectRef: { [name: string]: PGObject<any> },
    ): PGObject<any> {
      const fieldMap = model.fields.reduce<PGOutputFieldMap>((acc, x) => {
        let type: CreatePGFieldTypeArg
        switch (x.kind) {
          case 'scalar':
            type = x.isId ? 'ID' : (x.type as PGScalar)
            break
          case 'enum':
            type = enums[x.type]
            break
          case 'object':
            type = () => objectRef[x.type]
            break
          default:
            throw new PGError(`Unexpected kind '${x.kind}''.`, 'Error')
        }
        let field = createOutputField<any>(type)
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
    return resp as T
  }
