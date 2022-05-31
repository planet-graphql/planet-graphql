import fs from 'fs'
import { DMMF } from '@prisma/generator-helper'
import { getDMMF } from '@prisma/sdk'
import {
  generate,
  getInputFactories,
  getInputsTypeProperty,
  getPrismaImportPath,
  shapeInputs,
} from './generator'

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

// NOTE:
// If we don't mock @prisma/generator-helper, the generatorHandler will hold the process
// and jest will not terminate, so I have to mock it and not let it process anything.
// It might be better to keep the files separate.
jest.mock('@prisma/generator-helper')

describe('generateFile', () => {
  const outputPath = '.output.ts'

  afterEach(() => {
    if (fs.existsSync(outputPath)) {
      fs.rmSync(outputPath)
    }
  })

  it.skip('PrismaのSchemaに従ってpgfyの戻り値の型定義が生成される', async () => {
    const dmmf = await getDMMF({ datamodel })
    await generate(dmmf, outputPath, '@prisma/client')
    const result = fs.readFileSync(outputPath, 'utf8')

    expect(result).toBe(`import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";
import { PGEnum, PGField, PGModel } from "@prismagql/prismagql/lib/types/common";

type SomeEnumValuesType = ["AAA", "BBB", "CCC"];
type SomeEnum2ValuesType = ["Aaa", "Bbb", "Ccc"];
type SomeEnum3ValuesType = ["aaa", "bbb", "ccc"];
type Model1FieldMapType = {
        id: PGField<number>;
        string: PGField<string>;
        json: PGField<string>;
        int: PGField<number>;
        float: PGField<number>;
        boolean: PGField<boolean>;
        bigInt: PGField<bigint>;
        dateTime: PGField<Date>;
        bytes: PGField<Buffer>;
        decimal: PGField<Decimal>;
        nullable: PGField<string | null>;
        list: PGField<string[]>;
        enum: PGField<PGEnum<SomeEnumValuesType>>;
        enumList: PGField<Array<PGEnum<SomeEnum2ValuesType>>>;
        enumNullable: PGField<PGEnum<SomeEnum3ValuesType> | null>;
        oneToOne: PGField<PGModel<Model2FieldMapType> | null>;
        oneToMany: PGField<Array<PGModel<Model3FieldMapType>>>;
    };
type Model2FieldMapType = {
        id: PGField<number>;
        model1: PGField<PGModel<Model1FieldMapType>>;
        model1Id: PGField<number>;
    };
type Model3FieldMapType = {
        id: PGField<number>;
        model1: PGField<PGModel<Model1FieldMapType>>;
        model1Id: PGField<number>;
    };
type PGfyResponseEnums = {
        SomeEnum: PGEnum<SomeEnumValuesType>;
        SomeEnum2: PGEnum<SomeEnum2ValuesType>;
        SomeEnum3: PGEnum<SomeEnum3ValuesType>;
    };
type PGfyResponseModels = {
        Model1: PGModel<Model1FieldMapType, Prisma.Model1WhereInput>;
        Model2: PGModel<Model2FieldMapType, Prisma.Model2WhereInput>;
        Model3: PGModel<Model3FieldMapType, Prisma.Model3WhereInput>;
    };

export interface PGfyResponse {
    enums: PGfyResponseEnums;
    models: PGfyResponseModels;
}
`)
  })

  it.skip('ファイルが存在していても上書き保存され例外が発生しない', async () => {
    const dmmf = await getDMMF({ datamodel })
    await generate(dmmf, outputPath, '@prisma/client')
    await generate(dmmf, outputPath, '@prisma/client')
  })

  describe('getInputsTypeProperty', () => {
    describe('inputObjectTypes', () => {
      it('returns PGInputFactoryWrapper of type inputTypes', () => {
        const args: DMMF.SchemaArg = {
          name: 'arg',
          isRequired: false,
          isNullable: true,
          inputTypes: [
            {
              type: 'Input',
              namespace: 'prisma',
              location: 'inputObjectTypes',
              isList: false,
            },
          ],
        }
        const result = getInputsTypeProperty(args)
        expect(result).toEqual(
          '() => PGInputFactoryWrapper<InputFactory<Types> | null | undefined, Types>',
        )
      })
    })
    describe('Array of inputObjectTypes', () => {
      it('returns PGInputFactoryUnion & PGInputFactoryWrapper of type inputTypes', () => {
        const args: DMMF.SchemaArg = {
          name: 'arg',
          isRequired: true,
          isNullable: false,
          inputTypes: [
            {
              type: 'Input',
              namespace: 'prisma',
              location: 'inputObjectTypes',
              isList: true,
            },
            {
              type: 'Input',
              namespace: 'prisma',
              location: 'inputObjectTypes',
              isList: false,
            },
          ],
        }
        const result = getInputsTypeProperty(args)
        expect(result).toEqual(`PGInputFactoryUnion<{
__default: () => PGInputFactoryWrapper<Array<InputFactory<Types>>, Types>,
InputList: () => PGInputFactoryWrapper<Array<InputFactory<Types>>, Types>,
Input: () => PGInputFactoryWrapper<InputFactory<Types>, Types>
}>`)
      })
    })
    describe('scalar', () => {
      it('returns PGInputFactory of type scalar', () => {
        const args: DMMF.SchemaArg = {
          name: 'arg',
          isRequired: true,
          isNullable: true,
          inputTypes: [
            {
              type: 'Int',
              location: 'scalar',
              isList: false,
            },
          ],
        }
        const result = getInputsTypeProperty(args)
        expect(result).toEqual(`PGInputFactory<number | null, 'int', Types>`)
      })
    })
    describe('enumTypes', () => {
      it('returns PGInputFactory of type enum', () => {
        const args: DMMF.SchemaArg = {
          name: 'arg',
          isRequired: false,
          isNullable: false,
          inputTypes: [
            {
              type: 'Enum',
              namespace: 'prisma',
              location: 'enumTypes',
              isList: true,
            },
          ],
        }
        const result = getInputsTypeProperty(args)
        expect(result).toEqual(`PGInputFactory<EnumFactory[] | undefined, 'enum', Types>`)
      })
    })
  })
  describe('shapeInputs', () => {
    it('returns the factories in the form used by generator method', () => {
      const args: DMMF.SchemaArg[] = [
        {
          name: 'arg1',
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
        {
          name: 'arg2',
          isRequired: false,
          isNullable: false,
          inputTypes: [
            {
              type: 'Input2',
              namespace: 'prisma',
              location: 'inputObjectTypes',
              isList: true,
            },
            {
              type: 'Input2',
              namespace: 'prisma',
              location: 'inputObjectTypes',
              isList: false,
            },
          ],
        },
        {
          name: 'arg3',
          isRequired: false,
          isNullable: false,
          inputTypes: [
            {
              type: 'Int',
              location: 'scalar',
              isList: false,
            },
          ],
        },
      ]

      const result = shapeInputs('findFirstSomeModel', args)
      expect(result).toEqual({
        name: 'FindFirstSomeModelFactory',
        type: [
          {
            name: 'arg1',
            type: '() => PGInputFactoryWrapper<Input1Factory<Types> | undefined, Types>',
          },
          {
            name: 'arg2',
            type: `PGInputFactoryUnion<{
__default: () => PGInputFactoryWrapper<Array<Input2Factory<Types>> | undefined, Types>,
Input2List: () => PGInputFactoryWrapper<Array<Input2Factory<Types>> | undefined, Types>,
Input2: () => PGInputFactoryWrapper<Input2Factory<Types> | undefined, Types>
}>`,
          },
          {
            name: 'arg3',
            type: "PGInputFactory<number | undefined, 'int', Types>",
          },
        ],
        inputTypes: ['Input1Factory', 'Input2Factory'],
      })
    })
  })
  describe('getFactories', () => {
    it('returns all factories, including recursion, in the form used by generator method', async () => {
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
                      type: 'Enum1',
                      namespace: 'prisma',
                      location: 'enumTypes',
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
                      isNullable: true,
                      inputTypes: [
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
              values: ['asc', 'desc'],
            },
          ],
          model: [
            {
              name: 'Enum2',
              values: ['AAA', 'BBB'],
            },
          ],
        },
      }
      const result = getInputFactories(schema)
      expect(result).toEqual([
        {
          name: 'FindFirstSomeModelFactory',
          type: [
            {
              name: 'args1',
              type: '() => PGInputFactoryWrapper<Input1Factory<Types> | null | undefined, Types>',
            },
            {
              name: 'args2',
              type: "PGInputFactory<Enum2Factory, 'enum', Types>",
            },
          ],
          inputTypes: ['Input1Factory'],
        },
        {
          name: 'Input1Factory',
          type: [
            {
              name: 'field1',
              type: "PGInputFactory<Enum1Factory, 'enum', Types>",
            },
          ],
          inputTypes: [],
        },
      ])
    })
  })

  describe('Integration test', () => {
    let schema: DMMF.Schema
    const outputPath = '.output-factory.ts'
    beforeEach(() => {
      schema = {
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
                  name: 'recursiveField',
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
                  name: 'circularField',
                  isRequired: false,
                  isNullable: false,
                  inputTypes: [
                    {
                      type: 'Input3',
                      namespace: 'prisma',
                      location: 'inputObjectTypes',
                      isList: false,
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
                  name: 'circularField',
                  isRequired: true,
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
    })
    afterEach(() => {
      if (fs.existsSync(outputPath)) {
        fs.rmSync(outputPath)
      }
    })
    it('generator returns the correct value when only schema is passed', async () => {
      const dmmf: DMMF.Document = {
        schema,
        datamodel: {
          models: [],
          enums: [],
          types: [],
        },
        mappings: {
          modelOperations: [],
          otherOperations: {
            read: [],
            write: [],
          },
        },
      }
      await generate(dmmf, outputPath, '@prisma/client')
      const result = fs.readFileSync(outputPath, 'utf8')
      expect(result).toEqual(`import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";
import { PGTypes } from "@prismagql/prismagql/lib/types/builder";
import { PGEnum, PGField, PGModel } from "@prismagql/prismagql/lib/types/common";
import { PGInputFactoryWrapper, PGInputFactoryUnion, PGInputFactory } from "@prismagql/prismagql/lib/types/input-factory";

type PGfyResponseEnums = {};
type PGfyResponseModels = {};
type Enum1Factory = PGEnum<['id', 'name', 'income', 'role']>;
type Enum2Factory = PGEnum<['asc', 'desc']>;
type Enum3Factory = PGEnum<['AAA', 'BBB']>;
type FindFirstSomeModelFactory<Types extends PGTypes> = {
        args1: PGInputFactoryUnion<{
            __default: () => PGInputFactoryWrapper<Array<Input1Factory<Types>> | undefined, Types>,
            Input1List: () => PGInputFactoryWrapper<Array<Input1Factory<Types>> | undefined, Types>,
            Input1: () => PGInputFactoryWrapper<Input1Factory<Types> | undefined, Types>
            }>;
        args2: () => PGInputFactoryWrapper<Input2Factory<Types> | null | undefined, Types>;
        args3: PGInputFactory<number, 'int', Types>;
        args4: PGInputFactory<Enum1Factory[] | undefined, 'enum', Types>;
    };
type Input1Factory<Types extends PGTypes> = {
        field1: PGInputFactory<Enum2Factory, 'enum', Types>;
        field2: PGInputFactory<Enum3Factory | undefined, 'enum', Types>;
        recursiveField: () => PGInputFactoryWrapper<Input1Factory<Types> | undefined, Types>;
    };
type Input2Factory<Types extends PGTypes> = {
        field1: PGInputFactory<bigint | null | undefined, 'bigInt', Types>;
        circularField: () => PGInputFactoryWrapper<Input3Factory<Types> | undefined, Types>;
    };
type Input3Factory<Types extends PGTypes> = {
        field1: PGInputFactory<Enum2Factory | undefined, 'enum', Types>;
        circularField: () => PGInputFactoryWrapper<Input2Factory<Types>, Types>;
    };

interface Inputs<Types extends PGTypes> {
    findFirstSomeModel: FindFirstSomeModelFactory<Types>;
}

export interface PGfyResponse<Types extends PGTypes> {
    enums: PGfyResponseEnums;
    models: PGfyResponseModels;
    inputs: Inputs<Types>;
}
`)
    })
  })
})

describe('getPrismaImportPath', () => {
  it('PrismaClientのoutput設定に従って適切なimportのpathが返る', () => {
    expect(getPrismaImportPath('/root/output.ts')).toEqual('@prisma/client')
    expect(
      getPrismaImportPath('/root/output.ts', '/root/node_modules/@prisma/client'),
    ).toEqual('@prisma/client')
    expect(getPrismaImportPath('/root/output.ts', '/root/prisma/client')).toEqual(
      '../prisma/client',
    )
  })
})
