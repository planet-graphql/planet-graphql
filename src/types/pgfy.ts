import { DMMF } from '@prisma/generator-helper'
import { IsUnknown } from 'type-fest/source/set-return-type'
import { getPGBuilder } from '..'
import { PGTypes, PGTypeConfig, PGConfig, PGBuilder } from './builder'
import { PGEnum } from './common'
import { PGInputFactory } from './input-factory'
import {
  PGObject,
  PGObjectOptionsDefault,
  PGOutputField,
  PGOutputFieldBuilder,
  PGOutputFieldMap,
} from './output'

export type PrismaObject<
  T extends { [key: string]: Function },
  TName extends keyof T,
  TObject extends PGObject<any>,
> = IsUnknown<T[TName]> extends true
  ? TObject
  : T[TName] extends () => any
  ? ReturnType<T[TName]>
  : never

export interface PrismaObjectMap<
  T extends { [key: string]: Function },
  Types extends PGTypes,
> {
  User: PrismaObject<
    T,
    'User',
    PGObject<{
      id: PGOutputField<string>
      post: PGOutputField<() => PrismaObjectMap<T, Types>['Post']>
    }>
  >
  Post: PrismaObject<
    T,
    'Post',
    PGObject<{
      id: PGOutputField<string>
      user: PGOutputField<() => PrismaObjectMap<T, Types>['User']>
    }>
  >
}

export interface PrismaEnumMap {
  Role: PGEnum<any>
}

export interface PrismaArgsFactoryMap<Types extends PGTypes<PGTypeConfig, PGConfig>> {
  User: PGInputFactory<any, Types>
}

export type InitPGPrismaConverter = <T extends PGBuilder<any>>(
  builder: T,
) => T extends PGBuilder<infer U> ? PGPrismaConverter<U> : never

export interface PGPrismaConverter<Types extends PGTypes = PGTypes> {
  convert: <TMap extends { [key: string]: Function }>(
    dmmf: DMMF.Document,
    updatedObjectMap: TMap,
  ) => {
    enums: PrismaEnumMap
    objects: PrismaObjectMap<TMap, Types>
    inputs: PrismaArgsFactoryMap<Types>
  }
  define: <
    TName extends keyof PrismaObjectMap<{}, Types>,
    TFieldMap extends PGOutputFieldMap,
    TMap,
  >(x: {
    name: TName
    fields: (
      f: PrismaObjectMap<{}, Types>[TName]['value']['fieldMap'],
      b: PGOutputFieldBuilder<Types>,
    ) => TFieldMap
    relations: TMap
  }) => PGObject<TFieldMap, [], PGObjectOptionsDefault<Types>, Types>
}

const pg = getPGBuilder()()

const getPGPrismaConverter: InitPGPrismaConverter = (builder) => {
  return {} as any
}
export const pgpc = getPGPrismaConverter(pg)

const dmmf: DMMF.Document = null as any
export const { objects } = pgpc.convert(dmmf, {
  User: () => user,
  Post: () => post,
})

export const user = pgpc.define({
  name: 'User',
  fields: (f, b) => ({
    ...f,
    latestPost: b.relation(() => objects.Post),
  }),
  relations: objects,
})

export const post = pgpc.define({
  name: 'Post',
  fields: (f, b) => ({
    ...f,
    subTitle: b.string(),
  }),
  relations: objects,
})

pg.query({
  name: 'users',
  field: (b) =>
    b
      .object(() => user)
      .list()
      .resolve((params) => {
        return [
          {
            id: '1',
            latestPost: {
              user: {},
            },
          },
        ]
      }),
})
