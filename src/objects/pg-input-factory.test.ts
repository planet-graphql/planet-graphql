import { getPGBuilder } from '..'
import {
  mergeDefaultInputFactoryUnion,
  mergeDefaultInputFactory,
  mergeDefaultPGInput,
  mergeDefaultInputField,
} from '../test-utils'
import { PGInput } from '../types/input'
import { createPGEnum } from './pg-enum'
import { createPGInputFactoryUnion, createPGInputFactory } from './pg-input-factory'
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
    const pgInputFactory = createPGInputFactory(fieldMap)
    expect(pgInputFactory).toEqual(mergeDefaultInputFactory({ fieldMap }))
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
      const pgInputFactory = createPGInputFactory(fieldMap).nullish()
      expect(pgInputFactory).toEqual(
        mergeDefaultInputFactory({ fieldMap, isNullable: true, isOptional: true }),
      )
      expect(pgInputFactory.nullish(false)).toEqual(
        mergeDefaultInputFactory({ fieldMap }),
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
      const pgInputFactory = createPGInputFactory(fieldMap).nullable()
      expect(pgInputFactory).toEqual(
        mergeDefaultInputFactory({ fieldMap, isNullable: true }),
      )
      expect(pgInputFactory.nullable(false)).toEqual(
        mergeDefaultInputFactory({ fieldMap }),
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
      const pgInputFactory = createPGInputFactory(fieldMap).optional()
      expect(pgInputFactory).toEqual(
        mergeDefaultInputFactory({ fieldMap, isOptional: true }),
      )
      expect(pgInputFactory.optional(false)).toEqual(
        mergeDefaultInputFactory({ fieldMap }),
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
      const pgInputFactory = createPGInputFactory(fieldMap).list()
      expect(pgInputFactory).toEqual(
        mergeDefaultInputFactory({ fieldMap: fieldMap, isList: true }),
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
      const pgInputFactory = createPGInputFactory(fieldMap).nullable().default(null)
      expect(pgInputFactory).toEqual(
        mergeDefaultInputFactory({ fieldMap, isNullable: true, default: null }),
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
      const pgInputFactory = createPGInputFactory(fieldMap).validation(
        (value) => value.someField !== '',
      )
      expect(pgInputFactory).toEqual(
        mergeDefaultInputFactory({ fieldMap, validator: expect.any(Function) }),
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
      const original = createPGInputFactory({
        someField: createInputField<string, 'string', any>({
          kind: 'scalar',
          type: 'string',
        }),
        someObject: () =>
          createPGInputFactory({
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

      const expectFactory = mergeDefaultInputFactory({
        fieldMap: {
          someField: mergeDefaultInputField({ kind: 'scalar', type: 'string' }),
          someObject: mergeDefaultInputFactory({
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
        const pgInputFactory = createPGInputFactory({
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
        const pgInputFactory = createPGInputFactory({
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
        const pgInputFactory = createPGInputFactory({
          someInput: () =>
            createPGInputFactory({
              innerField: createInputField({
                kind: 'scalar',
                type: 'string',
              }),
            }),
        })

        const result = pgInputFactory.build('Prefix', pg)
        const someInput = (result.someInput.value.type as Function)()

        const expectResult = {
          someInput: mergeDefaultInputField({
            kind: 'object',
            type: expect.any(Function),
          }),
        }
        const expectSomeInput = mergeDefaultPGInput({
          name: 'PrefixSomeInput',
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
        expect(someInput).toEqual(expectSomeInput)
        expect(pg.cache().input).toEqual({
          PrefixSomeInput: expectSomeInput,
        })
      })

      describe('PGInputFactory values are set', () => {
        it('Returns a PGInputField and a PGInput that inherited the PGInputFactory values', () => {
          const pg = getPGBuilder()()
          const pgInputFactory = createPGInputFactory({
            someInput: () =>
              createPGInputFactory({
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
          const someInput = (result.someInput.value.type as Function)()

          const expectResult = {
            someInput: mergeDefaultInputField({
              kind: 'object',
              type: expect.any(Function),
              isList: true,
              isOptional: true,
              isNullable: true,
              default: [],
            }),
          }
          const expectSomeInput = mergeDefaultPGInput({
            name: 'PrefixSomeInput',
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
          expect(someInput).toEqual(expectSomeInput)
        })
      })
    })

    describe('UnionType Field', () => {
      it('Returns a PGInputField generated from default of PGInputFactoryUnion', () => {
        const pg = getPGBuilder()()
        const pgInputFactory = createPGInputFactory({
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
        const pgInputFactory = createPGInputFactory({
          field: createInputField({
            kind: 'scalar',
            type: 'string',
          }),
        })

        const result = pgInputFactory.build('Prefix', pg, true)
        const wrapInput: PGInput<any> = (result.value.type as Function)()

        const expectWrapInput = mergeDefaultPGInput({
          name: 'Prefix',
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
          Prefix: expectWrapInput,
        })
      })
    })

    // TODO: fix Maximum call stack size exceeded
    describe.skip('Recursive InputType', () => {
      it('Returns a recursive PGInputFactory', () => {
        const pg = getPGBuilder()()
        const fieldMap = {
          field: () => createPGInputFactory(fieldMap),
        }
        const pgInputFactory = createPGInputFactory(fieldMap)

        const result = pgInputFactory.build('Prefix', pg)

        expect(result).toEqual({
          AND: mergeDefaultInputField({
            kind: 'object',
            type: expect.any(Function),
          }),
        })
      })
    })

    // TODO: fix Maximum call stack size exceeded
    describe.skip('Cross-referenced InputType', () => {
      it('PReturns a cross-referenced PGInputFactory', () => {
        const pg = getPGBuilder()()
        const fieldMap1 = {
          field: () => createPGInputFactory(fieldMap2),
        }
        const fieldMap2 = {
          field: () => createPGInputFactory(fieldMap1),
        }
        const pgInputFactory = createPGInputFactory(fieldMap1)

        const result = pgInputFactory.build('Prefix', pg)

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
