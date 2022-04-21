import { expectType } from 'tsd'
import { getPGBuilder } from '..'
import { PGCache } from '../types/builder'
import { PGField, PGModel } from '../types/common'
import { PGObject, PGOutputField } from '../types/output'
import { setOutputFieldMethods, setPGObjectProperties } from './test-utils'

describe('objectFromModel', () => {
  it('PGModelのfieldと新規のfieldを持つ、新規のPGObjectが作られる', () => {
    const user: PGModel<
      { id: PGField<string>; age: PGField<number> },
      { where?: { id: string } }
    > = {
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
          args: () => {},
          list: () => {},
          nullable: () => {},
          resolve: () => {},
          subscribe: () => {},
          auth: () => {},
        } as any,
        age: {
          value: {
            kind: 'scalar',
            isRequired: true,
            isList: false,
            isId: false,
            type: 'Int',
          },
          args: () => {},
          list: () => {},
          nullable: () => {},
          resolve: () => {},
          subscribe: () => {},
          auth: () => {},
        } as any,
      },
      kind: 'model',
      __type: undefined as any,
    }

    const pg = getPGBuilder<any>()
    const editableCache = pg.cache() as unknown as PGCache
    editableCache.model[user.name] = user
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    editableCache.object[user.name] = {
      ...user,
      kind: 'object',
    } as any

    const post = pg.object('Post', (f) => ({
      id: f.id(),
      title: f.string(),
      ref: f.object(() => someObject),
    }))

    const someObject = pg.objectFromModel(user, (keep, f) => ({
      id: keep.id,
      age: f.float(),
      post: f.object(() => post),
    }))

    const expectValue = setPGObjectProperties({
      name: 'User',
      fieldMap: {
        id: setOutputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: false,
          isId: true,
          type: 'String',
        }),
        age: setOutputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: false,
          isId: false,
          type: 'Float',
        }),
        post: setOutputFieldMethods({
          kind: 'object',
          isRequired: true,
          isList: false,
          isId: false,
          type: expect.any(Function),
        }),
      },
    })

    expect(someObject).toEqual(expectValue)
    expect(pg.cache().object.User).toEqual(expectValue)

    expectType<
      PGObject<{
        id: PGOutputField<string, any, { id: string }>
        age: PGOutputField<number, any>
        post: PGOutputField<() => typeof post, any>
      }>
    >(someObject)
  })
})
