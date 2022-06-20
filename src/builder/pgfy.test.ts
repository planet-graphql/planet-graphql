import { DMMF } from '@prisma/generator-helper'
import { getDMMF } from '@prisma/sdk'
import { getPGBuilder } from '..'
import { DefaultScalars } from '../lib/scalars'
import { PGBuilder, PGTypes } from '../types/builder'
import { PGEnum } from '../types/common'
import { PGInputField } from '../types/input'
import { PGInputFactoryUnion, PGInputFactory } from '../types/input-factory'
import { PGObject } from '../types/output'
import {
  mergeDefaultPGObject,
  mergeDefaultOutputField,
  mergeDefaultInputFactory,
  mergeDefaultInputFactoryUnion,
  mergeDefaultInputField,
} from './test-utils'

const datamodel = /* Prisma */ `
  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }
  model Model1 {
    id            Int        @id @default(autoincrement())
    string        String
    json          Json
    int           Int
    float         Float
    boolean       Boolean
    bigInt        BigInt
    dateTime      DateTime
    bytes         Bytes
    decimal       Decimal
    nullable      String?
    list          String[]
    // NOTE: Omitted because Prisma does not have the concept of a nullable List.
    // nullableList
    enum          SomeEnum
    enumList      SomeEnum2[]
    enumNullable  SomeEnum3?
    oneToOne      Model2?
    oneToMany     Model3[]
  }
  model Model2 {
    id            Int     @id @default(autoincrement())
    model1        Model1  @relation(fields: [model1Id], references: [id])
    model1Id      Int
  }
  model Model3 {
    id            Int     @id @default(autoincrement())
    model1        Model1  @relation(fields: [model1Id], references: [id])
    model1Id      Int
  }
  enum SomeEnum {
    AAA
    BBB
    CCC
  }
  enum SomeEnum2 {
    Aaa
    Bbb
    Ccc
  }
  enum SomeEnum3 {
    aaa
    bbb
    ccc
  }
`

