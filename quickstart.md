# Quickstart

PrismaGQL relies on Prisma, so it is assumed that you understand the basic usage of Prisma.

## Install & Setup

```sh
npm install @prismagql/prismagql
```

Make sure that strict mode in tsconfig.json is set to true. This is to ensure that PrismaGQL type inference works correctly.

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

Add a new generator to schema.prisma to generate the type information needed by PrismaGQL.

```prisma
generator PrismaGQL {
  provider = "prismagql"
}
```

## Set up the builder & Convert your prisma schema to GraphQL types

```ts
import { Prisma, PrismaClient } from '@prisma/client'
import { getPGBuilder, PGfyResponse } from '@prismagql/prismagql'

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
