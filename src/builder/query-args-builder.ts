import _ from 'lodash'
import { createPGInput } from '../objects/pg-input'
import { createInputField } from '../objects/pg-input-field'
import { PGBuilder, PGCache, PGTypes } from '../types/builder'
import { PGInputFieldBuilder, PGInputFieldMap } from '../types/input'
import { getScalarTypeName } from './build'
import { setCache } from './utils'

export const queryArgsBuilder: <Types extends PGTypes>(
  cache: PGCache,
  inputFieldBuilder: PGInputFieldBuilder<Types>,
) => PGBuilder['queryArgsBuilder'] =
  (cache, inputFieldBuilder) => (inputNamePrefix) => (selector) => {
    function createInputFieldMap(prefix: string, s: any): PGInputFieldMap {
      const inputFieldMap = Object.entries(s).reduce<PGInputFieldMap>(
        (acc, [key, value]) => {
          const deArrayValue = Array.isArray(value) ? value[0] : value
          if (typeof deArrayValue === 'string') {
            acc[key] = createInputField({
              kind: 'scalar',
              type: getScalarTypeName(deArrayValue, false),
            }).nullish()
          } else {
            const p = `${prefix}${_.upperFirst(key)}`
            const pgInput = createPGInput(
              `${p}Input`,
              createInputFieldMap(p, deArrayValue),
              cache,
              inputFieldBuilder,
            )
            setCache(cache, pgInput)
            acc[key] = createInputField({
              kind: 'object',
              type: () => pgInput,
            }).nullish()
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
