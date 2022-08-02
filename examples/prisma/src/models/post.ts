import _ from 'lodash'
import { getRelations } from '../'
import { pgpc } from '../builders'

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
  fields: (f) => _.omit(f, 'author', 'attachments'),
})
