import _ from 'lodash'
import { PGBuilder, PGCache } from '../types/builder'
import { PGScalarLike } from '../types/common'
import { PGInput, PGInputFieldMap } from '../types/input'
import { getGraphQLScalar } from './build'
import { createInputField, setCache } from './utils'

export const queryArgsBuilder: (
  cache: PGCache,
  scalarMap: { [name: string]: PGScalarLike },
) => PGBuilder['queryArgsBuilder'] =
  (cache, scalarMap) => (inputNamePrefix) => (selector) => {
    function createInputFieldMap(prefix: string, s: any): PGInputFieldMap {
      const inputFieldMap = Object.entries(s).reduce<PGInputFieldMap>(
        (acc, [key, value]) => {
          const deArrayValue = Array.isArray(value) ? value[0] : value
          if (typeof deArrayValue === 'string') {
            acc[key] = createInputField<any>({
              kind: 'scalar',
              type: getGraphQLScalar(deArrayValue, false, scalarMap),
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
            acc[key] = createInputField<any>({
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
