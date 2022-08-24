import { graphql } from 'graphql'
import { expectType } from 'ts-expect'
import { getPGBuilder } from '..'
import { mergeDefaultOutputField, mergeDefaultPGObject } from '../test-utils'
import {
  createConnectionObject,
  encodeCursor,
  getPageInfo,
  getPrismaRelayArgs,
} from './prisma'
import type {
  SomePGTypes,
  SomePostPrismaArgs,
  SomeUserPrismaArgs,
} from '../types/test.util'
import type { TypeEqual } from 'ts-expect'

describe('prismaArgsFeature', () => {
  it('Separates received args into prismaArgs and args', async () => {
    let args: any
    let prismaArgs: any
    const pg = getPGBuilder()

    const someQuery = pg.query({
      name: 'someQuery',
      field: (b) =>
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
    })

    const query = `
      query {
        someQuery(a1: true, a2: false)
      }
    `

    await graphql({
      schema: pg.build([someQuery]),
      source: query,
      contextValue: {},
    })

    expect(args).toEqual({ a1: true })
    expect(prismaArgs).toEqual({ a2: false })
  })

  it('Generates and returns include args from fields set as relations in Prisma', async () => {
    let args: any
    let prismaArgs: any
    const pg = getPGBuilder<SomePGTypes>()

    const user = pg
      .object({
        name: 'user',
        fields: (b) => ({
          id: b.id(),
          posts: b.relation(() => post).list(),
        }),
      })
      .prismaModel('User')

    const post = pg
      .object({
        name: 'post',
        fields: (b) => ({
          id: b.id(),
          user: b.object(() => user),
        }),
      })
      .prismaModel('Post')

    const someQuery = pg.query({
      name: 'users',
      field: (b) =>
        b
          .object(() => user)
          .list()
          .resolve((params) => {
            args = params.args
            prismaArgs = params.prismaArgs
            expectType<TypeEqual<typeof params.args, never>>(true)
            expectType<
              TypeEqual<
                typeof params.prismaArgs,
                { include: SomeUserPrismaArgs['include'] | undefined }
              >
            >(true)
            return []
          }),
    })

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
      schema: pg.build([someQuery]),
      source: query,
      contextValue: {},
    })

    expect(args).toEqual(undefined)
    expect(prismaArgs).toEqual({ include: { posts: true } })
  })

  it('Merges and returns generated include clauses and prismaArgs', async () => {
    let prismaArgs: any
    let postsFieldPrismaArgs: any
    const pg = getPGBuilder<SomePGTypes>()

    const user = pg
      .object({
        name: 'user',
        fields: (b) => ({
          id: b.id(),
          posts: b
            .relation(() => post)
            .list()
            .prismaArgs((b) => ({
              where: b.input(() =>
                pg.input({
                  name: 'UserWhere',
                  fields: (b) => ({
                    isPublic: b.boolean(),
                  }),
                }),
              ),
              take: b.int(),
            }))
            .resolve((params) => {
              postsFieldPrismaArgs = params.prismaArgs
              expectType<
                TypeEqual<
                  typeof params.prismaArgs,
                  {
                    include: SomePostPrismaArgs['include'] | undefined
                    take: number
                    where: {
                      isPublic: boolean
                    }
                  }
                >
              >(true)
              return []
            }),
        }),
      })
      .prismaModel('User')

    const post = pg
      .object({
        name: 'post',
        fields: (b) => ({
          id: b.id(),
          user: b.object(() => user),
        }),
      })
      .prismaModel('Post')

    const usersQuery = pg.query({
      name: 'users',
      field: (b) =>
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
                  include: SomeUserPrismaArgs['include'] | undefined
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
    })

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
      schema: pg.build([usersQuery]),
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

  describe('With a relay field', () => {
    it('Generates and returns include args', async () => {
      let prismaArgs: any
      const pg = getPGBuilder<SomePGTypes>()
      const user = pg
        .object({
          name: 'user',
          fields: (b) => ({
            id: b.id(),
            posts: b
              .relation(() => post)
              .list()
              .prismaArgs((b) => ({
                take: b.int(),
              })),
          }),
        })
        .prismaModel('User')
      const post = pg
        .object({
          name: 'post',
          fields: (b) => ({
            id: b.id(),
            user: b.object(() => user),
          }),
        })
        .prismaModel('Post')
      const usersQuery = pg.query({
        name: 'users',
        field: (b) =>
          b
            .object(() => user)
            .relay()
            .resolve((params) => {
              prismaArgs = params.prismaArgs
              return [
                {
                  id: '1',
                  posts: [],
                },
              ]
            }),
      })
      const query = `
        query {
          users(first: 10) {
            edges {
              node {
                posts(take: 3) {
                  id
                }
              }
            }
          }
        }
      `

      const resp = await graphql({
        schema: pg.build([usersQuery]),
        source: query,
        contextValue: {},
      })

      expect(resp.errors).toBeUndefined()
      expect(prismaArgs).toEqual({
        take: 11,
        orderBy: {
          id: 'asc',
        },
        include: {
          posts: {
            take: 3,
          },
        },
      })
    })
  })
})

