import { omit } from 'lodash'
import { args, pgpc } from '../builders'
import { getRelations } from '../server'
import { postWithoutRelation } from './post'

// NOTE:
// Objects schema in GraphQL can be adjusted using the "redefine" method.
// The arg "f" has fields defined in your Prisma schema.
// Fields can be added or omitted as below.
export const user = pgpc.redefine({
  name: 'User',
  fields: (f, b) => ({
    ...omit(f, 'email'),
    posts: f.posts.prismaArgs(() => args.findManyPost.build()),
    fullName: b.string(),
    latestPost: b.object(() => postWithoutRelation).nullable(),
  }),
  // NOTE:
  // This is a spell to get the type right.
  // Specifically, it is needed to set the type of a relation, such as the User's "posts" field,
  // with the type after it has been redefined in "models/post.ts" and so on.
  relations: () => getRelations('User'),
})
