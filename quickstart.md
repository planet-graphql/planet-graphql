# Quickstart

PlanetGraphQL relies on Prisma, so it is assumed that you understand the basic usage of Prisma.

## Install & Setup

```sh
npm install @planet-graphql/planet-graphql
```

Make sure that strict mode in tsconfig.json is set to true. This is to ensure that PlanetGraphQL type inference works correctly.

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

Add a new generator to schema.prisma to generate the type information needed by PlanetGraphQL.

```prisma
generator PlanetGraphQL {
  provider = "planet-graphql"
}
```

## Set up the builder & Convert your prisma schema to GraphQL types

```ts
import { Prisma, PrismaClient } from '@prisma/client'
import { getPGBuilder, PGfyResponse } from '@planet-graphql/planet-graphql'

interface GraphQLContext {
  prisma: PrismaClient
}

const pg = getPGBuilder<GraphQLContext>()
const { models, enums } = pg.pgfy<PGfyResponse>(Prisma.dmmf.datamodel)
```

## Modifying GraphQL types

```ts
const user = pg.objectFromModel(models.User, (keep, f) => ({
  ...keep,
  fullName: f.string().resolve(({ source }) => `${source.fistName} ${source.lastName}`)
})
```

## Define queries

```ts
import { Prisma, PrismaClient } from '@prisma/client'

const findUsersArgs = pg.prismaFindArgs<Prisma.UserFindManyArgs>('FindUsers')({
  where: {
    email: {
      contains: 'String',
    },
  },
})

pg.query('users', (f) =>
  f
    .object(() => user)
    .list()
    .args(() => findUsersArgs)
    .resolve(async (params) => {
      const findArgs = pg.prismaFindArgs<Prisma.UserFindManyArgs>(user, params)
      return await params.context.prisma.user.findMany(findArgs)
    }),
)
```

## Start your server

```ts
const server = new ApolloServer({
  schema: pg.build(),
  context: { prisma: new PrismaClient() },
})

server.start()
```
