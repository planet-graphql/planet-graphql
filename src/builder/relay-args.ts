import { PGBuilder, PGTypes } from '../types/builder'
import { createInputField } from './utils'

export const relayArgs: <Types extends PGTypes>() => PGBuilder<Types>['relayArgs'] =
  () => (options) => {
    const relayArgs = {
      first: createInputField<number, 'int'>({ kind: 'scalar', type: 'int' }).nullable(),
      after: createInputField<string, 'string'>({
        kind: 'scalar',
        type: 'string',
      }).nullable(),
      last: createInputField<number, 'int'>({ kind: 'scalar', type: 'int' }).nullable(),
      before: createInputField<string, 'string'>({
        kind: 'scalar',
        type: 'string',
      }).nullable(),
    }
    if (options?.default !== undefined) {
      relayArgs.first.default(options.default)
      relayArgs.last.default(options.default)
    }
    if (options?.max !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      relayArgs.first.validation((schema) => schema.max(options.max!))
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      relayArgs.last.validation((schema) => schema.max(options.max!))
    }
    return relayArgs
  }
