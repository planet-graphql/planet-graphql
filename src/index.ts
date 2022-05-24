import { build } from './builder/build'
import { dataloader } from './builder/dataloader'
import { createEnum } from './builder/enum'
import { input } from './builder/input'
import { inputFromModel } from './builder/input-from-model'
import { object } from './builder/object'
import { objectFromModel } from './builder/object-from-model'
import { pgfy } from './builder/pgfy'
import { prismaFindArgs } from './builder/prisma-find-args'
import { queryArgsBuilder } from './builder/query-args-builder'
import { resolver } from './builder/resolver'
import { rootFieldBuilder } from './builder/root-field'
import { createPGInputFieldBuilder, createPGOutputFieldBuilder } from './builder/utils'
import { DefaultScalars } from './lib/scalars'
import {
  InitPGBuilder,
  PGBuilder,
  PGCache,
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

    const cache: PGCache = {
      scalar: scalarMap,
      model: {},
      object: {},
      input: {},
      enum: {},
      query: {},
      mutation: {},
      subscription: {},
    }

    const builder: PGBuilder<Types> = {
      object: object(cache, outputFieldBuilder),
      objectFromModel: objectFromModel(cache, outputFieldBuilder),
      enum: createEnum(cache),
      input: input(cache, inputFieldBuilder),
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
