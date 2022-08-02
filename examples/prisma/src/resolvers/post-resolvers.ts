import { args, pg } from '../builders'
import { post, postWithoutRelation } from '../models/post'
import { prisma } from '../server'

export const postsQuery = pg.query({
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

export const createPostMutation = pg.mutation({
  name: 'createPost',
  field: (b) =>
    b
      .object(() => postWithoutRelation)
      .args(() =>
        args.createOnePost
          .edit((f) => ({
            input: f.data
              .select('PostUncheckedCreateInput')
              .edit((f) => ({
                // NOTE:
                // Validations for each field can be defined by Zod's Schema.
                title: f.title.validation((schema) => schema.max(20)),
                content: f.content,
                isPublic: f.isPublic.default(true),
              }))
              // NOTE: Cross-field validation for input types can also be defined with a function that returns a boolean.
              .validation((value) => {
                return !(value.title.length === 0 && value.isPublic)
              }),
          }))
          // NOTE:
          // If you remove "{ type: true }", the type is no longer inferred.
          // The reason "{ type: true }" is not the default is that type inference in PGArgsBuilder is very expensive.
          // Sometimes, it may exceed the limits of TypeScript and cause errors.
          // Therefore, you should specify "{ type: true }" only when you need the type information.
          .build({ type: true }),
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
