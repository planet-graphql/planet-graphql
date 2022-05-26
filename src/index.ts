import { build } from './builder/build'
import { dataloader } from './builder/dataloader'
import { createEnumBuilder } from './builder/enum'
import { createPGInputFieldBuilder, createInputBuilder } from './builder/input'
import { inputFromModel } from './builder/input-from-model'
import { createPGOutputFieldBuilder, createObjectBuilder } from './builder/object'
import { objectFromModel } from './builder/object-from-model'
import { pgfy } from './builder/pgfy'
import { prismaFindArgs } from './builder/prisma-find-args'
import { queryArgsBuilder } from './builder/query-args-builder'
import { resolver } from './builder/resolver'
import { rootFieldBuilder } from './builder/root-field'
import { createBuilderCache } from './builder/utils'
import { DefaultScalars } from './lib/scalars'
import {
  InitPGBuilder,
  PGBuilder,
  PGConfig,
  PGTypeConfig,
  PGTypes,
} from './types/builder'

export * from './lib/generated'

export const getPGBuilder: InitPGBuilder =
  <TypeConfig extends PGTypeConfig = PGTypeConfig>() =>
  <Config extends PGConfig>(config?: Config) => {
    type Types = PGTypes<TypeConfig, Config>

    const scalarMap = {
      ...DefaultScalars,
      ...config?.scalars,
    }

    const inputFieldBuilder = createPGInputFieldBuilder<Types>(scalarMap)
    const outputFieldBuilder = createPGOutputFieldBuilder<Types>(
      scalarMap,
      inputFieldBuilder,
    )

    const cache = createBuilderCache(scalarMap)

    const builder: PGBuilder<Types> = {
      object: createObjectBuilder(cache, outputFieldBuilder),
      objectFromModel: objectFromModel(cache, outputFieldBuilder),
      enum: createEnumBuilder(cache),
      input: createInputBuilder(cache, inputFieldBuilder),
      inputFromModel: inputFromModel(cache, inputFieldBuilder),
      resolver: resolver(cache),
      query: rootFieldBuilder(cache, outputFieldBuilder, 'query'),
      mutation: rootFieldBuilder(cache, outputFieldBuilder, 'mutation'),
      subscription: rootFieldBuilder(cache, outputFieldBuilder, 'subscription'),
      build: build(cache),
      pgfy: pgfy(cache, inputFieldBuilder),
      queryArgsBuilder: queryArgsBuilder(cache),
      prismaFindArgs: prismaFindArgs(cache),
      dataloader,
      cache: () => cache,
    }

    return builder
  }
