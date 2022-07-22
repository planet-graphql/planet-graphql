import { graphql, GraphQLError } from 'graphql'
import { getPGBuilder } from '..'

describe('build', () => {
  describe('No Mutation is defined', () => {
    it('Builds a GraphQLSchema', async () => {
      const pg = getPGBuilder()()
      const someQuery = pg.query({
        name: 'someQuery',
        field: (b) => b.string().resolve(() => 'hi'),
      })
      const schema = pg.build([someQuery])
      const query = `
        query {
          someQuery
        }
      `
      const resp = await graphql({ schema, source: query, contextValue: {} })
      expect(resp).toEqual({ data: { someQuery: 'hi' } })
    })
  })

  describe('No Query is defined', () => {
    it('Returns errors because GraphQL.js requires at least one Query', async () => {
      const pg = getPGBuilder()()
      const someMutation = pg.mutation({
        name: 'someMutation',
        field: (b) => b.string().resolve(() => 'hi'),
      })
      const schema = pg.build([someMutation])
      const query = `
        mutation {
          someMutation
        }
      `
      const resp = await graphql({ schema, source: query, contextValue: {} })
      expect(resp).toEqual({
        errors: [new GraphQLError('Type Query must define one or more fields.')],
      })
    })
  })
})
