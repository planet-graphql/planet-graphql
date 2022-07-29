import type { PGArgBuilder } from './arg-builder'
import type { PGTypes, PGBuilder } from './builder'
import type { PGEnum, TypeOfPGFieldMap } from './common'
import type {
  ConvertPGInterfacesToFieldMap,
  GetPrismaModelNames,
  PGInterface,
  PGObject,
  PGObjectOptionsDefault,
  PGOutputFieldBuilder,
  PGOutputFieldMap,
} from './output'
import type { DMMF } from '@prisma/generator-helper'
import type { IsUnknown } from 'type-fest/source/set-return-type'

export type PrismaObject<
  TObjectRef extends { [key: string]: Function | undefined },
  TName extends string,
  TFieldMap extends PGOutputFieldMap,
  Types extends PGTypes = PGTypes,
> = IsUnknown<TObjectRef[TName]> extends true
  ? () => PGObject<TFieldMap, undefined, { PrismaModelName: TName }, Types>
  : TObjectRef[TName]

export interface PrismaObjectMap<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  TObjectRef extends { [key: string]: Function | undefined },
  Types extends PGTypes = PGTypes,
> {
  [key: string]: () => PGObject<any, any, any, Types>
}

export interface PrismaEnumMap {
  [name: string]: PGEnum<any>
}

export interface PrismaArgBuilderMap<Types extends PGTypes> {
  [name: string]: PGArgBuilder<any, Types>
}

export type InitPGPrismaConverter = <Types extends PGTypes>(
  builder: PGBuilder<Types>,
  dmmf: DMMF.Document,
) => PGPrismaConverter<Types>

export interface PGPrismaConverter<Types extends PGTypes> {
  convertOutputs: <
    TObjectRef extends { [P in keyof PrismaObjectMap<{}, Types>]?: Function },
  >(
    updatedObjectRef?: TObjectRef,
  ) => {
    objects: {
      [P in keyof PrismaObjectMap<TObjectRef, Types>]: ReturnType<
        PrismaObjectMap<TObjectRef, Types>[P]
      >
    }
    enums: PrismaEnumMap
    getRelations: <TName extends keyof PrismaObjectMap<{}, Types>>(
      name: TName,
    ) => Omit<PrismaObjectMap<TObjectRef, Types>, TName>
  }
  convertInputs: () => PrismaArgBuilderMap<Types>
  update: <
    TName extends Exclude<keyof PrismaObjectMap<{}, Types>, undefined | number>,
    TFieldMap extends PGOutputFieldMap,
    TObjectRef extends { [P in keyof PrismaObjectMap<{}, Types>]?: Function } = {},
    TInterfaces extends Array<PGInterface<any>> | undefined = undefined,
  >(config: {
    name: TName
    fields: (
      f: ReturnType<PrismaObjectMap<TObjectRef, Types>[TName]> extends infer U
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
    relations: () => TObjectRef
  }) => PGObject<
    TFieldMap & ConvertPGInterfacesToFieldMap<TInterfaces>,
    TInterfaces,
    TName extends GetPrismaModelNames<Types>
      ? { PrismaModelName: TName }
      : PGObjectOptionsDefault<Types>,
    Types
  >
}
