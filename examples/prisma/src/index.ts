import { createServer } from '@graphql-yoga/node'
import { pg, pgpc } from './builders'
import { post } from './models/post'
import { user } from './models/user'
import { PrismaClient } from './prisma-client'
import { createAttachmentMutation } from './resolvers/attachment-resolver'
import { createPostMutation, postsQuery } from './resolvers/post-resolvers'
import { usersQuery } from './resolvers/user-resolvers'
import type { GraphQLError } from 'graphql'

export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

export const { objects, enums, getRelations } = pgpc.convertTypes({
  // NOTE:
  // This is a spell to get the type right.
  // Specifically, it is needed to set the type of a relation, such as the Attachment's "post" field,
  // with the type after it has been redefined in "models/post.ts" and so on.
  User: () => user,
  Post: () => post,
})

const server = createServer({
  schema: pg.build([
    usersQuery,
    postsQuery,
    createPostMutation,
    createAttachmentMutation,
  ]),
  maskedErrors: {
    formatError: (error) => {
      const e = error as GraphQLError
      e.extensions.stack = e.originalError?.stack
      return e
    },
  },
  // NOTE: Set a fixed value since this is a sample
  context: {
    userId: 1,
    isAdmin: true,
  },
})

server.start().catch((error) => console.log(error))