describe('prismaRelayFeature', () => {
  it('Converts the return value to Relay format', async () => {
    const pg = getPGBuilder<SomePGTypes>()
    const user = pg
      .object({
        name: 'User',
        fields: (b) => ({
          id: b.id(),
        }),
      })
      .prismaModel('User')
    const usersQuery = pg.query({
      name: 'users',
      field: (f) =>
        f
          .object(() => user)
          .relay()
          .relayTotalCount(() => 1)
          .resolve(() => {
            return [{ id: '1' }]
          }),
    })

    const query = `
      query {
        users {
          edges {
            node {
              id
            }
            cursor
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          totalCount
        }
      }
    `
    const response = await graphql({
      schema: pg.build([usersQuery]),
      source: query,
      contextValue: {},
    })

    expect(response).toEqual({
      data: {
        users: {
          edges: [
            {
              node: {
                id: '1',
              },
              cursor: 'eyJpZCI6IjEifQ==',
            },
          ],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: 'eyJpZCI6IjEifQ==',
            endCursor: 'eyJpZCI6IjEifQ==',
          },
          totalCount: 1,
        },
      },
    })
  })

  it('Converts relay args to prisma args', async () => {
    let args
    let prismaArgs
    const pg = getPGBuilder<SomePGTypes>()
    const user = pg
      .object({
        name: 'User',
        fields: (b) => ({
          id: b.id(),
        }),
      })
      .prismaModel('User')
    const usersQuery = pg.query({
      name: 'users',
      field: (f) =>
        f
          .object(() => user)
          .relay()
          .resolve((params) => {
            args = params.args
            prismaArgs = params.prismaArgs
            expectType<
              TypeEqual<
                typeof args,
                {
                  first: number | undefined
                  after: string | undefined
                  last: number | undefined
                  before: string | undefined
                }
              >
            >(true)
            expectType<
              TypeEqual<
                typeof prismaArgs,
                {
                  include: SomeUserPrismaArgs['include'] | undefined
                  cursor: SomeUserPrismaArgs['cursor'] | undefined
                  take: SomeUserPrismaArgs['take'] | undefined
                  skip: SomeUserPrismaArgs['skip'] | undefined
                  orderBy: SomeUserPrismaArgs['orderBy']
                }
              >
            >(true)
            return [{ id: '1' }]
          }),
    })
    const query = `
      query {
        users(first: 1) {
          edges {
            node {
              id
            }
          }
        }
      }
    `
    await graphql({
      schema: pg.build([usersQuery]),
      source: query,
      contextValue: {},
    })

    expect(args).toEqual({
      first: 1,
    })
    expect(prismaArgs).toEqual({
      take: 2,
      orderBy: { id: 'asc' },
    })
  })

  describe('Create cursor function is set', () => {
    it('Uses set function to create cursors', async () => {
      const pg = getPGBuilder<SomePGTypes>()
      const user = pg
        .object({
          name: 'User',
          fields: (b) => ({
            id: b.id(),
            email: b.string(),
          }),
        })
        .prismaModel('User')
      const usersQuery = pg.query({
        name: 'users',
        field: (f) =>
          f
            .object(() => user)
            .relay()
            .relayCursor((node) => {
              expectType<TypeEqual<typeof node, { id: string; email: string }>>(true)
              return { email: node.email }
            })
            .resolve(() => {
              return [{ id: '1', email: 'xxx@xxx.com' }]
            }),
      })

      const query = `
        query {
          users {
            edges {
              cursor
            }
          }
        }
      `
      const response = await graphql({
        schema: pg.build([usersQuery]),
        source: query,
        contextValue: {},
      })

      expect((response.data as any).users.edges[0].cursor).toEqual(
        encodeCursor({ email: 'xxx@xxx.com' }),
      )
    })
  })

  describe('Default OrderBy args is set', () => {
    it('Uses set default OrderBy args ', async () => {
      let prismaArgs
      const pg = getPGBuilder<SomePGTypes>()
      const user = pg
        .object({
          name: 'User',
          fields: (b) => ({
            id: b.id(),
            email: b.string(),
          }),
        })
        .prismaModel('User')
      const usersQuery = pg.query({
        name: 'users',
        field: (f) =>
          f
            .object(() => user)
            .relay()
            .relayOrderBy({
              email: 'desc',
            })
            .resolve((params) => {
              prismaArgs = params.prismaArgs
              return [{ id: '1' }]
            }),
      })
      const query = `
        query {
          users {
            edges {
              node {
                id
              }
            }
          }
        }
      `
      await graphql({
        schema: pg.build([usersQuery]),
        source: query,
        contextValue: {},
      })

      expect(prismaArgs).toEqual({
        orderBy: { email: 'desc' },
      })
    })
  })

  describe('OrderBy args is passed as PrismaArgs', () => {
    it('Uses passed OrderBy args', async () => {
      let prismaArgs
      const pg = getPGBuilder<SomePGTypes>()
      const user = pg
        .object({
          name: 'User',
          fields: (b) => ({
            id: b.id(),
            email: b.string(),
          }),
        })
        .prismaModel('User')
      const usersQuery = pg.query({
        name: 'users',
        field: (f) =>
          f
            .object(() => user)
            .relay()
            .prismaArgs((b) => ({
              orderBy: b.input(() =>
                pg.input({
                  name: 'UsersOrderBy',
                  fields: (b) => ({
                    email: b.string(),
                    id: b.string(),
                  }),
                }),
              ),
            }))
            .resolve((params) => {
              prismaArgs = params.prismaArgs
              return [{ id: '1' }]
            }),
      })
      const query = `
        query {
          users(orderBy: { email: "asc", id: "desc" }) {
            edges {
              node {
                id
              }
            }
          }
        }
      `
      await graphql({
        schema: pg.build([usersQuery]),
        source: query,
        contextValue: {},
      })

      expect(prismaArgs).toEqual({
        orderBy: { email: 'asc', id: 'desc' },
      })
    })
  })
})

