import { expectType } from 'ts-expect'
import type { PGTypes } from './builder'
import type { PGObject, PGOutputField, PGOutputFieldOptionsDefault } from './output'
import type { PrismaObject } from './prisma-converter'
import type { TypeEqual } from 'ts-expect'

type UserFieldMap<
  TObjectRef extends { [key: string]: Function | undefined },
  Types extends PGTypes = PGTypes,
> = {
  id: PGOutputField<string, any, PGOutputFieldOptionsDefault, Types>
  posts: PGOutputField<
    [SamplePrismaObjectMap<TObjectRef, Types>['Post']],
    any,
    PGOutputFieldOptionsDefault,
    Types
  >
}

type PostFieldMap<
  TObjectRef extends { [key: string]: Function | undefined },
  Types extends PGTypes = PGTypes,
> = {
  id: PGOutputField<string, any, PGOutputFieldOptionsDefault, Types>
  user: PGOutputField<
    SamplePrismaObjectMap<TObjectRef, Types>['User'],
    any,
    PGOutputFieldOptionsDefault,
    Types
  >
  comments: PGOutputField<
    [SamplePrismaObjectMap<TObjectRef, Types>['Comment']],
    any,
    PGOutputFieldOptionsDefault,
    Types
  >
}

type CommentFieldMap<
  TObjectRef extends { [key: string]: Function | undefined },
  Types extends PGTypes = PGTypes,
> = {
  id: PGOutputField<string, any, PGOutputFieldOptionsDefault, Types>
  user: PGOutputField<
    SamplePrismaObjectMap<TObjectRef, Types>['User'],
    any,
    PGOutputFieldOptionsDefault,
    Types
  >
  post: PGOutputField<
    SamplePrismaObjectMap<TObjectRef, Types>['Post'],
    any,
    PGOutputFieldOptionsDefault,
    Types
  >
}

interface SamplePrismaObjectMap<
  TObjectRef extends { [key: string]: Function | undefined },
  Types extends PGTypes = PGTypes,
> {
  User: () => PrismaObject<
    TObjectRef,
    'User',
    PGObject<
      UserFieldMap<TObjectRef, Types>,
      undefined,
      { PrismaModelName: 'User' },
      Types
    >
  >
  Post: () => PrismaObject<
    TObjectRef,
    'Post',
    PGObject<
      PostFieldMap<TObjectRef, Types>,
      undefined,
      { PrismaModelName: 'Post' },
      Types
    >
  >
  Comment: () => PrismaObject<
    TObjectRef,
    'Comment',
    PGObject<
      CommentFieldMap<TObjectRef, Types>,
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
      posts: PGOutputField<[SamplePrismaObjectMap<TMap>['Post']]>
      latestPost: PGOutputField<SamplePrismaObjectMap<TMap>['Post']>
    }>
    type UpdatedPost = PGObject<{
      id: PGOutputField<string>
      user: PGOutputField<SamplePrismaObjectMap<TMap>['User']>
    }>
    type TMap = {
      User: () => UpdatedUser
      Post: () => UpdatedPost
    }

    type TUserInsidePost = ReturnType<
      ReturnType<
        SamplePrismaObjectMap<TMap>['Post']
      >['value']['fieldMap']['user']['__type']
    >
    type TPostsInsideUser = ReturnType<
      ReturnType<
        SamplePrismaObjectMap<TMap>['User']
      >['value']['fieldMap']['posts']['__type'][number]
    >
    type TUserInsideUserPost = ReturnType<
      ReturnType<
        ReturnType<
          SamplePrismaObjectMap<TMap>['User']
        >['value']['fieldMap']['posts']['__type'][0]
      >['value']['fieldMap']['user']['__type']
    >

    expectType<TypeEqual<TUserInsidePost, UpdatedUser>>(true)
    expectType<TypeEqual<TPostsInsideUser, UpdatedPost>>(true)
    expectType<TypeEqual<TUserInsideUserPost, UpdatedUser>>(true)
  })
})
