import { faker } from '@faker-js/faker'
import _ from 'lodash'

export const users = _.range(1, 20).map((id) => ({
  id: String(id),
  name: faker.internet.userName(),
}))

export const posts = users.flatMap((user) =>
  _.range(1, 3).flatMap((id) => ({
    id: String(id),
    authorId: user.id,
    title: faker.lorem.text(),
    content: faker.lorem.paragraphs(),
  })),
)
