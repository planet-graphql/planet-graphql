import { expectType } from 'tsd'
import { getPGBuilder } from '..'
import { PGObject, PGOutputField } from '../types/output'
import { setOutputFieldMethods, setPGObjectProperties } from './test-utils'

describe('resolver', () => {
  it('Sets resolves to each field of the PGObject', () => {
    const pg = getPGBuilder()()

    const post = pg.object('Post', (f) => ({
      id: f.id(),
      title: f.string(),
      ref: f.object(() => user),
    }))

    const user = pg.object('User', (f) => ({
      someID: f.id(),
      someString: f.string(),
      someObject: f.object(() => post),
    }))

    const setResolverObject = pg.resolver(user, {
      someString: () => {
        return 'hi'
      },
      someObject: ({ source }) => {
        return source.someObject
      },
    })

    const expectValue = setPGObjectProperties({
      name: 'User',
      fieldMap: {
        someID: setOutputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: false,
          type: 'id',
        }),
        someString: setOutputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: false,
          type: 'string',
          resolve: expect.any(Function),
        }),
        someObject: setOutputFieldMethods({
          kind: 'object',
          isRequired: true,
          isList: false,
          type: expect.any(Function),
          resolve: expect.any(Function),
        }),
      },
    })

    expect(setResolverObject).toEqual(expectValue)
    expect(
      setResolverObject.fieldMap.someString.value.resolve?.(undefined, {}, {}, {} as any),
    ).toEqual('hi')
    expect(
      setResolverObject.fieldMap.someObject.value.resolve?.(
        { someObject: 'hi' },
        {},
        {},
        {} as any,
      ),
    ).toEqual('hi')

    expect(pg.cache().object.User).toEqual(expectValue)

    expectType<
      PGObject<{
        someID: PGOutputField<string, any>
        someString: PGOutputField<string, any>
        someObject: PGOutputField<() => typeof post, any>
      }>
    >(setResolverObject)
  })
})
