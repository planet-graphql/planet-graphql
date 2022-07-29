import { getPGBuilder } from '..'
import {
  mergeDefaultArgBuilderUnion,
  mergeDefaultArgBuilder,
  mergeDefaultPGInput,
  mergeDefaultInputField,
} from '../test-utils'
import { createPGEnum } from './pg-enum'
import {
  createPGArgBuilderUnion,
  createPGArgBuilder,
  convertPGArgBuilderFieldToPGInputField,
} from './pg-input-factory'
import { createInputField } from './pg-input-field'
import type { PGTypes } from '../types/builder'
import type { PGInput } from '../types/input'
import type { PGArgBuilder } from '../types/input-factory'

describe('createPGArgBuilder', () => {
  it('Returns the entity of PGArgBuilder', () => {
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
    const pg = getPGBuilder()()
    const pgArgBuilder = createPGArgBuilder('SomeInput', fieldMap, pg)
    expect(pgArgBuilder).toEqual(mergeDefaultArgBuilder('SomeInput', { fieldMap }))
  })
})

describe('createPGArgBuilderUnion', () => {
  it('Returns the entity of PGArgBuilderUnion', () => {
    const builderMap = {
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
    const builderUnion = createPGArgBuilderUnion(builderMap)
    expect(builderUnion).toEqual(mergeDefaultArgBuilderUnion({ builderMap }))
  })
})

describe('PGArgBuilder', () => {
  describe('nullish', () => {
    it('Returns with isNullable and isOptional of value as true', () => {
      const fieldMap = {
        someField: createInputField<string, 'string', any>({
          kind: 'scalar',
          type: 'string',
        }),
      }
      const pg = getPGBuilder()()
      const pgArgBuilder = createPGArgBuilder('SomeInput', fieldMap, pg).nullish()
      expect(pgArgBuilder).toEqual(
        mergeDefaultArgBuilder('SomeInput', {
          fieldMap,
          isNullable: true,
          isOptional: true,
        }),
      )
      expect(pgArgBuilder.nullish(false)).toEqual(
        mergeDefaultArgBuilder('SomeInput', { fieldMap }),
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
      const pg = getPGBuilder()()
      const pgArgBuilder = createPGArgBuilder('SomeInput', fieldMap, pg).nullable()
      expect(pgArgBuilder).toEqual(
        mergeDefaultArgBuilder('SomeInput', { fieldMap, isNullable: true }),
      )
      expect(pgArgBuilder.nullable(false)).toEqual(
        mergeDefaultArgBuilder('SomeInput', { fieldMap }),
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
      const pg = getPGBuilder()()
      const pgArgBuilder = createPGArgBuilder('SomeInput', fieldMap, pg).optional()
      expect(pgArgBuilder).toEqual(
        mergeDefaultArgBuilder('SomeInput', { fieldMap, isOptional: true }),
      )
      expect(pgArgBuilder.optional(false)).toEqual(
        mergeDefaultArgBuilder('SomeInput', { fieldMap }),
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
      const pg = getPGBuilder()()
      const pgArgBuilder = createPGArgBuilder('SomeInput', fieldMap, pg).list()
      expect(pgArgBuilder).toEqual(
        mergeDefaultArgBuilder('SomeInput', { fieldMap, isList: true }),
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
      const pg = getPGBuilder()()
      const pgArgBuilder = createPGArgBuilder('SomeInput', fieldMap, pg)
        .nullable()
        .default(null)
      expect(pgArgBuilder).toEqual(
        mergeDefaultArgBuilder('SomeInput', {
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
      const pg = getPGBuilder()()
      const pgArgBuilder = createPGArgBuilder('SomeInput', fieldMap, pg).validation(
        (value) => value.someField !== '',
      )
      expect(pgArgBuilder).toEqual(
        mergeDefaultArgBuilder('SomeInput', {
          fieldMap,
          validator: expect.any(Function),
        }),
      )
      expect(
        pgArgBuilder.value.validator?.({
          someField: 'xxx',
        }),
      ).toEqual(true)
      expect(
        pgArgBuilder.value.validator?.({
          someField: '',
        }),
      ).toEqual(false)
    })
  })

  describe('edit', () => {
    it('Returns a new PGArgBuilder after editing each Field of the original', () => {
      const pg = getPGBuilder()()
      const original = createPGArgBuilder(
        'SomeInput',
        {
          someField: createInputField<string, 'string', any>({
            kind: 'scalar',
            type: 'string',
          }),
          someObject: () =>
            createPGArgBuilder(
              'SomeObjectSomeInput',
              {
                innerField: createInputField<string, 'string', any>({
                  kind: 'scalar',
                  type: 'string',
                }),
              },
              pg,
            ),
        },
        pg,
      )
      const edit = original.edit(
        (f) => ({
          someField: f.someField,
          someObject: f.someObject.edit((f) => ({
            innerField: f.innerField,
          })),
        }),
        'EditedSomeInput',
      )

      const expectArgBuilder = mergeDefaultArgBuilder('EditedSomeInput', {
        fieldMap: {
          someField: mergeDefaultInputField({ kind: 'scalar', type: 'string' }),
          someObject: mergeDefaultArgBuilder('SomeObjectSomeInput', {
            fieldMap: {
              innerField: mergeDefaultInputField({ kind: 'scalar', type: 'string' }),
            },
          }),
        },
      })
      expect(edit).toEqual(expectArgBuilder)
    })
  })

  describe('build', () => {
    describe('ScalarType Field', () => {
      it('Returns a scalar type PGInputField', () => {
        const pg = getPGBuilder()()
        const pgArgBuilder = createPGArgBuilder(
          'SomeInput',
          {
            someScalar: createInputField({
              kind: 'scalar',
              type: 'string',
            }),
          },
          pg,
        )

        const result = pgArgBuilder.build()

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
        const pgArgBuilder = createPGArgBuilder(
          'SomeInput',
          {
            someEnum: createInputField({
              kind: 'enum',
              type: createPGEnum('SomeEnum', ['AAA', 'BBB']),
            }),
          },
          pg,
        )

        const result = pgArgBuilder.build()
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
        const pgArgBuilder = createPGArgBuilder(
          'SomeInput',
          {
            field: () =>
              createPGArgBuilder(
                'SomeInputField',
                {
                  innerField: createInputField({
                    kind: 'scalar',
                    type: 'string',
                  }),
                },
                pg,
              ),
          },
          pg,
        )

        const result = pgArgBuilder.build()
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

      describe('PGArgBuilder values are set', () => {
        it('Returns a PGInputField and a PGInput that inherited the PGArgBuilder values', () => {
          const pg = getPGBuilder()()
          const pgArgBuilder = createPGArgBuilder(
            'SomeInput',
            {
              field: () =>
                createPGArgBuilder(
                  'SomeInputField',
                  {
                    innerField: createInputField({
                      kind: 'scalar',
                      type: 'string',
                    }),
                  },
                  pg,
                )
                  .list()
                  .optional()
                  .nullable()
                  .default([])
                  .validation(() => true),
            },
            pg,
          )

          const result = pgArgBuilder.build()
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
      it('Returns a PGInputField generated from default of PGArgBuilderUnion', () => {
        const pg = getPGBuilder()()
        const pgArgBuilder = createPGArgBuilder(
          'SomeInput',
          {
            someUnion: createPGArgBuilderUnion({
              __default: createInputField({
                kind: 'scalar',
                type: 'id',
              }),
              field: createInputField({
                kind: 'scalar',
                type: 'string',
              }),
            }),
          },
          pg,
        )

        const result = pgArgBuilder.build()

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
        const pgArgBuilder = createPGArgBuilder(
          'SomeInput',
          {
            field: createInputField({
              kind: 'scalar',
              type: 'string',
            }),
          },
          pg,
        )

        const result = pgArgBuilder.build({ wrap: true })
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
      it('Returns a recursive PGArgBuilder', () => {
        const pg = getPGBuilder()()
        type ArgBuilder = PGArgBuilder<{ field: () => ArgBuilder }, PGTypes>
        const fieldMap = {
          field: () => pgArgBuilder,
        }
        const pgArgBuilder: ArgBuilder = createPGArgBuilder('SomeInput', fieldMap, pg)
        const result = pgArgBuilder.build()
        expect(result).toEqual({
          field: mergeDefaultInputField({
            kind: 'object',
            type: expect.any(Function),
          }),
        })
      })
    })

    describe('Cross-referenced InputType', () => {
      it('PReturns a cross-referenced PGArgBuilder', () => {
        type ArgBuilder1 = PGArgBuilder<{ field: () => ArgBuilder2 }, PGTypes>
        type ArgBuilder2 = PGArgBuilder<{ field: () => ArgBuilder1 }, PGTypes>
        const pg = getPGBuilder()()
        const fieldMap1 = {
          field: () => pgArgBuilder2,
        }
        const fieldMap2 = {
          field: () => pgArgBuilder1,
        }
        const pgArgBuilder1: ArgBuilder1 = createPGArgBuilder('SomeInput1', fieldMap1, pg)
        const pgArgBuilder2: ArgBuilder2 = createPGArgBuilder('SomeInput2', fieldMap2, pg)

        const result = pgArgBuilder1.build()

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

describe('convertPGArgBuilderFieldToPGInputField', () => {
  it('Returns PGInputField converted from PGArgBuilder', () => {
    const pg = getPGBuilder()()
    const pgArgBuilder = createPGArgBuilder(
      'SomeInput',
      {
        field: createInputField({
          kind: 'scalar',
          type: 'string',
        }),
      },
      pg,
    )
    const inputRef = {}
    const result = convertPGArgBuilderFieldToPGInputField(pgArgBuilder, pg, inputRef)
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
  it('Returns PGInputField converted from PGArgBuilderUnion', () => {
    const pg = getPGBuilder()()
    const pgArgBuilderUnion = createPGArgBuilderUnion({
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
    const result = convertPGArgBuilderFieldToPGInputField(pgArgBuilderUnion, pg, inputRef)
    expect(result).toEqual(
      mergeDefaultInputField({
        kind: 'scalar',
        type: 'string',
        isList: true,
      }),
    )
  })
})

describe('PGArgBuilderUnion', () => {
  describe('select', () => {
    it('Returns the selected field from the BuilderMap of PGArgBuilderUnion', () => {
      const builderMap = {
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
      const builderUnion = createPGArgBuilderUnion(builderMap)
      const result = builderUnion.select('someFieldList')
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
