import { createPGInterface } from '../objects/pg-interface'
import { setCache } from './utils'
import type { PGTypes, PGCache, PGBuilder } from '../types/builder'
import type { PGOutputFieldBuilder } from '../types/output'

export const createInterfaceBuilder: <Types extends PGTypes>(
  cache: PGCache,
  outputFieldBuilder: PGOutputFieldBuilder<Types>,
) => PGBuilder<Types>['interface'] = (cache, outputFieldBuilder) => (config) => {
  const pgInterface = createPGInterface(config.name, config.fields(outputFieldBuilder))
  setCache(cache, pgInterface)
  return pgInterface
}
