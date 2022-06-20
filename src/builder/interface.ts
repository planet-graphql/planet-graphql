import { createPGInterface } from '../objects/pg-interface'
import { PGTypes, PGCache, PGBuilder } from '../types/builder'
import { PGOutputFieldBuilder } from '../types/output'
import { setCache } from './utils'

export const createInterfaceBuilder: <Types extends PGTypes>(
  cache: PGCache,
  outputFieldBuilder: PGOutputFieldBuilder<Types>,
) => PGBuilder<Types>['interface'] = (cache, outputFieldBuilder) => (config) => {
  const pgInterface = createPGInterface(config.name, config.fields(outputFieldBuilder))
  setCache(cache, pgInterface)
  return pgInterface
}
