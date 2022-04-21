import { expectType } from 'tsd'
import { getPGBuilder } from '..'
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
            isId: true,
            type: 'String',
          },
        } as any,
        age: {
          value: {
            kind: 'scalar',
            isRequired: true,
            isList: false,
            isId: false,
            type: 'Int',
          },
        } as any,
      },
      kind: 'model',
      __type: undefined as any,
    }
  })
  it('PGModelのfieldと新規のfieldを持つ、新規のPGInputが作られる', () => {
    const pg = getPGBuilder<any>()

    const post = pg.input('Post', (f) => ({
      id: f.id(),
      title: f.string(),
      ref: f.input(() => someInput),
    }))

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
          isId: true,
          type: 'String',
        }),
        age: setInputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: false,
          isId: false,
          type: 'Float',
        }),
        post: setInputFieldMethods({
          kind: 'object',
          isRequired: true,
          isList: false,
          isId: false,
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

  it('同じPGModelから二度PGInputは作成できず既存のリソースを返却する', () => {
    const pg = getPGBuilder<any>()
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
          isId: true,
          type: 'String',
        }),
      },
      kind: 'input',
      value: {},
      validation: expect.any(Function),
    })
  })
})
