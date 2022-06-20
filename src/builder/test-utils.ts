import { PGInput, PGInputField } from '../types/input'
import { PGInputFactoryUnion, PGInputFactory } from '../types/input-factory'
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
    relay: expect.any(Function),
    relayArgs: expect.any(Function),
    relayTotalCount: expect.any(Function),
    relayCursor: expect.any(Function),
    relayOrderBy: expect.any(Function),
    resolve: expect.any(Function),
    subscribe: expect.any(Function),
    auth: expect.any(Function),
    __type: undefined as any,
  }
}

export function mergeDefaultInputFactory(
  value: Partial<PGInputFactory<any>['value']>,
): PGInputFactory<any> {
  return {
    value: Object.assign(
      {
        fieldMap: {},
        kind: 'object',
        type: Function,
        isOptional: false,
        isNullable: false,
        isList: false,
      },
      value,
    ),
    nullish: expect.any(Function),
    nullable: expect.any(Function),
    optional: expect.any(Function),
    list: expect.any(Function),
    default: expect.any(Function),
    validation: expect.any(Function),
    edit: expect.any(Function),
    build: expect.any(Function),
  }
}

export function mergeDefaultInputFactoryUnion(
  value: Partial<PGInputFactoryUnion<any>['value']>,
): PGInputFactoryUnion<any> {
  return {
    value: Object.assign(
      {
        factoryMap: {},
      },
      value,
    ),
    select: expect.any(Function),
  }
}
