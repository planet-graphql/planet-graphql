import { createServer } from '@graphql-yoga/node'
import { pg, pgpc } from './graphql'
import { attachment } from './models/attachment'
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
export const { objects, getRelations } = pgpc.convertOutputs({
  User: () => user,
  Post: () => post,
  Attachment: () => attachment,
})

// TODO:
// Fix this. Change interface to accept PGRootFieldConfig by pg.build().
const a = [usersQuery, postQuery, createPostMutation, createAttachmentMutation]

const server = createServer({
  schema: pg.build(),
  maskedErrors: {
    formatError: (e) => {
      const error = e as GraphQLError
      console.log(error.originalError?.stack)
      return error
    },
  },
  context: {
    userId: 1,
  },
})

server.start().catch((error) => console.log(error))
