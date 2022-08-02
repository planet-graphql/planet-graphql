import { omit } from 'lodash'
import { pgpc } from '../builders'
import { getRelations } from '../server'

export const post = pgpc.redefine({
  name: 'Post',
  fields: (f) => ({
    ...f,
    attachments: f.attachments.relay(),
  }),
  relations: () => getRelations('Post'),
})

export const postWithoutRelation = post.copy({
  name: 'PostWithoutRelation',
  fields: (f) => omit(f, 'author', 'attachments'),
})
