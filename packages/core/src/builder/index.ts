import { DefaultScalars } from '../objects/pg-scalar'
import { build } from './build'
import { dataloaderBuilder } from './dataloader-builder'
import { createEnumBuilder } from './enum-builder'
import { createPGInputFieldBuilder, createInputBuilder } from './input-builder'
import { createInterfaceBuilder } from './interface-builder'
import { createPGOutputFieldBuilder, createObjectBuilder } from './object-builder'
import { createRootFieldBuilder } from './root-field-builder'
import { createUnionBuilder } from './union-builder'
import { createBuilderCache } from './utils'
import type {
  InitPGBuilderWithConfig,
  PGBuilder,
  PGConfig,
  PGTypeConfig,
  PGTypes,
} from '../types/builder'

export const getPGBuilderWithConfig: InitPGBuilderWithConfig =
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
      object: createObjectBuilder(cache, outputFieldBuilder, inputFieldBuilder),
      union: createUnionBuilder(cache),
      interface: createInterfaceBuilder(cache, outputFieldBuilder),
      enum: createEnumBuilder(cache),
      input: createInputBuilder(cache, inputFieldBuilder),
      query: createRootFieldBuilder(cache, outputFieldBuilder, 'query'),
      mutation: createRootFieldBuilder(cache, outputFieldBuilder, 'mutation'),
      subscription: createRootFieldBuilder(cache, outputFieldBuilder, 'subscription'),
      build: build(() => builder),
      dataloader: dataloaderBuilder,
      cache: () => cache,
      configure: (config) => getPGBuilderWithConfig<Types>()(config),
      fieldBuilders: {
        input: inputFieldBuilder,
        output: outputFieldBuilder,
      },
    }

    return builder
  }
