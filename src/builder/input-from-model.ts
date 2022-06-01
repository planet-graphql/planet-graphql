import { createPGInput } from '../objects/pg-input'
import { createInputField } from '../objects/pg-input-field'
import { PGBuilder, PGCache, PGTypes } from '../types/builder'
import { PGInputFieldBuilder, PGInputFieldMap } from '../types/input'
import { setCache } from './utils'

export const inputFromModel: <Types extends PGTypes>(
  cache: PGCache,
  inputFieldBuilder: PGInputFieldBuilder<Types>,
) => PGBuilder<Types>['inputFromModel'] =
  (cache, inputFieldBuilder) => (name, model, editFieldMap) => {
    const inputPGFieldMap = Object.entries(model.fieldMap).reduce<PGInputFieldMap>(
      (acc, [key, field]) => {
        const inputField = createInputField(field.value)
        acc[key] = inputField
        return acc
      },
      {},
    )

    const fieldMap = editFieldMap(inputPGFieldMap as any, inputFieldBuilder) as any
    const pgInput = createPGInput(name, fieldMap, cache, inputFieldBuilder)
    setCache(cache, pgInput)
    return pgInput
  }
