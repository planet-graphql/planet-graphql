import { prisma } from '..'
import { inputs, pg } from '../graphql'
import { post, postWithoutRelation } from '../models/post'

export const postQuery = pg.query({
  name: 'post',
  field: (b) =>
    b
      .object(() => post)
      .args((b) => ({
        id: b.int(),
      }))
      .resolve(async ({ args, prismaArgs }) => {
        return await prisma.post.findFirstOrThrow({
          ...prismaArgs,
          where: {
            id: args.id,
          },
        })
      }),
})

export const createPostMutation = pg.mutation({
  name: 'createPost',
  field: (b) =>
    b
      .object(() => postWithoutRelation)
      .args(() =>
        inputs.createOnePost
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
          .build(),
      )
      .resolve(async ({ context, args }) => {
        const created = await prisma.post.create({
          data: {
            ...args.input,
            authorId: context.userId,
          },
        })
        return created
      }),
})