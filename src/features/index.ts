import { authFeature } from './auth'
import { prismaArgsFeature, prismaRelayFeature } from './prisma'
import { validationFeature } from './validation'

export const DefaultFeatures = [
  authFeature,
  validationFeature,
  prismaArgsFeature,
  prismaRelayFeature,
]
