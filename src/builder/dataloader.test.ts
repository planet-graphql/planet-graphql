import { graphql } from 'graphql'
import _ from 'lodash'
import { getPGBuilder } from '..'

describe('dataloader', () => {
  it('Batches executions', async () => {
    const users = [
      {
        id: '1',
        posts: [],
        latestPost: null,
      },
      {
        id: '2',
        posts: [],
        latestPost: null,
      },
    ]

    const posts = [
      {
        id: '1',
        title: 'xxx',
        userId: '1',
      },
      {
        id: '2',
        title: 'yyy',
        userId: '1',
      },
      {
        id: '3',
        title: 'zzz',
        userId: '2',
      },
    ]

    const pg = getPGBuilder()()

    const user = pg.object('User', (f) => ({
      id: f.id(),
      posts: f.object(() => post).list(),
      latestPost: f.object(() => post).nullable(),
    }))

    const post = pg.object('Post', (f) => ({
      id: f.id(),
      title: f.string(),
      userId: f.string(),
    }))

    const spy = jest.fn()

    pg.resolver(user, {
      latestPost: (params) => {
        return pg.dataloader(params, (sourceList) => {
          spy()
          const userPosts = sourceList.map((x) => posts.filter((p) => p.userId === x.id))
          const latestPost = userPosts.map(
            (x) => _.maxBy(x, (post) => Number(post.id)) ?? null,
          )
          return latestPost
        })
      },
    })

    pg.query('findUsers', (f) =>
      f
        .object(() => user)
        .list()
        .resolve(() => users),
    )

    pg.mutation('createUsers', (f) =>
      f
        .object(() => user)
        .list()
        .resolve(() => users),
    )

    const schemaResult = pg.build()

    const query = `
    query {
      findUsers {
        latestPost {
          id
        }
      }
    }
    `

    const queryResp = await graphql({
      schema: schemaResult,
      source: query,
      contextValue: {},
    })
    if (queryResp.errors !== undefined) {
      console.log(queryResp)
    }

    expect(spy.mock.calls.length).toBe(1)
    expect(queryResp).toEqual({
      data: {
        findUsers: [
          {
            latestPost: {
              id: '2',
            },
          },
          {
            latestPost: {
              id: '3',
            },
          },
        ],
      },
    })
  })
})
