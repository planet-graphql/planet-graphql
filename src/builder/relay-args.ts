import { GraphQLInt, GraphQLString } from 'graphql'
import { PGBuilder, PGTypes } from '../types/builder'
import { createInputField } from './utils'

export const relayArgs: <Types extends PGTypes>() => PGBuilder<Types>['relayArgs'] =
  () => (options) => {
    const relayArgs = {
      first: createInputField<number>({ kind: 'scalar', type: GraphQLInt }).nullable(),
      after: createInputField<string>({ kind: 'scalar', type: GraphQLString }).nullable(),
      last: createInputField<number>({ kind: 'scalar', type: GraphQLInt }).nullable(),
      before: createInputField<string>({
        kind: 'scalar',
        type: GraphQLString,
      }).nullable(),
    }
    if (options?.default !== undefined) {
      relayArgs.first.default(options.default)
      relayArgs.last.default(options.default)
    }
    if (options?.max !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      relayArgs.first.validation((z) => z.number().max(options.max!))
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      relayArgs.last.validation((z) => z.number().max(options.max!))
    }
    return relayArgs
  }
