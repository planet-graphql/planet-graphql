import { getRelations } from '../'
import { inputs, pgpc } from '../graphql'
import { postWithoutRelation } from './post'

export const user = pgpc.update({
  name: 'User',
  fields: (f, b) => ({
    ...f,
    posts: f.posts.prismaArgs(() => inputs.findManyPost.build()),
    fullName: b.string(),
    latestPost: b.object(() => postWithoutRelation).nullable(),
  }),
  relations: () => getRelations('User'),
})
