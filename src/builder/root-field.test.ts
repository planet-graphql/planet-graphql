import { ExecutionResult, parse, subscribe } from 'graphql'
import { PubSub } from 'graphql-subscriptions'
import { getPGBuilder } from '..'
import { setInputFieldMethods, setOutputFieldMethods } from './test-utils'

describe('rootFieldBuilder', () => {
  it('指定したkindのPGRootFieldConfigが作られて、cacheに設定される', () => {
    const pg = getPGBuilder<any>()
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
        isId: false,
        type: expect.any(Function),
        args: {
          name: setInputFieldMethods({
            kind: 'scalar',
            isRequired: true,
            isList: false,
            isId: false,
            type: 'String',
          }),
          profile: setInputFieldMethods({
            kind: 'object',
            isRequired: true,
            isList: false,
            isId: false,
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

  it('同じ名前のQueryは作成できず既存のリソースを返却する', () => {
    const pg = getPGBuilder<any>()

    pg.query('SomeQuery', (f) => f.string().resolve(() => ''))

    expect(pg.query('SomeQuery', (f) => f.int().resolve(() => 1))).toEqual({
      name: 'SomeQuery',
      field: setOutputFieldMethods({
        kind: 'scalar',
        isRequired: true,
        isList: false,
        isId: false,
        type: 'String',
        resolve: expect.any(Function),
      }),
      kind: 'query',
    })
  })

  describe('subscription', () => {
    it('subscribeに設定した条件で、publishに応じて発火して値が返る', async () => {
      const pubsub = new PubSub()
      const pg = getPGBuilder<any>()

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
    it('同じ名前のSubscriptionは作成できず既存のリソースを返却する', () => {
      const pg = getPGBuilder<any>()
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
          isId: false,
          type: 'String',
          resolve: expect.any(Function),
          subscribe: expect.any(Function),
        }),
        kind: 'subscription',
      })
    })
  })
})