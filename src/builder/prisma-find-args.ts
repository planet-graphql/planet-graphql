import _ from 'lodash'
import {
  FieldsByTypeName,
  ResolveTree,
  parseResolveInfo,
} from '../lib/graphql-parse-resolve-info'
import { PGBuilder, PGCache, PGTypes } from '../types/builder'
import { ResolveParams, PGField } from '../types/common'
import { PGObject } from '../types/output'
import { PGError } from './utils'

export const prismaFindArgs: <Types extends PGTypes>(
  cache: PGCache,
) => PGBuilder<Types>['prismaFindArgs'] =
  (cache) =>
  <T>(root: PGObject<any>, params: ResolveParams<any, any, any, any>, defaultArgs: T) => {
    function createArgs(
      rootObject: PGObject<any>,
      fieldsByTypeName: FieldsByTypeName,
      args: ResolveTree['args'],
      dArgs: object | undefined,
      loc: ResolveTree['loc'],
    ): Record<string, any> | true | undefined {
      const returnType = Object.keys(fieldsByTypeName)[0]
      const rootModel = cache.model[rootObject.name]
      const targetArgsName = [
        'select',
        'include',
        'where',
        'orderBy',
        'cursor',
        'take',
        'skip',
        'distinct',
        'first',
        'after',
        'last',
        'before',
      ]
      const pickedArgs = _.pick(args, targetArgsName)
      const mergedArgs = _.mergeWith(
        {},
        _.omit(dArgs, 'include'),
        pickedArgs,
        (defaultValue, value) => {
          if (Array.isArray(defaultValue)) return value
        },
      )
      const { include, first, after, last, before, ...rest } = mergedArgs

      if (returnType !== rootModel.name) {
        throw new PGError(
          `A mismatch of type. RootType: ${rootModel.name}, TypeInResolverInfo: ${returnType}`,
          'Error',
        )
      }

      if ((first !== undefined || last !== undefined) && rest.orderBy === undefined) {
        throw new PGError('Cannot paginate without `orderBy`', 'Error')
      }

      const properties = fieldsByTypeName[returnType]
      const includeFromTree = Object.entries(properties).reduce<Record<string, any>>(
        (acc, [key, value]) => {
          const modelField: PGField<any> | undefined = rootModel.fieldMap[key]
          if (modelField !== undefined && modelField.value.kind === 'object') {
            const objectField = rootObject.fieldMap[key]
            const rootName: string =
              typeof objectField.value.type === 'function'
                ? objectField.value.type().name
                : objectField.value.type
            acc[key] = createArgs(
              cache.object[rootName],
              value.fieldsByTypeName,
              value.args,
              (dArgs as any)?.include?.[key],
              value.loc,
            )
          }
          return acc
        },
        {},
      )
      const includeArgs = _.merge(include, includeFromTree)
      const resp: any = _.omitBy(
        {
          ...rest,
          include: _.isEmpty(includeArgs) ? undefined : includeArgs,
        },
        _.isNil,
      )
      if (first !== undefined) {
        resp.take = Number(first) + 1
        if (after !== undefined) {
          resp.cursor = JSON.parse(Buffer.from(after as string, 'base64').toString())
          resp.skip = 1
        }
      }
      if (last !== undefined) {
        const switchOrderBy: any = (orderBy: any) => {
          if (Array.isArray(orderBy)) return orderBy.map((x) => switchOrderBy(x))
          if (typeof orderBy === 'object')
            return Object.entries(orderBy).reduce<{ [name: string]: any }>(
              (acc, [key, value]) => {
                acc[key] = switchOrderBy(value)
                return acc
              },
              {},
            )
          return orderBy === 'asc' ? 'desc' : 'asc'
        }
        resp.orderBy = switchOrderBy(resp.orderBy)
        resp.take = Number(last) + 1
        if (before !== undefined) {
          resp.cursor = JSON.parse(Buffer.from(before as string, 'base64').toString())
          resp.skip = 1
        }
      }
      return _.isEmpty(resp) ? true : resp
    }

    const tree = parseResolveInfo(params.info) as ResolveTree
    return createArgs(
      root,
      tree.fieldsByTypeName,
      tree.args,
      defaultArgs as any,
      tree.loc,
    ) as any
  }
