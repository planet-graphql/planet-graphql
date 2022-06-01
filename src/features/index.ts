import { authFeature } from './auth'
import { prismaArgsFeature } from './prisma'
import { validationFeature } from './validation'

export const DefaultFeatures = [authFeature, validationFeature, prismaArgsFeature]
