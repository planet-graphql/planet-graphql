import _ from 'lodash'
import { PGBuilder, PGCache } from '../types/builder'
import { PGInput, PGInputFieldMap } from '../types/input'
import { getScalarTypeName } from './build'
import { createInputField, setCache } from './utils'

export const queryArgsBuilder: (cache: PGCache) => PGBuilder['queryArgsBuilder'] =
  (cache) => (inputNamePrefix) => (selector) => {
    function createInputFieldMap(prefix: string, s: any): PGInputFieldMap {
      const inputFieldMap = Object.entries(s).reduce<PGInputFieldMap>(
        (acc, [key, value]) => {
          const deArrayValue = Array.isArray(value) ? value[0] : value
          if (typeof deArrayValue === 'string') {
            acc[key] = createInputField({
              kind: 'scalar',
              type: getScalarTypeName(deArrayValue, false),
            }).nullable()
          } else {
            const p = `${prefix}${_.upperFirst(key)}`
            const pgInput: PGInput<any> = {
              name: `${p}Input`,
              fieldMap: createInputFieldMap(p, deArrayValue),
              value: {},
              kind: 'input',
              validation: (builder) => {
                pgInput.value.validatorBuilder = builder
                return pgInput
              },
            }
            setCache(cache, pgInput)
            acc[key] = createInputField({
              kind: 'object',
              type: () => pgInput,
            }).nullable()
          }
          if (Array.isArray(value)) acc[key] = acc[key].list()
          return acc
        },
        {},
      )
      return inputFieldMap
    }
    const result: any = createInputFieldMap(inputNamePrefix, selector)
    return result
  }
