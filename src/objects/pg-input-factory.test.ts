import {
  mergeDefaultInputFactoryUnion,
  mergeDefaultInputFactoryWrapper,
  mergeDefaultInputField,
} from '../builder/test-utils'
import {
  createPGInputFactoryUnion,
  createPGInputFactoryWrapper,
} from './pg-input-factory'
import { createInputField } from './pg-input-field'

describe('createPGInputFactoryWrapper', () => {
  it('Returns the entity of PGInputFactoryWrapper', () => {
    const fieldMap = {
      id: createInputField<string, 'string', any>({
        kind: 'scalar',
        type: 'string',
      }),
      title: createInputField<string, 'string', any>({
        kind: 'scalar',
        type: 'string',
      }),
    }
    const factoryWrapper = createPGInputFactoryWrapper(fieldMap)
    expect(factoryWrapper).toEqual(mergeDefaultInputFactoryWrapper({ fieldMap }))
  })
})
describe('createPGInputFactoryUnion', () => {
  it('Returns the entity of PGInputFactoryUnion', () => {
    const factoryMap = {
      __default: createInputField<string, 'string', any>({
        kind: 'scalar',
        type: 'string',
      }).list(),
      someFieldList: createInputField<string, 'string', any>({
        kind: 'scalar',
        type: 'string',
      }).list(),
      someField: createInputField<string, 'string', any>({
        kind: 'scalar',
        type: 'string',
      }),
    }
    const factoryUnion = createPGInputFactoryUnion(factoryMap)
    expect(factoryUnion).toEqual(mergeDefaultInputFactoryUnion({ factoryMap }))
  })
})
describe('PGInputFactoryWrapper', () => {
  describe('nullish', () => {
    it('Returns with isNullable and isOptional of value as true', () => {
      const fieldMap = {
        someField: createInputField<string, 'string', any>({
          kind: 'scalar',
          type: 'string',
        }),
      }
      const factoryWrapper = createPGInputFactoryWrapper(fieldMap)
      expect(factoryWrapper.nullish()).toEqual(
        mergeDefaultInputFactoryWrapper({ fieldMap, isNullable: true, isOptional: true }),
      )
    })
  })
  describe('nullable', () => {
    it('Returns with isNullable of value as true', () => {
      const fieldMap = {
        someField: createInputField<string, 'string', any>({
          kind: 'scalar',
          type: 'string',
        }),
      }
      const factoryWrapper = createPGInputFactoryWrapper(fieldMap).nullable()
      expect(factoryWrapper).toEqual(
        mergeDefaultInputFactoryWrapper({ fieldMap, isNullable: true }),
      )
    })
  })
  describe('optional', () => {
    it('Returns with isOptional of value as true', () => {
      const fieldMap = {
        someField: createInputField<string, 'string', any>({
          kind: 'scalar',
          type: 'string',
        }),
      }
      const factoryWrapper = createPGInputFactoryWrapper(fieldMap).optional()
      expect(factoryWrapper).toEqual(
        mergeDefaultInputFactoryWrapper({ fieldMap, isOptional: true }),
      )
    })
  })
  describe('list', () => {
    it('Returns with isList of value as true and converts the fieldMap to a list', () => {
      const fieldMap = {
        someField: createInputField<string, 'string', any>({
          kind: 'scalar',
          type: 'string',
        }),
      }
      const factoryWrapper = createPGInputFactoryWrapper(fieldMap).list()
      expect(factoryWrapper).toEqual(
        mergeDefaultInputFactoryWrapper({ fieldMap: fieldMap, isList: true }),
      )
    })
  })
  describe('default', () => {
    it('Sets default value to default of value', () => {
      const fieldMap = {
        someField: createInputField<string, 'string', any>({
          kind: 'scalar',
          type: 'string',
        }),
      }
      const factoryWrapper = createPGInputFactoryWrapper(fieldMap)
        .nullable()
        .default(null)
      expect(factoryWrapper).toEqual(
        mergeDefaultInputFactoryWrapper({ fieldMap, isNullable: true, default: null }),
      )
    })
  })
  describe('validation', () => {
    it('Sets builder to validator of value', () => {
      const fieldMap = {
        someField: createInputField<string, 'string', any>({
          kind: 'scalar',
          type: 'string',
        }),
      }
      const factoryWrapper = createPGInputFactoryWrapper(fieldMap).validation(
        (value) => value.someField !== '',
      )
      expect(factoryWrapper).toEqual(
        mergeDefaultInputFactoryWrapper({ fieldMap, validator: expect.any(Function) }),
      )
      expect(
        factoryWrapper.value.validator?.({
          someField: 'xxx',
        }),
      ).toEqual(true)
      expect(
        factoryWrapper.value.validator?.({
          someField: '',
        }),
      ).toEqual(false)
    })
  })
  describe('edit', () => {
    it('Returns a new PGInputFactory after editing each Field of the original', () => {
      const original = createPGInputFactoryWrapper({
        someField: createInputField<string, 'string', any>({
          kind: 'scalar',
          type: 'string',
        }),
        someObject: () =>
          createPGInputFactoryWrapper({
            innerField: createInputField<string, 'string', any>({
              kind: 'scalar',
              type: 'string',
            }),
          }),
      })
      const edit = original.edit((f) => ({
        someField: f.someField,
        someObject: f.someObject.edit((f) => ({
          innerField: f.innerField,
        })),
      }))

      const expectFactoryWrapper = mergeDefaultInputFactoryWrapper({
        fieldMap: {
          someField: mergeDefaultInputField({ kind: 'scalar', type: 'string' }),
          someObject: mergeDefaultInputFactoryWrapper({
            fieldMap: {
              innerField: mergeDefaultInputField({ kind: 'scalar', type: 'string' }),
            },
          }),
        },
      })
      expect(edit).toEqual(expectFactoryWrapper)
    })
  })
  describe('build', () => {})
})
describe('PGInputFactoryUnion', () => {
  describe('select', () => {
    it('Returns the selected field from the FactoryMap of PGInputFactoryUnion', () => {
      const factoryMap = {
        __default: createInputField<string, 'string', any>({
          kind: 'scalar',
          type: 'string',
        }).list(),
        someFieldList: createInputField<string, 'string', any>({
          kind: 'scalar',
          type: 'string',
        }).list(),
        someField: createInputField<string, 'string', any>({
          kind: 'scalar',
          type: 'string',
        }),
      }
      const factoryUnion = createPGInputFactoryUnion(factoryMap)
      const result = factoryUnion.select('someFieldList')
      expect(result).toEqual(
        mergeDefaultInputField({
          kind: 'scalar',
          isOptional: false,
          isNullable: false,
          isList: true,
          type: 'string',
        }),
      )
    })
  })
})
