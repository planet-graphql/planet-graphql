import fs from 'fs'
import { getDMMF } from '@prisma/sdk'
import { generate, getPrismaImportPath } from './generator'

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

  it('PrismaのSchemaに従ってpgfyの戻り値の型定義が生成される', async () => {
    const dmmf = await getDMMF({ datamodel })
    await generate(dmmf.datamodel, outputPath, '@prisma/client')
    const result = fs.readFileSync(outputPath, 'utf8')

    expect(result).toBe(`import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";
import { PGEnum, PGField, PGModel } from "./pg";

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

  it('ファイルが存在していても上書き保存され例外が発生しない', async () => {
    const dmmf = await getDMMF({ datamodel })
    await generate(dmmf.datamodel, outputPath, '@prisma/client')
    await generate(dmmf.datamodel, outputPath, '@prisma/client')
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