describe('createConnectionObject', () => {
  it('Returns a PGObject that matches the Relay format', () => {
    const pg = getPGBuilder()
    const nodeObject = pg.object({
      name: 'Node',
      fields: (b) => ({
        id: b.id(),
      }),
    })
    const resultConnectionObject = createConnectionObject(
      () => nodeObject,
      'Prefix',
      pg,
      true,
    )
    const resultEdgeObject = resultConnectionObject.value.fieldMap.edges.value.type()
    const resultPageInfoObject =
      resultConnectionObject.value.fieldMap.pageInfo.value.type()
    const resultNodeObject = resultEdgeObject.value.fieldMap.node.value.type()

    const expectConnectionObject = mergeDefaultPGObject({
      name: 'PrefixConnection',
      value: {
        fieldMap: {
          edges: mergeDefaultOutputField({
            kind: 'object',
            type: expect.any(Function),
            isList: true,
          }),
          pageInfo: mergeDefaultOutputField({
            kind: 'object',
            type: expect.any(Function),
          }),
          totalCount: mergeDefaultOutputField({
            kind: 'scalar',
            type: 'int',
          }),
        },
      },
    })

    const expectEdgeObject = mergeDefaultPGObject({
      name: 'PrefixEdge',
      value: {
        fieldMap: {
          node: mergeDefaultOutputField({
            kind: 'object',
            type: expect.any(Function),
          }),
          cursor: mergeDefaultOutputField({
            kind: 'scalar',
            type: 'string',
          }),
        },
      },
    })

    const expectPageInfoObject = mergeDefaultPGObject({
      name: 'PageInfo',
      value: {
        fieldMap: {
          hasNextPage: mergeDefaultOutputField({
            kind: 'scalar',
            type: 'boolean',
          }),
          hasPreviousPage: mergeDefaultOutputField({
            kind: 'scalar',
            type: 'boolean',
          }),
          startCursor: mergeDefaultOutputField({
            kind: 'scalar',
            type: 'string',
            isNullable: true,
            isOptional: true,
          }),
          endCursor: mergeDefaultOutputField({
            kind: 'scalar',
            type: 'string',
            isNullable: true,
            isOptional: true,
          }),
        },
      },
    })

    expect(resultConnectionObject).toEqual(expectConnectionObject)
    expect(resultEdgeObject).toEqual(expectEdgeObject)
    expect(resultPageInfoObject).toEqual(expectPageInfoObject)
    expect(resultNodeObject).toEqual(nodeObject)
  })
})

