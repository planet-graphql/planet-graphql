import { PGBuilder } from '../types/builder'
import { createInputField } from './utils'

export const relayArgs: PGBuilder<any>['relayArgs'] = (options) => {
  const relayArgs = {
    first: createInputField<number>('Int').nullable(),
    after: createInputField<string>('String').nullable(),
    last: createInputField<number>('Int').nullable(),
    before: createInputField<string>('String').nullable(),
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
