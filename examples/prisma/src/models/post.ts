import _ from 'lodash'
import { getRelations } from '../'
import { pgpc } from '../graphql'

export const post = pgpc.update({
  name: 'Post',
  fields: (f, b) => ({
    ...f,
    attachments: f.attachments.relay(),
  }),
  relations: () => getRelations('Post'),
})

export const postWithoutRelation = post.copy({
  name: 'PostWithoutRelation',
  fields: (f) => _.omit(f, 'author', 'attachments'),
})
