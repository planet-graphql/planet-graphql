import { PGBuilder, PGCache, PGTypes } from '../types/builder'
import {
  PGInput,
  PGInputField,
  PGInputFieldBuilder,
  PGInputFieldMap,
} from '../types/input'
import { setCache } from './utils'

export const inputFromModel: <Types extends PGTypes>(
  cache: PGCache,
  inputFieldBuilder: PGInputFieldBuilder<Types>,
) => PGBuilder<Types>['inputFromModel'] =
  (cache, inputFieldBuilder) => (name, model, editFieldMap) => {
    if (cache.input[name] !== undefined) return cache.input[name]
    const inputPGFieldMap = Object.entries(model.fieldMap).reduce<PGInputFieldMap>(
      (acc, [key, value]) => {
        const field: PGInputField<any> = {
          ...value,
          nullable: () => {
            field.value.isNullable = true
            return field
          },
          optional: () => {
            field.value.isOptional = true
            return field
          },
          nullish: () => {
            field.value.isOptional = true
            field.value.isNullable = true
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
