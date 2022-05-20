import { GraphQLFloat, GraphQLInt } from 'graphql'
import { expectType } from 'tsd'
import { getPGBuilder } from '..'
import { PGGraphQLID } from '../lib/pg-id-scalar'
import { PGField, PGModel } from '../types/common'
import { PGInput, PGInputField } from '../types/input'
import { setInputFieldMethods } from './test-utils'

describe('inputFromModel', () => {
  let user: PGModel<{ id: PGField<string>; age: PGField<number> }>
  beforeEach(() => {
    user = {
      name: 'User',
      fieldMap: {
        id: {
          value: {
            kind: 'scalar',
            isRequired: true,
            isList: false,
            type: PGGraphQLID,
          },
        } as any,
        age: {
          value: {
            kind: 'scalar',
            isRequired: true,
            isList: false,
            type: GraphQLInt,
          },
        } as any,
      },
      kind: 'model',
      __type: undefined as any,
    }
  })
  it('Creates a new PGInput & Set it to the Build Cache', () => {
    const pg = getPGBuilder()()

    const post = pg.input('Post', (f) => {
      return {
        id: f.id(),
        title: f.string(),
        ref: f.input(() => someInput),
      }
    })

    const someInput = pg.inputFromModel('CreateUser', user, (keep, f) => ({
      id: keep.id,
      age: f.float(),
      post: f.input(() => post),
    }))

    const expectValue = {
      name: 'CreateUser',
      fieldMap: {
        id: setInputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: false,
          type: PGGraphQLID,
        }),
        age: setInputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: false,
          type: GraphQLFloat,
        }),
        post: setInputFieldMethods({
          kind: 'object',
          isRequired: true,
          isList: false,
          type: expect.any(Function),
        }),
      },
      kind: 'input',
      value: {},
      validation: expect.any(Function),
    }

    expect(someInput).toEqual(expectValue)
    expect(pg.cache().input.CreateUser).toEqual(expectValue)

    expectType<
      PGInput<{
        id: PGInputField<string>
        age: PGInputField<number>
        post: PGInputField<() => typeof post>
      }>
    >(someInput)
  })

  it('Returns an existing resource because a resource with the same name cannot be created', () => {
    const pg = getPGBuilder()()
    pg.inputFromModel('CreateUser', user, (keep, f) => ({
      id: keep.id,
    }))
    expect(
      pg.inputFromModel('CreateUser', user, (keep, f) => ({
        id: keep.id,
        title: f.string(),
      })),
    ).toEqual({
      name: 'CreateUser',
      fieldMap: {
        id: setInputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: false,
          type: PGGraphQLID,
        }),
      },
      kind: 'input',
      value: {},
      validation: expect.any(Function),
    })
  })
})
