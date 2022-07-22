import { getPGBuilder } from '@planet-graphql/core'
import { dmmf, getPGPrismaConverter } from './planet-graphql'
import type { PrismaTypes } from './planet-graphql'

type ContextType = {
  userId: number
}
export const pg = getPGBuilder<{ Context: ContextType; Prisma: PrismaTypes }>()()
export const pgpc = getPGPrismaConverter(pg, dmmf)
export const inputs = pgpc.convertInputs()
