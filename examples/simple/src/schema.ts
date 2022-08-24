import { getPGBuilder } from '@planet-graphql/core'
import { GraphQLPositiveInt } from 'graphql-scalars'
import { z } from 'zod'
import { posts, users } from './data'

const pg = getPGBuilder().configure({
  scalars: {
    // NOTE: You can set any custom scalars here.
    positiveInt: {
      scalar: GraphQLPositiveInt,
      schema: () => z.number().int().positive(),
    },
  },
})

const user = pg
  .object({
    name: 'User',
    fields: (b) => ({
      id: b.id(),
      name: b.string(),
      posts: b.object(() => post).list(),
    }),
  })
  .implement((f) => ({
    posts: f.posts.resolve(({ source }) => {
      return posts.filter((x) => x.authorId === source.id)
    }),
  }))

const post = pg
  .object({
    name: 'Post',
    fields: (b) => ({
      id: b.id(),
      title: b.string(),
      content: b.string(),
      authorId: b.string(),
      author: b.object(() => user),
    }),
  })
  .implement((f) => ({
    author: f.author.resolve(({ source }) => {
      return users.find((x) => x.id === source.authorId)!
    }),
  }))

const usersQuery = pg.query({
  name: 'users',
  field: (b) =>
    b
      .object(() => user)
      .list()
      .args((b) => ({
        take: b.positiveInt().default(10),
        skip: b.positiveInt().default(0),
      }))
      .resolve(({ args }) => users.slice(args.skip, args.skip + args.take)),
})

const createPostInput = pg.input({
  name: 'CreatePostInput',
  fields: (b) => ({
    authorId: b.string(),
    title: b.string(),
    content: b.string(),
  }),
})

const createPostMutation = pg.mutation({
  name: 'createPost',
  field: (b) =>
    b
      .object(() => post)
      .args((b) => ({
        input: b.input(() => createPostInput),
      }))
      .resolve(({ args }) => {
        const post = {
          id: String(posts.length + 1),
          ...args.input,
        }
        posts.push(post)
        return post
      }),
})

export const schema = pg.build([usersQuery, createPostMutation])
