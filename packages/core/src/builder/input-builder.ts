import { createPGInput } from '../objects/pg-input'
import { createInputField } from '../objects/pg-input-field'
import { setCache } from './utils'
import type { PGBuilder, PGCache, PGTypes } from '../types/builder'
import type { PGEnum, PGScalarLike } from '../types/common'
import type { PGInputField, PGInputFieldBuilder } from '../types/input'

export const createInputBuilder: <Types extends PGTypes>(
  cache: PGCache,
  inputFieldBuilder: PGInputFieldBuilder<Types>,
) => PGBuilder<Types>['input'] = (cache, inputFieldBuilder) => (config) => {
  const pgInput = createPGInput(
    config.name,
    config.fields(inputFieldBuilder),
    cache,
    inputFieldBuilder,
  )
  setCache(cache, pgInput)
  return pgInput
}

export function createPGInputFieldBuilder<Types extends PGTypes>(scalarMap: {
  [name: string]: PGScalarLike
}): PGInputFieldBuilder<Types> {
  const scalarFieldBuilder = Object.keys(scalarMap).reduce<{
    [name: string]: () => PGInputField<any>
  }>((acc, key) => {
    acc[key] = () => createInputField({ kind: 'scalar', type: key })
    return acc
  }, {})
  return {
    ...(scalarFieldBuilder as any),
    enum: (type: PGEnum<any>) => createInputField({ kind: 'enum', type }),
    input: (type: Function) => createInputField({ kind: 'object', type }),
  }
}
