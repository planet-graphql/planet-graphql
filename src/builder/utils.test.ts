import { graphql } from 'graphql'
import _ from 'lodash'
import { z } from 'zod'
import { getPGBuilder } from '..'
import { PGError } from './utils'

describe('PGOutputField', () => {
  describe('auth', () => {
    it('Sets the passed function to authChecker', () => {
      const pg = getPGBuilder<{
        Context: { user: { roles: Array<'Admin' | 'LoginUser'> } }
        PGGeneratedType: any
      }>()()

      const post = pg.object('Post', (f) => ({
        id: f.id().auth(({ ctx }) => ctx.user.roles.includes('Admin')),
      }))

      expect(
        post.fieldMap.id.value.authChecker?.({
          ctx: {
            user: {
              roles: ['Admin'],
            },
          },
          args: undefined as never,
        }),
      ).toEqual(true)
    })
  })
  describe('accessControlWrapper', () => {
    it('Controls authorization according to the rules set in authChecker', async () => {
      const users = [
        {
          id: '1',
          age: 28,
          posts: [
            {
              id: '1',
              title: 'xxx',
              userId: '1',
              config: 'xxx',
            },
            {
              id: '2',
              title: 'yyy',
              userId: '1',
              config: 'yyy',
            },
          ],
          latestPost: null,
        },
        {
          id: '2',
          age: 30,
          posts: [],
          latestPost: null,
        },
      ]

      const pg = getPGBuilder<{
        Context: { user: { roles: Array<'LoginUser' | 'Admin'> } }
        PGGeneratedType: any
      }>()()

      const user = pg.object('User', (f) => ({
        id: f.id(),
        age: f
          .int()
          .nullable()
          .auth(({ ctx }) => true),
        posts: f
          .object(() => post)
          .list()
          .auth(({ ctx }) => ctx.user.roles.includes('Admin')),
        latestPost: f
          .object(() => post)
          .nullable()
          .auth(({ ctx }) => true),
      }))

      const post = pg.object('Post', (f) => ({
        id: f.id(),
        title: f.string().auth(({ ctx }) => true),
        userId: f.string(),
        config: f
          .string()
          .nullable()
          .auth(({ ctx }) => ctx.user.roles.includes('Admin')),
      }))

      pg.resolver(user, {
        latestPost: ({ source }) => {
          return _.maxBy(source.posts, (post) => Number(post.id)) ?? null
        },
      })

      pg.query('findUsers', (f) =>
        f
          .object(() => user)
          .list()
          .resolve(() => users),
      )

      const schemaResult = pg.build()

      const query = `
      query {
        findUsers {
          id
          age
          posts {
            id
            title
            userId
            config
          }
          latestPost {
            id
            title
            userId
            config
          }
        }
      }
      `

      const loginUserQueryResp = await graphql({
        schema: schemaResult,
        source: query,
        contextValue: { user: { roles: ['LoginUser'] } },
      })
      if (loginUserQueryResp.errors !== undefined) {
        console.log(loginUserQueryResp)
      }

      expect(loginUserQueryResp).toEqual({
        data: {
          findUsers: [
            {
              id: '1',
              age: 28,
              posts: [],
              latestPost: {
                id: '2',
                title: 'yyy',
                userId: '1',
                config: null,
              },
            },
            {
              id: '2',
              age: 30,
              posts: [],
              latestPost: null,
            },
          ],
        },
      })

      const adminQueryResp = await graphql({
        schema: schemaResult,
        source: query,
        contextValue: { user: { roles: ['Admin'] } },
      })
      if (adminQueryResp.errors !== undefined) {
        console.log(adminQueryResp)
      }

      expect(adminQueryResp).toEqual({
        data: {
          findUsers: [
            {
              id: '1',
              age: 28,
              posts: [
                {
                  id: '1',
                  title: 'xxx',
                  userId: '1',
                  config: 'xxx',
                },
                {
                  id: '2',
                  title: 'yyy',
                  userId: '1',
                  config: 'yyy',
                },
              ],
              latestPost: {
                id: '2',
                title: 'yyy',
                userId: '1',
                config: 'yyy',
              },
            },
            {
              id: '2',
              age: 30,
              posts: [],
              latestPost: null,
            },
          ],
        },
      })
    })

    it('Returns an error if there is a non-nullable field that cannot be referenced', async () => {
      const users = [
        {
          id: '1',
          config: 'xxx',
        },
      ]

      const pg = getPGBuilder<{
        Context: { user: { roles: Array<'LoginUser' | 'Admin'> } }
        PGGeneratedType: any
      }>()()

      const user = pg.object('User', (f) => ({
        id: f.id(),
        config: f.string().auth(({ ctx }) => ctx.user.roles.includes('Admin')),
      }))

      pg.query('findUsers', (f) =>
        f
          .object(() => user)
          .list()
          .resolve(() => users),
      )

      const schemaResult = pg.build()

      const query = `
      query {
        findUsers {
          id
          config
        }
      }
      `

      const loginUserQueryResp = await graphql({
        schema: schemaResult,
        source: query,
        contextValue: { user: { roles: ['LoginUser'] } },
      })

      expect(loginUserQueryResp.data).toEqual(null)

      const originalErrors = loginUserQueryResp.errors?.[0].originalError
      expect(originalErrors).toBeInstanceOf(PGError)
      expect(originalErrors?.message).toEqual(
        'GraphQL permission denied. Field: User.config',
      )
      expect((originalErrors as PGError).code).toEqual('AuthError')
    })
  })
})

