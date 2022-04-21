import { Decimal, DMMF } from '@prisma/client/runtime'
import { getDMMF } from '@prisma/sdk'
import { graphql, GraphQLError } from 'graphql'
import _ from 'lodash'
import { getPGBuilder } from '..'
import { parseResolveInfo } from '../lib/graphql-parse-resolve-info'
import { PGEnum, PGField, PGModel, TypeOfPGModelBase } from '../types/common'

describe('build', () => {
  let dmmf: DMMF.Document
  beforeAll(async () => {
    const datamodel = /* Prisma */ `
      datasource db {
        provider = "postgresql"
        url      = env("DATABASE_URL")
      }

      model User {
        id            BigInt  @id @default(autoincrement())
        name          String
        income        Decimal
        posts         Post[]
        role          UserRole
      }

      model Post {
        id            Int     @id @default(autoincrement())
        title         String
        userId        BigInt
        user          User    @relation(fields: [userId], references: [id])
      }

      enum UserRole {
        USER
        MANAGER
        ADMIN
      }
    `
    dmmf = await getDMMF({ datamodel })
  })
  it('GraphQLSchemaがbuildされる', async () => {
    const pg = getPGBuilder<any>()
    type UserFieldMapType = {
      id: PGField<bigint>
      name: PGField<string>
      income: PGField<Decimal>
      posts: PGField<Array<PGModel<PostFieldMapType>>>
      role: PGField<PGEnum<UserRoleValuesType>>
    }
    type PostFieldMapType = {
      id: PGField<number>
      title: PGField<string>
      userId: PGField<bigint>
      user: PGField<PGModel<UserFieldMapType>>
    }
    type UserRoleValuesType = ['USER', 'MANAGER', 'ADMIN']
    type PGfyResponseEnums = {
      UserRole: PGEnum<UserRoleValuesType>
    }

    type PGfyResponseModels = {
      User: PGModel<UserFieldMapType>
      Post: PGModel<PostFieldMapType>
    }

    interface PGfyResponse {
      enums: PGfyResponseEnums
      models: PGfyResponseModels
    }
    const pgfyResult = pg.pgfy<PGfyResponse>(dmmf.datamodel)

    const user = pgfyResult.models.User

    const users: Array<TypeOfPGModelBase<typeof user>> = [
      {
        id: 1n,
        name: 'xxx',
        income: new Decimal(100),
        posts: [
          {
            id: 1,
            title: 'xxx',
            userId: 1n,
            user: {
              id: 1n,
              name: 'xxx',
              income: new Decimal(100),
              posts: [],
              role: 'USER',
            },
          },
        ],
        role: 'USER',
      },
      {
        id: 2n,
        name: 'yyy',
        income: new Decimal(1000),
        posts: [],
        role: 'MANAGER',
      },
    ]
    pg.query('findUser', (f) =>
      f
        .object(() => user)
        .args((f) => ({
          id: f.id(),
        }))
        .resolve(({ args, context }) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return users.find((x) => x.id === BigInt(args.id))!
        }),
    )

    pg.mutation('createUser', (f) =>
      f
        .object(() => user)
        .args((f) => ({
          input: f.input(() =>
            pg.input('CreateUserInput', (f) => ({
              name: f.string(),
            })),
          ),
        }))
        .resolve(({ args }) => {
          const user = {
            id: BigInt(_.maxBy(users, (x) => x.id)?.id ?? '0') + 1n,
            income: new Decimal(0),
            name: args.input.name,
            posts: [],
            role: 'USER' as const,
          }
          users.push(user)
          return user
        }),
    )

    const schemaResult = pg.build()

    const query = `
    query {
      findUser(id: "1") {
        id
        name
        income
        posts {
          id
          title
        }
        role
      }
    }
    `

    const mutation = `
    mutation {
      createUser(input: { name: "zzz" }) {
        id
        name
        income
        posts {
          id
        }
        role
      }
    }
    `

    const queryResp = await graphql({
      schema: schemaResult,
      source: query,
      contextValue: {},
    })
    if (queryResp.errors !== undefined) {
      console.log(queryResp)
    }

    const mutationResp = await graphql({
      schema: schemaResult,
      source: mutation,
      contextValue: {},
    })
    if (mutationResp.errors !== undefined) {
      console.log(mutationResp)
    }

    expect(queryResp).toEqual({
      data: {
        findUser: {
          id: '1',
          name: 'xxx',
          income: new Decimal(100),
          posts: [
            {
              id: '1',
              title: 'xxx',
            },
          ],
          role: 'USER',
        },
      },
    })
    expect(mutationResp).toEqual({
      data: {
        createUser: {
          id: '3',
          name: 'zzz',
          income: new Decimal(0),
          posts: [],
          role: 'USER',
        },
      },
    })
  })

  it('graphqlResolveInfoがctxCacheにセットされる', async () => {
    let ctxCache: any
    let resolveInfo: any
    const pg = getPGBuilder<any>()
    pg.query('someQuery', (f) =>
      f.string().resolve((params) => {
        ctxCache = params.context.__cache
        resolveInfo = params.info
        return 'hi'
      }),
    )
    const schema = pg.build()
    const query = `
        query {
          someQuery
        }
      `
    await graphql({ schema, source: query, contextValue: {} })

    expect(ctxCache?.rootResolveInfo).toEqual({
      raw: resolveInfo,
      parsed: parseResolveInfo(resolveInfo),
    })
  })

  describe('Mutationが未定義の場合', () => {
    it('Mutationが未定義でも正常なSchemaがビルドされる', async () => {
      const pg = getPGBuilder()
      pg.query('someQuery', (f) => f.string().resolve(() => 'hi'))
      const schema = pg.build()
      const query = `
        query {
          someQuery
        }
      `
      const resp = await graphql({ schema, source: query, contextValue: {} })
      expect(resp).toEqual({ data: { someQuery: 'hi' } })
    })
  })

  describe('Queryが未定義の場合', () => {
    it('GraphQL.jsの実装上Queryは最低1つ必要なのでエラーが返る。', async () => {
      const pg = getPGBuilder()
      pg.mutation('someMutation', (f) => f.string().resolve(() => 'hi'))
      const schema = pg.build()
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
