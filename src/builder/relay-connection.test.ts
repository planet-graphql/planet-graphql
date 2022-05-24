import { GraphQLSchema, graphql } from 'graphql'
import { getPGBuilder } from '..'
import { getPageInfo } from './relay-connection'
import {
  pgObjectToPGModel,
  setOutputFieldMethods,
  setPGObjectProperties,
} from './test-utils'

describe('relayConnection', () => {
  it('Creates a PGObject that supports Relay', () => {
    const pg = getPGBuilder()()
    const post = pg.object('Post', (f) => ({
      id: f.id(),
      uuid: f.id(),
      title: f.string(),
    }))
    const postConnection = pg.relayConnection(post)

    const expectConnection = setPGObjectProperties({
      name: 'PostConnection',
      fieldMap: {
        edges: setOutputFieldMethods({
          kind: 'object',
          isRequired: true,
          isList: true,

          resolve: expect.any(Function),
          type: expect.any(Function),
        }),
        pageInfo: setOutputFieldMethods({
          kind: 'object',
          isRequired: true,
          isList: false,

          resolve: expect.any(Function),
          type: expect.any(Function),
        }),
      },
      value: {
        isRelayConnection: true,
      },
    })

    const expectPostEdge = setPGObjectProperties({
      name: 'PostEdge',
      fieldMap: {
        cursor: setOutputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: false,

          resolve: expect.any(Function),
          type: 'string',
        }),
        node: setOutputFieldMethods({
          kind: 'object',
          isRequired: true,
          isList: false,

          resolve: expect.any(Function),
          type: expect.any(Function),
        }),
      },
    })

    const expectPageInfo = setPGObjectProperties({
      name: 'PageInfo',
      fieldMap: {
        hasNextPage: setOutputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: false,

          type: 'boolean',
        }),
        hasPreviousPage: setOutputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: false,

          type: 'boolean',
        }),
      },
    })

    expect(postConnection).toEqual(expectConnection)
    const edge = (postConnection.fieldMap.edges.value.type as Function)()
    expect(edge).toEqual(expectPostEdge)
    const cursorResolve = edge.fieldMap.cursor.value.resolve
    expect(cursorResolve({ id: 1 })).toEqual('eyJpZCI6MX0=')
    const pageInfo = (postConnection.fieldMap.pageInfo.value.type as Function)()
    expect(pageInfo).toEqual(expectPageInfo)
    expect(pg.cache().object.PostConnection).toEqual(expectConnection)
  })

  it('Sets resolvers for each field to support Relay', async () => {
    function getSchema(resolveValue: any): {
      schema: GraphQLSchema
      totalCountFindArgs: {
        users: any
        posts: any
      }
    } {
      const totalCountFindArgs = {
        users: null,
        posts: null,
      }
      const pg = getPGBuilder<{
        Context: { role: 'Admin' | 'User' }
        PGGeneratedType: any
      }>()()
      const pgCache = pg.cache()

      const userModel = pgObjectToPGModel()(
        pg.object('User', (f) => ({
          id: f.id(),
          name: f.string(),
          posts: f.object(() => postModel).list(),
        })),
        pgCache,
      )
      const user = pg.objectFromModel(userModel, (keep, f) => ({
        ...keep,
        posts: f
          .object(() => postConnection)
          .args((f) => ({
            ...pg.relayArgs(),
            where: f
              .input(() =>
                pg.input('PostsWhereInput', (f) => ({
                  title: f.input(() =>
                    pg.input('PostsWhereTitleInput', (f) => ({
                      equals: f.string().nullable(),
                    })),
                  ),
                })),
              )
              .nullable(),
          })),
      }))
      const userConnection = pg.relayConnection(user, {
        totalCount: (params, findArgs) => {
          totalCountFindArgs.users = findArgs
          return params.source.length
        },
      })

      const postModel = pgObjectToPGModel()(
        pg.object('Post', (f) => ({
          id: f.id(),
          title: f.string(),
        })),
        pgCache,
      )
      const post = pg.objectFromModel(postModel, (keep, f) => keep)
      const postConnection = pg.relayConnection(post, {
        totalCount: (params, findArgs) => {
          totalCountFindArgs.posts = findArgs
          return params.source.length
        },
      })

      pg.query('users', (f) =>
        f
          .object(() => userConnection)
          .args((f) => ({
            ...pg.relayArgs(),
            where: f
              .input(() =>
                pg.input('UsersWhereInput', (f) => ({
                  name: f.input(() =>
                    pg.input('UsersWhereNameInput', (f) => ({
                      equals: f.string().nullable(),
                    })),
                  ),
                })),
              )
              .nullable(),
          }))
          .resolve((params) => {
            pg.prismaFindArgs(userConnection, params, {
              orderBy: { id: 'desc' },
              include: {
                posts: {
                  orderBy: { id: 'desc' },
                },
              },
            })
            return resolveValue
          }),
      )

      return {
        schema: pg.build(),
        totalCountFindArgs,
      }
    }
    const query = `
      query (
        $usersWhereInput: UsersWhereInput
        $postsWhereInput: PostsWhereInput
      ) {
        users ( where: $usersWhereInput, first: 1 ) {
          totalCount
          edges {
            cursor
            node {
              name
              posts ( where: $postsWhereInput, after: "xxx" ){
                totalCount
                edges {
                  cursor
                  node {
                    title
                  }
                }
                pageInfo {
                  hasNextPage
                  hasPreviousPage
                }
              }
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
        }
      }
    `

    const { schema, totalCountFindArgs } = getSchema([
      {
        id: 'u1',
        name: 'user1',
        posts: [
          {
            id: 'p1',
            title: 'title1',
          },
        ],
      },
      {
        id: 'u2',
        name: 'user2',
        posts: [],
      },
    ])

    const resp = await graphql({
      schema,
      source: query,
      variableValues: {
        usersWhereInput: {
          name: { equals: 'xxx' },
        },
        postsWhereInput: null,
      },
      contextValue: {},
    })

    expect(resp.errors).toEqual(undefined)
    expect(resp.data).toEqual({
      users: {
        totalCount: 2,
        edges: [
          {
            cursor: 'eyJpZCI6InUxIn0=',
            node: {
              name: 'user1',
              posts: {
                totalCount: 1,
                edges: [
                  {
                    cursor: 'eyJpZCI6InAxIn0=',
                    node: { title: 'title1' },
                  },
                ],
                pageInfo: {
                  hasNextPage: false,
                  hasPreviousPage: true,
                },
              },
            },
          },
        ],
        pageInfo: {
          hasNextPage: true,
          hasPreviousPage: false,
        },
      },
    })

    // NOTE: totalCount取得用に渡されるargs
    expect(totalCountFindArgs).toEqual({
      posts: {
        orderBy: {
          id: 'desc',
        },
      },
      users: {
        include: {
          posts: {
            orderBy: {
              id: 'desc',
            },
          },
        },
        orderBy: {
          id: 'desc',
        },
        take: 2,
        where: {
          name: {
            equals: 'xxx',
          },
        },
      },
    })
  })

  describe('Options are specified', () => {
    it('Adds totalCount field & Calculates cursors with specified method', () => {
      const pg = getPGBuilder()()
      const user = pg.object('User', (f) => ({
        id: f.id(),
        posts: f.object(() => postConnection),
      }))
      const post = pg.object('Post', (f) => ({
        id: f.id(),
        uuid: f.id(),
        title: f.string(),
      }))
      const postConnection = pg.relayConnection(post, {
        connectionSource: user,
        totalCount: (params, nodeFindArgs) => {
          return { source: params.source, nodeFindArgs } as any
        },
        cursor: (node) => ({ uuid: node.uuid }),
      })

      const expectConnection = setPGObjectProperties({
        name: 'PostConnection',
        fieldMap: {
          totalCount: setOutputFieldMethods({
            kind: 'scalar',
            isRequired: true,
            isList: false,

            resolve: expect.any(Function),
            type: 'int',
          }),
          edges: setOutputFieldMethods({
            kind: 'object',
            isRequired: true,
            isList: true,

            resolve: expect.any(Function),
            type: expect.any(Function),
          }),
          pageInfo: setOutputFieldMethods({
            kind: 'object',
            isRequired: true,
            isList: false,

            resolve: expect.any(Function),
            type: expect.any(Function),
          }),
        },
        value: {
          isRelayConnection: true,
        },
      })

      const expectPostEdge = setPGObjectProperties({
        name: 'PostEdge',
        fieldMap: {
          cursor: setOutputFieldMethods({
            kind: 'scalar',
            isRequired: true,
            isList: false,

            resolve: expect.any(Function),
            type: 'string',
          }),
          node: setOutputFieldMethods({
            kind: 'object',
            isRequired: true,
            isList: false,

            resolve: expect.any(Function),
            type: expect.any(Function),
          }),
        },
      })

      expect(postConnection).toEqual(expectConnection)
      const totalCountResolve = postConnection.fieldMap.totalCount?.value.resolve
      expect(
        totalCountResolve?.([], null, {}, {
          fieldNodes: [{}],
        } as any),
      ).toEqual({
        source: [],
        nodeFindArgs: {},
      })
      const edge = (postConnection.fieldMap.edges.value.type as Function)()
      expect(edge).toEqual(expectPostEdge)
      const cursorResolve = edge.fieldMap.cursor.value.resolve
      expect(cursorResolve({ uuid: 1 })).toEqual('eyJ1dWlkIjoxfQ==')
    })
  })

  describe('getPageInfo', () => {
    it('Returns appropriate values according to the function', async () => {
      /*
        data = [
          {
            id: '1',
            title: 'title1',
          },
          {
            id: '2',
            title: 'title2', <- cursor: "Y3Vyc29yMg==" ( = cursor2 )
          },
          {
            id: '3',
            title: 'title3',
          },
        ]
      */

      expect(
        getPageInfo(3, {
          first: 2,
        }),
      ).toEqual({
        hasNextPage: true,
        hasPreviousPage: false,
      })

      expect(
        getPageInfo(1, {
          after: 'Y3Vyc29yMg==',
        }),
      ).toEqual({
        hasNextPage: false,
        hasPreviousPage: true,
      })

      expect(
        getPageInfo(1, {
          first: 1,
          after: 'Y3Vyc29yMg==',
        }),
      ).toEqual({
        hasNextPage: false,
        hasPreviousPage: true,
      })

      expect(
        getPageInfo(3, {
          last: 2,
        }),
      ).toEqual({
        hasNextPage: false,
        hasPreviousPage: true,
      })

      expect(
        getPageInfo(3, {
          before: 'Y3Vyc29yMg==',
        }),
      ).toEqual({
        hasNextPage: true,
        hasPreviousPage: false,
      })

      expect(
        getPageInfo(1, {
          last: 1,
          before: 'Y3Vyc29yMg==',
        }),
      ).toEqual({
        hasNextPage: true,
        hasPreviousPage: false,
      })

      expect(getPageInfo(3, {})).toEqual({
        hasNextPage: false,
        hasPreviousPage: false,
      })
    })
  })
})
