import _ from 'lodash'
import { getRelations } from '../'
import { pgpc } from '../graphql'

export const attachment = pgpc.update({
  name: 'Attachment',
  fields: (f, b) => ({
    ..._.omit(f, 'post'),
  }),
  relations: () => getRelations('Attachment'),
})
