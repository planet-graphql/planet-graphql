import { DefaultScalars } from '../lib/scalars'
import { createPGEnum } from '../objects/pg-enum'
import { createPGObject } from '../objects/pg-object'
import { createOutputField } from '../objects/pg-output-field'
import { PGTypes } from '../types/builder'
import { createPGInputFieldBuilder } from './input'
import { createObjectBuilder, createPGOutputFieldBuilder } from './object'
import { mergeDefaultOutputField, mergeDefaultPGObject } from './test-utils'
import { createBuilderCache } from './utils'

describe('createObjectBuilder', () => {
  it('Returns a builder that generates PGObjects & sets generated PGObjects in cache', () => {
    const cache = createBuilderCache(DefaultScalars)
    const inputFieldBuilder = createPGInputFieldBuilder<PGTypes>(DefaultScalars)
    const outputFieldBuilder = createPGOutputFieldBuilder<PGTypes>(
      DefaultScalars,
      inputFieldBuilder,
    )
    const builder = createObjectBuilder<PGTypes>(
      cache,
      outputFieldBuilder,
      inputFieldBuilder,
    )

    const object = builder({
      name: 'SomeObject',
      fields: (b) => ({
        id: b.id(),
      }),
    })

    const expectValue = mergeDefaultPGObject({
      name: 'SomeObject',
      fieldMap: {
        id: mergeDefaultOutputField({
          kind: 'scalar',
          type: 'id',
        }),
      },
    })

    expect(object).toEqual(expectValue)
    expect(cache.object.SomeObject).toEqual(expectValue)
  })
})

describe('createPGOutputFieldBuilder', () => {
  it('Returns a PGOutputFieldBuilder created for the argument ScalarMap', () => {
    const inputFieldBuilder = createPGInputFieldBuilder<PGTypes>(DefaultScalars)
    const builder = createPGOutputFieldBuilder<PGTypes>(DefaultScalars, inputFieldBuilder)

    expect(Object.keys(builder)).toEqual([
      ...Object.keys(DefaultScalars),
      'enum',
      'object',
      'relation',
    ])
  })

  it('Returns a builder to create a scalar type outputField', () => {
    const inputFieldBuilder = createPGInputFieldBuilder<PGTypes>(DefaultScalars)
    const builder = createPGOutputFieldBuilder<PGTypes>(DefaultScalars, inputFieldBuilder)

    expect(builder.id()).toEqual(
      mergeDefaultOutputField({
        kind: 'scalar',
        type: 'id',
      }),
    )
  })

  it('Returns a builder to create a enum type outputField', () => {
    const inputFieldBuilder = createPGInputFieldBuilder<PGTypes>(DefaultScalars)
    const builder = createPGOutputFieldBuilder<PGTypes>(DefaultScalars, inputFieldBuilder)
    const someEnum = createPGEnum('SomeEnum', 'A', 'B')

    expect(builder.enum(someEnum)).toEqual(
      mergeDefaultOutputField({
        kind: 'enum',
        type: someEnum,
      }),
    )
  })

  it('Returns a builder to create a input type inputField', () => {
    const cache = createBuilderCache(DefaultScalars)
    const inputFieldBuilder = createPGInputFieldBuilder<PGTypes>(DefaultScalars)
    const outputFieldBuilder = createPGOutputFieldBuilder<PGTypes>(
      DefaultScalars,
      inputFieldBuilder,
    )
    const builder = createPGOutputFieldBuilder<PGTypes>(DefaultScalars, inputFieldBuilder)
    const someObject = createPGObject(
      'SomeInput',
      {
        id: createOutputField<string, PGTypes>(
          {
            kind: 'scalar',
            type: 'string',
          },
          inputFieldBuilder,
        ),
      },
      cache,
      outputFieldBuilder,
      inputFieldBuilder,
    )

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const type = () => someObject
    expect(builder.object(type)).toEqual(
      mergeDefaultOutputField({
        kind: 'object',
        type,
      }),
    )
  })
})
