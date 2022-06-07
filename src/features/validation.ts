import { z } from 'zod'
import { PGError } from '../builder/utils'
import { parseResolveInfo, ResolveTree } from '../lib/graphql-parse-resolve-info'
import { PGCache, PGTypes } from '../types/builder'
import { GraphQLResolveParams, PGFeature } from '../types/feature'
import { PGInput, PGInputFieldMap } from '../types/input'

export const validationFeature: PGFeature = {
  name: 'validation',
  beforeResolve: async ({ resolveParams, isRootField, cache }) => {
    if (!isRootField) {
      return {
        isCallNext: true,
      }
    }
    const validateErrors = await argsValidationChecker(resolveParams, cache)
    if (validateErrors.length === 0) {
      return {
        isCallNext: true,
      }
    }
    return {
      isCallNext: false,
      resolveError: new PGError('Invalid args.', 'ValidationError', validateErrors),
    }
  },
}

type ValidateError = {
  path: string
  issues?: z.ZodIssue[]
}

export async function argsValidationChecker(
  resolveParams: GraphQLResolveParams<PGTypes>,
  cache: PGCache,
): Promise<Promise<ValidateError[]>> {
  async function validateArgsCore(
    argsValue: {
      [str: string]: any
    },
    fieldMap: PGInputFieldMap,
    pathPrefix: string,
  ): Promise<ValidateError[]> {
    const errors = await Promise.all(
      Object.entries(argsValue).map(async ([fieldName, argValue]) => {
        const e: ValidateError[] = []
        const field = fieldMap[fieldName]

        // NOTE: PGInputField validation
        const schemaBuilder =
          field.value.kind === 'scalar'
            ? cache.scalar[field.value.type].schema
            : () => z.any()
        const validator = field.value.validator?.(schemaBuilder() as z.ZodAny, context)
        const parsed = validator?.safeParse(argValue)
        if (parsed?.success === false) {
          e.push({
            path: `${pathPrefix}.${fieldName}`,
            issues: parsed.error.issues,
          })
        }

        // NOTE: PGInput validation
        // TODO: Fixed to consider null
        if (typeof field?.value.type === 'function' && argValue !== null) {
          const pgInput = field.value.type() as PGInput<any>
          const listedArgValue = Array.isArray(argValue) ? argValue : [argValue]
          for (const value of listedArgValue) {
            const result = await pgInput.value.validator?.(value, context)

            if (result === false) {
              e.push({
                path: `${pathPrefix}.${fieldName}`,
              })
            }

            e.push(
              ...(await validateArgsCore(
                value,
                pgInput.fieldMap,
                `${pathPrefix}.${fieldName}`,
              )),
            )
          }
        }
        return e
      }),
    )
    return errors.flat()
  }

  async function validateArgs(
    rt: ResolveTree,
    fieldMap: PGInputFieldMap,
    pathPrefix: string,
  ): Promise<ValidateError[]> {
    const rootErrors = await validateArgsCore(rt.args, fieldMap, pathPrefix)
    const objectName = Object.keys(rt.fieldsByTypeName)[0]
    if (objectName === undefined) {
      return [...rootErrors]
    }
    const pgObject = cache.object[objectName]
    const innerErrors = await Promise.all(
      Object.entries(rt.fieldsByTypeName[objectName]).map(async ([fieldName, t]) => {
        return await validateArgs(
          t,
          pgObject.fieldMap[fieldName].value.args ?? {},
          `${pathPrefix}.${fieldName}`,
        )
      }),
    )
    return [...rootErrors, ...innerErrors.flat()]
  }

  const { context, info } = resolveParams
  const tree = parseResolveInfo(info) as ResolveTree
  const queryType = info.parentType.name.toLowerCase() as
    | 'query'
    | 'mutation'
    | 'subscription'
  const resolver = cache[queryType][info.fieldName]

  return await validateArgs(tree, resolver.field.value.args ?? {}, tree.name)
}
