import type { PGArgBuilderUnion, PGArgBuilder } from './types/arg-builder'
import type { PGInput, PGInputField } from './types/input'
import type { PGInterface, PGObject, PGOutputField, PGUnion } from './types/output'

export function mergeDefaultPGInput(input: Partial<PGInput<any>>): PGInput<any> {
  return Object.assign(
    {
      name: '',
      kind: 'input',
      value: {
        fieldMap: {},
      },
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
      kind: 'object',
      value: {
        fieldMap: {},
      },
      copy: expect.any(Function),
      implement: expect.any(Function),
      prismaModel: expect.any(Function),
    },
    object,
  )
}

export function mergeDefaultPGInterface(
  someInterface: Partial<PGInterface<any>>,
): PGInterface<any> {
  return Object.assign(
    {
      name: '',
      kind: 'interface',
      value: {
        fieldMap: {},
      },
    },
    someInterface,
  )
}

export function mergeDefaultPGUnion(someUnion: Partial<PGUnion<any>>): PGUnion<any> {
  return Object.assign(
    {
      name: '',
      kind: 'union',
      value: {
        types: [],
      },
    },
    someUnion,
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

export function mergeDefaultArgBuilder(
  name: string,
  value: Partial<PGArgBuilder<any>['value']>,
): PGArgBuilder<any> {
  return {
    name,
    value: Object.assign(
      {
        fieldMap: {},
        builder: expect.any(Object),
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

export function mergeDefaultArgBuilderUnion(
  value: Partial<PGArgBuilderUnion<any>['value']>,
): PGArgBuilderUnion<any> {
  return {
    value: Object.assign(
      {
        builderMap: {},
      },
      value,
    ),
    select: expect.any(Function),
  }
}
