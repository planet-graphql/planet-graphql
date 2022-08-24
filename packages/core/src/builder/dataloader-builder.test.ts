import { graphql } from 'graphql'
import { getPGBuilder } from '..'

describe('DataloaderBuilder', () => {
  it('Returns a dataloader batches executions', async () => {
    const pg = getPGBuilder()
    const spy = jest.fn()
    const user = pg
      .object({
        name: 'User',
        fields: (f) => ({
          id: f.id(),
          posts: f.object(() => post).list(),
          latestPost: f.object(() => post).nullable(),
        }),
      })
      .implement((f) => ({
        latestPost: f.latestPost.resolve((params) => {
          return pg.dataloader(params, (users) => {
            spy()
            const latestPost = users.map((x) =>
              x.posts.length > 0 ? x.posts[x.posts.length - 1] : null,
            )
            return latestPost
          })
        }),
      }))
    const post = pg.object({
      name: 'Post',
      fields: (f) => ({
        id: f.id(),
      }),
    })
    const usersQuery = pg.query({
      name: 'users',
      field: (b) =>
        b
          .object(() => user)
          .list()
          .resolve(() => [
            {
              id: 'user1',
              posts: [{ id: 'post1' }],
            },
            {
              id: 'user2',
              posts: [{ id: 'post2' }, { id: 'post3' }],
            },
          ]),
    })
    const query = `
      query {
        users {
          id
          latestPost {
            id
          }
        }
      }
    `

    const response = await graphql({
      schema: pg.build([usersQuery]),
      source: query,
      contextValue: {},
    })

    expect(spy.mock.calls.length).toBe(1)
    expect(response).toEqual({
      data: {
        users: [
          {
            id: 'user1',
            latestPost: {
              id: 'post1',
            },
          },
          {
            id: 'user2',
            latestPost: {
              id: 'post3',
            },
          },
        ],
      },
    })
  })
})
