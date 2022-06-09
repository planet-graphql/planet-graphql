import { Decimal, DMMF } from '@prisma/client/runtime'
import { getDMMF } from '@prisma/sdk'
import { graphql, GraphQLError } from 'graphql'
import _ from 'lodash'
import { getPGBuilder } from '..'
import { PGfyResponseType, PGTypes } from '../types/builder'
import { PGEnum, PGModel } from '../types/common'
import { PGObject, PGOutputField } from '../types/output'

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
  it('Builds a GraphQLSchema', async () => {
    type UserFieldMapType<Types extends PGTypes> = {
      id: PGOutputField<bigint, any, undefined, undefined, Types>
      name: PGOutputField<string, any, undefined, undefined, Types>
      income: PGOutputField<Decimal, any, undefined, undefined, Types>
      posts: PGOutputField<
        Array<PGModel<PostFieldMapType<Types>>>,
        any,
        undefined,
        undefined,
        Types
      >
      role: PGOutputField<PGEnum<UserRoleValuesType>, any, undefined, undefined, Types>
    }
    type PostFieldMapType<Types extends PGTypes> = {
      id: PGOutputField<number, any, undefined, undefined, Types>
      title: PGOutputField<string, any, undefined, undefined, Types>
      userId: PGOutputField<bigint, any, undefined, undefined, Types>
      user: PGOutputField<
        PGObject<UserFieldMapType<Types>, 'User', Types>,
        any,
        undefined,
        undefined,
        Types
      >
    }
    type UserRoleValuesType = ['USER', 'MANAGER', 'ADMIN']
    type PGfyResponseEnums = {
      UserRole: PGEnum<UserRoleValuesType>
    }

    type PGfyResponseObjects<Types extends PGTypes> = {
      User: PGObject<UserFieldMapType<Types>, 'User', Types>
      Post: PGObject<PostFieldMapType<Types>, 'Post', Types>
    }

    interface PGfyResponse<Types extends PGTypes> extends PGfyResponseType<Types> {
      enums: PGfyResponseEnums
      objects: PGfyResponseObjects<Types>
      models: {}
    }

    type TypeConfig = {
      Context: any
      GeneratedType: <T extends PGTypes>(arg: T) => PGfyResponse<T>
    }

    const pg = getPGBuilder<TypeConfig>()()
    const pgfyResult = pg.pgfy(dmmf)

    const user = pgfyResult.objects.User

    const users = [
      {
        id: 1n,
        name: 'xxx',
        income: new Decimal(100),
        posts: [],
        role: 'USER' as const,
      },
      {
        id: 2n,
        name: 'yyy',
        income: new Decimal(1000),
        posts: [],
        role: 'MANAGER' as const,
      },
    ]
    pg.query('findUser', (f) =>
      f
        .object(() => user)
        .args((f) => ({
          id: f.id(),
        }))
        .resolve(({ args }) => {
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
          posts: [],
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

  describe('No Mutation is defined', () => {
    it('Builds a GraphQLSchema', async () => {
      const pg = getPGBuilder()()
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

  describe('No Query is defined', () => {
    it('Returns errors because GraphQL.js requires at least one Query', async () => {
      const pg = getPGBuilder()()
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
