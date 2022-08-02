import { getPGBuilder } from '@planet-graphql/core'
import { dmmf, getPGPrismaConverter } from './planet-graphql'
import type { PrismaTypes } from './planet-graphql'

export type ContextType = {
  userId: number
  isAdmin: boolean
}

export const pg = getPGBuilder<{ Context: ContextType; Prisma: PrismaTypes }>()()
export const pgpc = getPGPrismaConverter(pg, dmmf)
export const { args } = pgpc.convertBuilders()
