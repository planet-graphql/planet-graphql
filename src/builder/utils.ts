import { AbilityBuilder, subject } from '@casl/ability'
import { PrismaAbility } from '@casl/prisma'
import { Decimal, DMMF } from '@prisma/client/runtime'
import { withFilter } from 'graphql-subscriptions'
import _ from 'lodash'
import { ContextCache, PGCache, PGRootFieldConfig } from '../types/builder'
import {
  FieldBuilderArgsType,
  PGEnum,
  PGFieldType,
  PGModel,
  TypeOfPGFieldMap,
} from '../types/common'
import { InputFieldBuilder, PGInput, PGInputField } from '../types/input'
import {
  OutputFieldBuilder,
  PGObject,
  PGOutputField,
  PGOutputFieldMap,
} from '../types/output'

export class PGError extends Error {
  constructor(message: string, public code: string, public detail?: any) {
    super(message)
    this.name = 'PGError'
    this.code = code
    this.detail = JSON.stringify(detail)
  }
}

export function setCache(
  cache: PGCache,
  value: PGModel<any> | PGObject<any> | PGInput<any> | PGEnum<any> | PGRootFieldConfig,
  overwrite = false,
): void {
  if (overwrite || cache[value.kind][value.name] === undefined) {
    cache[value.kind][value.name] = value
  }
}

export function getCtxCache(context: any): ContextCache {
  if (!_.isPlainObject(context)) {
    throw new PGError('Context must be a plain object.', 'Error')
  }

  if (context.__cache === undefined) {
    const contextCache: ContextCache = {
      loader: {},
      auth: {},
      prismaAbility: {},
      rootResolveInfo: {
        raw: null,
        parsed: null,
      },
      prismaFindArgs: {},
    }
    context.__cache = contextCache
  }
  return context.__cache
}

export function getPrismaAbility(
  pgObject: PGObject<any>,
  ctx: any,
): PrismaAbility<any> | null {
  const abilityCache = getCtxCache(ctx)
  const cachedAbility = abilityCache.prismaAbility[pgObject.name]
  if (cachedAbility !== undefined) {
    return cachedAbility
  }
  if (pgObject.value.prismaAuthBuilder === undefined) {
    abilityCache.prismaAbility[pgObject.name] = null
    return null
  }

  const { can, cannot, build } = new AbilityBuilder(PrismaAbility)
  const allow = (action: string, conditionOrFields: any, condition?: any): void => {
    if (Array.isArray(conditionOrFields)) {
      can(action, pgObject.name as any, conditionOrFields, condition)
    } else {
      can(action, pgObject.name as any, conditionOrFields)
    }
  }
  const deny = (action: string, conditionOrFields: any, condition?: any): void => {
    if (Array.isArray(conditionOrFields)) {
      cannot(action, pgObject.name as any, conditionOrFields, condition)
    } else {
      cannot(action, pgObject.name as any, conditionOrFields)
    }
  }
  pgObject.value.prismaAuthBuilder({ ctx, allow, deny })
  const ability = build()
  abilityCache.prismaAbility[pgObject.name] = ability
  return ability
}

export function getPGFieldKind(type: FieldBuilderArgsType): DMMF.FieldKind {
  if (typeof type === 'string') {
    return 'scalar'
  }
  if (typeof type === 'object') {
    return 'enum'
  }
  if (typeof type === 'function') {
    return 'object'
  }
  throw new PGError('Unsupported type.', 'Error')
}

export function createOutputField<T extends PGFieldType | null>(
  type: FieldBuilderArgsType,
): PGOutputField<T> {
  const field: PGOutputField<any, any> = {
    value: {
      kind: getPGFieldKind(type),
      isRequired: true,
      isList: false,
      isId: type === 'ID',
      type:
        typeof type === 'string'
          ? type === 'ID'
            ? 'String'
            : type
          : typeof type === 'function'
          ? type
          : type.name,
    },
    list: () => {
      field.value.isList = true
      return field
    },
    nullable: () => {
      field.value.isRequired = false
      return field
    },
    args: (x) => {
      field.value.args = x(inputFieldBuilder)
      return field
    },
    resolve: (x) => {
      field.value.resolve = (source, args, context, info) =>
        x({ source, args, context, info, __type: undefined })
      return field
    },
    subscribe: (x) => {
      field.value.subscribe = withFilter(
        (source, args, context, info) => {
          const { pubSubIter } = x({ source, args, context, info, __type: undefined })
          return pubSubIter
        },
        (source, args, context, info) => {
          const { filter } = x({ source, args, context, info, __type: undefined })
          return filter !== undefined ? filter() : true
        },
      )
      return field
    },
    auth: (checker) => {
      field.value.authChecker = checker
      return field
    },
    __type: undefined as any,
  }
  return field
}

