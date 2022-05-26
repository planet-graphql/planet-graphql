import { expectType, TypeEqual } from 'ts-expect'
import { getPGBuilder } from '..'
import { PGTypes } from '../types/builder'
import { PGObject, PGOutputField } from '../types/output'
import { mergeDefaultOutputField, setPGObjectProperties } from './test-utils'

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
        someID: mergeDefaultOutputField({
          kind: 'scalar',
          type: 'id',
        }),
        someString: mergeDefaultOutputField({
          kind: 'scalar',
          type: 'string',
          resolve: expect.any(Function),
        }),
        someObject: mergeDefaultOutputField({
          kind: 'object',
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
      TypeEqual<
        typeof setResolverObject,
        PGObject<{
          someID: PGOutputField<string, undefined, PGTypes>
          someString: PGOutputField<string, undefined, PGTypes>
          someObject: PGOutputField<() => typeof post, undefined, PGTypes>
        }>
      >
    >(true)
  })
})
