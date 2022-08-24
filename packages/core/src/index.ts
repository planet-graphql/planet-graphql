import { getPGBuilderWithConfig } from './builder'
import type { InitPGBuilder } from './types/builder'

export * from './generated/index'

export const getPGBuilder: InitPGBuilder = getPGBuilderWithConfig()
