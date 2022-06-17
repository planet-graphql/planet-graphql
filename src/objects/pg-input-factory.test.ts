import { getPGBuilder } from '..'
import {
  mergeDefaultInputFactoryUnion,
  mergeDefaultInputFactoryWrapper,
  mergeDefaultInputField,
  mergeDefaultPGInput,
} from '../builder/test-utils'
import { createPGEnum } from './pg-enum'
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
      const factoryWrapper = createPGInputFactoryWrapper(fieldMap).nullish()
      expect(factoryWrapper).toEqual(
        mergeDefaultInputFactoryWrapper({ fieldMap, isNullable: true, isOptional: true }),
      )
      expect(factoryWrapper.nullish(false)).toEqual(
        mergeDefaultInputFactoryWrapper({ fieldMap }),
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
      expect(factoryWrapper.nullable(false)).toEqual(
        mergeDefaultInputFactoryWrapper({ fieldMap }),
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
      expect(factoryWrapper.optional(false)).toEqual(
        mergeDefaultInputFactoryWrapper({ fieldMap }),
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
  describe('build', () => {
    describe('scalarType and enumType', () => {
      it('PGInputField is generated from PGInputFactory & Input is cached', () => {
        const pg = getPGBuilder()()
        const pgInputFactory = createPGInputFactoryWrapper({
          someScalar: createInputField({
            kind: 'scalar',
            type: 'string',
          }),
          someEnum: createInputField({
            kind: 'enum',
            type: createPGEnum('SomeEnum', 'AAA', 'BBB'),
          }),
        })
        const pgInput = pgInputFactory
          .edit((f) => ({
            someScalar: f.someScalar,
            someEnum: f.someEnum,
          }))
          .build('SomeInput', pg)
        expect(pgInput).toEqual({
          someScalar: mergeDefaultInputField({
            kind: 'scalar',
            type: 'string',
          }),
          someEnum: mergeDefaultInputField({
            kind: 'enum',
            type: {
              name: 'SomeEnum',
              values: ['AAA', 'BBB'],
              kind: 'enum',
            },
          }),
        })
        expect(pg.cache().enum).toEqual({
          SomeEnum: {
            kind: 'enum',
            name: 'SomeEnum',
            values: ['AAA', 'BBB'],
          },
        })
        expect(pg.cache().input).toEqual({})
      })
    })
    describe('InputType', () => {
      it('PGInputField is generated from PGInputFactoryWrapper & Input is cached', () => {
        const pg = getPGBuilder()()
        const pgInputFactory = createPGInputFactoryWrapper({
          someObject: () =>
            createPGInputFactoryWrapper({
              innerObject: () =>
                createPGInputFactoryWrapper({
                  field: createInputField({
                    kind: 'scalar',
                    type: 'string',
                  }),
                }),
            }),
        })
        const pgInput = pgInputFactory
          .edit((f) => ({
            someObject: f.someObject.edit((f) => ({
              innerObject: f.innerObject,
            })),
          }))
          .build('SomeInput', pg)

        expect(pgInput).toEqual({
          someObject: mergeDefaultInputField({
            kind: 'object',
            type: expect.any(Function),
          }),
        })

        const someObjectValue = (pgInput.someObject.value.type as Function)()
        const innerObjectValue = (
          someObjectValue.fieldMap.innerObject.value.type as Function
        )()

        expect(someObjectValue).toEqual(
          mergeDefaultPGInput({
            name: 'SomeInputSomeObject',
            fieldMap: {
              innerObject: mergeDefaultInputField({
                kind: 'object',
                type: expect.any(Function),
              }),
            },
          }),
        )
        expect(innerObjectValue).toEqual(
          mergeDefaultPGInput({
            name: 'SomeInputSomeObjectInnerObject',
            fieldMap: {
              field: mergeDefaultInputField({
                kind: 'scalar',
                type: 'string',
              }),
            },
          }),
        )
        expect(pg.cache().input).toEqual({
          SomeInputSomeObject: mergeDefaultPGInput({
            name: 'SomeInputSomeObject',
            fieldMap: {
              innerObject: mergeDefaultInputField({
                kind: 'object',
                type: expect.any(Function),
              }),
            },
          }),
          SomeInputSomeObjectInnerObject: mergeDefaultPGInput({
            name: 'SomeInputSomeObjectInnerObject',
            fieldMap: {
              field: mergeDefaultInputField({
                kind: 'scalar',
                type: 'string',
              }),
            },
          }),
        })
      })
      it('returns after the value set in Value of PGInputFactoryWrapper is inherited', () => {
        const pg = getPGBuilder()()
        const pgInputFactory = createPGInputFactoryWrapper({
          someObject: () =>
            createPGInputFactoryWrapper({
              field: createInputField({
                kind: 'scalar',
                type: 'string',
              }),
            }),
        })
        const pgInput = pgInputFactory
          .edit((f) => ({
            someObject: f.someObject
              .edit((f) => ({
                field: f.field,
              }))
              .list()
              .nullish()
              .default(null)
              .validation((value) => value?.field !== 'xxx'),
          }))
          .build('SomeInput', pg)

        expect(pgInput).toEqual({
          someObject: mergeDefaultInputField({
            kind: 'object',
            type: expect.any(Function),
            isList: true,
            isNullable: true,
            isOptional: true,
            default: null,
          }),
        })
        const someObject = (pgInput.someObject.value.type as Function)()
        expect(someObject).toEqual(
          mergeDefaultPGInput({
            name: 'SomeInputSomeObject',
            fieldMap: {
              field: mergeDefaultInputField({
                kind: 'scalar',
                type: 'string',
              }),
            },
            value: {
              validator: expect.any(Function),
            },
          }),
        )
        expect(someObject.value.validator?.({ field: 'xxx' }, {})).toEqual(false)
        expect(someObject.value.validator?.({ field: 'yyy' }, {})).toEqual(true)
      })
    })
    describe('UnionType', () => {
      it('PGInputField is generated from default of PGInputFactoryUnion', () => {
        const pg = getPGBuilder()()
        const pgInputInput = createPGInputFactoryWrapper({
          someUnion: createPGInputFactoryUnion({
            __default: createInputField({
              kind: 'scalar',
              type: 'string',
            }).list(),
            field: createInputField({
              kind: 'scalar',
              type: 'string',
            }),
          }),
        })

        const pgInput = pgInputInput
          .edit((f) => ({
            someUnion: f.someUnion,
          }))
          .build('SomeInput', pg)

        expect(pgInput).toEqual({
          someUnion: mergeDefaultInputField({
            kind: 'scalar',
            type: 'string',
            isList: true,
          }),
        })
      })
    })
    describe('build with wrap', () => {
      it('PGInputField is generated from PGInputFactory with wrap & Input is cached', () => {
        const pg = getPGBuilder()()

        const pgInputFactory = createPGInputFactoryWrapper({
          field: createInputField({
            kind: 'scalar',
            type: 'string',
          }),
        })
        const pgInput = pgInputFactory
          .edit((f) => ({
            field: f.field,
          }))
          .build('SomeInput', pg, true)
        expect(pgInput).toEqual(
          mergeDefaultInputField({
            kind: 'object',
            type: expect.any(Function),
          }),
        )
        ;(pgInput.value.type as Function)()
        expect(pg.cache().input).toEqual({
          SomeInput: mergeDefaultPGInput({
            name: 'SomeInput',
            fieldMap: {
              field: mergeDefaultInputField({
                kind: 'scalar',
                type: 'string',
              }),
            },
          }),
        })
      })
    })
    describe('Recursive InputType', () => {
      it('PGInputField is generated from PGInputFactoryWrapper & Input is cached', () => {
        const pg = getPGBuilder()()
        const fieldMap = {
          field: createInputField({
            kind: 'scalar',
            type: 'string',
          }),
          AND: () => createPGInputFactoryWrapper(fieldMap),
        }

        const pgInputFactory = createPGInputFactoryWrapper(fieldMap)
        const pgInput = pgInputFactory
          .edit((f) => ({
            AND: f.AND.edit((f) => ({
              field: f.field,
            })),
          }))
          .build('SomeInput', pg)

        const someObjectValue = (pgInput.AND.value.type as Function)()

        expect(pgInput).toEqual({
          AND: mergeDefaultInputField({
            kind: 'object',
            type: expect.any(Function),
          }),
        })
        expect(someObjectValue).toEqual(
          mergeDefaultPGInput({
            name: 'SomeInputAND',
            fieldMap: {
              field: mergeDefaultInputField({
                kind: 'scalar',
                type: 'string',
              }),
            },
          }),
        )
        expect(pg.cache().input).toEqual({
          SomeInputAND: mergeDefaultPGInput({
            name: 'SomeInputAND',
            fieldMap: {
              field: mergeDefaultInputField({
                kind: 'scalar',
                type: 'string',
              }),
            },
          }),
        })
      })
    })
    describe('Cross-referenced InputType', () => {
      it('PGInputField is generated from PGInputFactoryWrapper & Input is cached', () => {
        const pg = getPGBuilder()()
        const fieldMap1 = {
          field1: createInputField({
            kind: 'scalar',
            type: 'string',
          }),
          input2s: () => createPGInputFactoryWrapper(fieldMap2).list(),
        }
        const fieldMap2 = {
          input1: () => createPGInputFactoryWrapper(fieldMap1),
        }

        const pgInputInput1 = createPGInputFactoryWrapper(fieldMap1)

        const pgInput1 = pgInputInput1
          .edit((f) => ({
            input2s: f.input2s.edit((f) => ({
              input1: f.input1.edit((f) => ({
                field1: f.field1,
              })),
            })),
          }))
          .build('SomeInput', pg)

        expect(pgInput1).toEqual({
          input2s: mergeDefaultInputField({
            kind: 'object',
            type: expect.any(Function),
            isList: true,
          }),
        })

        const singleCross = (pgInput1.input2s.value.type as Function)()
        const doubleCross = (singleCross.fieldMap.input1.value.type as Function)()

        expect(singleCross).toEqual(
          mergeDefaultPGInput({
            name: 'SomeInputInput2s',
            fieldMap: {
              input1: mergeDefaultInputField({
                kind: 'object',
                type: expect.any(Function),
              }),
            },
          }),
        )
        expect(doubleCross).toEqual(
          mergeDefaultPGInput({
            name: 'SomeInputInput2sInput1',
            fieldMap: {
              field1: mergeDefaultInputField({
                kind: 'scalar',
                type: 'string',
              }),
            },
          }),
        )
        expect(pg.cache().input).toEqual({
          SomeInputInput2s: mergeDefaultPGInput({
            name: 'SomeInputInput2s',
            fieldMap: {
              input1: mergeDefaultInputField({
                kind: 'object',
                type: expect.any(Function),
              }),
            },
          }),
          SomeInputInput2sInput1: mergeDefaultPGInput({
            name: 'SomeInputInput2sInput1',
            fieldMap: {
              field1: mergeDefaultInputField({
                kind: 'scalar',
                type: 'string',
              }),
            },
          }),
        })
      })
    })
  })
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
