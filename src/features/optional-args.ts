import _ from 'lodash'
import { PGFeature } from '../types/feature'
import { PGInput, PGInputFieldMap } from '../types/input'

export const optionalArgsFeature: PGFeature = {
  name: 'optionalArgs',
  beforeResolve: ({ field, isRootField, resolveParams }) => {
    if (!isRootField) {
      return {
        isCallNext: true,
      }
    }
    if (field.value.args === undefined) {
      return {
        isCallNext: true,
      }
    }

    const args = modifyArgValueOfNullableOrOptionalField(
      field.value.args,
      resolveParams.args,
    )
    return {
      isCallNext: true,
      updatedResolveParams: {
        ...resolveParams,
        args,
      },
    }
  },
}

export function modifyArgValueOfNullableOrOptionalField(
  fieldMap: PGInputFieldMap,
  args: Record<string, any>,
): Record<string, any> {
  return Object.entries(fieldMap).reduce<Record<string, any>>(
    (acc, [fieldName, field]) => {
      const arg = args[fieldName]
      if (arg === null && !field.value.isNullable) {
        acc[fieldName] = undefined
      }
      if (arg === undefined && !field.value.isOptional) {
        acc[fieldName] = null
      }
      if (_.isPlainObject(arg)) {
        const inputType: PGInput<PGInputFieldMap> = (
          fieldMap[fieldName].value.type as Function
        )()
        acc[fieldName] = modifyArgValueOfNullableOrOptionalField(inputType.fieldMap, arg)
      }
      return acc
    },
    {},
  )
}
