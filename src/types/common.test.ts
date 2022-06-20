import { expectType, TypeEqual } from 'ts-expect'
import { getPGBuilder } from '..'
import {
  ResolveResponse,
  TypeOfPGInterface,
  TypeOfPGModelBase,
  TypeOfPGUnion,
} from './common'

describe('TypeOfPGModelBase', () => {
  it('Type is evaluated correctly even if it contains circular references', () => {
    const pg = getPGBuilder()()
    const user = pg.object({
      name: 'user',
      fields: (b) => ({
        id: b.string(),
        posts: b.object(() => post).list(),
      }),
    })
    const post = pg.object({
      name: 'post',
      fields: (b) => ({
        id: b.string(),
        user: b.object(() => user),
      }),
    })

    type User = {
      id: string
      posts: Post[]
    }

    type Post = {
      id: string
      user: User
    }

    expectType<TypeEqual<TypeOfPGModelBase<typeof user>, User>>(true)
    expectType<TypeEqual<TypeOfPGModelBase<typeof post>, Post>>(true)
  })
})

describe('TypeOfPGUnion', () => {
  it('Converts types correctly', () => {
    const pg = getPGBuilder()()
    const objectA = pg.object({
      name: 'A',
      fields: (b) => ({
        a: b.string(),
      }),
    })
    const objectB = pg.object({
      name: 'A',
      fields: (b) => ({
        b: b.string(),
      }),
    })
    const union = pg.union({
      name: 'SomeUnion',
      types: [objectA, objectB],
    })

    type T = TypeOfPGUnion<typeof union>
    expectType<
      TypeEqual<
        T,
        | {
            a: string
          }
        | {
            b: string
          }
      >
    >(true)
  })
})

describe('TypeOfPGInterface', () => {
  it('Converts types correctly', () => {
    const pg = getPGBuilder()()
    const fruit = pg.interface({
      name: 'Fruit',
      fields: (b) => ({
        name: b.string(),
      }),
    })

    type T = TypeOfPGInterface<typeof fruit>
    expectType<
      TypeEqual<
        T,
        {
          name: string
        }
      >
    >(true)
  })
})

describe('ResolveResponse', () => {
  it('Converted to deeply partial and promisable', () => {
    type T = ResolveResponse<{
      name: string
      posts: Array<{
        title: string
      }>
    }>

    expectType<T>({
      name: '',
      posts: [
        {
          title: '',
        },
      ],
    })

    expectType<T>({
      posts: [{}],
    })

    expectType<T>({})

    expectType<T>(Promise.resolve({}))
  })

  describe('Array case', () => {
    it('The inside of the array is converted to deeply partial and promisable', () => {
      type T = ResolveResponse<
        Array<{
          name: string
          posts: Array<{
            title: string
          }>
        }>
      >
      expectType<T>([
        {
          name: '',
          posts: [
            {
              title: '',
            },
          ],
        },
      ])

      expectType<T>([
        {
          posts: [{}],
        },
      ])

      expectType<T>([{}])

      expectType<T>(Promise.resolve([{}]))
    })
  })
})
