import { getRelations } from '../'
import { args, pgpc } from '../graphql'
import { postWithoutRelation } from './post'

export const user = pgpc.redefine({
  name: 'User',
  fields: (f, b) => ({
    ...f,
    posts: f.posts.prismaArgs(() => args.findManyPost.build()),
    fullName: b.string(),
    latestPost: b.object(() => postWithoutRelation).nullable(),
  }),
  relations: () => getRelations('User'),
})
