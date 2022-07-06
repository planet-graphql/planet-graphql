import { DMMF } from '@prisma/generator-helper'
import { getDMMF } from '@prisma/internals'
import { getPGBuilder } from '..'
import { createPGEnum } from '../objects/pg-enum'
import { createInputField } from '../objects/pg-input-field'
import {
  mergeDefaultInputFactory,
  mergeDefaultInputFactoryUnion,
  mergeDefaultInputField,
  mergeDefaultOutputField,
  mergeDefaultPGObject,
} from '../test-utils'
import { PGInputFactory } from '../types/input-factory'
import {
  convertDMMFArgInputTypeToPGInputFactoryOrPGInputField,
  convertDMMFArgToPGInputFactoryField,
  convertDMMFModelToPGObject,
} from './utils'

async function getSampleDMMF(): Promise<DMMF.Document> {
  const datamodel = /* Prisma */ `
    datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }
    model SomeModel {
      id        Int             @id
      scalar    String?
      enum      SomeEnum  
      relations RelationModel[]
    }
    model RelationModel {
      id        Int             @id
      model     SomeModel       @relation(fields: [modelId], references: [id])
      modelId   Int
    }
    enum SomeEnum {
      A
      B
    }
  `
  return await getDMMF({ datamodel })
}

describe('convertDMMFModelToPGObject', () => {
  it('Returns a PGObject', async () => {
    const dmmf = await getSampleDMMF()
    const pg = getPGBuilder()()

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const dmmfModel = dmmf.datamodel.models.find((x) => x.name === 'SomeModel')!
    const pgEnumMap = {
      SomeEnum: createPGEnum('SomeEnum', ['A', 'B']),
    }
    const result = convertDMMFModelToPGObject(dmmfModel, pgEnumMap, {}, pg)

    expect(result).toEqual(
      mergeDefaultPGObject({
        name: 'SomeModel',
        value: {
          fieldMap: {
            id: mergeDefaultOutputField({
              kind: 'scalar',
              type: 'id',
            }),
            scalar: mergeDefaultOutputField({
              kind: 'scalar',
              type: 'string',
              isNullable: true,
              isOptional: true,
            }),
            enum: mergeDefaultOutputField({
              kind: 'enum',
              type: pgEnumMap.SomeEnum,
            }),
            relations: mergeDefaultOutputField({
              kind: 'object',
              type: expect.any(Function),
              isList: true,
              isPrismaRelation: true,
            }),
          },
          prismaModelName: 'SomeModel',
        },
      }),
    )
  })
})

describe('convertDMMFArgToPGInputFactoryField', () => {
  describe('The arg has multiple inputTypes', () => {
    it('Returns a PGInputFactoryUnion', () => {
      const arg = {
        name: 'SomeArg',
        isRequired: true,
        isNullable: false,
        inputTypes: [
          {
            type: 'Int',
            location: 'scalar',
            isList: true,
          } as const,
          {
            type: 'Int',
            location: 'scalar',
            isList: false,
          } as const,
        ],
      }

      const result = convertDMMFArgToPGInputFactoryField(arg, {}, {})

      expect(result).toEqual(
        mergeDefaultInputFactoryUnion({
          factoryMap: {
            __default: mergeDefaultInputField({
              kind: 'scalar',
              type: 'int',
              isList: true,
            }),
            IntList: mergeDefaultInputField({
              kind: 'scalar',
              type: 'int',
              isList: true,
            }),
            Int: mergeDefaultInputField({
              kind: 'scalar',
              type: 'int',
              isList: false,
            }),
          },
        }),
      )
    })
  })

  describe('The arg has one inputType', () => {
    it('Returns a PGInputField or a Function that returns a PGinputFactory', () => {
      const arg = {
        name: 'SomeArg',
        isRequired: true,
        isNullable: false,
        inputTypes: [
          {
            type: 'Int',
            location: 'scalar',
            isList: false,
          } as const,
        ],
      }

      const result = convertDMMFArgToPGInputFactoryField(arg, {}, {})

      expect(result).toEqual(
        mergeDefaultInputField({
          kind: 'scalar',
          type: 'int',
        }),
      )
    })
  })
})

describe('convertDMMFArgInputTypeToPGInputFactoryOrPGInputField', () => {
  describe('InputType is a scalar type', () => {
    it('Returns a scalar PGInputField', () => {
      const inputType = {
        type: 'Int',
        location: 'scalar',
        isList: false,
      } as const

      const result = convertDMMFArgInputTypeToPGInputFactoryOrPGInputField(
        inputType,
        {},
        {},
        false,
        false,
      )

      expect(result).toEqual(
        mergeDefaultInputField({
          kind: 'scalar',
          type: 'int',
        }),
      )
    })

    describe('InputType is list, optional and nullable', () => {
      it('Returns a listed, optional and nullable scalar PGInputField', () => {
        const inputType = {
          type: 'Int',
          location: 'scalar',
          isList: true,
        } as const

        const result = convertDMMFArgInputTypeToPGInputFactoryOrPGInputField(
          inputType,
          {},
          {},
          true,
          true,
        )

        expect(result).toEqual(
          mergeDefaultInputField({
            kind: 'scalar',
            type: 'int',
            isList: true,
            isOptional: true,
            isNullable: true,
          }),
        )
      })
    })
  })

  describe('InputType is a enumTypes', () => {
    it('Returns an enum PGInputField', () => {
      const inputType = {
        type: 'SomeEnum',
        namespace: 'prisma',
        location: 'enumTypes',
        isList: false,
      } as const
      const pgEnumMap = {
        SomeEnum: createPGEnum('SomeEnum', ['A', 'B']),
      }

      const result = convertDMMFArgInputTypeToPGInputFactoryOrPGInputField(
        inputType,
        {},
        pgEnumMap,
        false,
        false,
      )

      expect(result).toEqual(
        mergeDefaultInputField({
          kind: 'enum',
          type: pgEnumMap.SomeEnum,
        }),
      )
    })
  })

  describe('InputType is a inputObjectType', () => {
    it('Returns a function that returns a PGInputFactory', () => {
      const inputType = {
        type: 'SomeInput',
        namespace: 'prisma',
        location: 'inputObjectTypes',
        isList: false,
      } as const
      const fieldMap = {
        SomeInput: {
          id: createInputField({
            kind: 'scalar',
            type: 'id',
          }),
        },
      }

      const result = convertDMMFArgInputTypeToPGInputFactoryOrPGInputField(
        inputType,
        fieldMap,
        {},
        false,
        false,
      ) as () => PGInputFactory<any>

      expect(result()).toEqual(
        mergeDefaultInputFactory('SomeInput', {
          fieldMap: fieldMap.SomeInput,
        }),
      )
    })

    describe('InputType is list, optional and nullable', () => {
      it('Returns a function that returns a listed, optional and nullable PGInputFactory', () => {
        const inputType = {
          type: 'SomeInput',
          namespace: 'prisma',
          location: 'inputObjectTypes',
          isList: true,
        } as const
        const fieldMap = {
          SomeInput: {
            id: createInputField({
              kind: 'scalar',
              type: 'id',
            }),
          },
        }

        const result = convertDMMFArgInputTypeToPGInputFactoryOrPGInputField(
          inputType,
          fieldMap,
          {},
          true,
          true,
        ) as () => PGInputFactory<any>

        expect(result()).toEqual(
          mergeDefaultInputFactory('SomeInput', {
            fieldMap: fieldMap.SomeInput,
            isList: true,
            isOptional: true,
            isNullable: true,
          }),
        )
      })
    })
  })
})