describe('getPageInfo', () => {
  describe('only "first" arg passed', () => {
    it('Returns a correct PageInfo', () => {
      const result = getPageInfo(2, [{ node: { id: 1 }, cursor: 'cursor' }], {
        first: 1,
      })
      expect(result).toEqual({
        hasNextPage: true,
        hasPreviousPage: false,
        startCursor: 'cursor',
        endCursor: 'cursor',
      })
    })
  })
  describe('only "after" args passed', () => {
    it('Returns a correct PageInfo', () => {
      const result = getPageInfo(1, [{ node: { id: 1 }, cursor: 'cursor' }], {
        after: 'afterCursor',
      })
      expect(result).toEqual({
        hasNextPage: false,
        hasPreviousPage: true,
        startCursor: 'cursor',
        endCursor: 'cursor',
      })
    })
  })
  describe('only "last" arg passed', () => {
    it('Returns a correct PageInfo', () => {
      const result = getPageInfo(2, [{ node: { id: 1 }, cursor: 'cursor' }], {
        last: 1,
      })
      expect(result).toEqual({
        hasNextPage: false,
        hasPreviousPage: true,
        startCursor: 'cursor',
        endCursor: 'cursor',
      })
    })
  })
  describe('only "before" args passed', () => {
    it('Returns a correct PageInfo', () => {
      const result = getPageInfo(1, [{ node: { id: 1 }, cursor: 'cursor' }], {
        before: 'beforeCursor',
      })
      expect(result).toEqual({
        hasNextPage: true,
        hasPreviousPage: false,
        startCursor: 'cursor',
        endCursor: 'cursor',
      })
    })
  })
  describe('no relay args passed', () => {
    it('Returns a correct PageInfo', () => {
      const result = getPageInfo(1, [{ node: { id: 1 }, cursor: 'cursor' }], {})
      expect(result).toEqual({
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: 'cursor',
        endCursor: 'cursor',
      })
    })
  })
  describe('no edges', () => {
    it('Returns a correct PageInfo', () => {
      const result = getPageInfo(0, [], {})
      expect(result).toEqual({
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      })
    })
  })
})

describe('getPrismaRelayArgs', () => {
  describe('only "first" arg passed', () => {
    it('Returns "take"', () => {
      const result = getPrismaRelayArgs({ first: 3 }, [{ id: 'asc' }])
      expect(result).toEqual({
        take: 3 + 1,
        orderBy: [{ id: 'asc' }],
      })
    })
  })

  describe('"first" and "after" args passed', () => {
    it('Returns "take", "skip" and "cursor" created by decoding "after"', () => {
      const result = getPrismaRelayArgs({ first: 3, after: encodeCursor({ id: '1' }) }, [
        { id: 'asc' },
      ])
      expect(result).toEqual({
        take: 3 + 1,
        skip: 1,
        cursor: { id: '1' },
        orderBy: [{ id: 'asc' }],
      })
    })
  })

  describe('only "last" arg passed', () => {
    it('Returns "take" and reversed "orderBy"', () => {
      const result = getPrismaRelayArgs({ last: 3 }, [{ id: 'asc' }])
      expect(result).toEqual({
        take: 3 + 1,
        orderBy: [{ id: 'desc' }],
      })
    })
  })

  describe('"last" and "before" args passed', () => {
    it('Returns "take", "skip", "cursor" created by decoding "after" and reversed "orderBy"', () => {
      const result = getPrismaRelayArgs({ last: 3, before: encodeCursor({ id: '1' }) }, [
        { id: 'asc' },
      ])
      expect(result).toEqual({
        take: 3 + 1,
        skip: 1,
        cursor: { id: '1' },
        orderBy: [{ id: 'desc' }],
      })
    })
  })
})
