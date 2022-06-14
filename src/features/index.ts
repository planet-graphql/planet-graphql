import { authFeature } from './auth'
import { prismaArgsFeature, prismaRelayFeature } from './prisma'
import { optionalArgsFeature, validationFeature } from './validation'

export const DefaultFeatures = [
  authFeature,
  optionalArgsFeature,
  validationFeature,
  prismaArgsFeature,
  prismaRelayFeature,
]