describe('pgfy', () => {
  describe('the whole dmmf is passed', () => {
    let dmmf: DMMF.Document
    beforeAll(async () => {
      dmmf = await getDMMF({ datamodel })
    })

    it('Generates PGEnum, PGObject and PGInputFactory based on the Prisma schema', () => {
      const pg = getPGBuilder()()
      const result = pg.pgfy(pg, dmmf)
      expect(result).toMatchSnapshot()
    })
  })
  describe('only datamodel is passed', () => {
    let dmmf: DMMF.Document
    beforeAll(async () => {
      const originalDMMF = await getDMMF({ datamodel })
      dmmf = {
        ...originalDMMF,
        schema: {
          inputObjectTypes: { prisma: [] },
          outputObjectTypes: { model: [], prisma: [] },
          enumTypes: { prisma: [] },
        },
      }
    })

    it('Generates PGEnum and PGObject based on the Prisma schema & Set them in the Build Cache', async () => {
      const pg = getPGBuilder()()
      const result = pg.pgfy(pg, dmmf)
      const expectSomeEnum: PGEnum<['AAA', 'BBB', 'CCC']> = {
        kind: 'enum',
        name: 'SomeEnum',
        values: ['AAA', 'BBB', 'CCC'],
      }
      const expectSomeEnum2: PGEnum<['Aaa', 'Bbb', 'Ccc']> = {
        kind: 'enum',
        name: 'SomeEnum2',
        values: ['Aaa', 'Bbb', 'Ccc'],
      }
      const expectSomeEnum3: PGEnum<['aaa', 'bbb', 'ccc']> = {
        kind: 'enum',
        name: 'SomeEnum3',
        values: ['aaa', 'bbb', 'ccc'],
      }
      const expectModel1: PGObject<any> = mergeDefaultPGObject({
        name: 'Model1',
        prismaModelName: 'Model1',
        fieldMap: {
          id: mergeDefaultOutputField({
            kind: 'scalar',
            type: 'id',
          }),
          string: mergeDefaultOutputField({
            kind: 'scalar',
            type: 'string',
          }),
          json: mergeDefaultOutputField({
            kind: 'scalar',
            type: 'json',
          }),
          int: mergeDefaultOutputField({
            kind: 'scalar',
            type: 'int',
          }),
          float: mergeDefaultOutputField({
            kind: 'scalar',
            type: 'float',
          }),
          boolean: mergeDefaultOutputField({
            kind: 'scalar',
            type: 'boolean',
          }),
          bigInt: mergeDefaultOutputField({
            kind: 'scalar',
            type: 'bigInt',
          }),
          dateTime: mergeDefaultOutputField({
            kind: 'scalar',
            type: 'dateTime',
          }),
          bytes: mergeDefaultOutputField({
            kind: 'scalar',
            type: 'bytes',
          }),
          decimal: mergeDefaultOutputField({
            kind: 'scalar',
            type: 'decimal',
          }),
          nullable: mergeDefaultOutputField({
            isOptional: true,
            isNullable: true,
            kind: 'scalar',
            type: 'string',
          }),
          list: mergeDefaultOutputField({
            isList: true,
            kind: 'scalar',
            type: 'string',
          }),
          enum: mergeDefaultOutputField({
            kind: 'enum',
            type: expectSomeEnum,
          }),
          enumList: mergeDefaultOutputField({
            isList: true,
            kind: 'enum',
            type: expectSomeEnum2,
          }),
          enumNullable: mergeDefaultOutputField({
            isOptional: true,
            isNullable: true,
            kind: 'enum',
            type: expectSomeEnum3,
          }),
          oneToOne: mergeDefaultOutputField({
            isOptional: true,
            isNullable: true,
            isPrismaRelation: true,
            kind: 'object',
            type: expect.any(Function),
          }),
          oneToMany: mergeDefaultOutputField({
            isList: true,
            isPrismaRelation: true,
            kind: 'object',
            type: expect.any(Function),
          }),
        },
      })
      const expectModel2: PGObject<any> = mergeDefaultPGObject({
        name: 'Model2',
        prismaModelName: 'Model2',
        fieldMap: {
          id: mergeDefaultOutputField({
            kind: 'scalar',
            type: 'id',
          }),
          model1: mergeDefaultOutputField({
            isPrismaRelation: true,
            kind: 'object',
            type: expect.any(Function),
          }),
          model1Id: mergeDefaultOutputField({
            kind: 'scalar',
            type: 'int',
          }),
        },
      })
      const expectModel3: PGObject<any> = mergeDefaultPGObject({
        name: 'Model3',
        prismaModelName: 'Model3',
        fieldMap: {
          id: mergeDefaultOutputField({
            kind: 'scalar',
            type: 'id',
          }),
          model1: mergeDefaultOutputField({
            isPrismaRelation: true,
            kind: 'object',
            type: expect.any(Function),
          }),
          model1Id: mergeDefaultOutputField({
            kind: 'scalar',
            type: 'int',
          }),
        },
      })
      expect(result).toEqual({
        enums: {
          SomeEnum: expectSomeEnum,
          SomeEnum2: expectSomeEnum2,
          SomeEnum3: expectSomeEnum3,
        },
        objects: {
          Model1: expectModel1,
          Model2: expectModel2,
          Model3: expectModel3,
        },
        inputs: {},
      })
      expect(pg.cache()).toEqual({
        scalar: DefaultScalars,
        enum: {
          SomeEnum: expectSomeEnum,
          SomeEnum2: expectSomeEnum2,
          SomeEnum3: expectSomeEnum3,
        },
        object: {
          Model1: expectModel1,
          Model2: expectModel2,
          Model3: expectModel3,
        },
        input: {},
        interface: {},
        query: {},
        mutation: {},
        subscription: {},
        union: {},
      })
      // NOTE: Modelの参照が正しく設定されているかの確認
      const model1OneToOneFieldValueType =
        result.objects.Model1.fieldMap.oneToOne.value.type
      expect(
        typeof model1OneToOneFieldValueType === 'function'
          ? model1OneToOneFieldValueType()
          : null,
      ).toEqual({ ...expectModel2, kind: 'object' })
      const model1OneToManyFieldValueType =
        result.objects.Model1.fieldMap.oneToMany.value.type
      expect(
        typeof model1OneToManyFieldValueType === 'function'
          ? model1OneToManyFieldValueType()
          : null,
      ).toEqual({ ...expectModel3, kind: 'object' })
      const model2RelationFieldValueType =
        result.objects.Model2.fieldMap.model1.value.type
      expect(
        typeof model2RelationFieldValueType === 'function'
          ? model2RelationFieldValueType()
          : null,
      ).toEqual({ ...expectModel1, kind: 'object' })
      const model3RelationFieldValueType =
        result.objects.Model3.fieldMap.model1.value.type
      expect(
        typeof model3RelationFieldValueType === 'function'
          ? model3RelationFieldValueType()
          : null,
      ).toEqual({ ...expectModel1, kind: 'object' })
    })
  })

  describe('only schema is passed', () => {
    let dmmf: DMMF.Document
    beforeAll(() => {
      const schema: DMMF.Schema = {
        inputObjectTypes: {
          prisma: [
            {
              name: 'Input1',
              constraints: {
                maxNumFields: 1,
                minNumFields: 0,
              },
              fields: [
                {
                  name: 'field1',
                  isRequired: true,
                  isNullable: false,
                  inputTypes: [
                    {
                      type: 'Enum2',
                      namespace: 'prisma',
                      location: 'enumTypes',
                      isList: false,
                    },
                  ],
                },
                {
                  name: 'field2',
                  isRequired: false,
                  isNullable: false,
                  inputTypes: [
                    {
                      type: 'Enum3',
                      namespace: 'prisma',
                      location: 'enumTypes',
                      isList: false,
                    },
                  ],
                },
                {
                  name: 'AND',
                  isRequired: false,
                  isNullable: false,
                  inputTypes: [
                    {
                      type: 'Input1',
                      namespace: 'prisma',
                      location: 'inputObjectTypes',
                      isList: false,
                    },
                  ],
                },
              ],
            },
            {
              name: 'Input2',
              constraints: {
                maxNumFields: 1,
                minNumFields: 1,
              },
              fields: [
                {
                  name: 'field1',
                  isRequired: false,
                  isNullable: true,
                  inputTypes: [
                    {
                      type: 'BigInt',
                      location: 'scalar',
                      isList: false,
                    },
                  ],
                },
                {
                  name: 'Input3s',
                  isRequired: true,
                  isNullable: false,
                  inputTypes: [
                    {
                      type: 'Input3',
                      namespace: 'prisma',
                      location: 'inputObjectTypes',
                      isList: true,
                    },
                  ],
                },
              ],
            },
            {
              name: 'Input3',
              constraints: {
                maxNumFields: 1,
                minNumFields: 0,
              },
              fields: [
                {
                  name: 'field1',
                  isRequired: false,
                  isNullable: false,
                  inputTypes: [
                    {
                      type: 'Enum2',
                      namespace: 'prisma',
                      location: 'enumTypes',
                      isList: false,
                    },
                  ],
                },
                {
                  name: 'Input2',
                  isRequired: false,
                  isNullable: false,
                  inputTypes: [
                    {
                      type: 'Input2',
                      namespace: 'prisma',
                      location: 'inputObjectTypes',
                      isList: false,
                    },
                  ],
                },
              ],
            },
          ],
        },
        outputObjectTypes: {
          prisma: [
            {
              name: 'Query',
              fields: [
                {
                  name: 'findFirstSomeModel',
                  args: [
                    {
                      name: 'args1',
                      isRequired: false,
                      isNullable: false,
                      inputTypes: [
                        {
                          type: 'Input1',
                          namespace: 'prisma',
                          location: 'inputObjectTypes',
                          isList: true,
                        },
                        {
                          type: 'Input1',
                          namespace: 'prisma',
                          location: 'inputObjectTypes',
                          isList: false,
                        },
                      ],
                    },
                    {
                      name: 'args2',
                      isRequired: false,
                      isNullable: true,
                      inputTypes: [
                        {
                          type: 'Input2',
                          namespace: 'prisma',
                          location: 'inputObjectTypes',
                          isList: false,
                        },
                      ],
                    },
                    {
                      name: 'args3',
                      isRequired: true,
                      isNullable: false,
                      inputTypes: [
                        {
                          type: 'Int',
                          location: 'scalar',
                          isList: false,
                        },
                      ],
                    },
                    {
                      name: 'args4',
                      isRequired: false,
                      isNullable: false,
                      inputTypes: [
                        {
                          type: 'Enum1',
                          namespace: 'prisma',
                          location: 'enumTypes',
                          isList: true,
                        },
                      ],
                    },
                  ],
                  isNullable: true,
                  outputType: {
                    type: 'SomeModel',
                    namespace: 'model',
                    location: 'outputObjectTypes',
                    isList: false,
                  },
                },
              ],
            },
          ],
          model: [],
        },
        enumTypes: {
          prisma: [
            {
              name: 'Enum1',
              values: ['id', 'name', 'income', 'role'],
            },
            {
              name: 'Enum2',
              values: ['asc', 'desc'],
            },
          ],
          model: [
            {
              name: 'Enum3',
              values: ['AAA', 'BBB'],
            },
          ],
        },
      }
      dmmf = {
        schema,
        datamodel: { models: [], enums: [], types: [] },
        mappings: { modelOperations: [], otherOperations: { read: [], write: [] } },
      }
    })
    type Enum1Factory = PGEnum<['id', 'name', 'income', 'role']>
    type Enum2Factory = PGEnum<['asc', 'desc']>
    type Enum3Factory = PGEnum<['AAA', 'BBB']>
    type FindFirstSomeModelFactory<Types extends PGTypes> = {
      args1: PGInputFactoryUnion<{
        __default: () => PGInputFactory<Array<Input1Factory<Types>> | undefined, Types>
        Input1List: () => PGInputFactory<Array<Input1Factory<Types>> | undefined, Types>
        Input1: () => PGInputFactory<Input1Factory<Types> | undefined, Types>
      }>
      args2: () => PGInputFactory<Input2Factory<Types> | null | undefined, Types>
      args3: PGInputField<number, 'int', Types>
      args4: PGInputField<Enum1Factory[] | undefined, 'enum', Types>
    }
    type Input1Factory<Types extends PGTypes> = {
      field1: PGInputField<Enum2Factory, 'enum', Types>
      field2: PGInputField<Enum3Factory | undefined, 'enum', Types>
      AND: () => PGInputFactory<Input1Factory<Types> | undefined, Types>
    }
    type Input2Factory<Types extends PGTypes> = {
      field1: PGInputField<bigint | null | undefined, 'bigInt', Types>
      Input3s: () => PGInputFactory<Array<Input3Factory<Types>>, Types>
    }
    type Input3Factory<Types extends PGTypes> = {
      field1: PGInputField<Enum2Factory | undefined, 'enum', Types>
      Input2: () => PGInputFactory<Input2Factory<Types> | undefined, Types>
    }

    interface Inputs<Types extends PGTypes> extends Record<string, PGInputFactory<any>> {
      findFirstSomeModel: PGInputFactory<FindFirstSomeModelFactory<Types>, Types>
    }

    type PGfyResponse<T extends PGBuilder> = T extends PGBuilder<infer U>
      ? {
          enums: {}
          objects: {}
          inputs: Inputs<U>
        }
      : any

    type TypeConfig = {
      Context: any
      Prisma: {
        Args: {}
        PGfy: <T extends PGBuilder<any>>(
          builder: T,
          dmmf: DMMF.Document,
        ) => PGfyResponse<T>
      }
    }

    it('Generates PGInputFactory based on the Prisma schema & Set them in the Build Cache', () => {
      const pg = getPGBuilder<TypeConfig>()()
      const result = pg.pgfy(pg, dmmf)
      const expectValue = {
        enums: {},
        inputs: {
          findFirstSomeModel: mergeDefaultInputFactory({
            fieldMap: {
              args1: mergeDefaultInputFactoryUnion({
                factoryMap: {
                  __default: expect.any(Function),
                  Input1List: expect.any(Function),
                  Input1: expect.any(Function),
                },
              }),
              args2: expect.any(Function),
              args3: mergeDefaultInputField({
                kind: 'scalar',
                type: 'int',
              }),
              args4: mergeDefaultInputField({
                kind: 'enum',
                type: {
                  name: 'Enum1',
                  values: ['id', 'name', 'income', 'role'],
                  kind: 'enum',
                },
                isList: true,
                isOptional: true,
              }),
            },
          }),
        },
        objects: {},
      }
      expect(result).toEqual(expectValue)
    })
    it('Returns a PGInputFactory that recursively sets the same PGInputFactory using the edit method', () => {
      const pg = getPGBuilder<TypeConfig>()()
      const result = pg.pgfy(pg, dmmf)
      const editInputFactory = result.inputs.findFirstSomeModel.edit((f) => ({
        args1: f.args1.select('Input1').edit((f) => ({
          field1: f.field1,
          AND: f.AND.edit((f) => ({
            field2: f.field2,
          })),
        })),
      }))

      const expectEditValue = mergeDefaultInputFactory({
        fieldMap: {
          args1: mergeDefaultInputFactory({
            fieldMap: {
              field1: mergeDefaultInputField({
                kind: 'enum',
                type: {
                  name: 'Enum2',
                  values: ['asc', 'desc'],
                  kind: 'enum',
                },
              }),
              AND: mergeDefaultInputFactory({
                fieldMap: {
                  field2: mergeDefaultInputField({
                    kind: 'enum',
                    type: {
                      name: 'Enum3',
                      values: ['AAA', 'BBB'],
                      kind: 'enum',
                    },
                    isOptional: true,
                  }),
                },
                isOptional: true,
              }),
            },
            isOptional: true,
          }),
        },
      })
      expect(editInputFactory).toEqual(expectEditValue)
    })
    it('Returns a PGInputFactory with multiple PGInputFactorys mutually configured using the edit method', () => {
      const pg = getPGBuilder<TypeConfig>()()
      const result = pg.pgfy(pg, dmmf)
      const editInputFactory = result.inputs.findFirstSomeModel.edit((f) => ({
        args2: f.args2.edit((f) => ({
          Input3s: f.Input3s.edit((f) => ({
            Input2: f.Input2.edit((f) => ({
              field1: f.field1,
            })),
          })),
        })),
      }))

      const expectEditValue = mergeDefaultInputFactory({
        fieldMap: {
          args2: mergeDefaultInputFactory({
            fieldMap: {
              Input3s: mergeDefaultInputFactory({
                fieldMap: {
                  Input2: mergeDefaultInputFactory({
                    fieldMap: {
                      field1: mergeDefaultInputField({
                        kind: 'scalar',
                        type: 'bigInt',
                        isOptional: true,
                        isNullable: true,
                      }),
                    },
                    isOptional: true,
                  }),
                },
                isList: true,
              }),
            },
            isOptional: true,
            isNullable: true,
          }),
        },
      })
      expect(editInputFactory).toEqual(expectEditValue)
    })
    it('Returns a PGInputFactory with the scalar type set using the edit method', () => {
      const pg = getPGBuilder<TypeConfig>()()
      const result = pg.pgfy(pg, dmmf)
      const editInputFactory = result.inputs.findFirstSomeModel.edit((f) => ({
        args3: f.args3.nullable(),
      }))

      const expectEditValue = mergeDefaultInputFactory({
        fieldMap: {
          args3: mergeDefaultInputField({
            kind: 'scalar',
            type: 'int',
            isNullable: true,
          }),
        },
      })
      expect(editInputFactory).toEqual(expectEditValue)
    })
    it('Returns a PGInputFactory with the enum type set using the edit method', () => {
      const pg = getPGBuilder<TypeConfig>()()
      const result = pg.pgfy(pg, dmmf)
      const editInputFactory = result.inputs.findFirstSomeModel.edit((f) => ({
        args4: f.args4.nullable(),
      }))

      const expectEditValue = mergeDefaultInputFactory({
        fieldMap: {
          args4: mergeDefaultInputField({
            kind: 'enum',
            type: {
              name: 'Enum1',
              values: ['id', 'name', 'income', 'role'],
              kind: 'enum',
            },
            isOptional: true,
            isNullable: true,
            isList: true,
          }),
        },
      })
      expect(editInputFactory).toEqual(expectEditValue)
    })
  })
})
