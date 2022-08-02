import { prisma } from '..'
import { pg } from '../builders'
import { user } from '../models/user'
import { Prisma } from '../prisma-client'

user.implement((f) => ({
  fullName: f.fullName.resolve(({ source }) => source.firstName + source.lastName),
  latestPost: f.latestPost.resolve((params) => {
    // NOTE:
    // We use a dataloader to make a single DB call when retrieving the latestPost for multiple users.
    return pg.dataloader(params, async (userList) => {
      // NOTE:
      // "$queryRaw" is not necessary, of course.
      // Since Prisma does not generate the optimal SQL in this situation, we are just writing raw SQL.
      const posts: any[] = await prisma.$queryRaw`
        SELECT *
        FROM "Post"
        WHERE
          "authorId" IN (${Prisma.join(userList.map((x) => x.id))}) AND
          NOT EXISTS (
            SELECT *
            FROM "Post" AS InnerPost
            WHERE InnerPost."authorId" = "Post"."authorId" AND InnerPost."createdAt" > "Post"."createdAt"
          )
      `
      return userList.map((user) => posts.find((x) => x.authorId === user.id) ?? null)
    })
  }),
}))

export const usersQuery = pg.query({
  name: 'users',
  field: (b) =>
    b
      .object(() => user)
      // NOTE:
      // Just call "relay()" to change to a Query that supports pagination.
      // If you want to change the "cursor" or "orderby", you can use "relayCursor()" or "relayOrderBy()" method to adjust them.
      // Also, if you want to add a TotalCount field, you can set it with "relayTotalCount()".
      .relay()
      .relayCursor((node) => ({ id: node.id }))
      .relayOrderBy({ createdAt: 'desc' })
      .relayTotalCount(async () => await prisma.user.count())
      // NOTE:
      // "auth()" method can be used to control permissions.
      // In the following example, only the admin user can call the users query.
      .auth(({ context }) => context.isAdmin)
      .resolve(async ({ prismaArgs }) => {
        return await prisma.user.findMany(prismaArgs)
      }),
})
