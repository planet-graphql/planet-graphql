import fs from 'fs'
import path from 'path'
import { createServer } from '@graphql-yoga/node'
import { getPGBuilder } from '@planet-graphql/core'
import { getDMMF } from '@prisma/internals'
import { getPGPrismaConverter } from './planet-graphql-types'
import { PrismaClient } from './prisma-client'

async function setupServer() {
  const pg = getPGBuilder()()
  const dmmf = await getDMMF({
    datamodel: fs.readFileSync(path.join(__dirname, '../prisma/schema.prisma'), 'utf8'),
  })
  const pgpc = getPGPrismaConverter(pg, dmmf)
  const prisma = new PrismaClient()
  const { objects, inputs } = pgpc.convert()

  pg.query({
    name: 'users',
    field: (b) =>
      b
        .object(() => objects('User'))
        .prismaArgs(() => inputs('findManyUser').build('FindManyUser', pg))
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
