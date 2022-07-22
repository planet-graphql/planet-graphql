import { parse, subscribe } from 'graphql'
import { PubSub } from 'graphql-subscriptions'
import { getPGBuilder } from '..'
import { mergeDefaultInputField, mergeDefaultOutputField } from '../test-utils'
import type { ExecutionResult } from 'graphql'

describe('rootFieldBuilder', () => {
  it('Creates a new PGRootFieldConfig', () => {
    const pg = getPGBuilder()()
    const someObject = pg.object({
      name: 'SomeObject',
      fields: (f) => ({
        id: f.id(),
        name: f.string(),
        age: f.int(),
      }),
    })
    const someInput = pg.input({
      name: 'SomeInput',
      fields: (f) => ({
        age: f.int(),
      }),
    })

    const result = pg.query({
      name: 'someQuery',
      field: (b) =>
        b
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
    })

    const expectValue = {
      name: 'someQuery',
      field: mergeDefaultOutputField({
        kind: 'object',
        type: expect.any(Function),
        args: {
          name: mergeDefaultInputField({
            kind: 'scalar',
            type: 'string',
          }),
          profile: mergeDefaultInputField({
            kind: 'object',
            type: expect.any(Function),
          }),
        },
        resolve: expect.any(Function),
      }),
      kind: 'query',
    }

    expect(result).toEqual(expectValue)
  })

  describe('subscription', () => {
    it('Returns a value in response to a publish according to the conditions set in the filter', async () => {
      const pubsub = new PubSub()
      const pg = getPGBuilder()()

      const someQuery = pg.query({ name: 'SomeQuery', field: (b) => b.string() })
      const SomeSubscription = pg.subscription({
        name: 'SomeSubscription',
        field: (b) =>
          b
            .string()
            .args((f) => ({
              someArg: f.string(),
            }))
            .resolve((params) => params.source)
            .subscribe((params) => ({
              pubSubIter: pubsub.asyncIterator('somethingUpdated'),
              filter: () => params.args.someArg === 'arg',
            })),
      })

      const schema = pg.build([someQuery, SomeSubscription])

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
  })
})
