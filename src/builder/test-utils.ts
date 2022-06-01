import { ReadonlyDeep } from 'type-fest'
import { PGCache } from '../types/builder'
import { PGField, PGModel } from '../types/common'
import { PGInput, PGInputField } from '../types/input'
import { PGObject, PGOutputField } from '../types/output'

export function mergeDefaultPGInput(input: Partial<PGInput<any>>): PGInput<any> {
  return Object.assign(
    {
      name: '',
      fieldMap: {},
      value: {},
      kind: 'input',
      copy: expect.any(Function),
      update: expect.any(Function),
      validation: expect.any(Function),
    },
    input,
  )
}

export function mergeDefaultPGObject(object: Partial<PGObject<any>>): PGObject<any> {
  return Object.assign(
    {
      name: '',
      fieldMap: {},
      kind: 'object',
      copy: expect.any(Function),
      update: expect.any(Function),
      modify: expect.any(Function),
      prismaModel: expect.any(Function),
    },
    object,
  )
}

export function mergeDefaultInputField(
  value: Partial<PGInputField<any>['value']>,
): PGInputField<any> {
  return {
    value: Object.assign(
      {
        kind: 'scalar',
        isOptional: false,
        isNullable: false,
        isList: false,
        type: 'id',
      },
      value,
    ),
    nullable: expect.any(Function),
    optional: expect.any(Function),
    nullish: expect.any(Function),
    list: expect.any(Function),
    default: expect.any(Function),
    validation: expect.any(Function),
    __type: undefined as any,
  }
}

export function mergeDefaultOutputField(
  value: Partial<PGOutputField<any>['value']>,
): PGOutputField<any> {
  return {
    value: Object.assign(
      {
        kind: 'scalar',
        isOptional: false,
        isNullable: false,
        isList: false,
        type: 'id',
      },
      value,
    ),
    nullable: expect.any(Function),
    list: expect.any(Function),
    args: expect.any(Function),
    prismaArgs: expect.any(Function),
    prismaRelayArgs: expect.any(Function),
    resolve: expect.any(Function),
    subscribe: expect.any(Function),
    auth: expect.any(Function),
    __type: undefined as any,
  }
}

export function pgObjectToPGModel<TPrismaWhere = any>(): <T extends PGObject<any, any>>(
  object: T,
  pgCache?: ReadonlyDeep<PGCache>,
) => PGModel<
  T extends PGObject<infer U>
    ? {
        [P in keyof U]: U[P] extends PGOutputField<infer V, any, any> ? PGField<V> : never
      }
    : never,
  TPrismaWhere
> {
  return (object, pgCache) => {
    const model = {
      name: object.name,
      kind: 'model',
      fieldMap: object.fieldMap,
    } as any
    if (pgCache !== undefined) {
      const readableCache = pgCache as PGCache
      readableCache.model[model.name] = model
    }
    return model
  }
}
