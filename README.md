# PlanetGraphQL

PlanetGraphQL is a GraphQL Schema builder designed to work well with [Prisma](https://github.com/prisma/prisma).  
It aims to be simple, type-safe and customizable for real-world products.

## Getting started

The fastest way to get started with PlanetGraphQL is to check out our examples:

- [With Prisma](https://github.com/planet-graphql/planet-graphql/tree/master/examples/prisma)
- [Simple (Without Prisma)](https://github.com/planet-graphql/planet-graphql/tree/master/examples/simple)

## Install & Setup

```sh
npm install @planet-graphql/core
```

And add a new generator to your schema.prisma.

```prisma
generator pg {
  provider = "planet-graphql"
}
```

## Notable Features

### Quickly create a GraphQL schema based on your Prisma models & It is fully customizable

Objects schema in GraphQL can be adjusted using the "redefine" method.
The arg "f" has fields defined in your Prisma schema.
Fields can be added or omitted as below.

```ts
export const user = pgpc.redefine({
  name: 'User',
  fields: (f, b) => ({
    ...omit(f, 'email'),
    fullName: b.string(),
    latestPost: b.object(() => post).nullable(),
  }),
})
```

[See more details in the example.](https://github.com/planet-graphql/planet-graphql/blob/master/examples/prisma/src/models/user.ts)

### Automatically generating Prisma args from GraphQL queries (solves N+1 problems)

PlanetGraphQL provides "prismaArgs" argument in addition to the usual GraphQL.js arguments when resolving.
This "prismaArgs" contains the Prisma's "include" arg automatically generated from the GraphQL query.

```ts
export const usersQuery = pg.query({
  name: 'users',
  field: (b) =>
    b
      .object(() => user)
      .lits()
      .resolve(async ({ prismaArgs }) => {
        return await prisma.user.findMany(prismaArgs)
      }),
})
```

If the following query is received,

```graphql
query {
  users {
    id
    fullName
    posts {
      id
      title
    }
  }
}
```

the value of "prismaArgs" will look like this:

```ts
{
  include: {
    posts: true
  }
}
```

### Easily generate GraphQL inputs that can be passed to Prisma

PGArgBuilder allows you to convert familiar Prisma args into GraphQL Input types.
Furthermore, you can add validations and default values, and omit unnecessary fields.

```ts
args.createOnePost
  .edit((f) => ({
    input: f.data
      .select('PostUncheckedCreateInput')
      .edit((f) => ({
        title: f.title.validation((schema) => schema.max(20)),
        content: f.content,
        isPublic: f.isPublic.default(true),
      }))
      .validation((value) => {
        return !(value.title.length === 0 && value.isPublic)
      }),
  }))
  .build()
```

In addition, when combined with the PrismaArgs method, Prisma args can be converted to GraphQL args.
If you define "where" args as follows,

```ts
export const postQuery = pg.query({
  name: 'post',
  field: (b) =>
    b
      .object(() => post)
      .prismaArgs(() =>
        args.findFirstPost
          .edit((f) => ({
            where: f.where,
          }))
          .build(),
      )
      .resolve(async ({ prismaArgs }) => {
        return await prisma.post.findFirstOrThrow(prismaArgs)
      }),
})
```

now you can call query like this:

```graphql
query {
  post(
    where: {
      AND: {
        title: { contains: "typescript" }
        author: { is: { email: { equals: "someone@example.com" } } }
      }
    }
  ) {
    id
    title
    author {
      fullName
    }
  }
}
```

[See more details in the example.](https://github.com/planet-graphql/planet-graphql/blob/master/examples/prisma/src/resolvers/post-resolvers.ts)

## Built in tools you will allways need

We are aiming to cover the basic tools you will need for GraphQL.
Please check out the examples to see exactly how they are used.

- [pagination(relay)](https://github.com/planet-graphql/planet-graphql/blob/master/examples/prisma/src/resolvers/user-resolvers.ts#L36)
- [dataloader](https://github.com/planet-graphql/planet-graphql/blob/master/examples/prisma/src/resolvers/user-resolvers.ts#L8)
- [input validation](https://github.com/planet-graphql/planet-graphql/blob/master/examples/prisma/src/resolvers/post-resolvers.ts#L33)
- [auth control](https://github.com/planet-graphql/planet-graphql/blob/master/examples/prisma/src/resolvers/user-resolvers.ts#L44)

## Roadmap

- [ ] Better documentation
