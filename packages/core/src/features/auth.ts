import { PGError } from '../builder/utils'
import type { PGFeature } from '../types/feature'
import type { PGOutputField } from '../types/output'

export const authFeature: PGFeature = {
  name: 'auth',
  cacheKey: ({ info }) => `${info.parentType.name}:${info.fieldName}`,
  beforeResolve: async ({ field, resolveParams }) => {
    const hasAuth =
      field.value.auth === undefined ||
      (await field.value.auth.callback(resolveParams as any))
    if (hasAuth) {
      return {
        isCallNext: true,
      }
    }
    const unAuthResolveValue = getUnAuthResolveValue(
      field.value.auth?.options?.strict,
      field,
    )
    return {
      isCallNext: false,
      resolveValue: unAuthResolveValue,
      resolveError:
        unAuthResolveValue !== undefined
          ? undefined
          : new PGError(
              `GraphQL permission denied. Field: ${resolveParams.info.parentType.name}.${resolveParams.info.fieldName}`,
              'AuthError',
            ),
    }
  },
}

function getUnAuthResolveValue(
  isStrict: boolean | undefined,
  field: PGOutputField<unknown>,
): [] | null | undefined {
  if (isStrict === true) {
    return undefined
  }

  if (field.value.isNullable) {
    return null
  }
  if (field.value.isList) {
    return []
  }
  return undefined
}
