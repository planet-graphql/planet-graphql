import { createServer } from '@graphql-yoga/node'
import { pg, pgpc } from './graphql'
import { post } from './models/post'
import { user } from './models/user'
import { PrismaClient } from './prisma-client'
import { createAttachmentMutation } from './resolvers/attachment-resolver'
import { createPostMutation, postQuery } from './resolvers/post-resolvers'
import { usersQuery } from './resolvers/user-resolvers'
import type { GraphQLError } from 'graphql'

export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})
export const { objects, getRelations } = pgpc.convertTypes({
  User: () => user,
  Post: () => post,
})

const server = createServer({
  schema: pg.build([usersQuery, postQuery, createPostMutation, createAttachmentMutation]),
  maskedErrors: {
    formatError: (e) => {
      const error = e as GraphQLError
      console.log(error.originalError?.stack)
      return error
    },
  },
  context: {
    userId: 1,
    isAdmin: true,
  },
})

server.start().catch((error) => console.log(error))