describe('PGInput', () => {
  describe('validation', () => {
    it('Sets the passed function to validationBuilder', () => {
      const pg = getPGBuilder<{
        Context: { user: { roles: Array<'Admin' | 'LoginUser'> } }
        PGGeneratedType: any
      }>()()

      const findUser = pg
        .input('FindUser', (f) => ({
          password: f.string(),
          confirmPassword: f.string(),
        }))
        .validation((value, ctx) => {
          return ctx.user.roles.includes('Admin')
            ? true
            : value.password === value.confirmPassword
        })

      const validator = findUser.value.validatorBuilder
      const context = {
        user: {
          roles: ['LoginUser' as const],
        },
      }
      expect(
        validator?.(
          {
            password: 'xxx',
            confirmPassword: 'xxx',
          },
          context,
        ),
      ).toBe(true)
      expect(
        validator?.(
          {
            password: 'xxx',
            confirmPassword: 'yyy',
          },
          context,
        ),
      ).toBe(false)
    })

    it('Validates according to the rules set in the validationBuilder', async () => {
      const pg = getPGBuilder<{
        Context: { user: { roles: Array<'Admin' | 'LoginUser'> } }
        PGGeneratedType: any
      }>()()

      const contents = [
        {
          id: '1',
          name: 'bbb',
          password: 'xyz',
        },
        {
          id: '2',
          name: 'aaa',
          password: 'abc',
        },
        {
          id: '3',
          name: 'aaa',
          password: 'abc',
        },
      ]

      const content = pg.object('Content', (f) => ({
        id: f.id(),
        name: f.string(),
        password: f.string(),
        confirmPassword: f.string(),
      }))

      const contentInput = pg
        .input('ContentInput', (f) => ({
          id: f.id(),
          password: f.string(),
          confirmPassword: f.string(),
        }))
        .validation((value, ctx) => {
          return ctx.user.roles.includes('Admin')
            ? true
            : value.password === value.confirmPassword
        })

      const orderByInput = pg
        .input('OrderByInput', (f) => ({
          id: f.string().nullish(),
          name: f.string().nullish(),
        }))
        .validation((value, ctx) => {
          return value.id != null || value.name != null
        })

      pg.query('findContents', (f) =>
        f
          .object(() => content)
          .list()
          .args((f) => ({
            passCheck: f.input(() => contentInput).nullish(),
            orderBy: f
              .input(() => orderByInput)
              .list()
              .nullish(),
          }))
          .resolve(({ args }) => {
            const resultContents =
              args.passCheck == null
                ? contents
                : contents.filter(
                    (x) =>
                      args.passCheck?.id === x.id &&
                      args.passCheck?.password === x.password,
                  ) ?? []

            if (args.orderBy?.[0].id != null) {
              resultContents.sort(function (a, b) {
                if (a.id < b.id) {
                  return args.orderBy?.[0].id === 'asc' ? -1 : 1
                }
                if (a.id > b.id) {
                  return args.orderBy?.[0].id === 'asc' ? 1 : -1
                }
                if (a.id === b.id) {
                  const nameA = a.name.toUpperCase()
                  const nameB = b.name.toUpperCase()
                  if (nameA < nameB) {
                    return args.orderBy?.[1].name === 'asc' ? -1 : 1
                  }
                  if (nameA > nameB) {
                    return args.orderBy?.[1].name === 'asc' ? 1 : -1
                  }
                }
                return 0
              })
            }
            if (args.orderBy?.[0].name != null) {
              resultContents.sort(function (a, b) {
                const nameA = a.name.toUpperCase()
                const nameB = b.name.toUpperCase()
                if (nameA < nameB) {
                  return args.orderBy?.[0].name === 'asc' ? -1 : 1
                }
                if (nameA > nameB) {
                  return args.orderBy?.[0].name === 'asc' ? 1 : -1
                }
                if (nameA === nameB) {
                  if (a.id < b.id) {
                    return args.orderBy?.[1].id === 'asc' ? -1 : 1
                  } else {
                    return args.orderBy?.[1].id === 'asc' ? 1 : -1
                  }
                }
                return 0
              })
            }
            return resultContents
          }),
      )

      const schemaResult = pg.build()

      const adminFindAllQuery = `
      query {
        findContents(
          orderBy: [
            { name: "asc" },
            { id: "asc" }
          ]
        ) {
          id
          name
        }
      }
      `

      const adminFindAllQueryResp = await graphql({
        schema: schemaResult,
        source: adminFindAllQuery,
        contextValue: { user: { roles: ['Admin'] } },
      })

      expect(adminFindAllQueryResp).toEqual({
        data: {
          findContents: [
            {
              id: '2',
              name: 'aaa',
            },
            {
              id: '3',
              name: 'aaa',
            },
            {
              id: '1',
              name: 'bbb',
            },
          ],
        },
      })

      const adminNormalQuery = `
      query {
        findContents(
          passCheck: {
            id: "1"
            password: "xyz"
            confirmPassword: ""
          }
        ) {
          id
        }
      }
      `

      const adminNormalQueryResp = await graphql({
        schema: schemaResult,
        source: adminNormalQuery,
        contextValue: { user: { roles: ['Admin'] } },
      })

      expect(adminNormalQueryResp).toEqual({
        data: {
          findContents: [
            {
              id: '1',
            },
          ],
        },
      })

      const loginUserNormalQuery = `
      query {
        findContents(
          passCheck: {
            id: "1"
            password: "xyz"
            confirmPassword: "xyz"
          }
        ) {
          id
        }
      }
      `

      const loginUserNormalQueryResp = await graphql({
        schema: schemaResult,
        source: loginUserNormalQuery,
        contextValue: { user: { roles: ['LoginUser'] } },
      })

      expect(loginUserNormalQueryResp).toEqual({
        data: {
          findContents: [
            {
              id: '1',
            },
          ],
        },
      })

      const loginUserIrregularQuery = `
      query {
        findContents(
          passCheck: {
            id: "1"
            password: "xyz"
            confirmPassword: "abc"
          }
        ) {
          id
        }
      }
      `

      const loginUserIrregularQueryResp = await graphql({
        schema: schemaResult,
        source: loginUserIrregularQuery,
        contextValue: { user: { roles: ['LoginUser'] } },
      })

      expect(loginUserIrregularQueryResp.data).toEqual(null)

      const loginUserIrregularQueryOriginalErrors =
        loginUserIrregularQueryResp.errors?.[0].originalError
      expect(loginUserIrregularQueryOriginalErrors).toBeInstanceOf(PGError)
      expect(loginUserIrregularQueryOriginalErrors?.message).toEqual('Invalid args.')
      expect((loginUserIrregularQueryOriginalErrors as PGError).code).toEqual(
        'ValidationError',
      )
      expect((loginUserIrregularQueryOriginalErrors as PGError).detail).toEqual(
        '[{"path":"findContents.passCheck"}]',
      )
    })
  })
})

