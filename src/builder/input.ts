import { PGBuilder, PGCache } from '../types/builder'
import { PGInput } from '../types/input'
import { inputFieldBuilder, setCache } from './utils'

export const input: (cache: PGCache) => PGBuilder<any>['input'] =
  (cache) => (name, fieldMap) => {
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
