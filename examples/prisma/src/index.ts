import fs from 'fs'
import path from 'path'
import { createServer } from '@graphql-yoga/node'
import { getPGBuilder } from '@planet-graphql/core'
import { getDMMF } from '@prisma/internals'
import { getPGPrismaConverter } from './planet-graphql-types'
import { PrismaClient } from './prisma-client'
import type { PrismaTypes } from './planet-graphql-types'

async function setupServer() {
  const pg = getPGBuilder<{ Prisma: PrismaTypes }>()()
  const dmmf = await getDMMF({
    datamodel: fs.readFileSync(path.join(__dirname, '../prisma/schema.prisma'), 'utf8'),
  })
  const pgpc = getPGPrismaConverter(pg, dmmf)
  const prisma = new PrismaClient()
  const { objects, inputs, relations } = pgpc.convert({
    User: () => user,
  })

  const user = pgpc.update({
    name: 'User',
    fields: (f, b) => ({
      ...f,
      latestPost: b.object(() => objects('Post')),
    }),
    relations: relations('User'),
  })

  user.modify((f) => ({
    latestPost: f.latestPost.resolve(({ source }) => {
      return source.posts[0]
    }),
  }))

  pg.query({
    name: 'users',
    field: (b) =>
      b
        .object(() => objects('User'))
        .prismaArgs(() =>
          inputs('findManyUser')
            .edit((f) => ({
              where: f.where,
            }))
            .build('FindManyUser', pg),
        )
        .list()
        .resolve(async ({ prismaArgs }) => {
          return await prisma.user.findMany(prismaArgs)
        }),
  })

  const server = createServer({
    schema: pg.build(),
  })

  await server.start()
}

setupServer()
