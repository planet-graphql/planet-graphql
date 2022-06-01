import { graphql } from 'graphql'
import { expectType, TypeEqual } from 'ts-expect'
import { getPGBuilder } from '..'

type SomePrismaArgs = {
  select: any
  include: { some: any }
  where: any
  orderBy: any | any[]
  cursor: any
  take: number
  skip: number
  distinct: any | any[]
}
type GeneratedType = {
  enums: {}
  objects: {}
  models: {
    User: SomePrismaArgs
    Post: SomePrismaArgs
  }
}

describe('prismaArgsFeature', () => {
  it('Separates received args into prismaArgs and args', async () => {
    let args: any
    let prismaArgs: any
    const pg = getPGBuilder()()

    pg.query('someQuery', (b) =>
      b
        .boolean()
        .args((b) => ({
          a1: b.boolean(),
        }))
        .prismaArgs((b) => ({
          a2: b.boolean(),
        }))
        .resolve((params) => {
          args = params.args
          prismaArgs = params.prismaArgs
          expectType<TypeEqual<typeof params.args, { a1: boolean }>>(true)
          expectType<TypeEqual<typeof params.prismaArgs, { a2: boolean }>>(true)
          return true
        }),
    )

    const query = `
      query {
        someQuery(a1: true, a2: false)
      }
    `

    await graphql({
      schema: pg.build(),
      source: query,
      contextValue: {},
    })

    expect(args).toEqual({ a1: true })
    expect(prismaArgs).toEqual({ a2: false })
  })

  it('Generates and returns include args from fields set as relations in Prisma', async () => {
    let args: any
    let prismaArgs: any
    const pg = getPGBuilder<{ Context: any; GeneratedType: GeneratedType }>()()

    const user = pg
      .object('user', (b) => ({
        id: b.id(),
        posts: b.relation(() => post).list(),
      }))
      .prismaModel('User')

    const post = pg
      .object('post', (b) => ({
        id: b.id(),
        user: b.object(() => user),
      }))
      .prismaModel('Post')

    pg.query('users', (b) =>
      b
        .object(() => user)
        .list()
        .resolve((params) => {
          args = params.args
          prismaArgs = params.prismaArgs
          expectType<TypeEqual<typeof params.args, never>>(true)
          expectType<TypeEqual<typeof params.prismaArgs, { include: { some: any } }>>(
            true,
          )
          return []
        }),
    )

    const query = `
        query {
          users {
            posts {
              id
            }
          }
        }
      `

    await graphql({
      schema: pg.build(),
      source: query,
      contextValue: {},
    })

    expect(args).toEqual(undefined)
    expect(prismaArgs).toEqual({ include: { posts: true } })
  })

  it('Merges and returns generated include clauses and prismaArgs', async () => {
    let prismaArgs: any
    let postsFieldPrismaArgs: any
    const pg = getPGBuilder<{ Context: any; GeneratedType: GeneratedType }>()()

    const user = pg
      .object('user', (b) => ({
        id: b.id(),
        posts: b
          .relation(() => post)
          .list()
          .prismaArgs((b) => ({
            where: b.input(() =>
              pg.input('UserWhere', (b) => ({
                isPublic: b.boolean(),
              })),
            ),
            take: b.int(),
          }))
          .resolve((params) => {
            postsFieldPrismaArgs = params.prismaArgs
            expectType<
              TypeEqual<
                typeof params.prismaArgs,
                {
                  include: { some: any }
                  take: number
                  where: {
                    isPublic: boolean
                  }
                }
              >
            >(true)
            return []
          }),
      }))
      .prismaModel('User')

    const post = pg
      .object('post', (b) => ({
        id: b.id(),
        user: b.object(() => user),
      }))
      .prismaModel('Post')

    pg.query('users', (b) =>
      b
        .object(() => user)
        .list()
        .prismaArgs((b) => ({
          take: b.int(),
        }))
        .resolve((params) => {
          prismaArgs = params.prismaArgs
          expectType<
            TypeEqual<
              typeof params.prismaArgs,
              {
                include: { some: any }
                take: number
              }
            >
          >(true)
          return [
            {
              id: '1',
              posts: [],
            },
          ]
        }),
    )

    const query = `
        query {
          users(take: 10) {
            posts(take: 3, where: { isPublic: true }) {
              id
            }
          }
        }
      `

    await graphql({
      schema: pg.build(),
      source: query,
      contextValue: {},
    })

    expect(prismaArgs).toEqual({
      include: {
        posts: {
          take: 3,
          where: {
            isPublic: true,
          },
        },
      },
      take: 10,
    })
    expect(postsFieldPrismaArgs).toEqual({
      take: 3,
      where: {
        isPublic: true,
      },
    })
  })
})
