import _ from 'lodash'
import { objects } from '..'

// NOTE: Need immediate function to avoid "Cannot access 'objects' before initialization" error.
export const attachmentWithoutRelation = () =>
  objects.Attachment.copy({
    name: 'AttachmentWithoutRelation',
    fields: (f) => _.omit(f, 'post'),
  })
