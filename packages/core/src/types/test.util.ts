import type { DefaultScalars } from '../objects/pg-scalar'
import type { PGScalarMap } from './builder'

export type SortOrder = 'asc' | 'desc'

export type SomeUserPrismaArgs = {
  select: { userSelect: any }
  include: { userInclude: any }
  where: { userWhere: any }
  orderBy: { id?: SortOrder; email?: SortOrder }
  cursor: { id?: string; email?: string }
  take: number
  skip: number
  distinct: { userDistinct: any }
}

export type SomePostPrismaArgs = {
  select: { postSelect: any }
  include: { postInclude: any }
  where: { postWhere: any }
  orderBy: { postOrderBy: any }
  cursor: { postCursor: any }
  take: number
  skip: number
  distinct: { postDistinct: any }
}

export type SomePGTypes<Context = any> = {
  Context: Context
  Prisma: {
    Args: {
      User: SomeUserPrismaArgs
      Post: SomePostPrismaArgs
    }
    PGfy: any
  }
  ScalarMap: PGScalarMap<typeof DefaultScalars>
}
