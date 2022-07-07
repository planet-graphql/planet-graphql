import { createPGObject } from '../objects/pg-object'
import { createOutputField } from '../objects/pg-output-field'
import { setCache } from './utils'
import type { PGBuilder, PGCache, PGTypes } from '../types/builder'
import type { PGScalarLike, PGEnum } from '../types/common'
import type { PGInputFieldBuilder } from '../types/input'
import type { PGOutputField, PGOutputFieldBuilder } from '../types/output'

export const createObjectBuilder: <Types extends PGTypes>(
  cache: PGCache,
  outputFieldBuilder: PGOutputFieldBuilder<Types>,
  inputFieldBuilder: PGInputFieldBuilder<Types>,
) => PGBuilder<Types>['object'] =
  (cache, outputFieldBuilder, inputFieldBuilder) => (config) => {
    const pgObject = createPGObject<any, any, any>(
      config.name,
      config.fields(outputFieldBuilder),
      cache,
      outputFieldBuilder,
      inputFieldBuilder,
      config.interfaces,
      config.isTypeOf,
    )
    setCache(cache, pgObject)
    return pgObject
  }

export function createPGOutputFieldBuilder<Types extends PGTypes>(
  scalarMap: {
    [name: string]: PGScalarLike
  },
  inputFieldBuilder: PGInputFieldBuilder<Types>,
): PGOutputFieldBuilder<Types> {
  const scalarFieldBuilder = Object.keys(scalarMap).reduce<{
    [name: string]: () => PGOutputField<any>
  }>((acc, key) => {
    acc[key] = () => createOutputField({ kind: 'scalar', type: key }, inputFieldBuilder)
    return acc
  }, {})
  return {
    ...(scalarFieldBuilder as any),
    enum: (type: PGEnum<any>) =>
      createOutputField({ kind: 'enum', type }, inputFieldBuilder),
    object: (type: Function) =>
      createOutputField({ kind: 'object', type }, inputFieldBuilder),
    relation: (type: Function) => {
      const field = createOutputField({ kind: 'object', type }, inputFieldBuilder)
      field.value.isPrismaRelation = true
      return field
    },
  }
}
