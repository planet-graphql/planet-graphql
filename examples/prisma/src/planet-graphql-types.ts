import { getInternalPGPrismaConverter } from '@planet-graphql/core/dist/prisma-converter'
import type { Prisma } from './prisma-client'
import type { DMMF } from './prisma-client/runtime'
import type { PGTypes, PGBuilder } from '@planet-graphql/core/dist/types/builder'
import type {
  PGEnum,
  PGDecimal,
  TypeOfPGFieldMap,
  RequiredNonNullable,
} from '@planet-graphql/core/dist/types/common'
import type { PGInputField } from '@planet-graphql/core/dist/types/input'
import type {
  PGInputFactory,
  PGInputFactoryUnion,
} from '@planet-graphql/core/dist/types/input-factory'
import type {
  PGOutputField,
  PGOutputFieldOptionsDefault,
  PGObject,
  PGOutputFieldMap,
  PGInterface,
  PGOutputFieldBuilder,
  ConvertPGInterfacesToFieldMap,
  PGObjectOptionsDefault,
  GetPrismaModelNames,
} from '@planet-graphql/core/dist/types/output'
import type { PrismaObject } from '@planet-graphql/core/dist/types/prisma-converter'

type PrismaEnumMap = {}
type UserFieldMapType<
  TObjectRef extends { [key: string]: Function | undefined },
  Types extends PGTypes,
> = {
  id: PGOutputField<number, any, PGOutputFieldOptionsDefault, Types>
  firstName: PGOutputField<string, any, PGOutputFieldOptionsDefault, Types>
  lastName: PGOutputField<string, any, PGOutputFieldOptionsDefault, Types>
  posts: PGOutputField<
    Array<PrismaObjectMap<TObjectRef, Types>['Post']>,
    any,
    PGOutputFieldOptionsDefault,
    Types
  >
}
type PostFieldMapType<
  TObjectRef extends { [key: string]: Function | undefined },
  Types extends PGTypes,
> = {
  id: PGOutputField<number, any, PGOutputFieldOptionsDefault, Types>
  title: PGOutputField<string, any, PGOutputFieldOptionsDefault, Types>
  content: PGOutputField<string, any, PGOutputFieldOptionsDefault, Types>
  author: PGOutputField<
    PrismaObjectMap<TObjectRef, Types>['User'],
    any,
    PGOutputFieldOptionsDefault,
    Types
  >
  authorId: PGOutputField<number, any, PGOutputFieldOptionsDefault, Types>
}
type PrismaObjectMap<
  TObjectRef extends { [key: string]: Function | undefined },
  Types extends PGTypes,