describe('PGInputField', () => {
  describe('validation', () => {
    it('Sets the passed function to validationBuilder', () => {
      const pg = getPGBuilder<{
        Context: { user: { roles: Array<'Admin' | 'LoginUser'> } }
        PGGeneratedType: any
      }>()()

      const someInput = pg.input('SomeInput', (f) => ({
        id: f
          .id()
          .nullish()
          .validation((scheme, ctx) =>
            ctx.user.roles.includes('Admin') ? scheme.min(5) : z.null(),
          ),
      }))

      const validator = someInput.fieldMap.id.value.validatorBuilder?.(z.string(), {
        user: {
          roles: ['Admin'],
        },
      })

      expect(validator?.parse('abcde')).toEqual('abcde')
      expect(() => validator?.parse('abcd')).toThrow()
    })

    it('Validates according to the rules set in the validationBuilder', async () => {
      const pg = getPGBuilder<{
        Context: { user: { roles: Array<'Admin' | 'LoginUser'> } }
        PGGeneratedType: any
      }>()()
      const users = [
        {
          id: '1',
          name: 'xyz',
          age: 28,
          latestPost: {
            title: '123456',
          },
        },
        {
          id: '2',
          name: 'abcdefg',
          age: 18,
          latestPost: {
            title: '1234567',
          },
        },
      ]

      const user = pg.object('User', (f) => ({
        id: f.id(),
        name: f.string(),
        age: f.int(),
        latestPost: f
          .object(() => post)
          .args((f) => ({
            titleName: f
              .string()
              .nullish()
              .validation((schema, ctx) => schema.max(6)),
          }))
          .nullable()
          .resolve(({ source, args }) => {
            return args.titleName === source.latestPost.title ? source.latestPost : null
          }),
      }))

      const post = pg.object('Post', (f) => ({
        title: f.string(),
      }))

      const userProfileInput = pg.input('UserProfileInput', (f) => ({
        age: f
          .int()
          .nullish()
          .validation((schema, ctx) =>
            ctx.user.roles.includes('Admin') ? schema.min(20) : z.null(),
          ),
      }))

      pg.query('findUsers', (f) =>
        f
          .object(() => user)
          .list()
          .args((f) => ({
            name: f.string().validation((schema, ctx) => schema.max(6)),
            profile: f.input(() => userProfileInput).nullish(),
          }))
          .resolve(({ args }) => {
            return users.filter((x) => args.name === x.name) ?? []
          }),
      )

      const schemaResult = pg.build()

      const adminNormalQuery = `
      query {
        findUsers(
          name: "xyz"
          profile: {
            age: 28
          }
        ) {
          id
          name
          age
          latestPost(
            titleName: "123456"
          ){
            title
          }
        }
      }
      `

      const adminNormalQueryResp = await graphql({
        schema: schemaResult,
        source: adminNormalQuery,
        contextValue: { user: { roles: ['Admin'] } },
      })

      expect(adminNormalQueryResp).toEqual({
        data: {
          findUsers: [
            {
              id: '1',
              name: 'xyz',
              age: 28,
              latestPost: {
                title: '123456',
              },
            },
          ],
        },
      })

      const adminIrregularQuery = `
      query {
        findUsers(
          name: "abcdefg"
          profile: {
            age: 18
          }
        ) {
          id
          name
          age
          latestPost(
            titleName: "1234567"
          ){
            title
          }
        }
      }
      `

      const adminIrregularQueryResp = await graphql({
        schema: schemaResult,
        source: adminIrregularQuery,
        contextValue: { user: { roles: ['Admin'] } },
      })

      expect(adminIrregularQueryResp.data).toEqual(null)

      const adminIrregularQueryOriginalErrors =
        adminIrregularQueryResp.errors?.[0].originalError
      expect(adminIrregularQueryOriginalErrors).toBeInstanceOf(PGError)
      expect(adminIrregularQueryOriginalErrors?.message).toEqual('Invalid args.')
      expect((adminIrregularQueryOriginalErrors as PGError).code).toEqual(
        'ValidationError',
      )
      expect((adminIrregularQueryOriginalErrors as PGError).detail).toEqual(
        '[' +
          '{"path":"findUsers.name","issues":[{"code":"too_big","maximum":6,"type":"string","inclusive":true,"message":"String must contain at most 6 character(s)","path":[]}]},' +
          '{"path":"findUsers.profile.age","issues":[{"code":"too_small","minimum":20,"type":"number","inclusive":true,"message":"Number must be greater than or equal to 20","path":[]}]},' +
          '{"path":"findUsers.latestPost.titleName","issues":[{"code":"too_big","maximum":6,"type":"string","inclusive":true,"message":"String must contain at most 6 character(s)","path":[]}]}' +
          ']',
      )

      const loginUserNormalQuery = `
      query {
        findUsers(
          name: "xyz"
        ) {
          id
          name
          age
        }
      }
      `

      const loginUserNormalQueryResp = await graphql({
        schema: schemaResult,
        source: loginUserNormalQuery,
        contextValue: { user: { roles: ['LoginUser'] } },
      })

      expect(loginUserNormalQueryResp).toEqual({
        data: {
          findUsers: [
            {
              id: '1',
              name: 'xyz',
              age: 28,
            },
          ],
        },
      })

      const loginUserIrregularQuery = `
      query {
        findUsers(
          name: "xyz"
          profile: {
            age: 28
          }
        ) {
          id
          name
          age
        }
      }
      `

      const loginUserIrregularQueryResp = await graphql({
        schema: schemaResult,
        source: loginUserIrregularQuery,
        contextValue: { user: { roles: ['LoginUser'] } },
      })

      expect(loginUserIrregularQueryResp.data).toEqual(null)

      const loginUserIrregularQueryOriginalErrors =
        loginUserIrregularQueryResp.errors?.[0].originalError
      expect(loginUserIrregularQueryOriginalErrors).toBeInstanceOf(PGError)
      expect(loginUserIrregularQueryOriginalErrors?.message).toEqual('Invalid args.')
      expect((loginUserIrregularQueryOriginalErrors as PGError).code).toEqual(
        'ValidationError',
      )
      expect((loginUserIrregularQueryOriginalErrors as PGError).detail).toEqual(
        '[{"path":"findUsers.profile.age","issues":[{"code":"invalid_type","expected":"null","received":"number","path":[],"message":"Expected null, received number"}]}]',
      )
    })
  })
})
