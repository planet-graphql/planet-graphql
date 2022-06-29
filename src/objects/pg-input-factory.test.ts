import { getPGBuilder } from '..'
import {
  mergeDefaultInputFactoryUnion,
  mergeDefaultInputFactory,
  mergeDefaultPGInput,
  mergeDefaultInputField,
} from '../test-utils'
import { PGTypes } from '../types/builder'
import { PGInput } from '../types/input'
import { PGInputFactory } from '../types/input-factory'
import { createPGEnum } from './pg-enum'
import {
  createPGInputFactoryUnion,
  createPGInputFactory,
  convertPGInputFactoryFieldToPGInputField,
} from './pg-input-factory'
import { createInputField } from './pg-input-field'

describe('createPGInputFactory', () => {
  it('Returns the entity of PGInputFactory', () => {
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
    const pgInputFactory = createPGInputFactory('SomeInput', fieldMap)
    expect(pgInputFactory).toEqual(mergeDefaultInputFactory('SomeInput', { fieldMap }))
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

describe('PGInputFactory', () => {
  describe('nullish', () => {
    it('Returns with isNullable and isOptional of value as true', () => {
      const fieldMap = {
        someField: createInputField<string, 'string', any>({
          kind: 'scalar',
          type: 'string',
        }),
      }
      const pgInputFactory = createPGInputFactory('SomeInput', fieldMap).nullish()
      expect(pgInputFactory).toEqual(
        mergeDefaultInputFactory('SomeInput', {
          fieldMap,
          isNullable: true,
          isOptional: true,
        }),
      )
      expect(pgInputFactory.nullish(false)).toEqual(
        mergeDefaultInputFactory('SomeInput', { fieldMap }),
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
      const pgInputFactory = createPGInputFactory('SomeInput', fieldMap).nullable()
      expect(pgInputFactory).toEqual(
        mergeDefaultInputFactory('SomeInput', { fieldMap, isNullable: true }),
      )
      expect(pgInputFactory.nullable(false)).toEqual(
        mergeDefaultInputFactory('SomeInput', { fieldMap }),
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
      const pgInputFactory = createPGInputFactory('SomeInput', fieldMap).optional()
      expect(pgInputFactory).toEqual(
        mergeDefaultInputFactory('SomeInput', { fieldMap, isOptional: true }),
      )
      expect(pgInputFactory.optional(false)).toEqual(
        mergeDefaultInputFactory('SomeInput', { fieldMap }),
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
      const pgInputFactory = createPGInputFactory('SomeInput', fieldMap).list()
      expect(pgInputFactory).toEqual(
        mergeDefaultInputFactory('SomeInput', { fieldMap: fieldMap, isList: true }),
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
      const pgInputFactory = createPGInputFactory('SomeInput', fieldMap)
        .nullable()
        .default(null)
      expect(pgInputFactory).toEqual(
        mergeDefaultInputFactory('SomeInput', {
          fieldMap,
          isNullable: true,
          default: null,
        }),
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
      const pgInputFactory = createPGInputFactory('SomeInput', fieldMap).validation(
        (value) => value.someField !== '',
      )
      expect(pgInputFactory).toEqual(
        mergeDefaultInputFactory('SomeInput', {
          fieldMap,
          validator: expect.any(Function),
        }),
      )
      expect(
        pgInputFactory.value.validator?.({
          someField: 'xxx',
        }),
      ).toEqual(true)
      expect(
        pgInputFactory.value.validator?.({
          someField: '',
        }),
      ).toEqual(false)
    })
  })

  describe('edit', () => {
    it('Returns a new PGInputFactory after editing each Field of the original', () => {
      const original = createPGInputFactory('SomeInput', {
        someField: createInputField<string, 'string', any>({
          kind: 'scalar',
          type: 'string',
        }),
        someObject: () =>
          createPGInputFactory('SomeObjectSomeInput', {
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

      const expectFactory = mergeDefaultInputFactory('', {
        fieldMap: {
          someField: mergeDefaultInputField({ kind: 'scalar', type: 'string' }),
          someObject: mergeDefaultInputFactory('', {
            fieldMap: {
              innerField: mergeDefaultInputField({ kind: 'scalar', type: 'string' }),
            },
          }),
        },
      })
      expect(edit).toEqual(expectFactory)
    })
  })

  describe('build', () => {
    describe('ScalarType Field', () => {
      it('Returns a scalar type PGInputField', () => {
        const pg = getPGBuilder()()
        const pgInputFactory = createPGInputFactory('SomeInput', {
          someScalar: createInputField({
            kind: 'scalar',
            type: 'string',
          }),
        })

        const result = pgInputFactory.build('Prefix', pg)

        expect(result).toEqual({
          someScalar: mergeDefaultInputField({
            kind: 'scalar',
            type: 'string',
          }),
        })
      })
    })

    describe('EnumType Field', () => {
      it('Returns an enum type PGInputField', () => {
        const pg = getPGBuilder()()
        const pgInputFactory = createPGInputFactory('SomeInput', {
          someEnum: createInputField({
            kind: 'enum',
            type: createPGEnum('SomeEnum', ['AAA', 'BBB']),
          }),
        })

        const result = pgInputFactory.build('Prefix', pg)
        expect(result).toEqual({
          someEnum: mergeDefaultInputField({
            kind: 'enum',
            type: {
              name: 'SomeEnum',
              values: ['AAA', 'BBB'],
              kind: 'enum',
            },
          }),
        })
      })
    })

    describe('InputType Field', () => {
      it('Returns an PGInputField with a PGInput & the PGInput is set to the Build Cache', () => {
        const pg = getPGBuilder()()
        const pgInputFactory = createPGInputFactory('SomeInput', {
          field: () =>
            createPGInputFactory('SomeInputField', {
              innerField: createInputField({
                kind: 'scalar',
                type: 'string',
              }),
            }),
        })

        const result = pgInputFactory.build('Prefix', pg)
        const field = (result.field.value.type as Function)()

        const expectResult = {
          field: mergeDefaultInputField({
            kind: 'object',
            type: expect.any(Function),
          }),
        }
        const expectField = mergeDefaultPGInput({
          name: 'SomeInputField',
          value: {
            fieldMap: {
              innerField: mergeDefaultInputField({
                kind: 'scalar',
                type: 'string',
              }),
            },
          },
        })
        expect(result).toEqual(expectResult)
        expect(field).toEqual(expectField)
        expect(pg.cache().input).toEqual({
          SomeInputField: expectField,
        })
      })

      describe('PGInputFactory values are set', () => {
        it('Returns a PGInputField and a PGInput that inherited the PGInputFactory values', () => {
          const pg = getPGBuilder()()
          const pgInputFactory = createPGInputFactory('SomeInput', {
            field: () =>
              createPGInputFactory('SomeInputField', {
                innerField: createInputField({
                  kind: 'scalar',
                  type: 'string',
                }),
              })
                .list()
                .optional()
                .nullable()
                .default([])
                .validation(() => true),
          })

          const result = pgInputFactory.build('Prefix', pg)
          const field = (result.field.value.type as Function)()

          const expectResult = {
            field: mergeDefaultInputField({
              kind: 'object',
              type: expect.any(Function),
              isList: true,
              isOptional: true,
              isNullable: true,
              default: [],
            }),
          }
          const expectField = mergeDefaultPGInput({
            name: 'SomeInputField',
            value: {
              fieldMap: {
                innerField: mergeDefaultInputField({
                  kind: 'scalar',
                  type: 'string',
                }),
              },
              validator: expect.any(Function),
            },
          })
          expect(result).toEqual(expectResult)
          expect(field).toEqual(expectField)
        })
      })
    })

    describe('UnionType Field', () => {
      it('Returns a PGInputField generated from default of PGInputFactoryUnion', () => {
        const pg = getPGBuilder()()
        const pgInputFactory = createPGInputFactory('SomeInput', {
          someUnion: createPGInputFactoryUnion({
            __default: createInputField({
              kind: 'scalar',
              type: 'id',
            }),
            field: createInputField({
              kind: 'scalar',
              type: 'string',
            }),
          }),
        })

        const result = pgInputFactory.build('Prefix', pg)

        expect(result).toEqual({
          someUnion: mergeDefaultInputField({
            kind: 'scalar',
            type: 'id',
          }),
        })
      })
    })

    describe('Wrap is enabled', () => {
      it('Generated a PGInputField and a PGInput for wrapping & the PGInput is set into the Build Cache', () => {
        const pg = getPGBuilder()()
        const pgInputFactory = createPGInputFactory('SomeInput', {
          field: createInputField({
            kind: 'scalar',
            type: 'string',
          }),
        })

        const result = pgInputFactory.build('Prefix', pg, true)
        const wrapInput: PGInput<any> = (result.value.type as Function)()

        const expectWrapInput = mergeDefaultPGInput({
          name: 'SomeInput',
          value: {
            fieldMap: {
              field: mergeDefaultInputField({
                kind: 'scalar',
                type: 'string',
              }),
            },
          },
        })
        expect(result).toEqual(
          mergeDefaultInputField({
            kind: 'object',
            type: expect.any(Function),
          }),
        )
        expect(wrapInput).toEqual(expectWrapInput)
        expect(pg.cache().input).toEqual({
          SomeInput: expectWrapInput,
        })
      })
    })

    describe('Recursive InputType', () => {
      it('Returns a recursive PGInputFactory', () => {
        const pg = getPGBuilder()()
        type Factory = PGInputFactory<{ field: () => Factory }, PGTypes>
        const fieldMap = {
          field: () => pgInputFactory,
        }
        const pgInputFactory: Factory = createPGInputFactory('SomeInput', fieldMap)
        const result = pgInputFactory.build('Prefix', pg)
        expect(result).toEqual({
          field: mergeDefaultInputField({
            kind: 'object',
            type: expect.any(Function),
          }),
        })
      })
    })

    describe('Cross-referenced InputType', () => {
      it('PReturns a cross-referenced PGInputFactory', () => {
        type Factory1 = PGInputFactory<{ field: () => Factory2 }, PGTypes>
        type Factory2 = PGInputFactory<{ field: () => Factory1 }, PGTypes>
        const pg = getPGBuilder()()
        const fieldMap1 = {
          field: () => pgInputFactory2,
        }
        const fieldMap2 = {
          field: () => pgInputFactory1,
        }
        const pgInputFactory1: Factory1 = createPGInputFactory('SomeInput1', fieldMap1)
        const pgInputFactory2: Factory2 = createPGInputFactory('SomeInput2', fieldMap2)

        const result = pgInputFactory1.build('Prefix', pg)

        expect(result).toEqual({
          field: mergeDefaultInputField({
            kind: 'object',
            type: expect.any(Function),
          }),
        })
      })
    })
  })
})

describe('convertPGInputFactoryFieldToPGInputField', () => {
  it('Returns PGInputField converted from PGInputFactory', () => {
    const pg = getPGBuilder()()
    const pgInputFactory = createPGInputFactory('SomeInput', {
      field: createInputField({
        kind: 'scalar',
        type: 'string',
      }),
    })
    const inputRef = {}
    const result = convertPGInputFactoryFieldToPGInputField(
      'Prefix',
      pgInputFactory,
      pg,
      inputRef,
    )
    const expectSomeInput = mergeDefaultPGInput({
      name: 'SomeInput',
      value: {
        fieldMap: {
          field: mergeDefaultInputField({
            kind: 'scalar',
            type: 'string',
          }),
        },
      },
    })
    expect(result).toEqual(
      mergeDefaultInputField({
        kind: 'object',
        type: expect.any(Function),
      }),
    )
    expect((result.value.type as Function)()).toEqual(expectSomeInput)
    expect(inputRef).toEqual({
      SomeInput: expectSomeInput,
    })
  })
  it('Returns PGInputField converted from PGInputFactoryUnion', () => {
    const pg = getPGBuilder()()
    const pgInputFactoryUnion = createPGInputFactoryUnion({
      __default: createInputField<string, 'string', any>({
        kind: 'scalar',
        type: 'string',
      }).list(),
      field: createInputField<string, 'string', any>({
        kind: 'scalar',
        type: 'string',
      }),
    })
    const inputRef = {}
    const result = convertPGInputFactoryFieldToPGInputField(
      'Prefix',
      pgInputFactoryUnion,
      pg,
      inputRef,
    )
    expect(result).toEqual(
      mergeDefaultInputField({
        kind: 'scalar',
        type: 'string',
        isList: true,
      }),
    )
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
