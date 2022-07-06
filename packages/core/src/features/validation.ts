import _ from 'lodash'
import { z } from 'zod'
import { PGError } from '../builder/utils'
import { PGCache } from '../types/builder'
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
        return acc
      }
      if (arg === undefined && !field.value.isOptional) {
        acc[fieldName] = null
        return acc
      }
      if (_.isPlainObject(arg)) {
        const inputType: PGInput<PGInputFieldMap> = (
          fieldMap[fieldName].value.type as Function
        )()
        acc[fieldName] = modifyArgValueOfNullableOrOptionalField(
          inputType.value.fieldMap,
          arg,
        )
        return acc
      }
      if (arg !== undefined) {
        acc[fieldName] = arg
      }
      return acc
    },
    {},
  )
}

export const validationFeature: PGFeature = {
  name: 'validation',
  beforeResolve: async ({ field, isRootField, resolveParams, cache }) => {
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

    const errors = await validateArgs(
      resolveParams.info.fieldName,
      field.value.args,
      resolveParams.args,
      cache,
      resolveParams.context,
    )

    if (errors.length === 0) {
      return {
        isCallNext: true,
      }
    }

    return {
      isCallNext: false,
      resolveError: new PGError('Invalid args.', 'ValidationError', errors),
    }
  },
}

type ValidateError = {
  path: string
  issues: z.ZodIssue[]
}

export async function validateArgs(
  pathPrefix: string,
  fieldMap: PGInputFieldMap,
  args: Record<string, any>,
  cache: PGCache,
  context: any,
): Promise<ValidateError[]> {
  const errors: ValidateError[] = []
  for (const [fieldName, arg] of Object.entries(args)) {
    if (arg === null || arg === undefined) {
      continue
    }

    const field = fieldMap[fieldName]

    // NOTE: PGInputField validation
    if (field.value.validator != null) {
      const schemaBase =
        field.value.kind === 'scalar' ? cache.scalar[field.value.type].schema() : z.any()
      const schema = field.value.validator(schemaBase)
      const result = schema.safeParse(arg)
      if (!result.success) {
        errors.push({
          path: `${pathPrefix}.${fieldName}`,
          issues: result.error.issues,
        })
      }
    }

    // NOTE: PGInput validation
    if (typeof field.value.type === 'function') {
      const pgInput: PGInput<PGInputFieldMap> = field.value.type()
      if (pgInput.value.validator !== undefined) {
        const listedArg = Array.isArray(arg) ? arg : [arg]
        for (const x of listedArg) {
          const isValid = await pgInput.value.validator(x, context)
          if (!isValid) {
            errors.push({
              path: `${pathPrefix}.${fieldName}`,
              issues: [],
            })
          }
        }
      }
      errors.push(
        ...(await validateArgs(
          `${pathPrefix}.${fieldName}`,
          pgInput.value.fieldMap,
          arg,
          cache,
          context,
        )),
      )
    }
  }
  return errors
}
