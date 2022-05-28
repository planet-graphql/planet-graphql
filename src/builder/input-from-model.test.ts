import { getPGBuilder } from '..'
import { PGField, PGModel } from '../types/common'
import { mergeDefaultInputField, mergeDefaultPGInput } from './test-utils'

describe('inputFromModel', () => {
  let user: PGModel<{ id: PGField<string>; age: PGField<number> }>
  beforeEach(() => {
    user = {
      name: 'User',
      fieldMap: {
        id: {
          value: {
            kind: 'scalar',
            isOptional: false,
            isNullable: false,
            isList: false,
            type: 'id',
          },
        } as any,
        age: {
          value: {
            kind: 'scalar',
            isOptional: false,
            isNullable: false,
            isList: false,
            type: 'int',
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

    const expectValue = mergeDefaultPGInput({
      name: 'CreateUser',
      fieldMap: {
        id: mergeDefaultInputField({
          kind: 'scalar',
          type: 'id',
        }),
        age: mergeDefaultInputField({
          kind: 'scalar',
          type: 'float',
        }),
        post: mergeDefaultInputField({
          kind: 'object',
          type: expect.any(Function),
        }),
      },
    })

    expect(someInput).toEqual(expectValue)
    expect(pg.cache().input.CreateUser).toEqual(expectValue)

    // expectType<
    //   PGInput<{
    //     id: PGInputField<string>
    //     age: PGInputField<number>
    //     post: PGInputField<() => typeof post>
    //   }>
    // >(someInput)
  })
})
