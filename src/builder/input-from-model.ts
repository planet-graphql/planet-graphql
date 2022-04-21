import { PGBuilder, PGCache } from '../types/builder'
import { PGInput, PGInputField, PGInputFieldMap } from '../types/input'
import { inputFieldBuilder, setCache } from './utils'

export const inputFromModel: (cache: PGCache) => PGBuilder<any>['inputFromModel'] =
  (cache) => (name, model, editFieldMap) => {
    if (cache.input[name] !== undefined) return cache.input[name]
    const inputPGFieldMap = Object.entries(model.fieldMap).reduce<PGInputFieldMap>(
      (acc, [key, value]) => {
        const field: PGInputField<any> = {
          ...value,
          nullable: () => {
            field.value.isRequired = false
            return field
          },
          list: () => {
            field.value.isList = true
            return field
          },
          default: (value: any) => {
            field.value.default = value
            return field
          },
          validation: (validator) => {
            field.value.validatorBuilder = validator
            return field
          },
        }
        acc[key] = field
        return acc
      },
      {},
    )

    const pgFieldMap = editFieldMap(inputPGFieldMap as any, inputFieldBuilder)
    const pgInput: PGInput<any> = {
      name,
      fieldMap: pgFieldMap,
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
