import { authFeature } from './auth'
import { optionalArgsFeature } from './optional-args'
import { prismaArgsFeature, prismaRelayFeature } from './prisma'
import { validationFeature } from './validation'

export const DefaultFeatures = [
  authFeature,
  optionalArgsFeature,
  validationFeature,
  prismaArgsFeature,
  prismaRelayFeature,
]
