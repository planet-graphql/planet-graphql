import { PGBuilder, PGCache, PGTypes } from '../types/builder'
import { PGInput, PGInputFieldBuilder } from '../types/input'
import { setCache } from './utils'

export const input: <Types extends PGTypes>(
  cache: PGCache,
  inputFieldBuilder: PGInputFieldBuilder<Types>,
) => PGBuilder<Types>['input'] = (cache, inputFieldBuilder) => (name, fieldMap) => {
  if (cache.input[name] !== undefined) return cache.input[name] as PGInput<any>
  const pgInput: PGInput<any> = {
    name,
    fieldMap: fieldMap(inputFieldBuilder),
    value: {},
    kind: 'input' as const,
    validation: (builder) => {
      pgInput.value.validatorBuilder = builder
      return pgInput
    },
  }
  setCache(cache, pgInput)
  return pgInput
}
