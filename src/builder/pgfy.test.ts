import { Decimal } from '@prisma/client/runtime'
import { DMMF } from '@prisma/generator-helper'
import { getDMMF } from '@prisma/sdk'
import { getPGBuilder } from '..'
import { DefaultScalars } from '../lib/scalars'
import { PGField, PGEnum, PGModel } from '../types/common'
import { PGObject } from '../types/output'
import { setPGObjectProperties, mergeDefaultOutputField } from './test-utils'

describe('pgfy', () => {
  let dmmf: DMMF.Document
  beforeAll(async () => {
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
        // NOTE: PrismaにはnullableなListという概念がないため省略
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
    dmmf = await getDMMF({ datamodel })
  })

  type SomeEnumValuesType = ['AAA', 'BBB', 'CCC']
  type SomeEnum2ValuesType = ['Aaa', 'Bbb', 'Ccc']
  type SomeEnum3ValuesType = ['aaa', 'bbb', 'ccc']
  type Model1FieldMapType = {
    id: PGField<number>
    string: PGField<string>
    json: PGField<string>
    int: PGField<number>
    float: PGField<number>
    boolean: PGField<boolean>
    bigInt: PGField<bigint>
    dateTime: PGField<Date>
    bytes: PGField<Buffer>
    decimal: PGField<Decimal>
    nullable: PGField<string | null>
    list: PGField<string[]>
    enum: PGField<PGEnum<SomeEnumValuesType>>
    enumList: PGField<Array<PGEnum<SomeEnum2ValuesType>>>
    enumNullable: PGField<PGEnum<SomeEnum3ValuesType> | null>
    oneToOne: PGField<PGModel<Model2FieldMapType> | null>
    oneToMany: PGField<Array<PGModel<Model3FieldMapType>>>
  }
  type Model2FieldMapType = {
    id: PGField<number>
    model1: PGField<PGModel<Model1FieldMapType>>
    model1Id: PGField<number>
  }
  type Model3FieldMapType = {
    id: PGField<number>
    model1: PGField<PGModel<Model1FieldMapType>>
    model1Id: PGField<number>
  }

  type PGfyResponseEnums = {
    SomeEnum: PGEnum<SomeEnumValuesType>
    SomeEnum2: PGEnum<SomeEnum2ValuesType>
    SomeEnum3: PGEnum<SomeEnum3ValuesType>
  }

  type PGfyResponseModels = {
    Model1: PGModel<Model1FieldMapType>
    Model2: PGModel<Model2FieldMapType>
    Model3: PGModel<Model3FieldMapType>
  }

  interface PGfyResponse {
    enums: PGfyResponseEnums
    models: PGfyResponseModels
  }

  it('Generates PGEnum, PGModel, and PGObject based on the Prisma schema & Set them in the Build Cache', async () => {
    const pg = getPGBuilder<{ Context: any; PGGeneratedType: PGfyResponse }>()()
    const result = pg.pgfy(dmmf.datamodel)

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
    const expectModel1: PGObject<any> = setPGObjectProperties({
      name: 'Model1',
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
          kind: 'object',
          type: expect.any(Function),
        }),
        oneToMany: mergeDefaultOutputField({
          isList: true,
          kind: 'object',
          type: expect.any(Function),
        }),
      },
    })
    const expectModel2: PGObject<any> = setPGObjectProperties({
      name: 'Model2',
      fieldMap: {
        id: mergeDefaultOutputField({
          kind: 'scalar',
          type: 'id',
        }),
        model1: mergeDefaultOutputField({
          kind: 'object',
          type: expect.any(Function),
        }),
        model1Id: mergeDefaultOutputField({
          kind: 'scalar',
          type: 'int',
        }),
      },
    })
    const expectModel3: PGObject<any> = setPGObjectProperties({
      name: 'Model3',
      fieldMap: {
        id: mergeDefaultOutputField({
          kind: 'scalar',
          type: 'id',
        }),
        model1: mergeDefaultOutputField({
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
      // NOTE: 各Modelは型としてはPGModelだが、実態はPGModelを包含するPGObjectになっている
      models: {
        Model1: { ...expectModel1, kind: 'model' },
        Model2: { ...expectModel2, kind: 'model' },
        Model3: { ...expectModel3, kind: 'model' },
      },
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
      // NOTE: 各Modelは型としてはPGModelだが、実態はPGModelを包含するPGObjectになっている
      model: {
        Model1: { ...expectModel1, kind: 'model' },
        Model2: { ...expectModel2, kind: 'model' },
        Model3: { ...expectModel3, kind: 'model' },
      },
      input: {},
      query: {},
      mutation: {},
      subscription: {},
    })

    // NOTE: Modelの参照が正しく設定されているかの確認
    const model1OneToOneFieldValueType = result.models.Model1.fieldMap.oneToOne.value.type
    expect(
      typeof model1OneToOneFieldValueType === 'function'
        ? model1OneToOneFieldValueType()
        : null,
    ).toEqual({ ...expectModel2, kind: 'object' })
    const model1OneToManyFieldValueType =
      result.models.Model1.fieldMap.oneToMany.value.type
    expect(
      typeof model1OneToManyFieldValueType === 'function'
        ? model1OneToManyFieldValueType()
        : null,
    ).toEqual({ ...expectModel3, kind: 'object' })
    const model2RelationFieldValueType = result.models.Model2.fieldMap.model1.value.type
    expect(
      typeof model2RelationFieldValueType === 'function'
        ? model2RelationFieldValueType()
        : null,
    ).toEqual({ ...expectModel1, kind: 'object' })
    const model3RelationFieldValueType = result.models.Model3.fieldMap.model1.value.type
    expect(
      typeof model3RelationFieldValueType === 'function'
        ? model3RelationFieldValueType()
        : null,
    ).toEqual({ ...expectModel1, kind: 'object' })
  })
})
