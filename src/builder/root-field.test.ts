import { ExecutionResult, GraphQLString, parse, subscribe } from 'graphql'
import { PubSub } from 'graphql-subscriptions'
import { getPGBuilder } from '..'
import { setInputFieldMethods, setOutputFieldMethods } from './test-utils'

describe('rootFieldBuilder', () => {
  it('Creates a new PGRootFieldConfig & Set it to the Build Cache', () => {
    const pg = getPGBuilder()()
    const someObject = pg.object('SomeObject', (f) => ({
      id: f.id(),
      name: f.string(),
      age: f.int(),
    }))
    const someInput = pg.input('SomeInput', (f) => ({
      age: f.int(),
    }))

    const result = pg.query('someQuery', (f) =>
      f
        .object(() => someObject)
        .args((f) => ({
          name: f.string(),
          profile: f.input(() => someInput),
        }))
        .resolve(({ args }) => {
          return {
            id: 'id',
            name: args.name,
            age: args.profile.age,
          }
        }),
    )

    const expectValue = {
      name: 'someQuery',
      field: setOutputFieldMethods({
        kind: 'object',
        isRequired: true,
        isList: false,
        type: expect.any(Function),
        args: {
          name: setInputFieldMethods({
            kind: 'scalar',
            isRequired: true,
            isList: false,
            type: GraphQLString,
          }),
          profile: setInputFieldMethods({
            kind: 'object',
            isRequired: true,
            isList: false,
            type: expect.any(Function),
          }),
        },
        resolve: expect.any(Function),
      }),
      kind: 'query',
    }

    expect(result).toEqual(expectValue)
    expect(pg.cache().query.someQuery).toEqual(expectValue)
  })

  it('Returns an existing resource because a resource with the same name cannot be created', () => {
    const pg = getPGBuilder()()

    pg.query('SomeQuery', (f) => f.string().resolve(() => ''))

    expect(pg.query('SomeQuery', (f) => f.int().resolve(() => 1))).toEqual({
      name: 'SomeQuery',
      field: setOutputFieldMethods({
        kind: 'scalar',
        isRequired: true,
        isList: false,
        type: GraphQLString,
        resolve: expect.any(Function),
      }),
      kind: 'query',
    })
  })

  describe('subscription', () => {
    it('Returns a value in response to a publish according to the conditions set in the filter', async () => {
      const pubsub = new PubSub()
      const pg = getPGBuilder()()

      pg.query('SomeQuery', (f) => f.string())
      pg.subscription('SomeSubscription', (f) =>
        f
          .string()
          .args((f) => ({
            someArg: f.string(),
          }))
          .resolve((params) => params.source)
          .subscribe((params) => ({
            pubSubIter: pubsub.asyncIterator('somethingUpdated'),
            filter: () => params.args.someArg === 'arg',
          })),
      )

      const schema = pg.build()

      const subscription = `
        subscription onSomeSubscription {
          SomeSubscription ( someArg: "arg" )
        }
      `

      const subscriptionResp = (await subscribe({
        schema,
        document: parse(subscription),
        contextValue: {},
      })) as AsyncIterableIterator<ExecutionResult>

      setTimeout(() => {
        // eslint-disable-next-line no-void
        void pubsub.publish('somethingUpdated', 'hi')
      }, 100)

      const result = await (await subscriptionResp.next()).value
      expect(result).toEqual({ data: { SomeSubscription: 'hi' } })
    })
    it('Returns an existing resource because a resource with the same name cannot be created', () => {
      const pg = getPGBuilder()()
      const pubsub = new PubSub()
      pg.subscription('SomeSubscription', (f) =>
        f
          .string()
          .resolve((params) => params.source)
          .subscribe((params) => ({
            pubSubIter: pubsub.asyncIterator('somethingUpdated'),
          })),
      )

      expect(
        pg.subscription('SomeSubscription', (f) =>
          f
            .int()
            .resolve((params) => params.source)
            .subscribe((params) => ({
              pubSubIter: pubsub.asyncIterator('somethingUpdated'),
            })),
        ),
      ).toEqual({
        name: 'SomeSubscription',
        field: setOutputFieldMethods({
          kind: 'scalar',
          isRequired: true,
          isList: false,
          type: GraphQLString,
          resolve: expect.any(Function),
          subscribe: expect.any(Function),
        }),
        kind: 'subscription',
      })
    })
  })
})
