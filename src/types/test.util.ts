import { DefaultScalars } from '../lib/scalars'
import { PGScalarMap } from './builder'

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

export type SomeGeneratedType = {
  enums: {}
  inputs: {}
  objects: {}
  models: {
    User: SomeUserPrismaArgs
    Post: SomePostPrismaArgs
  }
}

export type SomePGTypes<Context = any> = {
  Context: Context
  GeneratedType: () => SomeGeneratedType
  ScalarMap: PGScalarMap<typeof DefaultScalars>
}
