import { DMMF } from '@prisma/generator-helper'
import { getDMMF } from '@prisma/sdk'
import { getPGBuilder } from '..'
import { DefaultScalars } from '../lib/scalars'
import { PGEnum } from '../types/common'
import { PGObject } from '../types/output'
import { mergeDefaultPGObject, mergeDefaultOutputField } from './test-utils'

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

  it('Generates PGEnum, PGModel, and PGObject based on the Prisma schema & Set them in the Build Cache', async () => {
    const pg = getPGBuilder()()
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
    const expectModel1: PGObject<any> = mergeDefaultPGObject({
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
    const expectModel2: PGObject<any> = mergeDefaultPGObject({
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
    const expectModel3: PGObject<any> = mergeDefaultPGObject({
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
      objects: {
        Model1: expectModel1,
        Model2: expectModel2,
        Model3: expectModel3,
      },
      models: {},
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
      model: {},
      query: {},
      mutation: {},
      subscription: {},
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
    const model2RelationFieldValueType = result.objects.Model2.fieldMap.model1.value.type
    expect(
      typeof model2RelationFieldValueType === 'function'
        ? model2RelationFieldValueType()
        : null,
    ).toEqual({ ...expectModel1, kind: 'object' })
    const model3RelationFieldValueType = result.objects.Model3.fieldMap.model1.value.type
    expect(
      typeof model3RelationFieldValueType === 'function'
        ? model3RelationFieldValueType()
        : null,
    ).toEqual({ ...expectModel1, kind: 'object' })
  })
})
