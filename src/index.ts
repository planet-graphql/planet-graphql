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
import { relayArgs } from './builder/relay-args'
import { relayConnection } from './builder/relay-connection'
import { resolver } from './builder/resolver'
import { rootFieldBuilder } from './builder/root-field'
import { PGBuilder, PGCache } from './types/builder'

export function getPGBuilder<TContext>(): PGBuilder<TContext> {
  const cache: PGCache = {
    model: {},
    object: {},
    input: {},
    enum: {},
    query: {},
    mutation: {},
    subscription: {},
  }

  const builder: PGBuilder<TContext> = {
    object: object(cache),
    objectFromModel: objectFromModel(cache),
    enum: createEnum(cache),
    input: input(cache),
    inputFromModel: inputFromModel(cache),
    resolver: resolver(cache),
    query: rootFieldBuilder(cache, 'query'),
    mutation: rootFieldBuilder(cache, 'mutation'),
    subscription: rootFieldBuilder(cache, 'subscription'),
    build: build(cache),
    pgfy: pgfy(cache),
    queryArgsBuilder: queryArgsBuilder(cache),
    prismaFindArgs: prismaFindArgs(cache),
    dataloader,
    relayConnection: relayConnection(cache),
    relayArgs,
    cache: () => cache,
  }

  return builder
}
