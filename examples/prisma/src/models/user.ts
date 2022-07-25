import { prisma, getRelations } from '../'
import { inputs, pg, pgpc } from '../graphql'
import { post, postWithoutRelation } from './post'

export const user = pgpc
  .update({
    name: 'User',
    fields: (f, b) => ({
      ...f,
      posts: b
        .relation(() => post)
        .list()
        .prismaArgs(() => inputs.findManyPost.build()),
      fullName: b.string(),
      latestPost: b.object(() => postWithoutRelation).nullable(),
    }),
    relations: () => getRelations('User'),
  })
  .modify((f) => ({
    fullName: f.fullName.resolve(({ source }) => source.firstName + source.lastName),
    latestPost: f.latestPost.resolve((params) => {
      return pg.dataloader(params, async (list) => {
        const posts: any[] = await prisma.$queryRaw`
          select *
          from Post
          where
            authorId in (${list.map((x) => x.id).join(',')}) and
            not exists (
              select *
              from Post as InnerPost
              where InnerPost.authorId = Post.authorId AND InnerPost.createdAt > Post.createdAt
            )
        `
        return list.map((user) => posts.find((x) => x.authorId === user.id) ?? null)
      })
    }),
  }))
