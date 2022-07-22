import { build } from './builder/build'
import { dataloaderBuilder } from './builder/dataloader-builder'
import { createEnumBuilder } from './builder/enum-builder'
import { createPGInputFieldBuilder, createInputBuilder } from './builder/input-builder'
import { createInterfaceBuilder } from './builder/interface-builder'
import { createPGOutputFieldBuilder, createObjectBuilder } from './builder/object-builder'
import { createRootFieldBuilder } from './builder/root-field-builder'
import { createUnionBuilder } from './builder/union-builder'
import { createBuilderCache } from './builder/utils'
import { DefaultScalars } from './objects/pg-scalar'
import type {
  InitPGBuilder,
  PGBuilder,
  PGConfig,
  PGTypeConfig,
  PGTypes,
} from './types/builder'

export * from './generated/index'

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
      utils: {
        inputFieldBuilder,
        outputFieldBuilder,
      },
    }

    return builder
  }
