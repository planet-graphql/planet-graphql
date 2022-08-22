import { args, pg } from '../builders'
import { attachmentWithoutRelation } from '../models/attachment'
import { prisma } from '../server'

export const createAttachmentMutation = pg.mutation({
  name: 'createAttachment',
  field: (b) =>
    b
      .object(attachmentWithoutRelation)
      .args(() =>
        args.createOneAttachment
          .edit((f) => ({
            input: f.data.select('AttachmentUncheckedCreateInput').edit((f) => ({
              name: f.name,
              buffer: f.buffer,
              meta: f.meta,
              postId: f.postId,
            })),
          }))
          .build({ type: true }),
      )
      .resolve(async ({ context, args }) => {
        await prisma.post.findFirstOrThrow({
          where: {
            id: args.input.postId,
            authorId: context.userId,
          },
        })
        const created = await prisma.attachment.create({
          data: {
            ...args.input,
            size: args.input.buffer.byteLength,
          },
        })
        return created
      }),
})
