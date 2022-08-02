import { omit } from 'lodash'
import { objects } from '../server'

// NOTE: Need immediate function to avoid "Cannot access 'objects' before initialization" error.
export const attachmentWithoutRelation = () =>
  objects.Attachment.copy({
    name: 'AttachmentWithoutRelation',
    fields: (f) => omit(f, 'post'),
  })
