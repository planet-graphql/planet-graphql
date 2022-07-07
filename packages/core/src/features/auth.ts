import { PGError } from '../builder/utils'
import type { PGFeature } from '../types/feature'
import type { PGOutputField } from '../types/output'

export const authFeature: PGFeature = {
  name: 'auth',
  cacheKey: ({ info }) => `${info.parentType.name}:${info.fieldName}`,
  beforeResolve: async ({ field, resolveParams }) => {
    const { context, args, info } = resolveParams
    const hasAuth =
      field.value.authChecker === undefined ||
      (await field.value.authChecker({
        ctx: context,
        args,
      }))
    if (hasAuth) {
      return {
        isCallNext: true,
      }
    }

    const unAuthResolveValue = getUnAuthResolveValue(field)
    return {
      isCallNext: false,
      resolveValue: unAuthResolveValue,
      resolveError:
        unAuthResolveValue !== undefined
          ? undefined
          : new PGError(
              `GraphQL permission denied. Field: ${info.parentType.name}.${info.fieldName}`,
              'AuthError',
            ),
    }
  },
}

function getUnAuthResolveValue(field: PGOutputField<unknown>): [] | null | undefined {
  if (field.value.isNullable) {
    return null
  }
  if (field.value.isList) {
    return []
  }
  return undefined
}
