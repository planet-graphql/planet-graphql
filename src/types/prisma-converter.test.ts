import { expectType, TypeEqual } from 'ts-expect'
import { PGTypes } from './builder'
import { PGObject, PGOutputField, PGOutputFieldOptionsDefault } from './output'
import { PrismaObject } from './prisma-converter'

interface SamplePrismaObjectMap<
  TMap extends { [key: string]: Function | undefined },
  Types extends PGTypes = PGTypes,
> {
  User: PrismaObject<
    TMap,
    'User',
    PGObject<
      {
        id: PGOutputField<string, any, PGOutputFieldOptionsDefault, Types>
        posts: PGOutputField<
          [() => SamplePrismaObjectMap<TMap, Types>['Post']],
          any,
          PGOutputFieldOptionsDefault,
          Types
        >
      },
      undefined,
      { PrismaModelName: 'User' },
      Types
    >
  >
  Post: PrismaObject<
    TMap,
    'Post',
    PGObject<
      {
        id: PGOutputField<string, any, PGOutputFieldOptionsDefault, Types>
        user: PGOutputField<
          () => SamplePrismaObjectMap<TMap, Types>['User'],
          any,
          PGOutputFieldOptionsDefault,
          Types
        >
        comments: PGOutputField<
          [() => SamplePrismaObjectMap<TMap, Types>['Comment']],
          any,
          PGOutputFieldOptionsDefault,
          Types
        >
      },
      undefined,
      { PrismaModelName: 'Post' },
      Types
    >
  >
  Comment: PrismaObject<
    TMap,
    'Comment',
    PGObject<
      {
        id: PGOutputField<string, any, PGOutputFieldOptionsDefault, Types>
        user: PGOutputField<
          () => SamplePrismaObjectMap<TMap, Types>['User'],
          any,
          PGOutputFieldOptionsDefault,
          Types
        >
        post: PGOutputField<
          () => SamplePrismaObjectMap<TMap, Types>['Post'],
          any,
          PGOutputFieldOptionsDefault,
          Types
        >
      },
      undefined,
      { PrismaModelName: 'Comment' },
      Types
    >
  >
}

describe('PrismaObjectMap', () => {
  it('Returns an object map updated recursively by TMap', () => {
    type UpdatedUser = PGObject<{
      id: PGOutputField<string>
      posts: PGOutputField<[() => SamplePrismaObjectMap<TMap>['Post']]>
      latestPost: PGOutputField<() => SamplePrismaObjectMap<TMap>['Post']>
    }>
    type TMap = {
      User: () => UpdatedUser
    }

    type TUserInsidePost = ReturnType<
      SamplePrismaObjectMap<TMap>['Post']['value']['fieldMap']['user']['__type']
    >
    type TUserInsideUserPost = ReturnType<
      ReturnType<
        SamplePrismaObjectMap<TMap>['User']['value']['fieldMap']['posts']['__type'][0]
      >['value']['fieldMap']['user']['__type']
    >

    expectType<TypeEqual<TUserInsidePost, UpdatedUser>>(true)
    expectType<TypeEqual<TUserInsideUserPost, UpdatedUser>>(true)
  })
})
