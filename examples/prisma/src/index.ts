import { createServer } from '@graphql-yoga/node'
import { getPGBuilder } from '@planet-graphql/core'
import { dmmf, getPGPrismaConverter } from './planet-graphql-types'
import { PrismaClient } from './prisma-client'
import type { PrismaTypes } from './planet-graphql-types'

const pg = getPGBuilder<{ Prisma: PrismaTypes }>()()
const pgpc = getPGPrismaConverter(pg, dmmf)
const prisma = new PrismaClient()
const { objects, inputs } = pgpc.convert()

pg.mutation({
  name: 'createAttachment',
  field: (b) =>
    b
      .object(() => objects('Attachment'))
      .args(() => ({
        input: inputs('createOneAttachment').build('CreateOneAttachment', pg, true),
      }))
      .resolve(({ args }) => {
        return prisma.attachment.create(args.input)
      }),
})

pg.query({
  name: 'attachments',
  field: (b) =>
    b
      .object(() => objects('Attachment'))
      .prismaArgs(() =>
        inputs('findManyAttachment')
          .edit((f) => ({
            where: f.where,
          }))
          .build('FindManyAttachment', pg),
      )
      .list()
      .resolve(({ prismaArgs }) => {
        return prisma.attachment.findMany(prismaArgs)
      }),
})

const server = createServer({
  schema: pg.build(),
})

server.start().catch((error) => console.log(error))
