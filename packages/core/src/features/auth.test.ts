import { graphql, GraphQLError } from 'graphql'
import { getPGBuilder } from '..'

describe('authFeature', () => {
  describe('Not authorized', () => {
    it('Raises an exception so that an error is returned', async () => {
      const pg = getPGBuilder()()

      const someQuery = pg.query({
        name: 'someQuery',
        field: (b) =>
          b
            .string()
            .auth(() => false)
            .resolve(() => ''),
      })

      const query = `query { someQuery }`

      const response = await graphql({
        schema: pg.build([someQuery]),
        source: query,
        contextValue: {},
      })

      expect(response).toEqual({
        data: null,
        errors: [
          new GraphQLError('GraphQL permission denied. Field: Query.someQuery', {}),
        ],
      })
    })

    describe('Return type is nullable', () => {
      it('Returns a null for user convenience', async () => {
        const pg = getPGBuilder()()

        const someQuery = pg.query({
          name: 'someQuery',
          field: (b) =>
            b
              .string()
              .nullable()
              .auth(() => false)
              .resolve(() => ''),
        })

        const query = `query { someQuery }`

        const response = await graphql({
          schema: pg.build([someQuery]),
          source: query,
          contextValue: {},
        })

        expect(response).toEqual({
          data: { someQuery: null },
        })
      })
    })

    describe('Return type is Array', () => {
      it('Returns an empty array for user convenience', async () => {
        const pg = getPGBuilder()()

        const someQuery = pg.query({
          name: 'someQuery',
          field: (b) =>
            b
              .string()
              .list()
              .auth(() => false)
              .resolve(() => ['a', 'b']),
        })

        const query = `query { someQuery }`

        const response = await graphql({
          schema: pg.build([someQuery]),
          source: query,
          contextValue: {},
        })

        expect(response).toEqual({
          data: { someQuery: [] },
        })
      })
    })
  })

  describe('Authorized', () => {
    it('Do nothing and return a set resolve return value', async () => {
      const pg = getPGBuilder()()

      const someQuery = pg.query({
        name: 'someQuery',
        field: (b) =>
          b
            .string()
            .auth(() => true)
            .resolve(() => ''),
      })

      const query = `query { someQuery }`

      const response = await graphql({
        schema: pg.build([someQuery]),
        source: query,
        contextValue: {},
      })

      expect(response).toEqual({
        data: { someQuery: '' },
      })
    })
  })
})