> = {
  User: PrismaObject<
    TObjectRef,
    'User',
    PGObject<
      UserFieldMapType<TObjectRef, Types>,
      undefined,
      { PrismaModelName: 'User' },
      Types
    >
  >
  Post: PrismaObject<
    TObjectRef,
    'Post',
    PGObject<
      PostFieldMapType<TObjectRef, Types>,
      undefined,
      { PrismaModelName: 'Post' },
      Types
    >
  >
}
type UserScalarFieldEnumFactory = PGEnum<['id', 'firstName', 'lastName']>
type PostScalarFieldEnumFactory = PGEnum<['id', 'title', 'content', 'authorId']>
type SortOrderFactory = PGEnum<['asc', 'desc']>
type FindFirstUserFactory<Types extends PGTypes> = {
  where: () => PGInputFactory<UserWhereInputFactory<Types> | undefined, Types>
  orderBy: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      Array<UserOrderByWithRelationInputFactory<Types>> | undefined,
      Types
    >
    UserOrderByWithRelationInputList: () => PGInputFactory<
      Array<UserOrderByWithRelationInputFactory<Types>> | undefined,
      Types
    >
    UserOrderByWithRelationInput: () => PGInputFactory<
      UserOrderByWithRelationInputFactory<Types> | undefined,
      Types
    >
  }>
  cursor: () => PGInputFactory<UserWhereUniqueInputFactory<Types> | undefined, Types>
  take: PGInputField<number | undefined, 'int', Types>
  skip: PGInputField<number | undefined, 'int', Types>
  distinct: PGInputField<UserScalarFieldEnumFactory[] | undefined, 'enum', Types>
}
type FindManyUserFactory<Types extends PGTypes> = {
  where: () => PGInputFactory<UserWhereInputFactory<Types> | undefined, Types>
  orderBy: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      Array<UserOrderByWithRelationInputFactory<Types>> | undefined,
      Types
    >
    UserOrderByWithRelationInputList: () => PGInputFactory<
      Array<UserOrderByWithRelationInputFactory<Types>> | undefined,
      Types
    >
    UserOrderByWithRelationInput: () => PGInputFactory<
      UserOrderByWithRelationInputFactory<Types> | undefined,
      Types
    >
  }>
  cursor: () => PGInputFactory<UserWhereUniqueInputFactory<Types> | undefined, Types>
  take: PGInputField<number | undefined, 'int', Types>
  skip: PGInputField<number | undefined, 'int', Types>
  distinct: PGInputField<UserScalarFieldEnumFactory[] | undefined, 'enum', Types>
}
type AggregateUserFactory<Types extends PGTypes> = {
  where: () => PGInputFactory<UserWhereInputFactory<Types> | undefined, Types>
  orderBy: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      Array<UserOrderByWithRelationInputFactory<Types>> | undefined,
      Types
    >
    UserOrderByWithRelationInputList: () => PGInputFactory<
      Array<UserOrderByWithRelationInputFactory<Types>> | undefined,
      Types
    >
    UserOrderByWithRelationInput: () => PGInputFactory<
      UserOrderByWithRelationInputFactory<Types> | undefined,
      Types
    >
  }>
  cursor: () => PGInputFactory<UserWhereUniqueInputFactory<Types> | undefined, Types>
  take: PGInputField<number | undefined, 'int', Types>
  skip: PGInputField<number | undefined, 'int', Types>
}
type GroupByUserFactory<Types extends PGTypes> = {
  where: () => PGInputFactory<UserWhereInputFactory<Types> | undefined, Types>
  orderBy: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      Array<UserOrderByWithAggregationInputFactory<Types>> | undefined,
      Types
    >
    UserOrderByWithAggregationInputList: () => PGInputFactory<
      Array<UserOrderByWithAggregationInputFactory<Types>> | undefined,
      Types
    >
    UserOrderByWithAggregationInput: () => PGInputFactory<
      UserOrderByWithAggregationInputFactory<Types> | undefined,
      Types
    >
  }>
  by: PGInputFactoryUnion<{
    __default: PGInputField<UserScalarFieldEnumFactory[], 'enum', Types>
    UserScalarFieldEnumList: PGInputField<UserScalarFieldEnumFactory[], 'enum', Types>
    UserScalarFieldEnum: PGInputField<UserScalarFieldEnumFactory, 'enum', Types>
  }>
  having: () => PGInputFactory<
    UserScalarWhereWithAggregatesInputFactory<Types> | undefined,
    Types
  >
  take: PGInputField<number | undefined, 'int', Types>
  skip: PGInputField<number | undefined, 'int', Types>
}
type FindUniqueUserFactory<Types extends PGTypes> = {
  where: () => PGInputFactory<UserWhereUniqueInputFactory<Types>, Types>
}
type FindFirstPostFactory<Types extends PGTypes> = {
  where: () => PGInputFactory<PostWhereInputFactory<Types> | undefined, Types>
  orderBy: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      Array<PostOrderByWithRelationInputFactory<Types>> | undefined,
      Types
    >
    PostOrderByWithRelationInputList: () => PGInputFactory<
      Array<PostOrderByWithRelationInputFactory<Types>> | undefined,
      Types
    >
    PostOrderByWithRelationInput: () => PGInputFactory<
      PostOrderByWithRelationInputFactory<Types> | undefined,
      Types
    >
  }>
  cursor: () => PGInputFactory<PostWhereUniqueInputFactory<Types> | undefined, Types>
  take: PGInputField<number | undefined, 'int', Types>
  skip: PGInputField<number | undefined, 'int', Types>
  distinct: PGInputField<PostScalarFieldEnumFactory[] | undefined, 'enum', Types>
}
type FindManyPostFactory<Types extends PGTypes> = {
  where: () => PGInputFactory<PostWhereInputFactory<Types> | undefined, Types>
  orderBy: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      Array<PostOrderByWithRelationInputFactory<Types>> | undefined,
      Types
    >
    PostOrderByWithRelationInputList: () => PGInputFactory<
      Array<PostOrderByWithRelationInputFactory<Types>> | undefined,
      Types
    >
    PostOrderByWithRelationInput: () => PGInputFactory<
      PostOrderByWithRelationInputFactory<Types> | undefined,
      Types
    >
  }>
  cursor: () => PGInputFactory<PostWhereUniqueInputFactory<Types> | undefined, Types>
  take: PGInputField<number | undefined, 'int', Types>
  skip: PGInputField<number | undefined, 'int', Types>
  distinct: PGInputField<PostScalarFieldEnumFactory[] | undefined, 'enum', Types>
}
type AggregatePostFactory<Types extends PGTypes> = {
  where: () => PGInputFactory<PostWhereInputFactory<Types> | undefined, Types>
  orderBy: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      Array<PostOrderByWithRelationInputFactory<Types>> | undefined,
      Types
    >
    PostOrderByWithRelationInputList: () => PGInputFactory<
      Array<PostOrderByWithRelationInputFactory<Types>> | undefined,
      Types
    >
    PostOrderByWithRelationInput: () => PGInputFactory<
      PostOrderByWithRelationInputFactory<Types> | undefined,
      Types
    >
  }>
  cursor: () => PGInputFactory<PostWhereUniqueInputFactory<Types> | undefined, Types>
  take: PGInputField<number | undefined, 'int', Types>
  skip: PGInputField<number | undefined, 'int', Types>
}
type GroupByPostFactory<Types extends PGTypes> = {
  where: () => PGInputFactory<PostWhereInputFactory<Types> | undefined, Types>
  orderBy: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      Array<PostOrderByWithAggregationInputFactory<Types>> | undefined,
      Types
    >
    PostOrderByWithAggregationInputList: () => PGInputFactory<
      Array<PostOrderByWithAggregationInputFactory<Types>> | undefined,
      Types
    >
    PostOrderByWithAggregationInput: () => PGInputFactory<
      PostOrderByWithAggregationInputFactory<Types> | undefined,
      Types
    >
  }>
  by: PGInputFactoryUnion<{
    __default: PGInputField<PostScalarFieldEnumFactory[], 'enum', Types>
    PostScalarFieldEnumList: PGInputField<PostScalarFieldEnumFactory[], 'enum', Types>
    PostScalarFieldEnum: PGInputField<PostScalarFieldEnumFactory, 'enum', Types>
  }>
  having: () => PGInputFactory<
    PostScalarWhereWithAggregatesInputFactory<Types> | undefined,
    Types
  >
  take: PGInputField<number | undefined, 'int', Types>
  skip: PGInputField<number | undefined, 'int', Types>
}
type FindUniquePostFactory<Types extends PGTypes> = {
  where: () => PGInputFactory<PostWhereUniqueInputFactory<Types>, Types>
}
type CreateOneUserFactory<Types extends PGTypes> = {
  data: PGInputFactoryUnion<{
    __default: () => PGInputFactory<UserCreateInputFactory<Types>, Types>
    UserCreateInput: () => PGInputFactory<UserCreateInputFactory<Types>, Types>
    UserUncheckedCreateInput: () => PGInputFactory<
      UserUncheckedCreateInputFactory<Types>,
      Types
    >
  }>
}
type UpsertOneUserFactory<Types extends PGTypes> = {
  where: () => PGInputFactory<UserWhereUniqueInputFactory<Types>, Types>
  create: PGInputFactoryUnion<{
    __default: () => PGInputFactory<UserCreateInputFactory<Types>, Types>
    UserCreateInput: () => PGInputFactory<UserCreateInputFactory<Types>, Types>
    UserUncheckedCreateInput: () => PGInputFactory<
      UserUncheckedCreateInputFactory<Types>,
      Types
    >
  }>
  update: PGInputFactoryUnion<{
    __default: () => PGInputFactory<UserUpdateInputFactory<Types>, Types>
    UserUpdateInput: () => PGInputFactory<UserUpdateInputFactory<Types>, Types>
    UserUncheckedUpdateInput: () => PGInputFactory<
      UserUncheckedUpdateInputFactory<Types>,
      Types
    >
  }>
}
type DeleteOneUserFactory<Types extends PGTypes> = {
  where: () => PGInputFactory<UserWhereUniqueInputFactory<Types>, Types>
}
type UpdateOneUserFactory<Types extends PGTypes> = {
  data: PGInputFactoryUnion<{
    __default: () => PGInputFactory<UserUpdateInputFactory<Types>, Types>
    UserUpdateInput: () => PGInputFactory<UserUpdateInputFactory<Types>, Types>
    UserUncheckedUpdateInput: () => PGInputFactory<
      UserUncheckedUpdateInputFactory<Types>,
      Types
    >
  }>
  where: () => PGInputFactory<UserWhereUniqueInputFactory<Types>, Types>
}
type UpdateManyUserFactory<Types extends PGTypes> = {
  data: PGInputFactoryUnion<{
    __default: () => PGInputFactory<UserUpdateManyMutationInputFactory<Types>, Types>
    UserUpdateManyMutationInput: () => PGInputFactory<
      UserUpdateManyMutationInputFactory<Types>,
      Types
    >
    UserUncheckedUpdateManyInput: () => PGInputFactory<
      UserUncheckedUpdateManyInputFactory<Types>,
      Types
    >
  }>
  where: () => PGInputFactory<UserWhereInputFactory<Types> | undefined, Types>
}
type DeleteManyUserFactory<Types extends PGTypes> = {
  where: () => PGInputFactory<UserWhereInputFactory<Types> | undefined, Types>
}
type CreateOnePostFactory<Types extends PGTypes> = {
  data: PGInputFactoryUnion<{
    __default: () => PGInputFactory<PostCreateInputFactory<Types>, Types>
    PostCreateInput: () => PGInputFactory<PostCreateInputFactory<Types>, Types>
    PostUncheckedCreateInput: () => PGInputFactory<
      PostUncheckedCreateInputFactory<Types>,
      Types
    >
  }>
}
type UpsertOnePostFactory<Types extends PGTypes> = {
  where: () => PGInputFactory<PostWhereUniqueInputFactory<Types>, Types>
  create: PGInputFactoryUnion<{
    __default: () => PGInputFactory<PostCreateInputFactory<Types>, Types>
    PostCreateInput: () => PGInputFactory<PostCreateInputFactory<Types>, Types>
    PostUncheckedCreateInput: () => PGInputFactory<
      PostUncheckedCreateInputFactory<Types>,
      Types
    >
  }>
  update: PGInputFactoryUnion<{
    __default: () => PGInputFactory<PostUpdateInputFactory<Types>, Types>
    PostUpdateInput: () => PGInputFactory<PostUpdateInputFactory<Types>, Types>
    PostUncheckedUpdateInput: () => PGInputFactory<
      PostUncheckedUpdateInputFactory<Types>,
      Types
    >
  }>
}
type DeleteOnePostFactory<Types extends PGTypes> = {
  where: () => PGInputFactory<PostWhereUniqueInputFactory<Types>, Types>
}
type UpdateOnePostFactory<Types extends PGTypes> = {
  data: PGInputFactoryUnion<{
    __default: () => PGInputFactory<PostUpdateInputFactory<Types>, Types>
    PostUpdateInput: () => PGInputFactory<PostUpdateInputFactory<Types>, Types>
    PostUncheckedUpdateInput: () => PGInputFactory<
      PostUncheckedUpdateInputFactory<Types>,
      Types
    >
  }>
  where: () => PGInputFactory<PostWhereUniqueInputFactory<Types>, Types>
}
type UpdateManyPostFactory<Types extends PGTypes> = {
  data: PGInputFactoryUnion<{
    __default: () => PGInputFactory<PostUpdateManyMutationInputFactory<Types>, Types>
    PostUpdateManyMutationInput: () => PGInputFactory<
      PostUpdateManyMutationInputFactory<Types>,
      Types
    >
    PostUncheckedUpdateManyInput: () => PGInputFactory<
      PostUncheckedUpdateManyInputFactory<Types>,
      Types
    >
  }>
  where: () => PGInputFactory<PostWhereInputFactory<Types> | undefined, Types>
}
type DeleteManyPostFactory<Types extends PGTypes> = {
  where: () => PGInputFactory<PostWhereInputFactory<Types> | undefined, Types>
}
type ExecuteRawFactory<Types extends PGTypes> = {
  query: PGInputField<string, 'string', Types>
  parameters: PGInputField<string | undefined, 'json', Types>
}
type QueryRawFactory<Types extends PGTypes> = {
  query: PGInputField<string, 'string', Types>
  parameters: PGInputField<string | undefined, 'json', Types>
}
type UserWhereInputFactory<Types extends PGTypes> = {
  AND: PGInputFactoryUnion<{
    __default: () => PGInputFactory<UserWhereInputFactory<Types> | undefined, Types>
    UserWhereInput: () => PGInputFactory<
      Array<UserWhereInputFactory<Types>> | undefined,
      Types
    >
    UserWhereInputList: () => PGInputFactory<
      Array<UserWhereInputFactory<Types>> | undefined,
      Types
    >
  }>
  OR: () => PGInputFactory<Array<UserWhereInputFactory<Types>> | undefined, Types>
  NOT: PGInputFactoryUnion<{
    __default: () => PGInputFactory<UserWhereInputFactory<Types> | undefined, Types>
    UserWhereInput: () => PGInputFactory<
      Array<UserWhereInputFactory<Types>> | undefined,
      Types
    >
    UserWhereInputList: () => PGInputFactory<
      Array<UserWhereInputFactory<Types>> | undefined,
      Types
    >
  }>
  id: PGInputFactoryUnion<{
    __default: () => PGInputFactory<IntFilterFactory<Types> | undefined, Types>
    IntFilter: () => PGInputFactory<IntFilterFactory<Types> | undefined, Types>
    Int: PGInputField<number | undefined, 'int', Types>
  }>
  firstName: PGInputFactoryUnion<{
    __default: () => PGInputFactory<StringFilterFactory<Types> | undefined, Types>
    StringFilter: () => PGInputFactory<StringFilterFactory<Types> | undefined, Types>
    String: PGInputField<string | undefined, 'string', Types>
  }>
  lastName: PGInputFactoryUnion<{
    __default: () => PGInputFactory<StringFilterFactory<Types> | undefined, Types>
    StringFilter: () => PGInputFactory<StringFilterFactory<Types> | undefined, Types>
    String: PGInputField<string | undefined, 'string', Types>
  }>
  posts: () => PGInputFactory<PostListRelationFilterFactory<Types> | undefined, Types>
}
type UserOrderByWithRelationInputFactory<Types extends PGTypes> = {
  id: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  firstName: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  lastName: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  posts: () => PGInputFactory<
    PostOrderByRelationAggregateInputFactory<Types> | undefined,
    Types
  >
}
type UserWhereUniqueInputFactory<Types extends PGTypes> = {
  id: PGInputField<number | undefined, 'int', Types>
}
type UserOrderByWithAggregationInputFactory<Types extends PGTypes> = {
  id: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  firstName: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  lastName: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  _count: () => PGInputFactory<
    UserCountOrderByAggregateInputFactory<Types> | undefined,
    Types
  >
  _avg: () => PGInputFactory<
    UserAvgOrderByAggregateInputFactory<Types> | undefined,
    Types
  >
  _max: () => PGInputFactory<
    UserMaxOrderByAggregateInputFactory<Types> | undefined,
    Types
  >
  _min: () => PGInputFactory<
    UserMinOrderByAggregateInputFactory<Types> | undefined,
    Types
  >
  _sum: () => PGInputFactory<
    UserSumOrderByAggregateInputFactory<Types> | undefined,
    Types
  >
}
type UserScalarWhereWithAggregatesInputFactory<Types extends PGTypes> = {
  AND: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      UserScalarWhereWithAggregatesInputFactory<Types> | undefined,
      Types
    >
    UserScalarWhereWithAggregatesInput: () => PGInputFactory<
      Array<UserScalarWhereWithAggregatesInputFactory<Types>> | undefined,
      Types
    >
    UserScalarWhereWithAggregatesInputList: () => PGInputFactory<
      Array<UserScalarWhereWithAggregatesInputFactory<Types>> | undefined,
      Types
    >
  }>
  OR: () => PGInputFactory<
    Array<UserScalarWhereWithAggregatesInputFactory<Types>> | undefined,
    Types
  >
  NOT: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      UserScalarWhereWithAggregatesInputFactory<Types> | undefined,
      Types
    >
    UserScalarWhereWithAggregatesInput: () => PGInputFactory<
      Array<UserScalarWhereWithAggregatesInputFactory<Types>> | undefined,
      Types
    >
    UserScalarWhereWithAggregatesInputList: () => PGInputFactory<
      Array<UserScalarWhereWithAggregatesInputFactory<Types>> | undefined,
      Types
    >
  }>
  id: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      IntWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
    IntWithAggregatesFilter: () => PGInputFactory<
      IntWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
    Int: PGInputField<number | undefined, 'int', Types>
  }>
  firstName: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      StringWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
    StringWithAggregatesFilter: () => PGInputFactory<
      StringWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
    String: PGInputField<string | undefined, 'string', Types>
  }>
  lastName: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      StringWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
    StringWithAggregatesFilter: () => PGInputFactory<
      StringWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
    String: PGInputField<string | undefined, 'string', Types>
  }>
}
type PostWhereInputFactory<Types extends PGTypes> = {
  AND: PGInputFactoryUnion<{
    __default: () => PGInputFactory<PostWhereInputFactory<Types> | undefined, Types>
    PostWhereInput: () => PGInputFactory<
      Array<PostWhereInputFactory<Types>> | undefined,
      Types
    >
    PostWhereInputList: () => PGInputFactory<
      Array<PostWhereInputFactory<Types>> | undefined,
      Types
    >
  }>
  OR: () => PGInputFactory<Array<PostWhereInputFactory<Types>> | undefined, Types>
  NOT: PGInputFactoryUnion<{
    __default: () => PGInputFactory<PostWhereInputFactory<Types> | undefined, Types>
    PostWhereInput: () => PGInputFactory<
      Array<PostWhereInputFactory<Types>> | undefined,
      Types
    >
    PostWhereInputList: () => PGInputFactory<
      Array<PostWhereInputFactory<Types>> | undefined,
      Types
    >
  }>
  id: PGInputFactoryUnion<{
    __default: () => PGInputFactory<IntFilterFactory<Types> | undefined, Types>
    IntFilter: () => PGInputFactory<IntFilterFactory<Types> | undefined, Types>
    Int: PGInputField<number | undefined, 'int', Types>
  }>
  title: PGInputFactoryUnion<{
    __default: () => PGInputFactory<StringFilterFactory<Types> | undefined, Types>
    StringFilter: () => PGInputFactory<StringFilterFactory<Types> | undefined, Types>
    String: PGInputField<string | undefined, 'string', Types>
  }>
  content: PGInputFactoryUnion<{
    __default: () => PGInputFactory<StringFilterFactory<Types> | undefined, Types>
    StringFilter: () => PGInputFactory<StringFilterFactory<Types> | undefined, Types>
    String: PGInputField<string | undefined, 'string', Types>
  }>
  author: PGInputFactoryUnion<{
    __default: () => PGInputFactory<UserRelationFilterFactory<Types> | undefined, Types>
    UserRelationFilter: () => PGInputFactory<
      UserRelationFilterFactory<Types> | undefined,
      Types
    >
    UserWhereInput: () => PGInputFactory<UserWhereInputFactory<Types> | undefined, Types>
  }>
  authorId: PGInputFactoryUnion<{
    __default: () => PGInputFactory<IntFilterFactory<Types> | undefined, Types>
    IntFilter: () => PGInputFactory<IntFilterFactory<Types> | undefined, Types>
    Int: PGInputField<number | undefined, 'int', Types>
  }>
}
type PostOrderByWithRelationInputFactory<Types extends PGTypes> = {
  id: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  title: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  content: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  author: () => PGInputFactory<
    UserOrderByWithRelationInputFactory<Types> | undefined,
    Types
  >
  authorId: PGInputField<SortOrderFactory | undefined, 'enum', Types>
}
type PostWhereUniqueInputFactory<Types extends PGTypes> = {
  id: PGInputField<number | undefined, 'int', Types>
}
type PostOrderByWithAggregationInputFactory<Types extends PGTypes> = {
  id: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  title: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  content: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  authorId: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  _count: () => PGInputFactory<
    PostCountOrderByAggregateInputFactory<Types> | undefined,
    Types
  >
  _avg: () => PGInputFactory<
    PostAvgOrderByAggregateInputFactory<Types> | undefined,
    Types
  >
  _max: () => PGInputFactory<
    PostMaxOrderByAggregateInputFactory<Types> | undefined,
    Types
  >
  _min: () => PGInputFactory<
    PostMinOrderByAggregateInputFactory<Types> | undefined,
    Types
  >
  _sum: () => PGInputFactory<
    PostSumOrderByAggregateInputFactory<Types> | undefined,
    Types
  >
}
type PostScalarWhereWithAggregatesInputFactory<Types extends PGTypes> = {
  AND: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      PostScalarWhereWithAggregatesInputFactory<Types> | undefined,
      Types
    >
    PostScalarWhereWithAggregatesInput: () => PGInputFactory<
      Array<PostScalarWhereWithAggregatesInputFactory<Types>> | undefined,
      Types
    >
    PostScalarWhereWithAggregatesInputList: () => PGInputFactory<
      Array<PostScalarWhereWithAggregatesInputFactory<Types>> | undefined,
      Types
    >
  }>
  OR: () => PGInputFactory<
    Array<PostScalarWhereWithAggregatesInputFactory<Types>> | undefined,
    Types
  >
  NOT: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      PostScalarWhereWithAggregatesInputFactory<Types> | undefined,
      Types
    >
    PostScalarWhereWithAggregatesInput: () => PGInputFactory<
      Array<PostScalarWhereWithAggregatesInputFactory<Types>> | undefined,
      Types
    >
    PostScalarWhereWithAggregatesInputList: () => PGInputFactory<
      Array<PostScalarWhereWithAggregatesInputFactory<Types>> | undefined,
      Types
    >
  }>
  id: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      IntWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
    IntWithAggregatesFilter: () => PGInputFactory<
      IntWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
    Int: PGInputField<number | undefined, 'int', Types>
  }>
  title: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      StringWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
    StringWithAggregatesFilter: () => PGInputFactory<
      StringWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
    String: PGInputField<string | undefined, 'string', Types>
  }>
  content: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      StringWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
    StringWithAggregatesFilter: () => PGInputFactory<
      StringWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
    String: PGInputField<string | undefined, 'string', Types>
  }>
  authorId: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      IntWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
    IntWithAggregatesFilter: () => PGInputFactory<
      IntWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
    Int: PGInputField<number | undefined, 'int', Types>
  }>
}
type UserCreateInputFactory<Types extends PGTypes> = {
  firstName: PGInputField<string, 'string', Types>
  lastName: PGInputField<string, 'string', Types>
  posts: () => PGInputFactory<
    PostCreateNestedManyWithoutAuthorInputFactory<Types> | undefined,
    Types
  >
}
type UserUncheckedCreateInputFactory<Types extends PGTypes> = {
  id: PGInputField<number | undefined, 'int', Types>
  firstName: PGInputField<string, 'string', Types>
  lastName: PGInputField<string, 'string', Types>
  posts: () => PGInputFactory<
    PostUncheckedCreateNestedManyWithoutAuthorInputFactory<Types> | undefined,
    Types
  >
}
type UserUpdateInputFactory<Types extends PGTypes> = {
  firstName: PGInputFactoryUnion<{
    __default: PGInputField<string | undefined, 'string', Types>
    String: PGInputField<string | undefined, 'string', Types>
    StringFieldUpdateOperationsInput: () => PGInputFactory<
      StringFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  lastName: PGInputFactoryUnion<{
    __default: PGInputField<string | undefined, 'string', Types>
    String: PGInputField<string | undefined, 'string', Types>
    StringFieldUpdateOperationsInput: () => PGInputFactory<
      StringFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  posts: () => PGInputFactory<
    PostUpdateManyWithoutAuthorNestedInputFactory<Types> | undefined,
    Types
  >
}
type UserUncheckedUpdateInputFactory<Types extends PGTypes> = {
  id: PGInputFactoryUnion<{
    __default: PGInputField<number | undefined, 'int', Types>
    Int: PGInputField<number | undefined, 'int', Types>
    IntFieldUpdateOperationsInput: () => PGInputFactory<
      IntFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  firstName: PGInputFactoryUnion<{
    __default: PGInputField<string | undefined, 'string', Types>
    String: PGInputField<string | undefined, 'string', Types>
    StringFieldUpdateOperationsInput: () => PGInputFactory<
      StringFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  lastName: PGInputFactoryUnion<{
    __default: PGInputField<string | undefined, 'string', Types>
    String: PGInputField<string | undefined, 'string', Types>
    StringFieldUpdateOperationsInput: () => PGInputFactory<
      StringFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  posts: () => PGInputFactory<
    PostUncheckedUpdateManyWithoutAuthorNestedInputFactory<Types> | undefined,
    Types
  >
}
type UserUpdateManyMutationInputFactory<Types extends PGTypes> = {
  firstName: PGInputFactoryUnion<{
    __default: PGInputField<string | undefined, 'string', Types>
    String: PGInputField<string | undefined, 'string', Types>
    StringFieldUpdateOperationsInput: () => PGInputFactory<
      StringFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  lastName: PGInputFactoryUnion<{
    __default: PGInputField<string | undefined, 'string', Types>
    String: PGInputField<string | undefined, 'string', Types>
    StringFieldUpdateOperationsInput: () => PGInputFactory<
      StringFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
}
type UserUncheckedUpdateManyInputFactory<Types extends PGTypes> = {
  id: PGInputFactoryUnion<{
    __default: PGInputField<number | undefined, 'int', Types>
    Int: PGInputField<number | undefined, 'int', Types>
    IntFieldUpdateOperationsInput: () => PGInputFactory<
      IntFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  firstName: PGInputFactoryUnion<{
    __default: PGInputField<string | undefined, 'string', Types>
    String: PGInputField<string | undefined, 'string', Types>
    StringFieldUpdateOperationsInput: () => PGInputFactory<
      StringFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  lastName: PGInputFactoryUnion<{
    __default: PGInputField<string | undefined, 'string', Types>
    String: PGInputField<string | undefined, 'string', Types>
    StringFieldUpdateOperationsInput: () => PGInputFactory<
      StringFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
}
type PostCreateInputFactory<Types extends PGTypes> = {
  title: PGInputField<string, 'string', Types>
  content: PGInputField<string, 'string', Types>
  author: () => PGInputFactory<UserCreateNestedOneWithoutPostsInputFactory<Types>, Types>
}
type PostUncheckedCreateInputFactory<Types extends PGTypes> = {
  id: PGInputField<number | undefined, 'int', Types>
  title: PGInputField<string, 'string', Types>
  content: PGInputField<string, 'string', Types>
  authorId: PGInputField<number, 'int', Types>
}
type PostUpdateInputFactory<Types extends PGTypes> = {
  title: PGInputFactoryUnion<{
    __default: PGInputField<string | undefined, 'string', Types>
    String: PGInputField<string | undefined, 'string', Types>
    StringFieldUpdateOperationsInput: () => PGInputFactory<
      StringFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  content: PGInputFactoryUnion<{
    __default: PGInputField<string | undefined, 'string', Types>
    String: PGInputField<string | undefined, 'string', Types>
    StringFieldUpdateOperationsInput: () => PGInputFactory<
      StringFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  author: () => PGInputFactory<
    UserUpdateOneRequiredWithoutPostsNestedInputFactory<Types> | undefined,
    Types
  >
}
type PostUncheckedUpdateInputFactory<Types extends PGTypes> = {
  id: PGInputFactoryUnion<{
    __default: PGInputField<number | undefined, 'int', Types>
    Int: PGInputField<number | undefined, 'int', Types>
    IntFieldUpdateOperationsInput: () => PGInputFactory<
      IntFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  title: PGInputFactoryUnion<{
    __default: PGInputField<string | undefined, 'string', Types>
    String: PGInputField<string | undefined, 'string', Types>
    StringFieldUpdateOperationsInput: () => PGInputFactory<
      StringFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  content: PGInputFactoryUnion<{
    __default: PGInputField<string | undefined, 'string', Types>
    String: PGInputField<string | undefined, 'string', Types>
    StringFieldUpdateOperationsInput: () => PGInputFactory<
      StringFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  authorId: PGInputFactoryUnion<{
    __default: PGInputField<number | undefined, 'int', Types>
    Int: PGInputField<number | undefined, 'int', Types>
    IntFieldUpdateOperationsInput: () => PGInputFactory<
      IntFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
}
type PostUpdateManyMutationInputFactory<Types extends PGTypes> = {
  title: PGInputFactoryUnion<{
    __default: PGInputField<string | undefined, 'string', Types>
    String: PGInputField<string | undefined, 'string', Types>
    StringFieldUpdateOperationsInput: () => PGInputFactory<
      StringFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  content: PGInputFactoryUnion<{
    __default: PGInputField<string | undefined, 'string', Types>
    String: PGInputField<string | undefined, 'string', Types>
    StringFieldUpdateOperationsInput: () => PGInputFactory<
      StringFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
}
type PostUncheckedUpdateManyInputFactory<Types extends PGTypes> = {
  id: PGInputFactoryUnion<{
    __default: PGInputField<number | undefined, 'int', Types>
    Int: PGInputField<number | undefined, 'int', Types>
    IntFieldUpdateOperationsInput: () => PGInputFactory<
      IntFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  title: PGInputFactoryUnion<{
    __default: PGInputField<string | undefined, 'string', Types>
    String: PGInputField<string | undefined, 'string', Types>
    StringFieldUpdateOperationsInput: () => PGInputFactory<
      StringFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  content: PGInputFactoryUnion<{
    __default: PGInputField<string | undefined, 'string', Types>
    String: PGInputField<string | undefined, 'string', Types>
    StringFieldUpdateOperationsInput: () => PGInputFactory<
      StringFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  authorId: PGInputFactoryUnion<{
    __default: PGInputField<number | undefined, 'int', Types>
    Int: PGInputField<number | undefined, 'int', Types>
    IntFieldUpdateOperationsInput: () => PGInputFactory<
      IntFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
}
type IntFilterFactory<Types extends PGTypes> = {
  equals: PGInputField<number | undefined, 'int', Types>
  in: PGInputField<number[] | undefined, 'int', Types>
  notIn: PGInputField<number[] | undefined, 'int', Types>
  lt: PGInputField<number | undefined, 'int', Types>
  lte: PGInputField<number | undefined, 'int', Types>
  gt: PGInputField<number | undefined, 'int', Types>
  gte: PGInputField<number | undefined, 'int', Types>
  not: PGInputFactoryUnion<{
    __default: PGInputField<number | undefined, 'int', Types>
    Int: PGInputField<number | undefined, 'int', Types>
    NestedIntFilter: () => PGInputFactory<
      NestedIntFilterFactory<Types> | undefined,
      Types
    >
  }>
}
type StringFilterFactory<Types extends PGTypes> = {
  equals: PGInputField<string | undefined, 'string', Types>
  in: PGInputField<string[] | undefined, 'string', Types>
  notIn: PGInputField<string[] | undefined, 'string', Types>
  lt: PGInputField<string | undefined, 'string', Types>
  lte: PGInputField<string | undefined, 'string', Types>
  gt: PGInputField<string | undefined, 'string', Types>
  gte: PGInputField<string | undefined, 'string', Types>
  contains: PGInputField<string | undefined, 'string', Types>
  startsWith: PGInputField<string | undefined, 'string', Types>
  endsWith: PGInputField<string | undefined, 'string', Types>
  not: PGInputFactoryUnion<{
    __default: PGInputField<string | undefined, 'string', Types>
    String: PGInputField<string | undefined, 'string', Types>
    NestedStringFilter: () => PGInputFactory<
      NestedStringFilterFactory<Types> | undefined,
      Types
    >
  }>
}
type PostListRelationFilterFactory<Types extends PGTypes> = {
  every: () => PGInputFactory<PostWhereInputFactory<Types> | undefined, Types>
  some: () => PGInputFactory<PostWhereInputFactory<Types> | undefined, Types>
  none: () => PGInputFactory<PostWhereInputFactory<Types> | undefined, Types>
}
type PostOrderByRelationAggregateInputFactory<Types extends PGTypes> = {
  _count: PGInputField<SortOrderFactory | undefined, 'enum', Types>
}
type UserCountOrderByAggregateInputFactory<Types extends PGTypes> = {
  id: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  firstName: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  lastName: PGInputField<SortOrderFactory | undefined, 'enum', Types>
}
type UserAvgOrderByAggregateInputFactory<Types extends PGTypes> = {
  id: PGInputField<SortOrderFactory | undefined, 'enum', Types>
}
type UserMaxOrderByAggregateInputFactory<Types extends PGTypes> = {
  id: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  firstName: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  lastName: PGInputField<SortOrderFactory | undefined, 'enum', Types>
}
type UserMinOrderByAggregateInputFactory<Types extends PGTypes> = {
  id: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  firstName: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  lastName: PGInputField<SortOrderFactory | undefined, 'enum', Types>
}
type UserSumOrderByAggregateInputFactory<Types extends PGTypes> = {
  id: PGInputField<SortOrderFactory | undefined, 'enum', Types>
}
type IntWithAggregatesFilterFactory<Types extends PGTypes> = {
  equals: PGInputField<number | undefined, 'int', Types>
  in: PGInputField<number[] | undefined, 'int', Types>
  notIn: PGInputField<number[] | undefined, 'int', Types>
  lt: PGInputField<number | undefined, 'int', Types>
  lte: PGInputField<number | undefined, 'int', Types>
  gt: PGInputField<number | undefined, 'int', Types>
  gte: PGInputField<number | undefined, 'int', Types>
  not: PGInputFactoryUnion<{
    __default: PGInputField<number | undefined, 'int', Types>
    Int: PGInputField<number | undefined, 'int', Types>
    NestedIntWithAggregatesFilter: () => PGInputFactory<
      NestedIntWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
  }>
  _count: () => PGInputFactory<NestedIntFilterFactory<Types> | undefined, Types>
  _avg: () => PGInputFactory<NestedFloatFilterFactory<Types> | undefined, Types>
  _sum: () => PGInputFactory<NestedIntFilterFactory<Types> | undefined, Types>
  _min: () => PGInputFactory<NestedIntFilterFactory<Types> | undefined, Types>
  _max: () => PGInputFactory<NestedIntFilterFactory<Types> | undefined, Types>
}
type StringWithAggregatesFilterFactory<Types extends PGTypes> = {
  equals: PGInputField<string | undefined, 'string', Types>
  in: PGInputField<string[] | undefined, 'string', Types>
  notIn: PGInputField<string[] | undefined, 'string', Types>
  lt: PGInputField<string | undefined, 'string', Types>
  lte: PGInputField<string | undefined, 'string', Types>
  gt: PGInputField<string | undefined, 'string', Types>
  gte: PGInputField<string | undefined, 'string', Types>
  contains: PGInputField<string | undefined, 'string', Types>
  startsWith: PGInputField<string | undefined, 'string', Types>
  endsWith: PGInputField<string | undefined, 'string', Types>
  not: PGInputFactoryUnion<{
    __default: PGInputField<string | undefined, 'string', Types>
    String: PGInputField<string | undefined, 'string', Types>
    NestedStringWithAggregatesFilter: () => PGInputFactory<
      NestedStringWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
  }>
  _count: () => PGInputFactory<NestedIntFilterFactory<Types> | undefined, Types>
  _min: () => PGInputFactory<NestedStringFilterFactory<Types> | undefined, Types>
  _max: () => PGInputFactory<NestedStringFilterFactory<Types> | undefined, Types>
}
type UserRelationFilterFactory<Types extends PGTypes> = {
  is: () => PGInputFactory<UserWhereInputFactory<Types> | undefined, Types>
  isNot: () => PGInputFactory<UserWhereInputFactory<Types> | undefined, Types>
}
type PostCountOrderByAggregateInputFactory<Types extends PGTypes> = {
  id: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  title: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  content: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  authorId: PGInputField<SortOrderFactory | undefined, 'enum', Types>
}
type PostAvgOrderByAggregateInputFactory<Types extends PGTypes> = {
  id: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  authorId: PGInputField<SortOrderFactory | undefined, 'enum', Types>
}
type PostMaxOrderByAggregateInputFactory<Types extends PGTypes> = {
  id: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  title: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  content: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  authorId: PGInputField<SortOrderFactory | undefined, 'enum', Types>
}
type PostMinOrderByAggregateInputFactory<Types extends PGTypes> = {
  id: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  title: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  content: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  authorId: PGInputField<SortOrderFactory | undefined, 'enum', Types>
}
type PostSumOrderByAggregateInputFactory<Types extends PGTypes> = {
  id: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  authorId: PGInputField<SortOrderFactory | undefined, 'enum', Types>
}
type PostCreateNestedManyWithoutAuthorInputFactory<Types extends PGTypes> = {
  create: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      PostCreateWithoutAuthorInputFactory<Types> | undefined,
      Types
    >
    PostCreateWithoutAuthorInput: () => PGInputFactory<
      Array<PostCreateWithoutAuthorInputFactory<Types>> | undefined,
      Types
    >
    PostCreateWithoutAuthorInputList: () => PGInputFactory<
      Array<PostCreateWithoutAuthorInputFactory<Types>> | undefined,
      Types
    >
    PostUncheckedCreateWithoutAuthorInput: () => PGInputFactory<
      Array<PostUncheckedCreateWithoutAuthorInputFactory<Types>> | undefined,
      Types
    >
    PostUncheckedCreateWithoutAuthorInputList: () => PGInputFactory<
      Array<PostUncheckedCreateWithoutAuthorInputFactory<Types>> | undefined,
      Types
    >
  }>
  connectOrCreate: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      PostCreateOrConnectWithoutAuthorInputFactory<Types> | undefined,
      Types
    >
    PostCreateOrConnectWithoutAuthorInput: () => PGInputFactory<
      Array<PostCreateOrConnectWithoutAuthorInputFactory<Types>> | undefined,
      Types
    >
    PostCreateOrConnectWithoutAuthorInputList: () => PGInputFactory<
      Array<PostCreateOrConnectWithoutAuthorInputFactory<Types>> | undefined,
      Types
    >
  }>
  connect: PGInputFactoryUnion<{
    __default: () => PGInputFactory<PostWhereUniqueInputFactory<Types> | undefined, Types>
    PostWhereUniqueInput: () => PGInputFactory<
      Array<PostWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
    PostWhereUniqueInputList: () => PGInputFactory<
      Array<PostWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
  }>
}
type PostUncheckedCreateNestedManyWithoutAuthorInputFactory<Types extends PGTypes> = {
  create: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      PostCreateWithoutAuthorInputFactory<Types> | undefined,
      Types
    >
    PostCreateWithoutAuthorInput: () => PGInputFactory<
      Array<PostCreateWithoutAuthorInputFactory<Types>> | undefined,
      Types
    >
    PostCreateWithoutAuthorInputList: () => PGInputFactory<
      Array<PostCreateWithoutAuthorInputFactory<Types>> | undefined,
      Types
    >
    PostUncheckedCreateWithoutAuthorInput: () => PGInputFactory<
      Array<PostUncheckedCreateWithoutAuthorInputFactory<Types>> | undefined,
      Types
    >
    PostUncheckedCreateWithoutAuthorInputList: () => PGInputFactory<
      Array<PostUncheckedCreateWithoutAuthorInputFactory<Types>> | undefined,
      Types
    >
  }>
  connectOrCreate: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      PostCreateOrConnectWithoutAuthorInputFactory<Types> | undefined,
      Types
    >
    PostCreateOrConnectWithoutAuthorInput: () => PGInputFactory<
      Array<PostCreateOrConnectWithoutAuthorInputFactory<Types>> | undefined,
      Types
    >
    PostCreateOrConnectWithoutAuthorInputList: () => PGInputFactory<
      Array<PostCreateOrConnectWithoutAuthorInputFactory<Types>> | undefined,
      Types
    >
  }>
  connect: PGInputFactoryUnion<{
    __default: () => PGInputFactory<PostWhereUniqueInputFactory<Types> | undefined, Types>
    PostWhereUniqueInput: () => PGInputFactory<
      Array<PostWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
    PostWhereUniqueInputList: () => PGInputFactory<
      Array<PostWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
  }>
}
type StringFieldUpdateOperationsInputFactory<Types extends PGTypes> = {
  set: PGInputField<string | undefined, 'string', Types>
}
type PostUpdateManyWithoutAuthorNestedInputFactory<Types extends PGTypes> = {
  create: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      PostCreateWithoutAuthorInputFactory<Types> | undefined,
      Types
    >
    PostCreateWithoutAuthorInput: () => PGInputFactory<
      Array<PostCreateWithoutAuthorInputFactory<Types>> | undefined,
      Types
    >
    PostCreateWithoutAuthorInputList: () => PGInputFactory<
      Array<PostCreateWithoutAuthorInputFactory<Types>> | undefined,
      Types
    >
    PostUncheckedCreateWithoutAuthorInput: () => PGInputFactory<
      Array<PostUncheckedCreateWithoutAuthorInputFactory<Types>> | undefined,
      Types
    >
    PostUncheckedCreateWithoutAuthorInputList: () => PGInputFactory<
      Array<PostUncheckedCreateWithoutAuthorInputFactory<Types>> | undefined,
      Types
    >
  }>
  connectOrCreate: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      PostCreateOrConnectWithoutAuthorInputFactory<Types> | undefined,
      Types
    >
    PostCreateOrConnectWithoutAuthorInput: () => PGInputFactory<
      Array<PostCreateOrConnectWithoutAuthorInputFactory<Types>> | undefined,
      Types
    >
    PostCreateOrConnectWithoutAuthorInputList: () => PGInputFactory<
      Array<PostCreateOrConnectWithoutAuthorInputFactory<Types>> | undefined,
      Types
    >
  }>
  upsert: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      PostUpsertWithWhereUniqueWithoutAuthorInputFactory<Types> | undefined,
      Types
    >
    PostUpsertWithWhereUniqueWithoutAuthorInput: () => PGInputFactory<
      Array<PostUpsertWithWhereUniqueWithoutAuthorInputFactory<Types>> | undefined,
      Types
    >
    PostUpsertWithWhereUniqueWithoutAuthorInputList: () => PGInputFactory<
      Array<PostUpsertWithWhereUniqueWithoutAuthorInputFactory<Types>> | undefined,
      Types
    >
  }>
  set: PGInputFactoryUnion<{
    __default: () => PGInputFactory<PostWhereUniqueInputFactory<Types> | undefined, Types>
    PostWhereUniqueInput: () => PGInputFactory<
      Array<PostWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
    PostWhereUniqueInputList: () => PGInputFactory<
      Array<PostWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
  }>
  disconnect: PGInputFactoryUnion<{
    __default: () => PGInputFactory<PostWhereUniqueInputFactory<Types> | undefined, Types>
    PostWhereUniqueInput: () => PGInputFactory<
      Array<PostWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
    PostWhereUniqueInputList: () => PGInputFactory<
      Array<PostWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
  }>
  delete: PGInputFactoryUnion<{
    __default: () => PGInputFactory<PostWhereUniqueInputFactory<Types> | undefined, Types>
    PostWhereUniqueInput: () => PGInputFactory<
      Array<PostWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
    PostWhereUniqueInputList: () => PGInputFactory<
      Array<PostWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
  }>
  connect: PGInputFactoryUnion<{
    __default: () => PGInputFactory<PostWhereUniqueInputFactory<Types> | undefined, Types>
    PostWhereUniqueInput: () => PGInputFactory<
      Array<PostWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
    PostWhereUniqueInputList: () => PGInputFactory<
      Array<PostWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
  }>
  update: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      PostUpdateWithWhereUniqueWithoutAuthorInputFactory<Types> | undefined,
      Types
    >
    PostUpdateWithWhereUniqueWithoutAuthorInput: () => PGInputFactory<
      Array<PostUpdateWithWhereUniqueWithoutAuthorInputFactory<Types>> | undefined,
      Types
    >
    PostUpdateWithWhereUniqueWithoutAuthorInputList: () => PGInputFactory<
      Array<PostUpdateWithWhereUniqueWithoutAuthorInputFactory<Types>> | undefined,
      Types
    >
  }>
  updateMany: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      PostUpdateManyWithWhereWithoutAuthorInputFactory<Types> | undefined,
      Types
    >
    PostUpdateManyWithWhereWithoutAuthorInput: () => PGInputFactory<
      Array<PostUpdateManyWithWhereWithoutAuthorInputFactory<Types>> | undefined,
      Types
    >
    PostUpdateManyWithWhereWithoutAuthorInputList: () => PGInputFactory<
      Array<PostUpdateManyWithWhereWithoutAuthorInputFactory<Types>> | undefined,
      Types
    >
  }>
  deleteMany: PGInputFactoryUnion<{
    __default: () => PGInputFactory<PostScalarWhereInputFactory<Types> | undefined, Types>
    PostScalarWhereInput: () => PGInputFactory<
      Array<PostScalarWhereInputFactory<Types>> | undefined,
      Types
    >
    PostScalarWhereInputList: () => PGInputFactory<
      Array<PostScalarWhereInputFactory<Types>> | undefined,
      Types
    >
  }>
}
type IntFieldUpdateOperationsInputFactory<Types extends PGTypes> = {
  set: PGInputField<number | undefined, 'int', Types>
  increment: PGInputField<number | undefined, 'int', Types>
  decrement: PGInputField<number | undefined, 'int', Types>
  multiply: PGInputField<number | undefined, 'int', Types>
  divide: PGInputField<number | undefined, 'int', Types>
}
type PostUncheckedUpdateManyWithoutAuthorNestedInputFactory<Types extends PGTypes> = {
  create: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      PostCreateWithoutAuthorInputFactory<Types> | undefined,
      Types
    >
    PostCreateWithoutAuthorInput: () => PGInputFactory<
      Array<PostCreateWithoutAuthorInputFactory<Types>> | undefined,
      Types
    >
    PostCreateWithoutAuthorInputList: () => PGInputFactory<
      Array<PostCreateWithoutAuthorInputFactory<Types>> | undefined,
      Types
    >
    PostUncheckedCreateWithoutAuthorInput: () => PGInputFactory<
      Array<PostUncheckedCreateWithoutAuthorInputFactory<Types>> | undefined,
      Types
    >
    PostUncheckedCreateWithoutAuthorInputList: () => PGInputFactory<
      Array<PostUncheckedCreateWithoutAuthorInputFactory<Types>> | undefined,
      Types
    >
  }>
  connectOrCreate: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      PostCreateOrConnectWithoutAuthorInputFactory<Types> | undefined,
      Types
    >
    PostCreateOrConnectWithoutAuthorInput: () => PGInputFactory<
      Array<PostCreateOrConnectWithoutAuthorInputFactory<Types>> | undefined,
      Types
    >
    PostCreateOrConnectWithoutAuthorInputList: () => PGInputFactory<
      Array<PostCreateOrConnectWithoutAuthorInputFactory<Types>> | undefined,
      Types
    >
  }>
  upsert: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      PostUpsertWithWhereUniqueWithoutAuthorInputFactory<Types> | undefined,
      Types
    >
    PostUpsertWithWhereUniqueWithoutAuthorInput: () => PGInputFactory<
      Array<PostUpsertWithWhereUniqueWithoutAuthorInputFactory<Types>> | undefined,
      Types
    >
    PostUpsertWithWhereUniqueWithoutAuthorInputList: () => PGInputFactory<
      Array<PostUpsertWithWhereUniqueWithoutAuthorInputFactory<Types>> | undefined,
      Types
    >
  }>
  set: PGInputFactoryUnion<{
    __default: () => PGInputFactory<PostWhereUniqueInputFactory<Types> | undefined, Types>
    PostWhereUniqueInput: () => PGInputFactory<
      Array<PostWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
    PostWhereUniqueInputList: () => PGInputFactory<
      Array<PostWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
  }>
  disconnect: PGInputFactoryUnion<{
    __default: () => PGInputFactory<PostWhereUniqueInputFactory<Types> | undefined, Types>
    PostWhereUniqueInput: () => PGInputFactory<
      Array<PostWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
    PostWhereUniqueInputList: () => PGInputFactory<
      Array<PostWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
  }>
  delete: PGInputFactoryUnion<{
    __default: () => PGInputFactory<PostWhereUniqueInputFactory<Types> | undefined, Types>
    PostWhereUniqueInput: () => PGInputFactory<
      Array<PostWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
    PostWhereUniqueInputList: () => PGInputFactory<
      Array<PostWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
  }>
  connect: PGInputFactoryUnion<{
    __default: () => PGInputFactory<PostWhereUniqueInputFactory<Types> | undefined, Types>
    PostWhereUniqueInput: () => PGInputFactory<
      Array<PostWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
    PostWhereUniqueInputList: () => PGInputFactory<
      Array<PostWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
  }>
  update: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      PostUpdateWithWhereUniqueWithoutAuthorInputFactory<Types> | undefined,
      Types
    >
    PostUpdateWithWhereUniqueWithoutAuthorInput: () => PGInputFactory<
      Array<PostUpdateWithWhereUniqueWithoutAuthorInputFactory<Types>> | undefined,
      Types
    >
    PostUpdateWithWhereUniqueWithoutAuthorInputList: () => PGInputFactory<
      Array<PostUpdateWithWhereUniqueWithoutAuthorInputFactory<Types>> | undefined,
      Types
    >
  }>
  updateMany: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      PostUpdateManyWithWhereWithoutAuthorInputFactory<Types> | undefined,
      Types
    >
    PostUpdateManyWithWhereWithoutAuthorInput: () => PGInputFactory<
      Array<PostUpdateManyWithWhereWithoutAuthorInputFactory<Types>> | undefined,
      Types
    >
    PostUpdateManyWithWhereWithoutAuthorInputList: () => PGInputFactory<
      Array<PostUpdateManyWithWhereWithoutAuthorInputFactory<Types>> | undefined,
      Types
    >
  }>
  deleteMany: PGInputFactoryUnion<{
    __default: () => PGInputFactory<PostScalarWhereInputFactory<Types> | undefined, Types>
    PostScalarWhereInput: () => PGInputFactory<
      Array<PostScalarWhereInputFactory<Types>> | undefined,
      Types
    >
    PostScalarWhereInputList: () => PGInputFactory<
      Array<PostScalarWhereInputFactory<Types>> | undefined,
      Types
    >
  }>
}
type UserCreateNestedOneWithoutPostsInputFactory<Types extends PGTypes> = {
  create: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      UserCreateWithoutPostsInputFactory<Types> | undefined,
      Types
    >
    UserCreateWithoutPostsInput: () => PGInputFactory<
      UserCreateWithoutPostsInputFactory<Types> | undefined,
      Types
    >
    UserUncheckedCreateWithoutPostsInput: () => PGInputFactory<
      UserUncheckedCreateWithoutPostsInputFactory<Types> | undefined,
      Types
    >
  }>
  connectOrCreate: () => PGInputFactory<
    UserCreateOrConnectWithoutPostsInputFactory<Types> | undefined,
    Types
  >
  connect: () => PGInputFactory<UserWhereUniqueInputFactory<Types> | undefined, Types>
}
type UserUpdateOneRequiredWithoutPostsNestedInputFactory<Types extends PGTypes> = {
  create: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      UserCreateWithoutPostsInputFactory<Types> | undefined,
      Types
    >
    UserCreateWithoutPostsInput: () => PGInputFactory<
      UserCreateWithoutPostsInputFactory<Types> | undefined,
      Types
    >
    UserUncheckedCreateWithoutPostsInput: () => PGInputFactory<
      UserUncheckedCreateWithoutPostsInputFactory<Types> | undefined,
      Types
    >
  }>
  connectOrCreate: () => PGInputFactory<
    UserCreateOrConnectWithoutPostsInputFactory<Types> | undefined,
    Types
  >
  upsert: () => PGInputFactory<
    UserUpsertWithoutPostsInputFactory<Types> | undefined,
    Types
  >
  connect: () => PGInputFactory<UserWhereUniqueInputFactory<Types> | undefined, Types>
  update: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      UserUpdateWithoutPostsInputFactory<Types> | undefined,
      Types
    >
    UserUpdateWithoutPostsInput: () => PGInputFactory<
      UserUpdateWithoutPostsInputFactory<Types> | undefined,
      Types
    >
    UserUncheckedUpdateWithoutPostsInput: () => PGInputFactory<
      UserUncheckedUpdateWithoutPostsInputFactory<Types> | undefined,
      Types
    >
  }>
}
type NestedIntFilterFactory<Types extends PGTypes> = {
  equals: PGInputField<number | undefined, 'int', Types>
  in: PGInputField<number[] | undefined, 'int', Types>
  notIn: PGInputField<number[] | undefined, 'int', Types>
  lt: PGInputField<number | undefined, 'int', Types>
  lte: PGInputField<number | undefined, 'int', Types>
  gt: PGInputField<number | undefined, 'int', Types>
  gte: PGInputField<number | undefined, 'int', Types>
  not: PGInputFactoryUnion<{
    __default: PGInputField<number | undefined, 'int', Types>
    Int: PGInputField<number | undefined, 'int', Types>
    NestedIntFilter: () => PGInputFactory<
      NestedIntFilterFactory<Types> | undefined,
      Types
    >
  }>
}
type NestedStringFilterFactory<Types extends PGTypes> = {
  equals: PGInputField<string | undefined, 'string', Types>
  in: PGInputField<string[] | undefined, 'string', Types>
  notIn: PGInputField<string[] | undefined, 'string', Types>
  lt: PGInputField<string | undefined, 'string', Types>
  lte: PGInputField<string | undefined, 'string', Types>
  gt: PGInputField<string | undefined, 'string', Types>
  gte: PGInputField<string | undefined, 'string', Types>
  contains: PGInputField<string | undefined, 'string', Types>
  startsWith: PGInputField<string | undefined, 'string', Types>
  endsWith: PGInputField<string | undefined, 'string', Types>
  not: PGInputFactoryUnion<{
    __default: PGInputField<string | undefined, 'string', Types>
    String: PGInputField<string | undefined, 'string', Types>
    NestedStringFilter: () => PGInputFactory<
      NestedStringFilterFactory<Types> | undefined,
      Types
    >
  }>
}
type NestedIntWithAggregatesFilterFactory<Types extends PGTypes> = {
  equals: PGInputField<number | undefined, 'int', Types>
  in: PGInputField<number[] | undefined, 'int', Types>
  notIn: PGInputField<number[] | undefined, 'int', Types>
  lt: PGInputField<number | undefined, 'int', Types>
  lte: PGInputField<number | undefined, 'int', Types>
  gt: PGInputField<number | undefined, 'int', Types>
  gte: PGInputField<number | undefined, 'int', Types>
  not: PGInputFactoryUnion<{
    __default: PGInputField<number | undefined, 'int', Types>
    Int: PGInputField<number | undefined, 'int', Types>
    NestedIntWithAggregatesFilter: () => PGInputFactory<
      NestedIntWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
  }>
  _count: () => PGInputFactory<NestedIntFilterFactory<Types> | undefined, Types>
  _avg: () => PGInputFactory<NestedFloatFilterFactory<Types> | undefined, Types>
  _sum: () => PGInputFactory<NestedIntFilterFactory<Types> | undefined, Types>
  _min: () => PGInputFactory<NestedIntFilterFactory<Types> | undefined, Types>
  _max: () => PGInputFactory<NestedIntFilterFactory<Types> | undefined, Types>
}
type NestedFloatFilterFactory<Types extends PGTypes> = {
  equals: PGInputField<number | undefined, 'float', Types>
  in: PGInputField<number[] | undefined, 'float', Types>
  notIn: PGInputField<number[] | undefined, 'float', Types>
  lt: PGInputField<number | undefined, 'float', Types>
  lte: PGInputField<number | undefined, 'float', Types>
  gt: PGInputField<number | undefined, 'float', Types>
  gte: PGInputField<number | undefined, 'float', Types>
  not: PGInputFactoryUnion<{
    __default: PGInputField<number | undefined, 'float', Types>
    Float: PGInputField<number | undefined, 'float', Types>
    NestedFloatFilter: () => PGInputFactory<
      NestedFloatFilterFactory<Types> | undefined,
      Types
    >
  }>
}
type NestedStringWithAggregatesFilterFactory<Types extends PGTypes> = {
  equals: PGInputField<string | undefined, 'string', Types>
  in: PGInputField<string[] | undefined, 'string', Types>
  notIn: PGInputField<string[] | undefined, 'string', Types>
  lt: PGInputField<string | undefined, 'string', Types>
  lte: PGInputField<string | undefined, 'string', Types>
  gt: PGInputField<string | undefined, 'string', Types>
  gte: PGInputField<string | undefined, 'string', Types>
  contains: PGInputField<string | undefined, 'string', Types>
  startsWith: PGInputField<string | undefined, 'string', Types>
  endsWith: PGInputField<string | undefined, 'string', Types>
  not: PGInputFactoryUnion<{
    __default: PGInputField<string | undefined, 'string', Types>
    String: PGInputField<string | undefined, 'string', Types>
    NestedStringWithAggregatesFilter: () => PGInputFactory<
      NestedStringWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
  }>
  _count: () => PGInputFactory<NestedIntFilterFactory<Types> | undefined, Types>
  _min: () => PGInputFactory<NestedStringFilterFactory<Types> | undefined, Types>
  _max: () => PGInputFactory<NestedStringFilterFactory<Types> | undefined, Types>
}
type PostCreateWithoutAuthorInputFactory<Types extends PGTypes> = {
  title: PGInputField<string, 'string', Types>
  content: PGInputField<string, 'string', Types>
}
type PostUncheckedCreateWithoutAuthorInputFactory<Types extends PGTypes> = {
  id: PGInputField<number | undefined, 'int', Types>
  title: PGInputField<string, 'string', Types>
  content: PGInputField<string, 'string', Types>
}
type PostCreateOrConnectWithoutAuthorInputFactory<Types extends PGTypes> = {
  where: () => PGInputFactory<PostWhereUniqueInputFactory<Types>, Types>
  create: PGInputFactoryUnion<{
    __default: () => PGInputFactory<PostCreateWithoutAuthorInputFactory<Types>, Types>
    PostCreateWithoutAuthorInput: () => PGInputFactory<
      PostCreateWithoutAuthorInputFactory<Types>,
      Types
    >
    PostUncheckedCreateWithoutAuthorInput: () => PGInputFactory<
      PostUncheckedCreateWithoutAuthorInputFactory<Types>,
      Types
    >
  }>
}
type PostUpsertWithWhereUniqueWithoutAuthorInputFactory<Types extends PGTypes> = {
  where: () => PGInputFactory<PostWhereUniqueInputFactory<Types>, Types>
  update: PGInputFactoryUnion<{
    __default: () => PGInputFactory<PostUpdateWithoutAuthorInputFactory<Types>, Types>
    PostUpdateWithoutAuthorInput: () => PGInputFactory<
      PostUpdateWithoutAuthorInputFactory<Types>,
      Types
    >
    PostUncheckedUpdateWithoutAuthorInput: () => PGInputFactory<
      PostUncheckedUpdateWithoutAuthorInputFactory<Types>,
      Types
    >
  }>
  create: PGInputFactoryUnion<{
    __default: () => PGInputFactory<PostCreateWithoutAuthorInputFactory<Types>, Types>
    PostCreateWithoutAuthorInput: () => PGInputFactory<
      PostCreateWithoutAuthorInputFactory<Types>,
      Types
    >
    PostUncheckedCreateWithoutAuthorInput: () => PGInputFactory<
      PostUncheckedCreateWithoutAuthorInputFactory<Types>,
      Types
    >
  }>
}
type PostUpdateWithWhereUniqueWithoutAuthorInputFactory<Types extends PGTypes> = {
  where: () => PGInputFactory<PostWhereUniqueInputFactory<Types>, Types>
  data: PGInputFactoryUnion<{
    __default: () => PGInputFactory<PostUpdateWithoutAuthorInputFactory<Types>, Types>
    PostUpdateWithoutAuthorInput: () => PGInputFactory<
      PostUpdateWithoutAuthorInputFactory<Types>,
      Types
    >
    PostUncheckedUpdateWithoutAuthorInput: () => PGInputFactory<
      PostUncheckedUpdateWithoutAuthorInputFactory<Types>,
      Types
    >
  }>
}
type PostUpdateManyWithWhereWithoutAuthorInputFactory<Types extends PGTypes> = {
  where: () => PGInputFactory<PostScalarWhereInputFactory<Types>, Types>
  data: PGInputFactoryUnion<{
    __default: () => PGInputFactory<PostUpdateManyMutationInputFactory<Types>, Types>
    PostUpdateManyMutationInput: () => PGInputFactory<
      PostUpdateManyMutationInputFactory<Types>,
      Types
    >
    PostUncheckedUpdateManyWithoutPostsInput: () => PGInputFactory<
      PostUncheckedUpdateManyWithoutPostsInputFactory<Types>,
      Types
    >
  }>
}
type PostScalarWhereInputFactory<Types extends PGTypes> = {
  AND: PGInputFactoryUnion<{
    __default: () => PGInputFactory<PostScalarWhereInputFactory<Types> | undefined, Types>
    PostScalarWhereInput: () => PGInputFactory<
      Array<PostScalarWhereInputFactory<Types>> | undefined,
      Types
    >
    PostScalarWhereInputList: () => PGInputFactory<
      Array<PostScalarWhereInputFactory<Types>> | undefined,
      Types
    >
  }>
  OR: () => PGInputFactory<Array<PostScalarWhereInputFactory<Types>> | undefined, Types>
  NOT: PGInputFactoryUnion<{
    __default: () => PGInputFactory<PostScalarWhereInputFactory<Types> | undefined, Types>
    PostScalarWhereInput: () => PGInputFactory<
      Array<PostScalarWhereInputFactory<Types>> | undefined,
      Types
    >
    PostScalarWhereInputList: () => PGInputFactory<
      Array<PostScalarWhereInputFactory<Types>> | undefined,
      Types
    >
  }>
  id: PGInputFactoryUnion<{
    __default: () => PGInputFactory<IntFilterFactory<Types> | undefined, Types>
    IntFilter: () => PGInputFactory<IntFilterFactory<Types> | undefined, Types>
    Int: PGInputField<number | undefined, 'int', Types>
  }>
  title: PGInputFactoryUnion<{
    __default: () => PGInputFactory<StringFilterFactory<Types> | undefined, Types>
    StringFilter: () => PGInputFactory<StringFilterFactory<Types> | undefined, Types>
    String: PGInputField<string | undefined, 'string', Types>
  }>
  content: PGInputFactoryUnion<{
    __default: () => PGInputFactory<StringFilterFactory<Types> | undefined, Types>
    StringFilter: () => PGInputFactory<StringFilterFactory<Types> | undefined, Types>
    String: PGInputField<string | undefined, 'string', Types>
  }>
  authorId: PGInputFactoryUnion<{
    __default: () => PGInputFactory<IntFilterFactory<Types> | undefined, Types>
    IntFilter: () => PGInputFactory<IntFilterFactory<Types> | undefined, Types>
    Int: PGInputField<number | undefined, 'int', Types>
  }>
}
type UserCreateWithoutPostsInputFactory<Types extends PGTypes> = {
  firstName: PGInputField<string, 'string', Types>
  lastName: PGInputField<string, 'string', Types>
}
type UserUncheckedCreateWithoutPostsInputFactory<Types extends PGTypes> = {
  id: PGInputField<number | undefined, 'int', Types>
  firstName: PGInputField<string, 'string', Types>
  lastName: PGInputField<string, 'string', Types>
}
type UserCreateOrConnectWithoutPostsInputFactory<Types extends PGTypes> = {
  where: () => PGInputFactory<UserWhereUniqueInputFactory<Types>, Types>
  create: PGInputFactoryUnion<{
    __default: () => PGInputFactory<UserCreateWithoutPostsInputFactory<Types>, Types>
    UserCreateWithoutPostsInput: () => PGInputFactory<
      UserCreateWithoutPostsInputFactory<Types>,
      Types
    >
    UserUncheckedCreateWithoutPostsInput: () => PGInputFactory<
      UserUncheckedCreateWithoutPostsInputFactory<Types>,
      Types
    >
  }>
}
type UserUpsertWithoutPostsInputFactory<Types extends PGTypes> = {
  update: PGInputFactoryUnion<{
    __default: () => PGInputFactory<UserUpdateWithoutPostsInputFactory<Types>, Types>
    UserUpdateWithoutPostsInput: () => PGInputFactory<
      UserUpdateWithoutPostsInputFactory<Types>,
      Types
    >
    UserUncheckedUpdateWithoutPostsInput: () => PGInputFactory<
      UserUncheckedUpdateWithoutPostsInputFactory<Types>,
      Types
    >
  }>
  create: PGInputFactoryUnion<{
    __default: () => PGInputFactory<UserCreateWithoutPostsInputFactory<Types>, Types>
    UserCreateWithoutPostsInput: () => PGInputFactory<
      UserCreateWithoutPostsInputFactory<Types>,
      Types
    >
    UserUncheckedCreateWithoutPostsInput: () => PGInputFactory<
      UserUncheckedCreateWithoutPostsInputFactory<Types>,
      Types
    >
  }>
}
type UserUpdateWithoutPostsInputFactory<Types extends PGTypes> = {
  firstName: PGInputFactoryUnion<{
    __default: PGInputField<string | undefined, 'string', Types>
    String: PGInputField<string | undefined, 'string', Types>
    StringFieldUpdateOperationsInput: () => PGInputFactory<
      StringFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  lastName: PGInputFactoryUnion<{
    __default: PGInputField<string | undefined, 'string', Types>
    String: PGInputField<string | undefined, 'string', Types>
    StringFieldUpdateOperationsInput: () => PGInputFactory<
      StringFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
}
type UserUncheckedUpdateWithoutPostsInputFactory<Types extends PGTypes> = {
  id: PGInputFactoryUnion<{
    __default: PGInputField<number | undefined, 'int', Types>
    Int: PGInputField<number | undefined, 'int', Types>
    IntFieldUpdateOperationsInput: () => PGInputFactory<
      IntFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  firstName: PGInputFactoryUnion<{
    __default: PGInputField<string | undefined, 'string', Types>
    String: PGInputField<string | undefined, 'string', Types>
    StringFieldUpdateOperationsInput: () => PGInputFactory<
      StringFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  lastName: PGInputFactoryUnion<{
    __default: PGInputField<string | undefined, 'string', Types>
    String: PGInputField<string | undefined, 'string', Types>
    StringFieldUpdateOperationsInput: () => PGInputFactory<
      StringFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
}
type PostUpdateWithoutAuthorInputFactory<Types extends PGTypes> = {
  title: PGInputFactoryUnion<{
    __default: PGInputField<string | undefined, 'string', Types>
    String: PGInputField<string | undefined, 'string', Types>
    StringFieldUpdateOperationsInput: () => PGInputFactory<
      StringFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  content: PGInputFactoryUnion<{
    __default: PGInputField<string | undefined, 'string', Types>
    String: PGInputField<string | undefined, 'string', Types>
    StringFieldUpdateOperationsInput: () => PGInputFactory<
      StringFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
}
type PostUncheckedUpdateWithoutAuthorInputFactory<Types extends PGTypes> = {
  id: PGInputFactoryUnion<{
    __default: PGInputField<number | undefined, 'int', Types>
    Int: PGInputField<number | undefined, 'int', Types>
    IntFieldUpdateOperationsInput: () => PGInputFactory<
      IntFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  title: PGInputFactoryUnion<{
    __default: PGInputField<string | undefined, 'string', Types>
    String: PGInputField<string | undefined, 'string', Types>
    StringFieldUpdateOperationsInput: () => PGInputFactory<
      StringFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  content: PGInputFactoryUnion<{
    __default: PGInputField<string | undefined, 'string', Types>
    String: PGInputField<string | undefined, 'string', Types>
    StringFieldUpdateOperationsInput: () => PGInputFactory<
      StringFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
}
type PostUncheckedUpdateManyWithoutPostsInputFactory<Types extends PGTypes> = {
  id: PGInputFactoryUnion<{
    __default: PGInputField<number | undefined, 'int', Types>
    Int: PGInputField<number | undefined, 'int', Types>
    IntFieldUpdateOperationsInput: () => PGInputFactory<
      IntFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  title: PGInputFactoryUnion<{
    __default: PGInputField<string | undefined, 'string', Types>
    String: PGInputField<string | undefined, 'string', Types>
    StringFieldUpdateOperationsInput: () => PGInputFactory<
      StringFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  content: PGInputFactoryUnion<{
    __default: PGInputField<string | undefined, 'string', Types>
    String: PGInputField<string | undefined, 'string', Types>
    StringFieldUpdateOperationsInput: () => PGInputFactory<
      StringFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
}

interface PrismaInputFactoryMap<Types extends PGTypes> {
  findFirstUser: PGInputFactory<FindFirstUserFactory<Types>, Types>
  findManyUser: PGInputFactory<FindManyUserFactory<Types>, Types>
  aggregateUser: PGInputFactory<AggregateUserFactory<Types>, Types>
  groupByUser: PGInputFactory<GroupByUserFactory<Types>, Types>
  findUniqueUser: PGInputFactory<FindUniqueUserFactory<Types>, Types>
  findFirstPost: PGInputFactory<FindFirstPostFactory<Types>, Types>
  findManyPost: PGInputFactory<FindManyPostFactory<Types>, Types>
  aggregatePost: PGInputFactory<AggregatePostFactory<Types>, Types>
  groupByPost: PGInputFactory<GroupByPostFactory<Types>, Types>
  findUniquePost: PGInputFactory<FindUniquePostFactory<Types>, Types>
  createOneUser: PGInputFactory<CreateOneUserFactory<Types>, Types>
  upsertOneUser: PGInputFactory<UpsertOneUserFactory<Types>, Types>
  deleteOneUser: PGInputFactory<DeleteOneUserFactory<Types>, Types>
  updateOneUser: PGInputFactory<UpdateOneUserFactory<Types>, Types>
  updateManyUser: PGInputFactory<UpdateManyUserFactory<Types>, Types>
  deleteManyUser: PGInputFactory<DeleteManyUserFactory<Types>, Types>
  createOnePost: PGInputFactory<CreateOnePostFactory<Types>, Types>
  upsertOnePost: PGInputFactory<UpsertOnePostFactory<Types>, Types>
  deleteOnePost: PGInputFactory<DeleteOnePostFactory<Types>, Types>
  updateOnePost: PGInputFactory<UpdateOnePostFactory<Types>, Types>
  updateManyPost: PGInputFactory<UpdateManyPostFactory<Types>, Types>
  deleteManyPost: PGInputFactory<DeleteManyPostFactory<Types>, Types>
  executeRaw: PGInputFactory<ExecuteRawFactory<Types>, Types>
  queryRaw: PGInputFactory<QueryRawFactory<Types>, Types>
}

interface PGPrismaConverter<Types extends PGTypes> {
  convert: <
    TObjectRef extends { [P in keyof PrismaObjectMap<{}, Types>]?: Function } = {},
  >(
    updatedObjectRef?: TObjectRef,
  ) => {
    objects: <TName extends keyof PrismaObjectMap<TObjectRef, Types>>(
      name: TName,
    ) => PrismaObjectMap<TObjectRef, Types>[TName]
    relations: <TName extends keyof PrismaObjectMap<TObjectRef, Types>>(
      name: TName,
    ) => Omit<PrismaObjectMap<TObjectRef, Types>, TName> extends infer U
      ? { [P in keyof U]: () => U[P] }
      : never
    enums: <TName extends keyof PrismaEnumMap>(name: TName) => PrismaEnumMap[TName]
    inputs: <TName extends keyof PrismaInputFactoryMap<Types>>(
      name: TName,
    ) => PrismaInputFactoryMap<Types>[TName]
  }
  update: <
    TName extends Exclude<keyof PrismaObjectMap<{}, Types>, undefined | number>,
    TFieldMap extends PGOutputFieldMap,
    TObjectRef extends { [P in keyof PrismaObjectMap<{}, Types>]?: Function } = {},
    TInterfaces extends Array<PGInterface<any>> | undefined = undefined,
  >(config: {
    name: TName
    fields: (
      f: PrismaObjectMap<TObjectRef, Types>[TName] extends infer U
        ? U extends PGObject<any>
          ? U['value']['fieldMap']
          : never
        : never,
      b: PGOutputFieldBuilder<Types>,
    ) => TFieldMap
    interfaces?: TInterfaces
    isTypeOf?: (
      value: TypeOfPGFieldMap<TFieldMap & ConvertPGInterfacesToFieldMap<TInterfaces>>,
    ) => boolean
    relations: TObjectRef
  }) => PGObject<
    TFieldMap & ConvertPGInterfacesToFieldMap<TInterfaces>,
    TInterfaces,
    TName extends GetPrismaModelNames<Types>
      ? { PrismaModelName: TName }
      : PGObjectOptionsDefault<Types>,
    Types
  >
}

type InitPGPrismaConverter = <Types extends PGTypes>(
  builder: PGBuilder<Types>,
  dmmf: DMMF.Document,
) => PGPrismaConverter<Types>

export const getPGPrismaConverter: InitPGPrismaConverter = (builder, dmmf) =>
  getInternalPGPrismaConverter(builder, dmmf) as any

type PrismaArgsMap = {
  User: RequiredNonNullable<Prisma.UserFindManyArgs>
  Post: RequiredNonNullable<Prisma.PostFindManyArgs>
}
export type PrismaTypes = {
  Args: PrismaArgsMap
}
