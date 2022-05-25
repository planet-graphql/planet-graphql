import { DefaultScalars } from '../lib/scalars'
import { PGTypes } from '../types/builder'
import { createEnum } from './enum'
import { createPGInputFieldBuilder } from './input'
import {
  createObjectBuilder,
  createOutputField,
  createPGObject,
  createPGOutputFieldBuilder,
} from './object'
import { mergeDefaultOutputField } from './test-utils'
import { createBuilderCache } from './utils'

describe('createObjectBuilder', () => {
  it('Returns a builder that generates PGObjects & sets generated PGObjects in cache', () => {
    const cache = createBuilderCache(DefaultScalars)
    const inputFieldBuilder = createPGInputFieldBuilder<PGTypes>(DefaultScalars)
    const outputFieldBuilder = createPGOutputFieldBuilder<PGTypes>(
      DefaultScalars,
      inputFieldBuilder,
    )
    const builder = createObjectBuilder<PGTypes>(cache, outputFieldBuilder)

    const object = builder('SomeObject', (b) => ({
      id: b.id(),
    }))

    const expectValue = {
      name: 'SomeObject',
      fieldMap: {
        id: mergeDefaultOutputField({
          kind: 'scalar',
          type: 'id',
        }),
      },
      kind: 'object',
    }

    expect(object).toEqual(expectValue)
    expect(cache.object.SomeObject).toEqual(expectValue)
  })

  it('Returns an existing resource because a resource with the same name cannot be created', () => {
    const cache = createBuilderCache(DefaultScalars)
    const inputFieldBuilder = createPGInputFieldBuilder<PGTypes>(DefaultScalars)
    const outputFieldBuilder = createPGOutputFieldBuilder<PGTypes>(
      DefaultScalars,
      inputFieldBuilder,
    )
    const builder = createObjectBuilder<PGTypes>(cache, outputFieldBuilder)

    builder('SomeObject', (b) => ({
      id: b.id(),
    }))

    const object = builder('SomeObject', (b) => ({
      int: b.int(),
    }))

    const expectValue = {
      name: 'SomeObject',
      fieldMap: {
        id: mergeDefaultOutputField({
          kind: 'scalar',
          type: 'id',
        }),
      },
      kind: 'object',
    }

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
    const someEnum = createEnum('SomeEnum', 'A', 'B')

    expect(builder.enum(someEnum)).toEqual(
      mergeDefaultOutputField({
        kind: 'enum',
        type: someEnum,
      }),
    )
  })

  it('Returns a builder to create a input type inputField', () => {
    const inputFieldBuilder = createPGInputFieldBuilder<PGTypes>(DefaultScalars)
    const builder = createPGOutputFieldBuilder<PGTypes>(DefaultScalars, inputFieldBuilder)
    const someObject = createPGObject('SomeInput', {
      id: createOutputField<string, PGTypes>(
        {
          kind: 'scalar',
          type: 'string',
        },
        inputFieldBuilder,
      ),
    })

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

describe('createOutputField', () => {
  it('Returns a PGOutputField', () => {
    const inputFieldBuilder = createPGInputFieldBuilder<PGTypes>(DefaultScalars)
    const outputField = createOutputField<string, PGTypes>(
      {
        kind: 'scalar',
        type: 'string',
      },
      inputFieldBuilder,
    )

    expect(outputField).toEqual(
      mergeDefaultOutputField({
        kind: 'scalar',
        type: 'string',
      }),
    )
  })
})
