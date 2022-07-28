import { prisma } from '..'
import { inputs, pg } from '../graphql'
import { user } from '../models/user'
import { Prisma } from '../prisma-client'

user.modify((f) => ({
  fullName: f.fullName.resolve(({ source }) => source.firstName + source.lastName),
  latestPost: f.latestPost.resolve((params) => {
    return pg.dataloader(params, async (list) => {
      const posts: any[] = await prisma.$queryRaw`
        SELECT *
        FROM "Post"
        WHERE
          "authorId" IN (${Prisma.join(list.map((x) => x.id))}) AND
          NOT EXISTS (
            SELECT *
            FROM "Post" AS InnerPost
            WHERE InnerPost."authorId" = "Post"."authorId" AND InnerPost."createdAt" > "Post"."createdAt"
          )
      `
      return list.map((user) => posts.find((x) => x.authorId === user.id) ?? null)
    })
  }),
}))

export const usersQuery = pg.query({
  name: 'users',
  field: (b) =>
    b
      .object(() => user)
      .auth(({ context }) => context.isAdmin)
      .relay()
      .prismaArgs(() =>
        inputs.findManyUser
          .edit((f) => ({
            where: f.where,
            orderBy: f.orderBy,
          }))
          .build(),
      )
      .resolve(async (params) => {
        return await prisma.user.findMany(params.prismaArgs)
      }),
})
