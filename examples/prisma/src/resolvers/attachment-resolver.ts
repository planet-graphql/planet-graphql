import { prisma } from '..'
import { inputs, pg } from '../graphql'
import { attachment } from '../models/attachment'

export const createAttachmentMutation = pg.mutation({
  name: 'createAttachment',
  field: (b) =>
    b
      .object(() => attachment)
      .args(() =>
        inputs.createOneAttachment
          .edit((f) => ({
            input: f.data.select('AttachmentUncheckedCreateInput').edit((f) => ({
              name: f.name,
              buffer: f.buffer,
              // TODO:
              // Fix PGInputFactory's default
              // to eliminate the need to explicitly select "Json".
              meta: f.meta.select('Json'),
              postId: f.postId,
            })),
          }))
          .build(),
      )
      .resolve(async ({ context, args }) => {
        await prisma.post.findFirstOrThrow({
          where: {
            id: args.input.postId,
            authorId: context.userId,
          },
        })
        // NOTE:
        // Errors may occur depending on the value of meta field.
        // This is a Prisma Client issue.
        // https://github.com/prisma/prisma/issues/14274
        const created = await prisma.attachment.create({
          data: {
            ...args.input,
            size: args.input.buffer.byteLength,
          },
        })
        return created
      }),
})
