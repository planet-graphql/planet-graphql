import { prisma } from '..'
import { inputs, pg } from '../graphql'
import { user } from '../models/user'

export const usersQuery = pg.query({
  name: 'users',
  field: (b) =>
    b
      .object(() => user)
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
