import { createPGInput } from '../objects/pg-input'
import { createInputField } from '../objects/pg-input-field'
import { PGBuilder, PGCache, PGTypes } from '../types/builder'
import { PGEnum, PGScalarLike } from '../types/common'
import { PGInputField, PGInputFieldBuilder } from '../types/input'
import { setCache } from './utils'

export const createInputBuilder: <Types extends PGTypes>(
  cache: PGCache,
  inputFieldBuilder: PGInputFieldBuilder<Types>,
) => PGBuilder<Types>['input'] = (cache, inputFieldBuilder) => (name, fieldMap) => {
  const pgInput = createPGInput(
    name,
    fieldMap(inputFieldBuilder),
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
