import type { PGTypes, PGBuilder } from './builder'
import type { PGEnum, TypeOfPGFieldMap } from './common'
import type { PGInputFactory } from './input-factory'
import type {
  ConvertPGInterfacesToFieldMap,
  PGInterface,
  PGObject,
  PGObjectOptionsDefault,
  PGOutputFieldBuilder,
  PGOutputFieldMap,
} from './output'
import type { DMMF } from '@prisma/generator-helper'
import type { Simplify } from 'type-fest'
import type { IsUnknown } from 'type-fest/source/set-return-type'

export type PrismaObject<
  TObjectRef extends { [key: string]: Function | undefined },
  TName extends keyof TObjectRef,
  TObject extends PGObject<any>,
> = IsUnknown<TObjectRef[TName]> extends true
  ? TObject
  : TObjectRef[TName] extends () => any
  ? ReturnType<TObjectRef[TName]>
  : never

export interface PrismaObjectMap<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  TObjectRef extends { [key: string]: Function | undefined },
  Types extends PGTypes = PGTypes,
> {
  [key: string]: PGObject<any, any, any, Types>
}

export interface PrismaEnumMap {
  [name: string]: PGEnum<any>
}

export interface PrismaInputFactoryMap<Types extends PGTypes> {
  [name: string]: PGInputFactory<any, Types>
}

export type InitPGPrismaConverter = <Types extends PGTypes>(
  builder: PGBuilder<Types>,
  dmmf: DMMF.Document,
) => PGPrismaConverter<Types>

export interface PGPrismaConverter<Types extends PGTypes> {
  convert: <
    TObjectRef extends { [P in keyof PrismaObjectMap<{}, Types>]?: Function } = {},
  >(
    updatedObjectRef?: TObjectRef,
  ) => {
    objects: <TName extends keyof PrismaObjectMap<TObjectRef, Types>>(
      name: TName,
    ) => PrismaObjectMap<TObjectRef, Types>[TName]
    relations: <TName extends keyof PrismaObjectMap<TObjectRef, Types>>(
      name: TName,
    ) => Omit<PrismaObjectMap<TObjectRef, Types>, TName> extends infer U
      ? { [P in keyof U]: () => U[P] }
      : never
    enums: <TName extends keyof PrismaEnumMap>(name: TName) => PrismaEnumMap[TName]
    inputs: <TName extends keyof PrismaInputFactoryMap<Types>>(
      name: TName,
    ) => PrismaInputFactoryMap<Types>[TName]
  }
  update: <
    TName extends Exclude<keyof PrismaObjectMap<{}, Types>, undefined | number>,
    TFieldMap extends PGOutputFieldMap,
    TObjectRef extends { [P in keyof PrismaObjectMap<{}, Types>]?: Function } = {},
    TInterfaces extends Array<PGInterface<any>> | undefined = undefined,
  >(config: {
    name: TName
    fields: (
      f: PrismaObjectMap<TObjectRef, Types>[TName] extends infer U
        ? U extends PGObject<any>
          ? U['value']['fieldMap']
          : never
        : never,
      b: PGOutputFieldBuilder<Types>,
    ) => TFieldMap
    interfaces?: TInterfaces
    isTypeOf?: (
      value: TypeOfPGFieldMap<TFieldMap & ConvertPGInterfacesToFieldMap<TInterfaces>>,
    ) => boolean
    relations: TObjectRef
  }) => PGObject<
    Simplify<TFieldMap & ConvertPGInterfacesToFieldMap<TInterfaces>>,
    TInterfaces,
    TName extends keyof Types['Prisma']['Args']
      ? { PrismaModelName: TName }
      : PGObjectOptionsDefault<Types>,
    Types
  >
}
