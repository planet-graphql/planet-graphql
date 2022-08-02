import { createServer } from '@graphql-yoga/node'
import { schema } from './schema'
import type { GraphQLError } from 'graphql'

const server = createServer({
  schema,
  maskedErrors: {
    formatError: (error) => {
      const e = error as GraphQLError
      e.extensions.stack = e.originalError?.stack
      return e
    },
  },
})

server.start().catch((error) => {
  console.error(error)
})
