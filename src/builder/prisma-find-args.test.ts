import { graphql } from 'graphql'
import { expectType } from 'tsd'
import { getPGBuilder } from '..'
import { ResolveParams } from '../types/common'
import { getResolveParamsRef, pgObjectToPGModel } from './test-utils'

describe('prismaFindArgs', () => {
  describe('Regular queries', () => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    function getObjects() {
      type Context = {
        role: 'Admin' | 'User'
      }
      const pg = getPGBuilder<{ Context: Context; PGGeneratedType: any }>()()
      const pgCache = pg.cache()

      const userModel = pgObjectToPGModel<{
        isDeleted?: boolean
        profile?: {
          isPublic?: boolean
        }
      }>()(
        pg.object('User', (f) => ({
          id: f.id(),
          isDeleted: f.boolean(),
          email: f.string(),
          posts: f.object(() => postModel).list(),
          profie: f.object(() => profileModel),
        })),
        pgCache,
      )

      const profileModel = pgObjectToPGModel()(
        pg.object('Profile', (f) => ({
          id: f.id(),
          age: f.int(),
          isPublic: f.boolean(),
        })),
        pgCache,
      )

      const postModel = pgObjectToPGModel()(
        pg.object('Post', (f) => ({
          id: f.id(),
          title: f.string(),
          comments: f.object(() => commentModel),
        })),
        pgCache,
      )

      const commentModel = pgObjectToPGModel<{
        message?: {
          contains?: string
        }
      }>()(
        pg.object('Comment', (f) => ({
          id: f.id(),
          message: f.string(),
        })),
        pgCache,
      )

      const user = pg.objectFromModel(userModel, (keep, f) => ({
        id: keep.id,
        posts: keep.posts.args((f) => ({
          include: f
            .input(() =>
              pg.input('PostsIncludeInput', (f) => ({
                _count: f.boolean().nullish(),
              })),
            )
            .nullish(),
          where: f
            .input(() =>
              pg.input('PostsWhereInput', (f) => ({
                title: f.input(() =>
                  pg.input('PostsWhereTitleInput', (f) => ({
                    equals: f.string().nullish(),
                  })),
                ),
              })),
            )
            .nullish(),
          orderBy: f
            .input(() =>
              pg.input('PostsOrderByInput', (f) => ({
                updatedAt: f.string().nullish(),
              })),
            )
            .nullish(),
          cursor: f
            .input(() =>
              pg.input('PostsCursorInput', (f) => ({
                id: f.int().nullish(),
              })),
            )
            .nullish(),
          take: f.int().nullish(),
          skip: f.int().nullish(),
          distinct: f.string().nullish(),
          unrelated2: f.boolean().nullish(),
        })),
        latestPost: f.object(() => postModel),
      }))

      const profile = pg.objectFromModel(profileModel, (keep) => keep)

      const post = pg.objectFromModel(postModel, (keep, f) => ({
        ...keep,
        comments: keep.comments.args((f) => ({
          take: f.int().nullish(),
          unrelated3: f.boolean().nullish(),
        })),
      }))

      const comment = pg.objectFromModel(commentModel, (keep) => keep)

      pg.query('users', (f) =>
        f
          .object(() => user)
          .list()
          .args((f) => ({
            select: f.string().list().nullish(),
            include: f
              .input(() =>
                pg.input('UsersIncludeInput', (f) => ({
                  _count: f.boolean().nullish(),
                })),
              )
              .nullish(),
            where: f
              .input(() =>
                pg.input('UsersWhereInput', (f) => ({
                  email: f.input(() =>
                    pg.input('PostsWhereEmailInput', (f) => ({
                      contains: f.string().nullish(),
                    })),
                  ),
                })),
              )
              .nullish(),
            orderBy: f
              .input(() =>
                pg.input('UsersOrderByInput', (f) => ({
                  name: f.string().nullish(),
                  email: f.string().nullish(),
                })),
              )
              .list()
              .nullish(),
            cursor: f
              .input(() =>
                pg.input('UsersCursorInput', (f) => ({
                  id: f.int().nullish(),
                })),
              )
              .nullish(),
            take: f.int().nullish(),
            skip: f.int().nullish(),
            distinct: f.string().nullish(),
            unrelated: f.boolean().nullish(),
          }))
          .resolve(() => {
            return [
              {
                id: 'id',
                email: 'email',
                posts: [],
                profile: {
                  id: 'id',
                  age: 20,
                },
              },
            ]
          }),
      )

      const paramsRef = getResolveParamsRef(pgCache)

      const schema = pg.build()

      return { pg, schema, paramsRef, user, profile, post, comment }
    }
    it('Generates args that can be passed to Prisma with the specified type', async () => {
      const query = `
      query(
        $usersIncludeInput: UsersIncludeInput,
        $usersWhereInput: UsersWhereInput,
        $usersOrderByInput: [UsersOrderByInput],
        $postsCursorInput: PostsCursorInput,
        $postsTake: Int,
        $postsSkip: Int,
        $postsDistinct: String
      ) {
        users (
          include: $usersIncludeInput,
          where: $usersWhereInput,
          orderBy: $usersOrderByInput,
          cursor: { id: 10 },
          take: 10,
          skip: 1,
          distinct: "email",
          unrelated: false,
        ) {
          id
          posts (
            include: { _count: true },
            where: { title: { equals: "prisma" } },
            orderBy: { updatedAt: "desc" },
            cursor: $postsCursorInput,
            take: $postsTake,
            skip: $postsSkip,
            distinct: $postsDistinct,
            unrelated2: false,
          ) {
            title
            comments(
              take: 10,
              unrelated3: false,
            ) {
              id
              message
            }
          }
          latestPost {
            title
          }
        }
      }
    `
      const { pg, schema, paramsRef, user } = getObjects()

      await graphql({
        schema,
        source: query,
        variableValues: {
          usersIncludeInput: { _count: true },
          usersWhereInput: { email: { contains: 'prisma' } },
          usersOrderByInput: [{ name: 'desc' }, { email: 'asc' }],
          postsCursorInput: { id: 10 },
          postsTake: 10,
          postsSkip: 1,
          postsDistinct: 'title',
        },
        contextValue: {},
      })

      type SomeType = {
        someArgs: string
      }
      // NOTE: 本来はジェネリクスにPrismaが生成する`UserFindManyArgs`などを指定する
      const result = pg.prismaFindArgs<SomeType>(user, paramsRef.value)

      expect(result).toEqual({
        include: {
          _count: true,
          posts: {
            include: {
              _count: true,
              comments: {
                take: 10,
              },
            },
            where: {
              title: {
                equals: 'prisma',
              },
            },
            orderBy: {
              updatedAt: 'desc',
            },
            cursor: {
              id: 10,
            },
            take: 10,
            skip: 1,
            distinct: 'title',
          },
        },
        where: {
          email: {
            contains: 'prisma',
          },
        },
        orderBy: [{ name: 'desc' }, { email: 'asc' }],
        cursor: {
          id: 10,
        },
        take: 10,
        skip: 1,
        distinct: 'email',
      })

      expectType<{
        someArgs: string
      }>(result)
    })

    it('Generates args considering the default value of each PGInputFields', async () => {
      // type Context = {
      //   role: 'Admin' | 'User'
      // }
      const pg = getPGBuilder()()
      const pgCache = pg.cache()

      let paramsValue: ResolveParams<any, any, any, any> = null as any

      const userModel = pgObjectToPGModel()(
        pg.object('User', (f) => ({
          id: f.id(),
          email: f.string(),
          posts: f.object(() => postModel).list(),
        })),
        pgCache,
      )

      const postModel = pgObjectToPGModel()(
        pg.object('Post', (f) => ({
          id: f.id(),
          title: f.string(),
          comment: f.object(() => commentModel),
          signature: f.string(),
        })),
        pgCache,
      )

      const commentModel = pgObjectToPGModel()(
        pg.object('Comment', (f) => ({
          id: f.id(),
          message: f.string(),
          signature: f.string(),
        })),
        pgCache,
      )

      const comment = pg.objectFromModel(commentModel, (keep) => keep)

      const post = pg.objectFromModel(postModel, (keep, f) => ({
        ...keep,
        comment: f
          .object(() => comment)
          .args((f) => ({
            where: f
              .input(() =>
                pg.input('CommentWhereInput', (f) => ({
                  someText: f.input(() =>
                    pg.input('CommentsWhereTextInput', (f) => ({
                      inner: f.input(() =>
                        pg.input('CommentsWhereTextInnerInput', (f) => ({
                          equals: f.string().default('defaultText'),
                        })),
                      ),
                    })),
                  ),
                  someList: f
                    .input(() =>
                      pg.input('CommentWhereListInput', (f) => ({
                        equals: f.string().default('defaultList'),
                      })),
                    )
                    .list()
                    .default([]),
                  someNoDefault: f
                    .input(() =>
                      pg.input('CommentWhereNoDefaultInput', (f) => ({
                        equals: f.string(),
                      })),
                    )
                    .nullish(),
                  someOverride: f.input(() =>
                    pg.input('CommentWhereOverrideInput', (f) => ({
                      equals: f.string().default('default'),
                    })),
                  ),
                })),
              )
              .nullish(),
          })),
      }))

      const user = pg.objectFromModel(userModel, (keep, f) => ({
        ...keep,
        posts: f
          .object(() => post)
          .args((f) => ({
            where: f
              .input(() =>
                pg.input('PostWhereInput', (f) => ({
                  someText: f.input(() =>
                    pg.input('PostWhereTextInput', (f) => ({
                      inner: f.input(() =>
                        pg.input('PostWhereTextInnerInput', (f) => ({
                          equals: f.string().default('defaultText'),
                        })),
                      ),
                    })),
                  ),
                  someList: f
                    .input(() =>
                      pg.input('PostWhereListInput', (f) => ({
                        equals: f.string().default('defaultList'),
                      })),
                    )
                    .list()
                    .default([]),
                  someNoDefault: f
                    .input(() =>
                      pg.input('PostWhereNoDefaultInput', (f) => ({
                        equals: f.string(),
                      })),
                    )
                    .nullish(),
                  someOverride: f.input(() =>
                    pg.input('PostWhereOverrideInput', (f) => ({
                      equals: f.string().default('default'),
                    })),
                  ),
                })),
              )
              .nullish(),
          }))
          .list(),
      }))

      pg.query('users', (f) =>
        f
          .object(() => user)
          .list()
          .args((f) => ({
            where: f
              .input(() =>
                pg.input('UserWhereInput', (f) => ({
                  someText: f.input(() =>
                    pg.input('UserWhereTextInput', (f) => ({
                      inner: f.input(() =>
                        pg.input('UserWhereTextInnerInput', (f) => ({
                          equals: f.string().default('defaultText'),
                        })),
                      ),
                    })),
                  ),
                  someList: f
                    .input(() =>
                      pg.input('UserWhereListInput', (f) => ({
                        equals: f.string().default('defaultList'),
                      })),
                    )
                    .list()
                    .default([]),
                  someNoDefault: f
                    .input(() =>
                      pg.input('UserWhereNoDefaultInput', (f) => ({
                        equals: f.string(),
                      })),
                    )
                    .nullish(),
                  someOverride: f.input(() =>
                    pg.input('UserWhereOverrideInput', (f) => ({
                      equals: f.string().default('default'),
                    })),
                  ),
                })),
              )
              .nullish(),
          }))
          .resolve((params) => {
            paramsValue = params
            return [
              {
                id: 'id',
                email: 'email',
                posts: [],
                latestPost: {
                  id: 'id',
                  title: 'title',
                  comment: {
                    id: 'id',
                    message: 'message',
                    signature: 'signature',
                  },
                  signature: 'signature',
                },
              },
            ]
          }),
      )

      const schema = pg.build()

      const query = `
        query {
          users (
            where: {
              someOverride: {
                equals: "override",
              }
            }
          ) {
            email
            posts (
              where: {
                someOverride: {
                  equals: "override",
                }
              }
            ) {
              title
              signature
              comment (
                where: {
                  someOverride: {
                    equals: "override",
                  }
                }
              ) {
                message
                signature
              }
            }
          }
        }
      `

      await graphql({
        schema,
        source: query,
        contextValue: {},
      })

      type SomeType = {
        someArgs: string
      }
      // NOTE: 本来はジェネリクスにPrismaが生成する`UserFindManyArgs`などを指定する
      const result = pg.prismaFindArgs<SomeType>(user, paramsValue)

      expect(result).toEqual({
        include: {
          posts: {
            include: {
              comment: {
                where: {
                  someText: {
                    inner: {
                      equals: 'defaultText',
                    },
                  },
                  someList: [],
                  someOverride: {
                    equals: 'override',
                  },
                },
              },
            },
            where: {
              someText: {
                inner: {
                  equals: 'defaultText',
                },
              },
              someList: [],
              someOverride: {
                equals: 'override',
              },
            },
          },
        },
        where: {
          someText: {
            inner: {
              equals: 'defaultText',
            },
          },
          someList: [],
          someOverride: {
            equals: 'override',
          },
        },
      })
    })

    it('Raises an exception because the ReturnType of the Query and the PGObject specified as root are different', async () => {
      const query = `
      query {
        users {
          id
        }
      }
    `
      const { pg, schema, paramsRef, post } = getObjects()
      await graphql({
        schema,
        source: query,
        contextValue: {},
      })

      expect(() => {
        pg.prismaFindArgs(post, paramsRef.value)
      }).toThrow('A mismatch of type. RootType: Post, TypeInResolverInfo: User')
    })
  })

  describe('Default args is specified as the third argument', () => {
    it('Merges the specified default args', async () => {
      const pg = getPGBuilder()()
      const pgCache = pg.cache()

      let paramsValue: ResolveParams<any, any, any, any> = null as any

      const userModel = pgObjectToPGModel()(
        pg.object('User', (f) => ({
          id: f.id(),
          name: f.string(),
          date: f.dateTime(),
          somePosts: f.object(() => postModel).list(),
          profile: f.object(() => profileModel),
        })),
        pgCache,
      )

      const postModel = pgObjectToPGModel()(
        pg.object('Post', (f) => ({
          id: f.id(),
          title: f.string(),
        })),
        pgCache,
      )

      const profileModel = pgObjectToPGModel()(
        pg.object('Profile', (f) => ({
          id: f.id(),
          content: f.string(),
        })),
      )

      const user = pg.objectFromModel(userModel, (keep, f) => ({
        ...keep,
        somePosts: keep.somePosts.args((f) => ({
          orderBy: f
            .input(() =>
              pg.input('PostOrderByInput', (f) => ({
                id: f.string().nullish(),
              })),
            )
            .nullish(),
        })),
      }))

      pg.query('users', (f) =>
        f
          .object(() => user)
          .args((f) => ({
            where: f
              .input(() =>
                pg.input('UsersWhereInput', (f) => ({
                  name: f.input(() =>
                    pg.input('UsersWhereNameInput', (f) => ({
                      contains: f.string().nullish(),
                    })),
                  ),
                })),
              )
              .nullish(),
            orderBy: f
              .input(() =>
                pg.input('UserOrderByInput', (f) => ({
                  id: f.id().nullish(),
                  name: f.string().nullish(),
                })),
              )
              .list()
              .nullish(),
          }))
          .resolve((params) => {
            paramsValue = params
            return {
              id: '1',
              somePosts: [],
            }
          }),
      )

      const schema = pg.build()

      const nestedQuery = `
      query {
        users ( 
          where: {
            name: {
              contains: "xxx"
            }
          }
          orderBy: [{ id: "asc" }, { name: "asc" }]
          ) {
            id
            somePosts ( orderBy: { id: "asc" } ) {
              id
            }
        }
      }`
      await graphql({
        schema,
        source: nestedQuery,
        contextValue: { role: 'User' },
      })

      const nestedResult = pg.prismaFindArgs(user, paramsValue, {
        where: {
          name: {
            equals: 'xxxXXX',
          },
        },
        orderBy: [
          {
            date: 'desc',
          },
        ],
        include: {
          somePosts: {
            where: {
              title: {
                contains: 'yyyYYY',
              },
            },
          },
          profile: {
            where: {
              content: {
                contains: 'zzzZZZ',
              },
            },
          },
        },
      })

      expect(nestedResult).toEqual({
        include: {
          somePosts: {
            orderBy: {
              id: 'asc',
            },
            where: {
              title: {
                contains: 'yyyYYY',
              },
            },
          },
        },
        where: {
          name: {
            equals: 'xxxXXX',
            contains: 'xxx',
          },
        },
        orderBy: [
          {
            id: 'asc',
          },
          {
            name: 'asc',
          },
        ],
      })

      const notNestedQuery = `
      query {
        users ( 
          where: {
            name: {
              contains: "xxx"
            }
          }
          orderBy: [{ id: "asc" }, { name: "asc" }]
          ) {
            id
        }
      }`
      await graphql({
        schema,
        source: notNestedQuery,
        contextValue: { role: 'User' },
      })

      const notNestedResult = pg.prismaFindArgs(user, paramsValue, {
        where: {
          name: {
            equals: 'xxxXXX',
          },
        },
        orderBy: [
          {
            date: 'desc',
          },
        ],
        include: {
          somePosts: {
            where: {
              title: {
                contains: 'yyyYYY',
              },
            },
          },
        },
      })

      expect(notNestedResult).toEqual({
        where: {
          name: {
            equals: 'xxxXXX',
            contains: 'xxx',
          },
        },
        orderBy: [
          {
            id: 'asc',
          },
          {
            name: 'asc',
          },
        ],
      })
    })
  })
})