export function createInputField<T extends PGFieldType>(
  type: FieldBuilderArgsType,
): PGInputField<T> {
  const field: PGInputField<any> = {
    value: {
      kind: getPGFieldKind(type),
      isRequired: true,
      isList: false,
      isId: type === 'ID',
      type:
        typeof type === 'string'
          ? type === 'ID'
            ? 'String'
            : type
          : typeof type === 'function'
          ? type
          : type.name,
    },
    list: () => {
      field.value.isList = true
      return field
    },
    nullable: () => {
      field.value.isRequired = false
      return field
    },
    default: (value: any) => {
      field.value.default = value
      return field
    },
    validation: (validator) => {
      field.value.validatorBuilder = validator
      return field
    },
    __type: undefined as any,
  }
  return field
}

export function createPGObject<TFieldMap extends PGOutputFieldMap>(
  name: string,
  fieldMap: TFieldMap,
): PGObject<TFieldMap> {
  const pgObject: PGObject<TFieldMap> = {
    name,
    fieldMap,
    value: {},
    kind: 'object',
    prismaAuth: (builder) => {
      pgObject.value.prismaAuthBuilder = builder
      return pgObject
    },
    checkPrismaPermission: (ctx, action, value, condition = value) => {
      const ability = getPrismaAbility(pgObject, ctx)
      if (ability === null)
        return {
          hasPermission: true,
          permittedValue: value,
        }
      const listedValue = (Array.isArray(value) ? value : [value]) as any[]
      const listedCondition = (
        Array.isArray(condition) ? condition : [condition]
      ) as any[]
      let hasPermission = true
      const permittedValue = listedValue.map((listedValueElement, index) => {
        return Object.entries(listedValueElement).reduce<{ [key: string]: any }>(
          (acc, [key, fieldValue]) => {
            if (!ability.can(action, subject(name, listedCondition[index]), key)) {
              if (!pgObject.fieldMap[key].value.isRequired) {
                hasPermission = false
                acc[key] = null
                return acc
              }
              if (pgObject.fieldMap[key].value.isList) {
                hasPermission = false
                acc[key] = []
                return acc
              }
              throw new PGError(
                `Prisma permission denied. Field: ${name}.${key}`,
                'PrismaAuthError',
              )
            }
            if (typeof pgObject.fieldMap[key].value.type === 'function') {
              const innerObject = pgObject.fieldMap[key].value.type as Function
              const innerObjectPermission = innerObject().checkPrismaPermission(
                ctx,
                action,
                listedValueElement[key],
                listedCondition[index][key],
              )
              if (innerObjectPermission.hasPermission === false) hasPermission = false
              acc[key] = innerObjectPermission.permittedValue
              return acc
            }
            acc[key] = fieldValue
            return acc
          },
          {},
        ) as Partial<TypeOfPGFieldMap<TFieldMap>>
      })
      return {
        hasPermission,
        permittedValue: Array.isArray(value)
          ? permittedValue
          : (permittedValue[0] as any),
      }
    },
  }
  return pgObject
}

export const inputFieldBuilder: InputFieldBuilder<any> = {
  id: () => createInputField<string>('ID'),
  string: () => createInputField<string>('String'),
  boolean: () => createInputField<boolean>('Boolean'),
  int: () => createInputField<number>('Int'),
  bigInt: () => createInputField<bigint>('BigInt'),
  float: () => createInputField<number>('Float'),
  dateTime: () => createInputField<Date>('DateTime'),
  json: () => createInputField<string>('Json'),
  byte: () => createInputField<Buffer>('Bytes'),
  decimal: () => createInputField<Decimal>('Decimal'),
  input: <T extends Function>(type: T) => createInputField<T>(type as any),
  enum: <T extends PGEnum<any>>(type: T) => createInputField<T>(type),
}

export const outputFieldBuilder: OutputFieldBuilder<any> = {
  id: () => createOutputField<string>('ID'),
  string: () => createOutputField<string>('String'),
  boolean: () => createOutputField<boolean>('Boolean'),
  int: () => createOutputField<number>('Int'),
  bigInt: () => createOutputField<bigint>('BigInt'),
  float: () => createOutputField<number>('Float'),
  dateTime: () => createOutputField<Date>('DateTime'),
  json: () => createOutputField<string>('Json'),
  byte: () => createOutputField<Buffer>('Bytes'),
  decimal: () => createOutputField<Decimal>('Decimal'),
  object: <T extends Function>(type: T) => createOutputField<T>(type as any),
  enum: <T extends PGEnum<any>>(type: T) => createOutputField<T>(type),
}
