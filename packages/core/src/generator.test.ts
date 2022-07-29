import fs from 'fs'
import { getDMMF } from '@prisma/internals'
import {
  generate,
  getInputFactories,
  getInputsTypeProperty,
  getPrismaImportPath,
  shapeInputs,
} from './generator'
import type { DMMF } from '@prisma/generator-helper'

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
  model1Id      Int     @unique
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

describe('generate', () => {
  describe('the whole dmmf is passed', () => {
    const outputPath = '.output'

    afterEach(() => {
      if (fs.existsSync(outputPath)) {
        fs.rmSync(outputPath, { recursive: true, force: true })
      }
    })

    it("Type definitions (Snapshot) of pgfy return values are generated according to Prisma's Schema", async () => {
      const dmmf = await getDMMF({ datamodel })
      await generate(dmmf, outputPath, '@prisma/client')
      const typeFileResult = fs.readFileSync(`${outputPath}/index.d.ts`, 'utf8')
      const jsFileResult = fs.readFileSync(`${outputPath}/index.js`, 'utf8')
      const packageJsonFileResult = fs.readFileSync(`${outputPath}/package.json`, 'utf8')

      expect(typeFileResult).toMatchSnapshot()
      expect(jsFileResult).toMatchSnapshot()
      expect(packageJsonFileResult).toMatchSnapshot()
    })

    it('File is overwritten even if it exists and no exception is raised', async () => {
      const dmmf: DMMF.Document = {
        datamodel: { models: [], enums: [], types: [] },
        schema: {
          outputObjectTypes: { model: [], prisma: [] },
          inputObjectTypes: { prisma: [] },
          enumTypes: { prisma: [] },
        },
        mappings: { modelOperations: [], otherOperations: { read: [], write: [] } },
      }
      await generate(dmmf, outputPath, '@prisma/client')
      await generate(dmmf, outputPath, '@prisma/client')
    })
  })
})

describe('getInputsTypeProperty', () => {
  describe('inputObjectTypes', () => {
    it('returns PGArgBuilder of type inputTypes', () => {
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
        '() => PGArgBuilder<InputFieldMap<Types> | null | undefined, Types>',
      )
    })
  })

  describe('Array of inputObjectTypes', () => {
    it('returns PGArgBuilderUnion & PGArgBuilder of type inputTypes', () => {
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
      expect(result).toEqual(`PGArgBuilderUnion<{
__default: () => PGArgBuilder<Array<InputFieldMap<Types>>, Types>,
InputList: () => PGArgBuilder<Array<InputFieldMap<Types>>, Types>,
Input: () => PGArgBuilder<InputFieldMap<Types>, Types>
}>`)
    })
  })

  describe('scalar', () => {
    it('returns PGArgBuilder of type scalar', () => {
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
      expect(result).toEqual(`PGInputField<number | null, 'int', Types>`)
    })
  })

  describe('enumTypes', () => {
    it('returns PGArgBuilder of type enum', () => {
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
      expect(result).toEqual(`PGInputField<EnumValues[] | undefined, 'enum', Types>`)
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
      name: 'FindFirstSomeModelFieldMap',
      type: [
        {
          name: 'arg1',
          type: '() => PGArgBuilder<Input1FieldMap<Types> | undefined, Types>',
        },
        {
          name: 'arg2',
          type: `PGArgBuilderUnion<{
__default: () => PGArgBuilder<Array<Input2FieldMap<Types>> | undefined, Types>,
Input2List: () => PGArgBuilder<Array<Input2FieldMap<Types>> | undefined, Types>,
Input2: () => PGArgBuilder<Input2FieldMap<Types> | undefined, Types>
}>`,
        },
        {
          name: 'arg3',
          type: "PGInputField<number | undefined, 'int', Types>",
        },
      ],
      inputTypes: ['Input1FieldMap', 'Input2FieldMap'],
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
        name: 'FindFirstSomeModelFieldMap',
        type: [
          {
            name: 'args1',
            type: '() => PGArgBuilder<Input1FieldMap<Types> | null | undefined, Types>',
          },
          {
            name: 'args2',
            type: "PGInputField<Enum2Values, 'enum', Types>",
          },
        ],
        inputTypes: ['Input1FieldMap'],
      },
      {
        name: 'Input1FieldMap',
        type: [
          {
            name: 'field1',
            type: "PGInputField<Enum1Values, 'enum', Types>",
          },
        ],
        inputTypes: [],
      },
    ])
  })
})

describe('getPrismaImportPath', () => {
  describe('An output path is not set', () => {
    it('Returns "@prisma/client"', () => {
      const result = getPrismaImportPath(
        '/code/node_modules/@planet-graphql/core/dist/generated',
        '/code/node_modules/@prisma/client',
      )

      expect(result).toEqual('@prisma/client')
    })
  })

  describe('The Prisma Client output path is set', () => {
    it('Returns a relative path', () => {
      const result = getPrismaImportPath(
        '/code/src/planet-graphql',
        '/code/src/prisma-client',
      )

      expect(result).toEqual('../prisma-client')
    })
  })
})
