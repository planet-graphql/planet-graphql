import { getInternalPGPrismaConverter } from '@planet-graphql/core/dist/prisma-converter'
import type { Prisma } from './prisma-client'
import type { DMMF } from './prisma-client/runtime'
import type { PGTypes, PGBuilder } from '@planet-graphql/core/dist/types/builder'
import type {
  PGEnum,
  PGDecimal,
  PGInputDecimal,
  PGJson,
  PGInputJson,
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
  createdAt: PGOutputField<Date, any, PGOutputFieldOptionsDefault, Types>
  updatedAt: PGOutputField<Date, any, PGOutputFieldOptionsDefault, Types>
}
type PostFieldMapType<
  TObjectRef extends { [key: string]: Function | undefined },
  Types extends PGTypes,
> = {
  id: PGOutputField<number, any, PGOutputFieldOptionsDefault, Types>
  title: PGOutputField<string, any, PGOutputFieldOptionsDefault, Types>
  content: PGOutputField<string, any, PGOutputFieldOptionsDefault, Types>
  isPublic: PGOutputField<boolean, any, PGOutputFieldOptionsDefault, Types>
  author: PGOutputField<
    PrismaObjectMap<TObjectRef, Types>['User'],
    any,
    PGOutputFieldOptionsDefault,
    Types
  >
  authorId: PGOutputField<number, any, PGOutputFieldOptionsDefault, Types>
  attachments: PGOutputField<
    Array<PrismaObjectMap<TObjectRef, Types>['Attachment']>,
    any,
    PGOutputFieldOptionsDefault,
    Types
  >
  createdAt: PGOutputField<Date, any, PGOutputFieldOptionsDefault, Types>
  updatedAt: PGOutputField<Date, any, PGOutputFieldOptionsDefault, Types>
}
type AttachmentFieldMapType<
  TObjectRef extends { [key: string]: Function | undefined },
  Types extends PGTypes,
> = {
  id: PGOutputField<bigint, any, PGOutputFieldOptionsDefault, Types>
  name: PGOutputField<string, any, PGOutputFieldOptionsDefault, Types>
  buffer: PGOutputField<Buffer, any, PGOutputFieldOptionsDefault, Types>
  meta: PGOutputField<PGJson, any, PGOutputFieldOptionsDefault, Types>
  size: PGOutputField<PGDecimal, any, PGOutputFieldOptionsDefault, Types>
  post: PGOutputField<
    PrismaObjectMap<TObjectRef, Types>['Post'],
    any,
    PGOutputFieldOptionsDefault,
    Types
  >
  postId: PGOutputField<number, any, PGOutputFieldOptionsDefault, Types>
  createdAt: PGOutputField<Date, any, PGOutputFieldOptionsDefault, Types>
  updatedAt: PGOutputField<Date, any, PGOutputFieldOptionsDefault, Types>
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
  Attachment: PrismaObject<
    TObjectRef,
    'Attachment',
    PGObject<
      AttachmentFieldMapType<TObjectRef, Types>,
      undefined,
      { PrismaModelName: 'Attachment' },
      Types
    >
  >
}
type UserScalarFieldEnumFactory = PGEnum<
  ['id', 'firstName', 'lastName', 'createdAt', 'updatedAt']
>
type PostScalarFieldEnumFactory = PGEnum<
  ['id', 'title', 'content', 'isPublic', 'authorId', 'createdAt', 'updatedAt']
>
type AttachmentScalarFieldEnumFactory = PGEnum<
  ['id', 'name', 'buffer', 'meta', 'size', 'postId', 'createdAt', 'updatedAt']
>
type SortOrderFactory = PGEnum<['asc', 'desc']>
type JsonNullValueInputFactory = PGEnum<['JsonNull']>
type QueryModeFactory = PGEnum<['default', 'insensitive']>
type JsonNullValueFilterFactory = PGEnum<['DbNull', 'JsonNull', 'AnyNull']>
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
type FindFirstAttachmentFactory<Types extends PGTypes> = {
  where: () => PGInputFactory<AttachmentWhereInputFactory<Types> | undefined, Types>
  orderBy: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      Array<AttachmentOrderByWithRelationInputFactory<Types>> | undefined,
      Types
    >
    AttachmentOrderByWithRelationInputList: () => PGInputFactory<
      Array<AttachmentOrderByWithRelationInputFactory<Types>> | undefined,
      Types
    >
    AttachmentOrderByWithRelationInput: () => PGInputFactory<
      AttachmentOrderByWithRelationInputFactory<Types> | undefined,
      Types
    >
  }>
  cursor: () => PGInputFactory<
    AttachmentWhereUniqueInputFactory<Types> | undefined,
    Types
  >
  take: PGInputField<number | undefined, 'int', Types>
  skip: PGInputField<number | undefined, 'int', Types>
  distinct: PGInputField<AttachmentScalarFieldEnumFactory[] | undefined, 'enum', Types>
}
type FindManyAttachmentFactory<Types extends PGTypes> = {
  where: () => PGInputFactory<AttachmentWhereInputFactory<Types> | undefined, Types>
  orderBy: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      Array<AttachmentOrderByWithRelationInputFactory<Types>> | undefined,
      Types
    >
    AttachmentOrderByWithRelationInputList: () => PGInputFactory<
      Array<AttachmentOrderByWithRelationInputFactory<Types>> | undefined,
      Types
    >
    AttachmentOrderByWithRelationInput: () => PGInputFactory<
      AttachmentOrderByWithRelationInputFactory<Types> | undefined,
      Types
    >
  }>
  cursor: () => PGInputFactory<
    AttachmentWhereUniqueInputFactory<Types> | undefined,
    Types
  >
  take: PGInputField<number | undefined, 'int', Types>
  skip: PGInputField<number | undefined, 'int', Types>
  distinct: PGInputField<AttachmentScalarFieldEnumFactory[] | undefined, 'enum', Types>
}
type AggregateAttachmentFactory<Types extends PGTypes> = {
  where: () => PGInputFactory<AttachmentWhereInputFactory<Types> | undefined, Types>
  orderBy: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      Array<AttachmentOrderByWithRelationInputFactory<Types>> | undefined,
      Types
    >
    AttachmentOrderByWithRelationInputList: () => PGInputFactory<
      Array<AttachmentOrderByWithRelationInputFactory<Types>> | undefined,
      Types
    >
    AttachmentOrderByWithRelationInput: () => PGInputFactory<
      AttachmentOrderByWithRelationInputFactory<Types> | undefined,
      Types
    >
  }>
  cursor: () => PGInputFactory<
    AttachmentWhereUniqueInputFactory<Types> | undefined,
    Types
  >
  take: PGInputField<number | undefined, 'int', Types>
  skip: PGInputField<number | undefined, 'int', Types>
}
type GroupByAttachmentFactory<Types extends PGTypes> = {
  where: () => PGInputFactory<AttachmentWhereInputFactory<Types> | undefined, Types>
  orderBy: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      Array<AttachmentOrderByWithAggregationInputFactory<Types>> | undefined,
      Types
    >
    AttachmentOrderByWithAggregationInputList: () => PGInputFactory<
      Array<AttachmentOrderByWithAggregationInputFactory<Types>> | undefined,
      Types
    >
    AttachmentOrderByWithAggregationInput: () => PGInputFactory<
      AttachmentOrderByWithAggregationInputFactory<Types> | undefined,
      Types
    >
  }>
  by: PGInputFactoryUnion<{
    __default: PGInputField<AttachmentScalarFieldEnumFactory[], 'enum', Types>
    AttachmentScalarFieldEnumList: PGInputField<
      AttachmentScalarFieldEnumFactory[],
      'enum',
      Types
    >
    AttachmentScalarFieldEnum: PGInputField<
      AttachmentScalarFieldEnumFactory,
      'enum',
      Types
    >
  }>
  having: () => PGInputFactory<
    AttachmentScalarWhereWithAggregatesInputFactory<Types> | undefined,
    Types
  >
  take: PGInputField<number | undefined, 'int', Types>
  skip: PGInputField<number | undefined, 'int', Types>
}
type FindUniqueAttachmentFactory<Types extends PGTypes> = {
  where: () => PGInputFactory<AttachmentWhereUniqueInputFactory<Types>, Types>
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
type CreateManyUserFactory<Types extends PGTypes> = {
  data: () => PGInputFactory<Array<UserCreateManyInputFactory<Types>>, Types>
  skipDuplicates: PGInputField<boolean | undefined, 'boolean', Types>
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
type CreateManyPostFactory<Types extends PGTypes> = {
  data: () => PGInputFactory<Array<PostCreateManyInputFactory<Types>>, Types>
  skipDuplicates: PGInputField<boolean | undefined, 'boolean', Types>
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
type CreateOneAttachmentFactory<Types extends PGTypes> = {
  data: PGInputFactoryUnion<{
    __default: () => PGInputFactory<AttachmentCreateInputFactory<Types>, Types>
    AttachmentCreateInput: () => PGInputFactory<
      AttachmentCreateInputFactory<Types>,
      Types
    >
    AttachmentUncheckedCreateInput: () => PGInputFactory<
      AttachmentUncheckedCreateInputFactory<Types>,
      Types
    >
  }>
}
type UpsertOneAttachmentFactory<Types extends PGTypes> = {
  where: () => PGInputFactory<AttachmentWhereUniqueInputFactory<Types>, Types>
  create: PGInputFactoryUnion<{
    __default: () => PGInputFactory<AttachmentCreateInputFactory<Types>, Types>
    AttachmentCreateInput: () => PGInputFactory<
      AttachmentCreateInputFactory<Types>,
      Types
    >
    AttachmentUncheckedCreateInput: () => PGInputFactory<
      AttachmentUncheckedCreateInputFactory<Types>,
      Types
    >
  }>
  update: PGInputFactoryUnion<{
    __default: () => PGInputFactory<AttachmentUpdateInputFactory<Types>, Types>
    AttachmentUpdateInput: () => PGInputFactory<
      AttachmentUpdateInputFactory<Types>,
      Types
    >
    AttachmentUncheckedUpdateInput: () => PGInputFactory<
      AttachmentUncheckedUpdateInputFactory<Types>,
      Types
    >
  }>
}
type CreateManyAttachmentFactory<Types extends PGTypes> = {
  data: () => PGInputFactory<Array<AttachmentCreateManyInputFactory<Types>>, Types>
  skipDuplicates: PGInputField<boolean | undefined, 'boolean', Types>
}
type DeleteOneAttachmentFactory<Types extends PGTypes> = {
  where: () => PGInputFactory<AttachmentWhereUniqueInputFactory<Types>, Types>
}
type UpdateOneAttachmentFactory<Types extends PGTypes> = {
  data: PGInputFactoryUnion<{
    __default: () => PGInputFactory<AttachmentUpdateInputFactory<Types>, Types>
    AttachmentUpdateInput: () => PGInputFactory<
      AttachmentUpdateInputFactory<Types>,
      Types
    >
    AttachmentUncheckedUpdateInput: () => PGInputFactory<
      AttachmentUncheckedUpdateInputFactory<Types>,
      Types
    >
  }>
  where: () => PGInputFactory<AttachmentWhereUniqueInputFactory<Types>, Types>
}
type UpdateManyAttachmentFactory<Types extends PGTypes> = {
  data: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      AttachmentUpdateManyMutationInputFactory<Types>,
      Types
    >
    AttachmentUpdateManyMutationInput: () => PGInputFactory<
      AttachmentUpdateManyMutationInputFactory<Types>,
      Types
    >
    AttachmentUncheckedUpdateManyInput: () => PGInputFactory<
      AttachmentUncheckedUpdateManyInputFactory<Types>,
      Types
    >
  }>
  where: () => PGInputFactory<AttachmentWhereInputFactory<Types> | undefined, Types>
}
type DeleteManyAttachmentFactory<Types extends PGTypes> = {
  where: () => PGInputFactory<AttachmentWhereInputFactory<Types> | undefined, Types>
}
type ExecuteRawFactory<Types extends PGTypes> = {
  query: PGInputField<string, 'string', Types>
  parameters: PGInputField<PGInputJson | undefined, 'json', Types>
}
type QueryRawFactory<Types extends PGTypes> = {
  query: PGInputField<string, 'string', Types>
  parameters: PGInputField<PGInputJson | undefined, 'json', Types>
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
  createdAt: PGInputFactoryUnion<{
    __default: () => PGInputFactory<DateTimeFilterFactory<Types> | undefined, Types>
    DateTimeFilter: () => PGInputFactory<DateTimeFilterFactory<Types> | undefined, Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
  }>
  updatedAt: PGInputFactoryUnion<{
    __default: () => PGInputFactory<DateTimeFilterFactory<Types> | undefined, Types>
    DateTimeFilter: () => PGInputFactory<DateTimeFilterFactory<Types> | undefined, Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
  }>
}
type UserOrderByWithRelationInputFactory<Types extends PGTypes> = {
  id: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  firstName: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  lastName: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  posts: () => PGInputFactory<
    PostOrderByRelationAggregateInputFactory<Types> | undefined,
    Types
  >
  createdAt: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  updatedAt: PGInputField<SortOrderFactory | undefined, 'enum', Types>
}
type UserWhereUniqueInputFactory<Types extends PGTypes> = {
  id: PGInputField<number | undefined, 'int', Types>
}
type UserOrderByWithAggregationInputFactory<Types extends PGTypes> = {
  id: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  firstName: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  lastName: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  createdAt: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  updatedAt: PGInputField<SortOrderFactory | undefined, 'enum', Types>
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
  createdAt: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      DateTimeWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
    DateTimeWithAggregatesFilter: () => PGInputFactory<
      DateTimeWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
  }>
  updatedAt: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      DateTimeWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
    DateTimeWithAggregatesFilter: () => PGInputFactory<
      DateTimeWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
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
  isPublic: PGInputFactoryUnion<{
    __default: () => PGInputFactory<BoolFilterFactory<Types> | undefined, Types>
    BoolFilter: () => PGInputFactory<BoolFilterFactory<Types> | undefined, Types>
    Boolean: PGInputField<boolean | undefined, 'boolean', Types>
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
  attachments: () => PGInputFactory<
    AttachmentListRelationFilterFactory<Types> | undefined,
    Types
  >
  createdAt: PGInputFactoryUnion<{
    __default: () => PGInputFactory<DateTimeFilterFactory<Types> | undefined, Types>
    DateTimeFilter: () => PGInputFactory<DateTimeFilterFactory<Types> | undefined, Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
  }>
  updatedAt: PGInputFactoryUnion<{
    __default: () => PGInputFactory<DateTimeFilterFactory<Types> | undefined, Types>
    DateTimeFilter: () => PGInputFactory<DateTimeFilterFactory<Types> | undefined, Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
  }>
}
type PostOrderByWithRelationInputFactory<Types extends PGTypes> = {
  id: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  title: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  content: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  isPublic: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  author: () => PGInputFactory<
    UserOrderByWithRelationInputFactory<Types> | undefined,
    Types
  >
  authorId: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  attachments: () => PGInputFactory<
    AttachmentOrderByRelationAggregateInputFactory<Types> | undefined,
    Types
  >
  createdAt: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  updatedAt: PGInputField<SortOrderFactory | undefined, 'enum', Types>
}
type PostWhereUniqueInputFactory<Types extends PGTypes> = {
  id: PGInputField<number | undefined, 'int', Types>
}
type PostOrderByWithAggregationInputFactory<Types extends PGTypes> = {
  id: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  title: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  content: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  isPublic: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  authorId: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  createdAt: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  updatedAt: PGInputField<SortOrderFactory | undefined, 'enum', Types>
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
  isPublic: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      BoolWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
    BoolWithAggregatesFilter: () => PGInputFactory<
      BoolWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
    Boolean: PGInputField<boolean | undefined, 'boolean', Types>
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
  createdAt: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      DateTimeWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
    DateTimeWithAggregatesFilter: () => PGInputFactory<
      DateTimeWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
  }>
  updatedAt: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      DateTimeWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
    DateTimeWithAggregatesFilter: () => PGInputFactory<
      DateTimeWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
  }>
}
type AttachmentWhereInputFactory<Types extends PGTypes> = {
  AND: PGInputFactoryUnion<{
    __default: () => PGInputFactory<AttachmentWhereInputFactory<Types> | undefined, Types>
    AttachmentWhereInput: () => PGInputFactory<
      Array<AttachmentWhereInputFactory<Types>> | undefined,
      Types
    >
    AttachmentWhereInputList: () => PGInputFactory<
      Array<AttachmentWhereInputFactory<Types>> | undefined,
      Types
    >
  }>
  OR: () => PGInputFactory<Array<AttachmentWhereInputFactory<Types>> | undefined, Types>
  NOT: PGInputFactoryUnion<{
    __default: () => PGInputFactory<AttachmentWhereInputFactory<Types> | undefined, Types>
    AttachmentWhereInput: () => PGInputFactory<
      Array<AttachmentWhereInputFactory<Types>> | undefined,
      Types
    >
    AttachmentWhereInputList: () => PGInputFactory<
      Array<AttachmentWhereInputFactory<Types>> | undefined,
      Types
    >
  }>
  id: PGInputFactoryUnion<{
    __default: () => PGInputFactory<BigIntFilterFactory<Types> | undefined, Types>
    BigIntFilter: () => PGInputFactory<BigIntFilterFactory<Types> | undefined, Types>
    BigInt: PGInputField<bigint | undefined, 'bigInt', Types>
  }>
  name: PGInputFactoryUnion<{
    __default: () => PGInputFactory<StringFilterFactory<Types> | undefined, Types>
    StringFilter: () => PGInputFactory<StringFilterFactory<Types> | undefined, Types>
    String: PGInputField<string | undefined, 'string', Types>
  }>
  buffer: PGInputFactoryUnion<{
    __default: () => PGInputFactory<BytesFilterFactory<Types> | undefined, Types>
    BytesFilter: () => PGInputFactory<BytesFilterFactory<Types> | undefined, Types>
    Bytes: PGInputField<Buffer | undefined, 'bytes', Types>
  }>
  meta: () => PGInputFactory<JsonFilterFactory<Types> | undefined, Types>
  size: PGInputFactoryUnion<{
    __default: () => PGInputFactory<DecimalFilterFactory<Types> | undefined, Types>
    DecimalFilter: () => PGInputFactory<DecimalFilterFactory<Types> | undefined, Types>
    Decimal: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
  }>
  post: PGInputFactoryUnion<{
    __default: () => PGInputFactory<PostRelationFilterFactory<Types> | undefined, Types>
    PostRelationFilter: () => PGInputFactory<
      PostRelationFilterFactory<Types> | undefined,
      Types
    >
    PostWhereInput: () => PGInputFactory<PostWhereInputFactory<Types> | undefined, Types>
  }>
  postId: PGInputFactoryUnion<{
    __default: () => PGInputFactory<IntFilterFactory<Types> | undefined, Types>
    IntFilter: () => PGInputFactory<IntFilterFactory<Types> | undefined, Types>
    Int: PGInputField<number | undefined, 'int', Types>
  }>
  createdAt: PGInputFactoryUnion<{
    __default: () => PGInputFactory<DateTimeFilterFactory<Types> | undefined, Types>
    DateTimeFilter: () => PGInputFactory<DateTimeFilterFactory<Types> | undefined, Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
  }>
  updatedAt: PGInputFactoryUnion<{
    __default: () => PGInputFactory<DateTimeFilterFactory<Types> | undefined, Types>
    DateTimeFilter: () => PGInputFactory<DateTimeFilterFactory<Types> | undefined, Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
  }>
}
type AttachmentOrderByWithRelationInputFactory<Types extends PGTypes> = {
  id: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  name: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  buffer: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  meta: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  size: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  post: () => PGInputFactory<
    PostOrderByWithRelationInputFactory<Types> | undefined,
    Types
  >
  postId: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  createdAt: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  updatedAt: PGInputField<SortOrderFactory | undefined, 'enum', Types>
}
type AttachmentWhereUniqueInputFactory<Types extends PGTypes> = {
  id: PGInputField<bigint | undefined, 'bigInt', Types>
}
type AttachmentOrderByWithAggregationInputFactory<Types extends PGTypes> = {
  id: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  name: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  buffer: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  meta: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  size: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  postId: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  createdAt: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  updatedAt: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  _count: () => PGInputFactory<
    AttachmentCountOrderByAggregateInputFactory<Types> | undefined,
    Types
  >
  _avg: () => PGInputFactory<
    AttachmentAvgOrderByAggregateInputFactory<Types> | undefined,
    Types
  >
  _max: () => PGInputFactory<
    AttachmentMaxOrderByAggregateInputFactory<Types> | undefined,
    Types
  >
  _min: () => PGInputFactory<
    AttachmentMinOrderByAggregateInputFactory<Types> | undefined,
    Types
  >
  _sum: () => PGInputFactory<
    AttachmentSumOrderByAggregateInputFactory<Types> | undefined,
    Types
  >
}
type AttachmentScalarWhereWithAggregatesInputFactory<Types extends PGTypes> = {
  AND: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      AttachmentScalarWhereWithAggregatesInputFactory<Types> | undefined,
      Types
    >
    AttachmentScalarWhereWithAggregatesInput: () => PGInputFactory<
      Array<AttachmentScalarWhereWithAggregatesInputFactory<Types>> | undefined,
      Types
    >
    AttachmentScalarWhereWithAggregatesInputList: () => PGInputFactory<
      Array<AttachmentScalarWhereWithAggregatesInputFactory<Types>> | undefined,
      Types
    >
  }>
  OR: () => PGInputFactory<
    Array<AttachmentScalarWhereWithAggregatesInputFactory<Types>> | undefined,
    Types
  >
  NOT: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      AttachmentScalarWhereWithAggregatesInputFactory<Types> | undefined,
      Types
    >
    AttachmentScalarWhereWithAggregatesInput: () => PGInputFactory<
      Array<AttachmentScalarWhereWithAggregatesInputFactory<Types>> | undefined,
      Types
    >
    AttachmentScalarWhereWithAggregatesInputList: () => PGInputFactory<
      Array<AttachmentScalarWhereWithAggregatesInputFactory<Types>> | undefined,
      Types
    >
  }>
  id: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      BigIntWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
    BigIntWithAggregatesFilter: () => PGInputFactory<
      BigIntWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
    BigInt: PGInputField<bigint | undefined, 'bigInt', Types>
  }>
  name: PGInputFactoryUnion<{
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
  buffer: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      BytesWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
    BytesWithAggregatesFilter: () => PGInputFactory<
      BytesWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
    Bytes: PGInputField<Buffer | undefined, 'bytes', Types>
  }>
  meta: () => PGInputFactory<JsonWithAggregatesFilterFactory<Types> | undefined, Types>
  size: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      DecimalWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
    DecimalWithAggregatesFilter: () => PGInputFactory<
      DecimalWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
    Decimal: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
  }>
  postId: PGInputFactoryUnion<{
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
  createdAt: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      DateTimeWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
    DateTimeWithAggregatesFilter: () => PGInputFactory<
      DateTimeWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
  }>
  updatedAt: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      DateTimeWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
    DateTimeWithAggregatesFilter: () => PGInputFactory<
      DateTimeWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
  }>
}
type UserCreateInputFactory<Types extends PGTypes> = {
  firstName: PGInputField<string, 'string', Types>
  lastName: PGInputField<string, 'string', Types>
  posts: () => PGInputFactory<
    PostCreateNestedManyWithoutAuthorInputFactory<Types> | undefined,
    Types
  >
  createdAt: PGInputField<Date | undefined, 'dateTime', Types>
  updatedAt: PGInputField<Date | undefined, 'dateTime', Types>
}
type UserUncheckedCreateInputFactory<Types extends PGTypes> = {
  id: PGInputField<number | undefined, 'int', Types>
  firstName: PGInputField<string, 'string', Types>
  lastName: PGInputField<string, 'string', Types>
  posts: () => PGInputFactory<
    PostUncheckedCreateNestedManyWithoutAuthorInputFactory<Types> | undefined,
    Types
  >
  createdAt: PGInputField<Date | undefined, 'dateTime', Types>
  updatedAt: PGInputField<Date | undefined, 'dateTime', Types>
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
  createdAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  updatedAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
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
  createdAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  updatedAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
}
type UserCreateManyInputFactory<Types extends PGTypes> = {
  id: PGInputField<number | undefined, 'int', Types>
  firstName: PGInputField<string, 'string', Types>
  lastName: PGInputField<string, 'string', Types>
  createdAt: PGInputField<Date | undefined, 'dateTime', Types>
  updatedAt: PGInputField<Date | undefined, 'dateTime', Types>
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
  createdAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  updatedAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
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
  createdAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  updatedAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
}
type PostCreateInputFactory<Types extends PGTypes> = {
  title: PGInputField<string, 'string', Types>
  content: PGInputField<string, 'string', Types>
  isPublic: PGInputField<boolean, 'boolean', Types>
  author: () => PGInputFactory<UserCreateNestedOneWithoutPostsInputFactory<Types>, Types>
  attachments: () => PGInputFactory<
    AttachmentCreateNestedManyWithoutPostInputFactory<Types> | undefined,
    Types
  >
  createdAt: PGInputField<Date | undefined, 'dateTime', Types>
  updatedAt: PGInputField<Date | undefined, 'dateTime', Types>
}
type PostUncheckedCreateInputFactory<Types extends PGTypes> = {
  id: PGInputField<number | undefined, 'int', Types>
  title: PGInputField<string, 'string', Types>
  content: PGInputField<string, 'string', Types>
  isPublic: PGInputField<boolean, 'boolean', Types>
  authorId: PGInputField<number, 'int', Types>
  attachments: () => PGInputFactory<
    AttachmentUncheckedCreateNestedManyWithoutPostInputFactory<Types> | undefined,
    Types
  >
  createdAt: PGInputField<Date | undefined, 'dateTime', Types>
  updatedAt: PGInputField<Date | undefined, 'dateTime', Types>
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
  isPublic: PGInputFactoryUnion<{
    __default: PGInputField<boolean | undefined, 'boolean', Types>
    Boolean: PGInputField<boolean | undefined, 'boolean', Types>
    BoolFieldUpdateOperationsInput: () => PGInputFactory<
      BoolFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  author: () => PGInputFactory<
    UserUpdateOneRequiredWithoutPostsNestedInputFactory<Types> | undefined,
    Types
  >
  attachments: () => PGInputFactory<
    AttachmentUpdateManyWithoutPostNestedInputFactory<Types> | undefined,
    Types
  >
  createdAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  updatedAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
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
  isPublic: PGInputFactoryUnion<{
    __default: PGInputField<boolean | undefined, 'boolean', Types>
    Boolean: PGInputField<boolean | undefined, 'boolean', Types>
    BoolFieldUpdateOperationsInput: () => PGInputFactory<
      BoolFieldUpdateOperationsInputFactory<Types> | undefined,
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
  attachments: () => PGInputFactory<
    AttachmentUncheckedUpdateManyWithoutPostNestedInputFactory<Types> | undefined,
    Types
  >
  createdAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  updatedAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
}
type PostCreateManyInputFactory<Types extends PGTypes> = {
  id: PGInputField<number | undefined, 'int', Types>
  title: PGInputField<string, 'string', Types>
  content: PGInputField<string, 'string', Types>
  isPublic: PGInputField<boolean, 'boolean', Types>
  authorId: PGInputField<number, 'int', Types>
  createdAt: PGInputField<Date | undefined, 'dateTime', Types>
  updatedAt: PGInputField<Date | undefined, 'dateTime', Types>
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
  isPublic: PGInputFactoryUnion<{
    __default: PGInputField<boolean | undefined, 'boolean', Types>
    Boolean: PGInputField<boolean | undefined, 'boolean', Types>
    BoolFieldUpdateOperationsInput: () => PGInputFactory<
      BoolFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  createdAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  updatedAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
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
  isPublic: PGInputFactoryUnion<{
    __default: PGInputField<boolean | undefined, 'boolean', Types>
    Boolean: PGInputField<boolean | undefined, 'boolean', Types>
    BoolFieldUpdateOperationsInput: () => PGInputFactory<
      BoolFieldUpdateOperationsInputFactory<Types> | undefined,
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
  createdAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  updatedAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
}
type AttachmentCreateInputFactory<Types extends PGTypes> = {
  id: PGInputField<bigint | undefined, 'bigInt', Types>
  name: PGInputField<string, 'string', Types>
  buffer: PGInputField<Buffer, 'bytes', Types>
  meta: PGInputFactoryUnion<{
    __default: PGInputField<JsonNullValueInputFactory, 'enum', Types>
    JsonNullValueInput: PGInputField<JsonNullValueInputFactory, 'enum', Types>
    Json: PGInputField<PGInputJson, 'json', Types>
  }>
  size: PGInputField<PGInputDecimal, 'decimal', Types>
  post: () => PGInputFactory<
    PostCreateNestedOneWithoutAttachmentsInputFactory<Types>,
    Types
  >
  createdAt: PGInputField<Date | undefined, 'dateTime', Types>
  updatedAt: PGInputField<Date | undefined, 'dateTime', Types>
}
type AttachmentUncheckedCreateInputFactory<Types extends PGTypes> = {
  id: PGInputField<bigint | undefined, 'bigInt', Types>
  name: PGInputField<string, 'string', Types>
  buffer: PGInputField<Buffer, 'bytes', Types>
  meta: PGInputFactoryUnion<{
    __default: PGInputField<JsonNullValueInputFactory, 'enum', Types>
    JsonNullValueInput: PGInputField<JsonNullValueInputFactory, 'enum', Types>
    Json: PGInputField<PGInputJson, 'json', Types>
  }>
  size: PGInputField<PGInputDecimal, 'decimal', Types>
  postId: PGInputField<number, 'int', Types>
  createdAt: PGInputField<Date | undefined, 'dateTime', Types>
  updatedAt: PGInputField<Date | undefined, 'dateTime', Types>
}
type AttachmentUpdateInputFactory<Types extends PGTypes> = {
  id: PGInputFactoryUnion<{
    __default: PGInputField<bigint | undefined, 'bigInt', Types>
    BigInt: PGInputField<bigint | undefined, 'bigInt', Types>
    BigIntFieldUpdateOperationsInput: () => PGInputFactory<
      BigIntFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  name: PGInputFactoryUnion<{
    __default: PGInputField<string | undefined, 'string', Types>
    String: PGInputField<string | undefined, 'string', Types>
    StringFieldUpdateOperationsInput: () => PGInputFactory<
      StringFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  buffer: PGInputFactoryUnion<{
    __default: PGInputField<Buffer | undefined, 'bytes', Types>
    Bytes: PGInputField<Buffer | undefined, 'bytes', Types>
    BytesFieldUpdateOperationsInput: () => PGInputFactory<
      BytesFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  meta: PGInputFactoryUnion<{
    __default: PGInputField<JsonNullValueInputFactory | undefined, 'enum', Types>
    JsonNullValueInput: PGInputField<JsonNullValueInputFactory | undefined, 'enum', Types>
    Json: PGInputField<PGInputJson | undefined, 'json', Types>
  }>
  size: PGInputFactoryUnion<{
    __default: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
    Decimal: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
    DecimalFieldUpdateOperationsInput: () => PGInputFactory<
      DecimalFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  post: () => PGInputFactory<
    PostUpdateOneRequiredWithoutAttachmentsNestedInputFactory<Types> | undefined,
    Types
  >
  createdAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  updatedAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
}
type AttachmentUncheckedUpdateInputFactory<Types extends PGTypes> = {
  id: PGInputFactoryUnion<{
    __default: PGInputField<bigint | undefined, 'bigInt', Types>
    BigInt: PGInputField<bigint | undefined, 'bigInt', Types>
    BigIntFieldUpdateOperationsInput: () => PGInputFactory<
      BigIntFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  name: PGInputFactoryUnion<{
    __default: PGInputField<string | undefined, 'string', Types>
    String: PGInputField<string | undefined, 'string', Types>
    StringFieldUpdateOperationsInput: () => PGInputFactory<
      StringFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  buffer: PGInputFactoryUnion<{
    __default: PGInputField<Buffer | undefined, 'bytes', Types>
    Bytes: PGInputField<Buffer | undefined, 'bytes', Types>
    BytesFieldUpdateOperationsInput: () => PGInputFactory<
      BytesFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  meta: PGInputFactoryUnion<{
    __default: PGInputField<JsonNullValueInputFactory | undefined, 'enum', Types>
    JsonNullValueInput: PGInputField<JsonNullValueInputFactory | undefined, 'enum', Types>
    Json: PGInputField<PGInputJson | undefined, 'json', Types>
  }>
  size: PGInputFactoryUnion<{
    __default: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
    Decimal: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
    DecimalFieldUpdateOperationsInput: () => PGInputFactory<
      DecimalFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  postId: PGInputFactoryUnion<{
    __default: PGInputField<number | undefined, 'int', Types>
    Int: PGInputField<number | undefined, 'int', Types>
    IntFieldUpdateOperationsInput: () => PGInputFactory<
      IntFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  createdAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  updatedAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
}
type AttachmentCreateManyInputFactory<Types extends PGTypes> = {
  id: PGInputField<bigint | undefined, 'bigInt', Types>
  name: PGInputField<string, 'string', Types>
  buffer: PGInputField<Buffer, 'bytes', Types>
  meta: PGInputFactoryUnion<{
    __default: PGInputField<JsonNullValueInputFactory, 'enum', Types>
    JsonNullValueInput: PGInputField<JsonNullValueInputFactory, 'enum', Types>
    Json: PGInputField<PGInputJson, 'json', Types>
  }>
  size: PGInputField<PGInputDecimal, 'decimal', Types>
  postId: PGInputField<number, 'int', Types>
  createdAt: PGInputField<Date | undefined, 'dateTime', Types>
  updatedAt: PGInputField<Date | undefined, 'dateTime', Types>
}
type AttachmentUpdateManyMutationInputFactory<Types extends PGTypes> = {
  id: PGInputFactoryUnion<{
    __default: PGInputField<bigint | undefined, 'bigInt', Types>
    BigInt: PGInputField<bigint | undefined, 'bigInt', Types>
    BigIntFieldUpdateOperationsInput: () => PGInputFactory<
      BigIntFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  name: PGInputFactoryUnion<{
    __default: PGInputField<string | undefined, 'string', Types>
    String: PGInputField<string | undefined, 'string', Types>
    StringFieldUpdateOperationsInput: () => PGInputFactory<
      StringFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  buffer: PGInputFactoryUnion<{
    __default: PGInputField<Buffer | undefined, 'bytes', Types>
    Bytes: PGInputField<Buffer | undefined, 'bytes', Types>
    BytesFieldUpdateOperationsInput: () => PGInputFactory<
      BytesFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  meta: PGInputFactoryUnion<{
    __default: PGInputField<JsonNullValueInputFactory | undefined, 'enum', Types>
    JsonNullValueInput: PGInputField<JsonNullValueInputFactory | undefined, 'enum', Types>
    Json: PGInputField<PGInputJson | undefined, 'json', Types>
  }>
  size: PGInputFactoryUnion<{
    __default: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
    Decimal: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
    DecimalFieldUpdateOperationsInput: () => PGInputFactory<
      DecimalFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  createdAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  updatedAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
}
type AttachmentUncheckedUpdateManyInputFactory<Types extends PGTypes> = {
  id: PGInputFactoryUnion<{
    __default: PGInputField<bigint | undefined, 'bigInt', Types>
    BigInt: PGInputField<bigint | undefined, 'bigInt', Types>
    BigIntFieldUpdateOperationsInput: () => PGInputFactory<
      BigIntFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  name: PGInputFactoryUnion<{
    __default: PGInputField<string | undefined, 'string', Types>
    String: PGInputField<string | undefined, 'string', Types>
    StringFieldUpdateOperationsInput: () => PGInputFactory<
      StringFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  buffer: PGInputFactoryUnion<{
    __default: PGInputField<Buffer | undefined, 'bytes', Types>
    Bytes: PGInputField<Buffer | undefined, 'bytes', Types>
    BytesFieldUpdateOperationsInput: () => PGInputFactory<
      BytesFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  meta: PGInputFactoryUnion<{
    __default: PGInputField<JsonNullValueInputFactory | undefined, 'enum', Types>
    JsonNullValueInput: PGInputField<JsonNullValueInputFactory | undefined, 'enum', Types>
    Json: PGInputField<PGInputJson | undefined, 'json', Types>
  }>
  size: PGInputFactoryUnion<{
    __default: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
    Decimal: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
    DecimalFieldUpdateOperationsInput: () => PGInputFactory<
      DecimalFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  postId: PGInputFactoryUnion<{
    __default: PGInputField<number | undefined, 'int', Types>
    Int: PGInputField<number | undefined, 'int', Types>
    IntFieldUpdateOperationsInput: () => PGInputFactory<
      IntFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  createdAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  updatedAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
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
  mode: PGInputField<QueryModeFactory | undefined, 'enum', Types>
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
type DateTimeFilterFactory<Types extends PGTypes> = {
  equals: PGInputField<Date | undefined, 'dateTime', Types>
  in: PGInputField<Date[] | undefined, 'dateTime', Types>
  notIn: PGInputField<Date[] | undefined, 'dateTime', Types>
  lt: PGInputField<Date | undefined, 'dateTime', Types>
  lte: PGInputField<Date | undefined, 'dateTime', Types>
  gt: PGInputField<Date | undefined, 'dateTime', Types>
  gte: PGInputField<Date | undefined, 'dateTime', Types>
  not: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    NestedDateTimeFilter: () => PGInputFactory<
      NestedDateTimeFilterFactory<Types> | undefined,
      Types
    >
  }>
}
type PostOrderByRelationAggregateInputFactory<Types extends PGTypes> = {
  _count: PGInputField<SortOrderFactory | undefined, 'enum', Types>
}
type UserCountOrderByAggregateInputFactory<Types extends PGTypes> = {
  id: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  firstName: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  lastName: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  createdAt: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  updatedAt: PGInputField<SortOrderFactory | undefined, 'enum', Types>
}
type UserAvgOrderByAggregateInputFactory<Types extends PGTypes> = {
  id: PGInputField<SortOrderFactory | undefined, 'enum', Types>
}
type UserMaxOrderByAggregateInputFactory<Types extends PGTypes> = {
  id: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  firstName: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  lastName: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  createdAt: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  updatedAt: PGInputField<SortOrderFactory | undefined, 'enum', Types>
}
type UserMinOrderByAggregateInputFactory<Types extends PGTypes> = {
  id: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  firstName: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  lastName: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  createdAt: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  updatedAt: PGInputField<SortOrderFactory | undefined, 'enum', Types>
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
  mode: PGInputField<QueryModeFactory | undefined, 'enum', Types>
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
type DateTimeWithAggregatesFilterFactory<Types extends PGTypes> = {
  equals: PGInputField<Date | undefined, 'dateTime', Types>
  in: PGInputField<Date[] | undefined, 'dateTime', Types>
  notIn: PGInputField<Date[] | undefined, 'dateTime', Types>
  lt: PGInputField<Date | undefined, 'dateTime', Types>
  lte: PGInputField<Date | undefined, 'dateTime', Types>
  gt: PGInputField<Date | undefined, 'dateTime', Types>
  gte: PGInputField<Date | undefined, 'dateTime', Types>
  not: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    NestedDateTimeWithAggregatesFilter: () => PGInputFactory<
      NestedDateTimeWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
  }>
  _count: () => PGInputFactory<NestedIntFilterFactory<Types> | undefined, Types>
  _min: () => PGInputFactory<NestedDateTimeFilterFactory<Types> | undefined, Types>
  _max: () => PGInputFactory<NestedDateTimeFilterFactory<Types> | undefined, Types>
}
type BoolFilterFactory<Types extends PGTypes> = {
  equals: PGInputField<boolean | undefined, 'boolean', Types>
  not: PGInputFactoryUnion<{
    __default: PGInputField<boolean | undefined, 'boolean', Types>
    Boolean: PGInputField<boolean | undefined, 'boolean', Types>
    NestedBoolFilter: () => PGInputFactory<
      NestedBoolFilterFactory<Types> | undefined,
      Types
    >
  }>
}
type UserRelationFilterFactory<Types extends PGTypes> = {
  is: () => PGInputFactory<UserWhereInputFactory<Types> | undefined, Types>
  isNot: () => PGInputFactory<UserWhereInputFactory<Types> | undefined, Types>
}
type AttachmentListRelationFilterFactory<Types extends PGTypes> = {
  every: () => PGInputFactory<AttachmentWhereInputFactory<Types> | undefined, Types>
  some: () => PGInputFactory<AttachmentWhereInputFactory<Types> | undefined, Types>
  none: () => PGInputFactory<AttachmentWhereInputFactory<Types> | undefined, Types>
}
type AttachmentOrderByRelationAggregateInputFactory<Types extends PGTypes> = {
  _count: PGInputField<SortOrderFactory | undefined, 'enum', Types>
}
type PostCountOrderByAggregateInputFactory<Types extends PGTypes> = {
  id: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  title: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  content: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  isPublic: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  authorId: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  createdAt: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  updatedAt: PGInputField<SortOrderFactory | undefined, 'enum', Types>
}
type PostAvgOrderByAggregateInputFactory<Types extends PGTypes> = {
  id: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  authorId: PGInputField<SortOrderFactory | undefined, 'enum', Types>
}
type PostMaxOrderByAggregateInputFactory<Types extends PGTypes> = {
  id: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  title: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  content: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  isPublic: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  authorId: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  createdAt: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  updatedAt: PGInputField<SortOrderFactory | undefined, 'enum', Types>
}
type PostMinOrderByAggregateInputFactory<Types extends PGTypes> = {
  id: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  title: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  content: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  isPublic: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  authorId: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  createdAt: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  updatedAt: PGInputField<SortOrderFactory | undefined, 'enum', Types>
}
type PostSumOrderByAggregateInputFactory<Types extends PGTypes> = {
  id: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  authorId: PGInputField<SortOrderFactory | undefined, 'enum', Types>
}
type BoolWithAggregatesFilterFactory<Types extends PGTypes> = {
  equals: PGInputField<boolean | undefined, 'boolean', Types>
  not: PGInputFactoryUnion<{
    __default: PGInputField<boolean | undefined, 'boolean', Types>
    Boolean: PGInputField<boolean | undefined, 'boolean', Types>
    NestedBoolWithAggregatesFilter: () => PGInputFactory<
      NestedBoolWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
  }>
  _count: () => PGInputFactory<NestedIntFilterFactory<Types> | undefined, Types>
  _min: () => PGInputFactory<NestedBoolFilterFactory<Types> | undefined, Types>
  _max: () => PGInputFactory<NestedBoolFilterFactory<Types> | undefined, Types>
}
type BigIntFilterFactory<Types extends PGTypes> = {
  equals: PGInputField<bigint | undefined, 'bigInt', Types>
  in: PGInputField<bigint[] | undefined, 'bigInt', Types>
  notIn: PGInputField<bigint[] | undefined, 'bigInt', Types>
  lt: PGInputField<bigint | undefined, 'bigInt', Types>
  lte: PGInputField<bigint | undefined, 'bigInt', Types>
  gt: PGInputField<bigint | undefined, 'bigInt', Types>
  gte: PGInputField<bigint | undefined, 'bigInt', Types>
  not: PGInputFactoryUnion<{
    __default: PGInputField<bigint | undefined, 'bigInt', Types>
    BigInt: PGInputField<bigint | undefined, 'bigInt', Types>
    NestedBigIntFilter: () => PGInputFactory<
      NestedBigIntFilterFactory<Types> | undefined,
      Types
    >
  }>
}
type BytesFilterFactory<Types extends PGTypes> = {
  equals: PGInputField<Buffer | undefined, 'bytes', Types>
  in: PGInputField<Buffer[] | undefined, 'bytes', Types>
  notIn: PGInputField<Buffer[] | undefined, 'bytes', Types>
  not: PGInputFactoryUnion<{
    __default: PGInputField<Buffer | undefined, 'bytes', Types>
    Bytes: PGInputField<Buffer | undefined, 'bytes', Types>
    NestedBytesFilter: () => PGInputFactory<
      NestedBytesFilterFactory<Types> | undefined,
      Types
    >
  }>
}
type JsonFilterFactory<Types extends PGTypes> = {
  equals: PGInputFactoryUnion<{
    __default: PGInputField<JsonNullValueFilterFactory | undefined, 'enum', Types>
    JsonNullValueFilter: PGInputField<
      JsonNullValueFilterFactory | undefined,
      'enum',
      Types
    >
    Json: PGInputField<PGInputJson | undefined, 'json', Types>
  }>
  path: PGInputField<string[] | undefined, 'string', Types>
  string_contains: PGInputField<string | undefined, 'string', Types>
  string_starts_with: PGInputField<string | undefined, 'string', Types>
  string_ends_with: PGInputField<string | undefined, 'string', Types>
  array_contains: PGInputField<PGInputJson | null | undefined, 'json', Types>
  array_starts_with: PGInputField<PGInputJson | null | undefined, 'json', Types>
  array_ends_with: PGInputField<PGInputJson | null | undefined, 'json', Types>
  lt: PGInputField<PGInputJson | undefined, 'json', Types>
  lte: PGInputField<PGInputJson | undefined, 'json', Types>
  gt: PGInputField<PGInputJson | undefined, 'json', Types>
  gte: PGInputField<PGInputJson | undefined, 'json', Types>
  not: PGInputFactoryUnion<{
    __default: PGInputField<JsonNullValueFilterFactory | undefined, 'enum', Types>
    JsonNullValueFilter: PGInputField<
      JsonNullValueFilterFactory | undefined,
      'enum',
      Types
    >
    Json: PGInputField<PGInputJson | undefined, 'json', Types>
  }>
}
type DecimalFilterFactory<Types extends PGTypes> = {
  equals: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
  in: PGInputField<PGInputDecimal[] | undefined, 'decimal', Types>
  notIn: PGInputField<PGInputDecimal[] | undefined, 'decimal', Types>
  lt: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
  lte: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
  gt: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
  gte: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
  not: PGInputFactoryUnion<{
    __default: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
    Decimal: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
    NestedDecimalFilter: () => PGInputFactory<
      NestedDecimalFilterFactory<Types> | undefined,
      Types
    >
  }>
}
type PostRelationFilterFactory<Types extends PGTypes> = {
  is: () => PGInputFactory<PostWhereInputFactory<Types> | undefined, Types>
  isNot: () => PGInputFactory<PostWhereInputFactory<Types> | undefined, Types>
}
type AttachmentCountOrderByAggregateInputFactory<Types extends PGTypes> = {
  id: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  name: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  buffer: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  meta: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  size: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  postId: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  createdAt: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  updatedAt: PGInputField<SortOrderFactory | undefined, 'enum', Types>
}
type AttachmentAvgOrderByAggregateInputFactory<Types extends PGTypes> = {
  id: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  size: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  postId: PGInputField<SortOrderFactory | undefined, 'enum', Types>
}
type AttachmentMaxOrderByAggregateInputFactory<Types extends PGTypes> = {
  id: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  name: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  buffer: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  size: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  postId: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  createdAt: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  updatedAt: PGInputField<SortOrderFactory | undefined, 'enum', Types>
}
type AttachmentMinOrderByAggregateInputFactory<Types extends PGTypes> = {
  id: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  name: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  buffer: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  size: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  postId: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  createdAt: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  updatedAt: PGInputField<SortOrderFactory | undefined, 'enum', Types>
}
type AttachmentSumOrderByAggregateInputFactory<Types extends PGTypes> = {
  id: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  size: PGInputField<SortOrderFactory | undefined, 'enum', Types>
  postId: PGInputField<SortOrderFactory | undefined, 'enum', Types>
}
type BigIntWithAggregatesFilterFactory<Types extends PGTypes> = {
  equals: PGInputField<bigint | undefined, 'bigInt', Types>
  in: PGInputField<bigint[] | undefined, 'bigInt', Types>
  notIn: PGInputField<bigint[] | undefined, 'bigInt', Types>
  lt: PGInputField<bigint | undefined, 'bigInt', Types>
  lte: PGInputField<bigint | undefined, 'bigInt', Types>
  gt: PGInputField<bigint | undefined, 'bigInt', Types>
  gte: PGInputField<bigint | undefined, 'bigInt', Types>
  not: PGInputFactoryUnion<{
    __default: PGInputField<bigint | undefined, 'bigInt', Types>
    BigInt: PGInputField<bigint | undefined, 'bigInt', Types>
    NestedBigIntWithAggregatesFilter: () => PGInputFactory<
      NestedBigIntWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
  }>
  _count: () => PGInputFactory<NestedIntFilterFactory<Types> | undefined, Types>
  _avg: () => PGInputFactory<NestedFloatFilterFactory<Types> | undefined, Types>
  _sum: () => PGInputFactory<NestedBigIntFilterFactory<Types> | undefined, Types>
  _min: () => PGInputFactory<NestedBigIntFilterFactory<Types> | undefined, Types>
  _max: () => PGInputFactory<NestedBigIntFilterFactory<Types> | undefined, Types>
}
type BytesWithAggregatesFilterFactory<Types extends PGTypes> = {
  equals: PGInputField<Buffer | undefined, 'bytes', Types>
  in: PGInputField<Buffer[] | undefined, 'bytes', Types>
  notIn: PGInputField<Buffer[] | undefined, 'bytes', Types>
  not: PGInputFactoryUnion<{
    __default: PGInputField<Buffer | undefined, 'bytes', Types>
    Bytes: PGInputField<Buffer | undefined, 'bytes', Types>
    NestedBytesWithAggregatesFilter: () => PGInputFactory<
      NestedBytesWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
  }>
  _count: () => PGInputFactory<NestedIntFilterFactory<Types> | undefined, Types>
  _min: () => PGInputFactory<NestedBytesFilterFactory<Types> | undefined, Types>
  _max: () => PGInputFactory<NestedBytesFilterFactory<Types> | undefined, Types>
}
type JsonWithAggregatesFilterFactory<Types extends PGTypes> = {
  equals: PGInputFactoryUnion<{
    __default: PGInputField<JsonNullValueFilterFactory | undefined, 'enum', Types>
    JsonNullValueFilter: PGInputField<
      JsonNullValueFilterFactory | undefined,
      'enum',
      Types
    >
    Json: PGInputField<PGInputJson | undefined, 'json', Types>
  }>
  path: PGInputField<string[] | undefined, 'string', Types>
  string_contains: PGInputField<string | undefined, 'string', Types>
  string_starts_with: PGInputField<string | undefined, 'string', Types>
  string_ends_with: PGInputField<string | undefined, 'string', Types>
  array_contains: PGInputField<PGInputJson | null | undefined, 'json', Types>
  array_starts_with: PGInputField<PGInputJson | null | undefined, 'json', Types>
  array_ends_with: PGInputField<PGInputJson | null | undefined, 'json', Types>
  lt: PGInputField<PGInputJson | undefined, 'json', Types>
  lte: PGInputField<PGInputJson | undefined, 'json', Types>
  gt: PGInputField<PGInputJson | undefined, 'json', Types>
  gte: PGInputField<PGInputJson | undefined, 'json', Types>
  not: PGInputFactoryUnion<{
    __default: PGInputField<JsonNullValueFilterFactory | undefined, 'enum', Types>
    JsonNullValueFilter: PGInputField<
      JsonNullValueFilterFactory | undefined,
      'enum',
      Types
    >
    Json: PGInputField<PGInputJson | undefined, 'json', Types>
  }>
  _count: () => PGInputFactory<NestedIntFilterFactory<Types> | undefined, Types>
  _min: () => PGInputFactory<NestedJsonFilterFactory<Types> | undefined, Types>
  _max: () => PGInputFactory<NestedJsonFilterFactory<Types> | undefined, Types>
}
type DecimalWithAggregatesFilterFactory<Types extends PGTypes> = {
  equals: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
  in: PGInputField<PGInputDecimal[] | undefined, 'decimal', Types>
  notIn: PGInputField<PGInputDecimal[] | undefined, 'decimal', Types>
  lt: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
  lte: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
  gt: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
  gte: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
  not: PGInputFactoryUnion<{
    __default: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
    Decimal: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
    NestedDecimalWithAggregatesFilter: () => PGInputFactory<
      NestedDecimalWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
  }>
  _count: () => PGInputFactory<NestedIntFilterFactory<Types> | undefined, Types>
  _avg: () => PGInputFactory<NestedDecimalFilterFactory<Types> | undefined, Types>
  _sum: () => PGInputFactory<NestedDecimalFilterFactory<Types> | undefined, Types>
  _min: () => PGInputFactory<NestedDecimalFilterFactory<Types> | undefined, Types>
  _max: () => PGInputFactory<NestedDecimalFilterFactory<Types> | undefined, Types>
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
  createMany: () => PGInputFactory<
    PostCreateManyAuthorInputEnvelopeFactory<Types> | undefined,
    Types
  >
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
  createMany: () => PGInputFactory<
    PostCreateManyAuthorInputEnvelopeFactory<Types> | undefined,
    Types
  >
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
  createMany: () => PGInputFactory<
    PostCreateManyAuthorInputEnvelopeFactory<Types> | undefined,
    Types
  >
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
type DateTimeFieldUpdateOperationsInputFactory<Types extends PGTypes> = {
  set: PGInputField<Date | undefined, 'dateTime', Types>
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
  createMany: () => PGInputFactory<
    PostCreateManyAuthorInputEnvelopeFactory<Types> | undefined,
    Types
  >
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
type AttachmentCreateNestedManyWithoutPostInputFactory<Types extends PGTypes> = {
  create: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      AttachmentCreateWithoutPostInputFactory<Types> | undefined,
      Types
    >
    AttachmentCreateWithoutPostInput: () => PGInputFactory<
      Array<AttachmentCreateWithoutPostInputFactory<Types>> | undefined,
      Types
    >
    AttachmentCreateWithoutPostInputList: () => PGInputFactory<
      Array<AttachmentCreateWithoutPostInputFactory<Types>> | undefined,
      Types
    >
    AttachmentUncheckedCreateWithoutPostInput: () => PGInputFactory<
      Array<AttachmentUncheckedCreateWithoutPostInputFactory<Types>> | undefined,
      Types
    >
    AttachmentUncheckedCreateWithoutPostInputList: () => PGInputFactory<
      Array<AttachmentUncheckedCreateWithoutPostInputFactory<Types>> | undefined,
      Types
    >
  }>
  connectOrCreate: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      AttachmentCreateOrConnectWithoutPostInputFactory<Types> | undefined,
      Types
    >
    AttachmentCreateOrConnectWithoutPostInput: () => PGInputFactory<
      Array<AttachmentCreateOrConnectWithoutPostInputFactory<Types>> | undefined,
      Types
    >
    AttachmentCreateOrConnectWithoutPostInputList: () => PGInputFactory<
      Array<AttachmentCreateOrConnectWithoutPostInputFactory<Types>> | undefined,
      Types
    >
  }>
  createMany: () => PGInputFactory<
    AttachmentCreateManyPostInputEnvelopeFactory<Types> | undefined,
    Types
  >
  connect: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      AttachmentWhereUniqueInputFactory<Types> | undefined,
      Types
    >
    AttachmentWhereUniqueInput: () => PGInputFactory<
      Array<AttachmentWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
    AttachmentWhereUniqueInputList: () => PGInputFactory<
      Array<AttachmentWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
  }>
}
type AttachmentUncheckedCreateNestedManyWithoutPostInputFactory<Types extends PGTypes> = {
  create: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      AttachmentCreateWithoutPostInputFactory<Types> | undefined,
      Types
    >
    AttachmentCreateWithoutPostInput: () => PGInputFactory<
      Array<AttachmentCreateWithoutPostInputFactory<Types>> | undefined,
      Types
    >
    AttachmentCreateWithoutPostInputList: () => PGInputFactory<
      Array<AttachmentCreateWithoutPostInputFactory<Types>> | undefined,
      Types
    >
    AttachmentUncheckedCreateWithoutPostInput: () => PGInputFactory<
      Array<AttachmentUncheckedCreateWithoutPostInputFactory<Types>> | undefined,
      Types
    >
    AttachmentUncheckedCreateWithoutPostInputList: () => PGInputFactory<
      Array<AttachmentUncheckedCreateWithoutPostInputFactory<Types>> | undefined,
      Types
    >
  }>
  connectOrCreate: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      AttachmentCreateOrConnectWithoutPostInputFactory<Types> | undefined,
      Types
    >
    AttachmentCreateOrConnectWithoutPostInput: () => PGInputFactory<
      Array<AttachmentCreateOrConnectWithoutPostInputFactory<Types>> | undefined,
      Types
    >
    AttachmentCreateOrConnectWithoutPostInputList: () => PGInputFactory<
      Array<AttachmentCreateOrConnectWithoutPostInputFactory<Types>> | undefined,
      Types
    >
  }>
  createMany: () => PGInputFactory<
    AttachmentCreateManyPostInputEnvelopeFactory<Types> | undefined,
    Types
  >
  connect: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      AttachmentWhereUniqueInputFactory<Types> | undefined,
      Types
    >
    AttachmentWhereUniqueInput: () => PGInputFactory<
      Array<AttachmentWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
    AttachmentWhereUniqueInputList: () => PGInputFactory<
      Array<AttachmentWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
  }>
}
type BoolFieldUpdateOperationsInputFactory<Types extends PGTypes> = {
  set: PGInputField<boolean | undefined, 'boolean', Types>
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
type AttachmentUpdateManyWithoutPostNestedInputFactory<Types extends PGTypes> = {
  create: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      AttachmentCreateWithoutPostInputFactory<Types> | undefined,
      Types
    >
    AttachmentCreateWithoutPostInput: () => PGInputFactory<
      Array<AttachmentCreateWithoutPostInputFactory<Types>> | undefined,
      Types
    >
    AttachmentCreateWithoutPostInputList: () => PGInputFactory<
      Array<AttachmentCreateWithoutPostInputFactory<Types>> | undefined,
      Types
    >
    AttachmentUncheckedCreateWithoutPostInput: () => PGInputFactory<
      Array<AttachmentUncheckedCreateWithoutPostInputFactory<Types>> | undefined,
      Types
    >
    AttachmentUncheckedCreateWithoutPostInputList: () => PGInputFactory<
      Array<AttachmentUncheckedCreateWithoutPostInputFactory<Types>> | undefined,
      Types
    >
  }>
  connectOrCreate: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      AttachmentCreateOrConnectWithoutPostInputFactory<Types> | undefined,
      Types
    >
    AttachmentCreateOrConnectWithoutPostInput: () => PGInputFactory<
      Array<AttachmentCreateOrConnectWithoutPostInputFactory<Types>> | undefined,
      Types
    >
    AttachmentCreateOrConnectWithoutPostInputList: () => PGInputFactory<
      Array<AttachmentCreateOrConnectWithoutPostInputFactory<Types>> | undefined,
      Types
    >
  }>
  upsert: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      AttachmentUpsertWithWhereUniqueWithoutPostInputFactory<Types> | undefined,
      Types
    >
    AttachmentUpsertWithWhereUniqueWithoutPostInput: () => PGInputFactory<
      Array<AttachmentUpsertWithWhereUniqueWithoutPostInputFactory<Types>> | undefined,
      Types
    >
    AttachmentUpsertWithWhereUniqueWithoutPostInputList: () => PGInputFactory<
      Array<AttachmentUpsertWithWhereUniqueWithoutPostInputFactory<Types>> | undefined,
      Types
    >
  }>
  createMany: () => PGInputFactory<
    AttachmentCreateManyPostInputEnvelopeFactory<Types> | undefined,
    Types
  >
  set: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      AttachmentWhereUniqueInputFactory<Types> | undefined,
      Types
    >
    AttachmentWhereUniqueInput: () => PGInputFactory<
      Array<AttachmentWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
    AttachmentWhereUniqueInputList: () => PGInputFactory<
      Array<AttachmentWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
  }>
  disconnect: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      AttachmentWhereUniqueInputFactory<Types> | undefined,
      Types
    >
    AttachmentWhereUniqueInput: () => PGInputFactory<
      Array<AttachmentWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
    AttachmentWhereUniqueInputList: () => PGInputFactory<
      Array<AttachmentWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
  }>
  delete: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      AttachmentWhereUniqueInputFactory<Types> | undefined,
      Types
    >
    AttachmentWhereUniqueInput: () => PGInputFactory<
      Array<AttachmentWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
    AttachmentWhereUniqueInputList: () => PGInputFactory<
      Array<AttachmentWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
  }>
  connect: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      AttachmentWhereUniqueInputFactory<Types> | undefined,
      Types
    >
    AttachmentWhereUniqueInput: () => PGInputFactory<
      Array<AttachmentWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
    AttachmentWhereUniqueInputList: () => PGInputFactory<
      Array<AttachmentWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
  }>
  update: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      AttachmentUpdateWithWhereUniqueWithoutPostInputFactory<Types> | undefined,
      Types
    >
    AttachmentUpdateWithWhereUniqueWithoutPostInput: () => PGInputFactory<
      Array<AttachmentUpdateWithWhereUniqueWithoutPostInputFactory<Types>> | undefined,
      Types
    >
    AttachmentUpdateWithWhereUniqueWithoutPostInputList: () => PGInputFactory<
      Array<AttachmentUpdateWithWhereUniqueWithoutPostInputFactory<Types>> | undefined,
      Types
    >
  }>
  updateMany: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      AttachmentUpdateManyWithWhereWithoutPostInputFactory<Types> | undefined,
      Types
    >
    AttachmentUpdateManyWithWhereWithoutPostInput: () => PGInputFactory<
      Array<AttachmentUpdateManyWithWhereWithoutPostInputFactory<Types>> | undefined,
      Types
    >
    AttachmentUpdateManyWithWhereWithoutPostInputList: () => PGInputFactory<
      Array<AttachmentUpdateManyWithWhereWithoutPostInputFactory<Types>> | undefined,
      Types
    >
  }>
  deleteMany: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      AttachmentScalarWhereInputFactory<Types> | undefined,
      Types
    >
    AttachmentScalarWhereInput: () => PGInputFactory<
      Array<AttachmentScalarWhereInputFactory<Types>> | undefined,
      Types
    >
    AttachmentScalarWhereInputList: () => PGInputFactory<
      Array<AttachmentScalarWhereInputFactory<Types>> | undefined,
      Types
    >
  }>
}
type AttachmentUncheckedUpdateManyWithoutPostNestedInputFactory<Types extends PGTypes> = {
  create: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      AttachmentCreateWithoutPostInputFactory<Types> | undefined,
      Types
    >
    AttachmentCreateWithoutPostInput: () => PGInputFactory<
      Array<AttachmentCreateWithoutPostInputFactory<Types>> | undefined,
      Types
    >
    AttachmentCreateWithoutPostInputList: () => PGInputFactory<
      Array<AttachmentCreateWithoutPostInputFactory<Types>> | undefined,
      Types
    >
    AttachmentUncheckedCreateWithoutPostInput: () => PGInputFactory<
      Array<AttachmentUncheckedCreateWithoutPostInputFactory<Types>> | undefined,
      Types
    >
    AttachmentUncheckedCreateWithoutPostInputList: () => PGInputFactory<
      Array<AttachmentUncheckedCreateWithoutPostInputFactory<Types>> | undefined,
      Types
    >
  }>
  connectOrCreate: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      AttachmentCreateOrConnectWithoutPostInputFactory<Types> | undefined,
      Types
    >
    AttachmentCreateOrConnectWithoutPostInput: () => PGInputFactory<
      Array<AttachmentCreateOrConnectWithoutPostInputFactory<Types>> | undefined,
      Types
    >
    AttachmentCreateOrConnectWithoutPostInputList: () => PGInputFactory<
      Array<AttachmentCreateOrConnectWithoutPostInputFactory<Types>> | undefined,
      Types
    >
  }>
  upsert: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      AttachmentUpsertWithWhereUniqueWithoutPostInputFactory<Types> | undefined,
      Types
    >
    AttachmentUpsertWithWhereUniqueWithoutPostInput: () => PGInputFactory<
      Array<AttachmentUpsertWithWhereUniqueWithoutPostInputFactory<Types>> | undefined,
      Types
    >
    AttachmentUpsertWithWhereUniqueWithoutPostInputList: () => PGInputFactory<
      Array<AttachmentUpsertWithWhereUniqueWithoutPostInputFactory<Types>> | undefined,
      Types
    >
  }>
  createMany: () => PGInputFactory<
    AttachmentCreateManyPostInputEnvelopeFactory<Types> | undefined,
    Types
  >
  set: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      AttachmentWhereUniqueInputFactory<Types> | undefined,
      Types
    >
    AttachmentWhereUniqueInput: () => PGInputFactory<
      Array<AttachmentWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
    AttachmentWhereUniqueInputList: () => PGInputFactory<
      Array<AttachmentWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
  }>
  disconnect: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      AttachmentWhereUniqueInputFactory<Types> | undefined,
      Types
    >
    AttachmentWhereUniqueInput: () => PGInputFactory<
      Array<AttachmentWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
    AttachmentWhereUniqueInputList: () => PGInputFactory<
      Array<AttachmentWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
  }>
  delete: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      AttachmentWhereUniqueInputFactory<Types> | undefined,
      Types
    >
    AttachmentWhereUniqueInput: () => PGInputFactory<
      Array<AttachmentWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
    AttachmentWhereUniqueInputList: () => PGInputFactory<
      Array<AttachmentWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
  }>
  connect: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      AttachmentWhereUniqueInputFactory<Types> | undefined,
      Types
    >
    AttachmentWhereUniqueInput: () => PGInputFactory<
      Array<AttachmentWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
    AttachmentWhereUniqueInputList: () => PGInputFactory<
      Array<AttachmentWhereUniqueInputFactory<Types>> | undefined,
      Types
    >
  }>
  update: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      AttachmentUpdateWithWhereUniqueWithoutPostInputFactory<Types> | undefined,
      Types
    >
    AttachmentUpdateWithWhereUniqueWithoutPostInput: () => PGInputFactory<
      Array<AttachmentUpdateWithWhereUniqueWithoutPostInputFactory<Types>> | undefined,
      Types
    >
    AttachmentUpdateWithWhereUniqueWithoutPostInputList: () => PGInputFactory<
      Array<AttachmentUpdateWithWhereUniqueWithoutPostInputFactory<Types>> | undefined,
      Types
    >
  }>
  updateMany: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      AttachmentUpdateManyWithWhereWithoutPostInputFactory<Types> | undefined,
      Types
    >
    AttachmentUpdateManyWithWhereWithoutPostInput: () => PGInputFactory<
      Array<AttachmentUpdateManyWithWhereWithoutPostInputFactory<Types>> | undefined,
      Types
    >
    AttachmentUpdateManyWithWhereWithoutPostInputList: () => PGInputFactory<
      Array<AttachmentUpdateManyWithWhereWithoutPostInputFactory<Types>> | undefined,
      Types
    >
  }>
  deleteMany: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      AttachmentScalarWhereInputFactory<Types> | undefined,
      Types
    >
    AttachmentScalarWhereInput: () => PGInputFactory<
      Array<AttachmentScalarWhereInputFactory<Types>> | undefined,
      Types
    >
    AttachmentScalarWhereInputList: () => PGInputFactory<
      Array<AttachmentScalarWhereInputFactory<Types>> | undefined,
      Types
    >
  }>
}
type PostCreateNestedOneWithoutAttachmentsInputFactory<Types extends PGTypes> = {
  create: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      PostCreateWithoutAttachmentsInputFactory<Types> | undefined,
      Types
    >
    PostCreateWithoutAttachmentsInput: () => PGInputFactory<
      PostCreateWithoutAttachmentsInputFactory<Types> | undefined,
      Types
    >
    PostUncheckedCreateWithoutAttachmentsInput: () => PGInputFactory<
      PostUncheckedCreateWithoutAttachmentsInputFactory<Types> | undefined,
      Types
    >
  }>
  connectOrCreate: () => PGInputFactory<
    PostCreateOrConnectWithoutAttachmentsInputFactory<Types> | undefined,
    Types
  >
  connect: () => PGInputFactory<PostWhereUniqueInputFactory<Types> | undefined, Types>
}
type BigIntFieldUpdateOperationsInputFactory<Types extends PGTypes> = {
  set: PGInputField<bigint | undefined, 'bigInt', Types>
  increment: PGInputField<bigint | undefined, 'bigInt', Types>
  decrement: PGInputField<bigint | undefined, 'bigInt', Types>
  multiply: PGInputField<bigint | undefined, 'bigInt', Types>
  divide: PGInputField<bigint | undefined, 'bigInt', Types>
}
type BytesFieldUpdateOperationsInputFactory<Types extends PGTypes> = {
  set: PGInputField<Buffer | undefined, 'bytes', Types>
}
type DecimalFieldUpdateOperationsInputFactory<Types extends PGTypes> = {
  set: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
  increment: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
  decrement: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
  multiply: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
  divide: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
}
type PostUpdateOneRequiredWithoutAttachmentsNestedInputFactory<Types extends PGTypes> = {
  create: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      PostCreateWithoutAttachmentsInputFactory<Types> | undefined,
      Types
    >
    PostCreateWithoutAttachmentsInput: () => PGInputFactory<
      PostCreateWithoutAttachmentsInputFactory<Types> | undefined,
      Types
    >
    PostUncheckedCreateWithoutAttachmentsInput: () => PGInputFactory<
      PostUncheckedCreateWithoutAttachmentsInputFactory<Types> | undefined,
      Types
    >
  }>
  connectOrCreate: () => PGInputFactory<
    PostCreateOrConnectWithoutAttachmentsInputFactory<Types> | undefined,
    Types
  >
  upsert: () => PGInputFactory<
    PostUpsertWithoutAttachmentsInputFactory<Types> | undefined,
    Types
  >
  connect: () => PGInputFactory<PostWhereUniqueInputFactory<Types> | undefined, Types>
  update: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      PostUpdateWithoutAttachmentsInputFactory<Types> | undefined,
      Types
    >
    PostUpdateWithoutAttachmentsInput: () => PGInputFactory<
      PostUpdateWithoutAttachmentsInputFactory<Types> | undefined,
      Types
    >
    PostUncheckedUpdateWithoutAttachmentsInput: () => PGInputFactory<
      PostUncheckedUpdateWithoutAttachmentsInputFactory<Types> | undefined,
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
type NestedDateTimeFilterFactory<Types extends PGTypes> = {
  equals: PGInputField<Date | undefined, 'dateTime', Types>
  in: PGInputField<Date[] | undefined, 'dateTime', Types>
  notIn: PGInputField<Date[] | undefined, 'dateTime', Types>
  lt: PGInputField<Date | undefined, 'dateTime', Types>
  lte: PGInputField<Date | undefined, 'dateTime', Types>
  gt: PGInputField<Date | undefined, 'dateTime', Types>
  gte: PGInputField<Date | undefined, 'dateTime', Types>
  not: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    NestedDateTimeFilter: () => PGInputFactory<
      NestedDateTimeFilterFactory<Types> | undefined,
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
type NestedDateTimeWithAggregatesFilterFactory<Types extends PGTypes> = {
  equals: PGInputField<Date | undefined, 'dateTime', Types>
  in: PGInputField<Date[] | undefined, 'dateTime', Types>
  notIn: PGInputField<Date[] | undefined, 'dateTime', Types>
  lt: PGInputField<Date | undefined, 'dateTime', Types>
  lte: PGInputField<Date | undefined, 'dateTime', Types>
  gt: PGInputField<Date | undefined, 'dateTime', Types>
  gte: PGInputField<Date | undefined, 'dateTime', Types>
  not: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    NestedDateTimeWithAggregatesFilter: () => PGInputFactory<
      NestedDateTimeWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
  }>
  _count: () => PGInputFactory<NestedIntFilterFactory<Types> | undefined, Types>
  _min: () => PGInputFactory<NestedDateTimeFilterFactory<Types> | undefined, Types>
  _max: () => PGInputFactory<NestedDateTimeFilterFactory<Types> | undefined, Types>
}
type NestedBoolFilterFactory<Types extends PGTypes> = {
  equals: PGInputField<boolean | undefined, 'boolean', Types>
  not: PGInputFactoryUnion<{
    __default: PGInputField<boolean | undefined, 'boolean', Types>
    Boolean: PGInputField<boolean | undefined, 'boolean', Types>
    NestedBoolFilter: () => PGInputFactory<
      NestedBoolFilterFactory<Types> | undefined,
      Types
    >
  }>
}
type NestedBoolWithAggregatesFilterFactory<Types extends PGTypes> = {
  equals: PGInputField<boolean | undefined, 'boolean', Types>
  not: PGInputFactoryUnion<{
    __default: PGInputField<boolean | undefined, 'boolean', Types>
    Boolean: PGInputField<boolean | undefined, 'boolean', Types>
    NestedBoolWithAggregatesFilter: () => PGInputFactory<
      NestedBoolWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
  }>
  _count: () => PGInputFactory<NestedIntFilterFactory<Types> | undefined, Types>
  _min: () => PGInputFactory<NestedBoolFilterFactory<Types> | undefined, Types>
  _max: () => PGInputFactory<NestedBoolFilterFactory<Types> | undefined, Types>
}
type NestedBigIntFilterFactory<Types extends PGTypes> = {
  equals: PGInputField<bigint | undefined, 'bigInt', Types>
  in: PGInputField<bigint[] | undefined, 'bigInt', Types>
  notIn: PGInputField<bigint[] | undefined, 'bigInt', Types>
  lt: PGInputField<bigint | undefined, 'bigInt', Types>
  lte: PGInputField<bigint | undefined, 'bigInt', Types>
  gt: PGInputField<bigint | undefined, 'bigInt', Types>
  gte: PGInputField<bigint | undefined, 'bigInt', Types>
  not: PGInputFactoryUnion<{
    __default: PGInputField<bigint | undefined, 'bigInt', Types>
    BigInt: PGInputField<bigint | undefined, 'bigInt', Types>
    NestedBigIntFilter: () => PGInputFactory<
      NestedBigIntFilterFactory<Types> | undefined,
      Types
    >
  }>
}
type NestedBytesFilterFactory<Types extends PGTypes> = {
  equals: PGInputField<Buffer | undefined, 'bytes', Types>
  in: PGInputField<Buffer[] | undefined, 'bytes', Types>
  notIn: PGInputField<Buffer[] | undefined, 'bytes', Types>
  not: PGInputFactoryUnion<{
    __default: PGInputField<Buffer | undefined, 'bytes', Types>
    Bytes: PGInputField<Buffer | undefined, 'bytes', Types>
    NestedBytesFilter: () => PGInputFactory<
      NestedBytesFilterFactory<Types> | undefined,
      Types
    >
  }>
}
type NestedDecimalFilterFactory<Types extends PGTypes> = {
  equals: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
  in: PGInputField<PGInputDecimal[] | undefined, 'decimal', Types>
  notIn: PGInputField<PGInputDecimal[] | undefined, 'decimal', Types>
  lt: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
  lte: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
  gt: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
  gte: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
  not: PGInputFactoryUnion<{
    __default: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
    Decimal: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
    NestedDecimalFilter: () => PGInputFactory<
      NestedDecimalFilterFactory<Types> | undefined,
      Types
    >
  }>
}
type NestedBigIntWithAggregatesFilterFactory<Types extends PGTypes> = {
  equals: PGInputField<bigint | undefined, 'bigInt', Types>
  in: PGInputField<bigint[] | undefined, 'bigInt', Types>
  notIn: PGInputField<bigint[] | undefined, 'bigInt', Types>
  lt: PGInputField<bigint | undefined, 'bigInt', Types>
  lte: PGInputField<bigint | undefined, 'bigInt', Types>
  gt: PGInputField<bigint | undefined, 'bigInt', Types>
  gte: PGInputField<bigint | undefined, 'bigInt', Types>
  not: PGInputFactoryUnion<{
    __default: PGInputField<bigint | undefined, 'bigInt', Types>
    BigInt: PGInputField<bigint | undefined, 'bigInt', Types>
    NestedBigIntWithAggregatesFilter: () => PGInputFactory<
      NestedBigIntWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
  }>
  _count: () => PGInputFactory<NestedIntFilterFactory<Types> | undefined, Types>
  _avg: () => PGInputFactory<NestedFloatFilterFactory<Types> | undefined, Types>
  _sum: () => PGInputFactory<NestedBigIntFilterFactory<Types> | undefined, Types>
  _min: () => PGInputFactory<NestedBigIntFilterFactory<Types> | undefined, Types>
  _max: () => PGInputFactory<NestedBigIntFilterFactory<Types> | undefined, Types>
}
type NestedBytesWithAggregatesFilterFactory<Types extends PGTypes> = {
  equals: PGInputField<Buffer | undefined, 'bytes', Types>
  in: PGInputField<Buffer[] | undefined, 'bytes', Types>
  notIn: PGInputField<Buffer[] | undefined, 'bytes', Types>
  not: PGInputFactoryUnion<{
    __default: PGInputField<Buffer | undefined, 'bytes', Types>
    Bytes: PGInputField<Buffer | undefined, 'bytes', Types>
    NestedBytesWithAggregatesFilter: () => PGInputFactory<
      NestedBytesWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
  }>
  _count: () => PGInputFactory<NestedIntFilterFactory<Types> | undefined, Types>
  _min: () => PGInputFactory<NestedBytesFilterFactory<Types> | undefined, Types>
  _max: () => PGInputFactory<NestedBytesFilterFactory<Types> | undefined, Types>
}
type NestedJsonFilterFactory<Types extends PGTypes> = {
  equals: PGInputFactoryUnion<{
    __default: PGInputField<JsonNullValueFilterFactory | undefined, 'enum', Types>
    JsonNullValueFilter: PGInputField<
      JsonNullValueFilterFactory | undefined,
      'enum',
      Types
    >
    Json: PGInputField<PGInputJson | undefined, 'json', Types>
  }>
  path: PGInputField<string[] | undefined, 'string', Types>
  string_contains: PGInputField<string | undefined, 'string', Types>
  string_starts_with: PGInputField<string | undefined, 'string', Types>
  string_ends_with: PGInputField<string | undefined, 'string', Types>
  array_contains: PGInputField<PGInputJson | null | undefined, 'json', Types>
  array_starts_with: PGInputField<PGInputJson | null | undefined, 'json', Types>
  array_ends_with: PGInputField<PGInputJson | null | undefined, 'json', Types>
  lt: PGInputField<PGInputJson | undefined, 'json', Types>
  lte: PGInputField<PGInputJson | undefined, 'json', Types>
  gt: PGInputField<PGInputJson | undefined, 'json', Types>
  gte: PGInputField<PGInputJson | undefined, 'json', Types>
  not: PGInputFactoryUnion<{
    __default: PGInputField<JsonNullValueFilterFactory | undefined, 'enum', Types>
    JsonNullValueFilter: PGInputField<
      JsonNullValueFilterFactory | undefined,
      'enum',
      Types
    >
    Json: PGInputField<PGInputJson | undefined, 'json', Types>
  }>
}
type NestedDecimalWithAggregatesFilterFactory<Types extends PGTypes> = {
  equals: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
  in: PGInputField<PGInputDecimal[] | undefined, 'decimal', Types>
  notIn: PGInputField<PGInputDecimal[] | undefined, 'decimal', Types>
  lt: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
  lte: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
  gt: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
  gte: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
  not: PGInputFactoryUnion<{
    __default: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
    Decimal: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
    NestedDecimalWithAggregatesFilter: () => PGInputFactory<
      NestedDecimalWithAggregatesFilterFactory<Types> | undefined,
      Types
    >
  }>
  _count: () => PGInputFactory<NestedIntFilterFactory<Types> | undefined, Types>
  _avg: () => PGInputFactory<NestedDecimalFilterFactory<Types> | undefined, Types>
  _sum: () => PGInputFactory<NestedDecimalFilterFactory<Types> | undefined, Types>
  _min: () => PGInputFactory<NestedDecimalFilterFactory<Types> | undefined, Types>
  _max: () => PGInputFactory<NestedDecimalFilterFactory<Types> | undefined, Types>
}
type PostCreateWithoutAuthorInputFactory<Types extends PGTypes> = {
  title: PGInputField<string, 'string', Types>
  content: PGInputField<string, 'string', Types>
  isPublic: PGInputField<boolean, 'boolean', Types>
  attachments: () => PGInputFactory<
    AttachmentCreateNestedManyWithoutPostInputFactory<Types> | undefined,
    Types
  >
  createdAt: PGInputField<Date | undefined, 'dateTime', Types>
  updatedAt: PGInputField<Date | undefined, 'dateTime', Types>
}
type PostUncheckedCreateWithoutAuthorInputFactory<Types extends PGTypes> = {
  id: PGInputField<number | undefined, 'int', Types>
  title: PGInputField<string, 'string', Types>
  content: PGInputField<string, 'string', Types>
  isPublic: PGInputField<boolean, 'boolean', Types>
  attachments: () => PGInputFactory<
    AttachmentUncheckedCreateNestedManyWithoutPostInputFactory<Types> | undefined,
    Types
  >
  createdAt: PGInputField<Date | undefined, 'dateTime', Types>
  updatedAt: PGInputField<Date | undefined, 'dateTime', Types>
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
type PostCreateManyAuthorInputEnvelopeFactory<Types extends PGTypes> = {
  data: () => PGInputFactory<Array<PostCreateManyAuthorInputFactory<Types>>, Types>
  skipDuplicates: PGInputField<boolean | undefined, 'boolean', Types>
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
  isPublic: PGInputFactoryUnion<{
    __default: () => PGInputFactory<BoolFilterFactory<Types> | undefined, Types>
    BoolFilter: () => PGInputFactory<BoolFilterFactory<Types> | undefined, Types>
    Boolean: PGInputField<boolean | undefined, 'boolean', Types>
  }>
  authorId: PGInputFactoryUnion<{
    __default: () => PGInputFactory<IntFilterFactory<Types> | undefined, Types>
    IntFilter: () => PGInputFactory<IntFilterFactory<Types> | undefined, Types>
    Int: PGInputField<number | undefined, 'int', Types>
  }>
  createdAt: PGInputFactoryUnion<{
    __default: () => PGInputFactory<DateTimeFilterFactory<Types> | undefined, Types>
    DateTimeFilter: () => PGInputFactory<DateTimeFilterFactory<Types> | undefined, Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
  }>
  updatedAt: PGInputFactoryUnion<{
    __default: () => PGInputFactory<DateTimeFilterFactory<Types> | undefined, Types>
    DateTimeFilter: () => PGInputFactory<DateTimeFilterFactory<Types> | undefined, Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
  }>
}
type UserCreateWithoutPostsInputFactory<Types extends PGTypes> = {
  firstName: PGInputField<string, 'string', Types>
  lastName: PGInputField<string, 'string', Types>
  createdAt: PGInputField<Date | undefined, 'dateTime', Types>
  updatedAt: PGInputField<Date | undefined, 'dateTime', Types>
}
type UserUncheckedCreateWithoutPostsInputFactory<Types extends PGTypes> = {
  id: PGInputField<number | undefined, 'int', Types>
  firstName: PGInputField<string, 'string', Types>
  lastName: PGInputField<string, 'string', Types>
  createdAt: PGInputField<Date | undefined, 'dateTime', Types>
  updatedAt: PGInputField<Date | undefined, 'dateTime', Types>
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
type AttachmentCreateWithoutPostInputFactory<Types extends PGTypes> = {
  id: PGInputField<bigint | undefined, 'bigInt', Types>
  name: PGInputField<string, 'string', Types>
  buffer: PGInputField<Buffer, 'bytes', Types>
  meta: PGInputFactoryUnion<{
    __default: PGInputField<JsonNullValueInputFactory, 'enum', Types>
    JsonNullValueInput: PGInputField<JsonNullValueInputFactory, 'enum', Types>
    Json: PGInputField<PGInputJson, 'json', Types>
  }>
  size: PGInputField<PGInputDecimal, 'decimal', Types>
  createdAt: PGInputField<Date | undefined, 'dateTime', Types>
  updatedAt: PGInputField<Date | undefined, 'dateTime', Types>
}
type AttachmentUncheckedCreateWithoutPostInputFactory<Types extends PGTypes> = {
  id: PGInputField<bigint | undefined, 'bigInt', Types>
  name: PGInputField<string, 'string', Types>
  buffer: PGInputField<Buffer, 'bytes', Types>
  meta: PGInputFactoryUnion<{
    __default: PGInputField<JsonNullValueInputFactory, 'enum', Types>
    JsonNullValueInput: PGInputField<JsonNullValueInputFactory, 'enum', Types>
    Json: PGInputField<PGInputJson, 'json', Types>
  }>
  size: PGInputField<PGInputDecimal, 'decimal', Types>
  createdAt: PGInputField<Date | undefined, 'dateTime', Types>
  updatedAt: PGInputField<Date | undefined, 'dateTime', Types>
}
type AttachmentCreateOrConnectWithoutPostInputFactory<Types extends PGTypes> = {
  where: () => PGInputFactory<AttachmentWhereUniqueInputFactory<Types>, Types>
  create: PGInputFactoryUnion<{
    __default: () => PGInputFactory<AttachmentCreateWithoutPostInputFactory<Types>, Types>
    AttachmentCreateWithoutPostInput: () => PGInputFactory<
      AttachmentCreateWithoutPostInputFactory<Types>,
      Types
    >
    AttachmentUncheckedCreateWithoutPostInput: () => PGInputFactory<
      AttachmentUncheckedCreateWithoutPostInputFactory<Types>,
      Types
    >
  }>
}
type AttachmentCreateManyPostInputEnvelopeFactory<Types extends PGTypes> = {
  data: () => PGInputFactory<Array<AttachmentCreateManyPostInputFactory<Types>>, Types>
  skipDuplicates: PGInputField<boolean | undefined, 'boolean', Types>
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
  createdAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  updatedAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
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
  createdAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  updatedAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
}
type AttachmentUpsertWithWhereUniqueWithoutPostInputFactory<Types extends PGTypes> = {
  where: () => PGInputFactory<AttachmentWhereUniqueInputFactory<Types>, Types>
  update: PGInputFactoryUnion<{
    __default: () => PGInputFactory<AttachmentUpdateWithoutPostInputFactory<Types>, Types>
    AttachmentUpdateWithoutPostInput: () => PGInputFactory<
      AttachmentUpdateWithoutPostInputFactory<Types>,
      Types
    >
    AttachmentUncheckedUpdateWithoutPostInput: () => PGInputFactory<
      AttachmentUncheckedUpdateWithoutPostInputFactory<Types>,
      Types
    >
  }>
  create: PGInputFactoryUnion<{
    __default: () => PGInputFactory<AttachmentCreateWithoutPostInputFactory<Types>, Types>
    AttachmentCreateWithoutPostInput: () => PGInputFactory<
      AttachmentCreateWithoutPostInputFactory<Types>,
      Types
    >
    AttachmentUncheckedCreateWithoutPostInput: () => PGInputFactory<
      AttachmentUncheckedCreateWithoutPostInputFactory<Types>,
      Types
    >
  }>
}
type AttachmentUpdateWithWhereUniqueWithoutPostInputFactory<Types extends PGTypes> = {
  where: () => PGInputFactory<AttachmentWhereUniqueInputFactory<Types>, Types>
  data: PGInputFactoryUnion<{
    __default: () => PGInputFactory<AttachmentUpdateWithoutPostInputFactory<Types>, Types>
    AttachmentUpdateWithoutPostInput: () => PGInputFactory<
      AttachmentUpdateWithoutPostInputFactory<Types>,
      Types
    >
    AttachmentUncheckedUpdateWithoutPostInput: () => PGInputFactory<
      AttachmentUncheckedUpdateWithoutPostInputFactory<Types>,
      Types
    >
  }>
}
type AttachmentUpdateManyWithWhereWithoutPostInputFactory<Types extends PGTypes> = {
  where: () => PGInputFactory<AttachmentScalarWhereInputFactory<Types>, Types>
  data: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      AttachmentUpdateManyMutationInputFactory<Types>,
      Types
    >
    AttachmentUpdateManyMutationInput: () => PGInputFactory<
      AttachmentUpdateManyMutationInputFactory<Types>,
      Types
    >
    AttachmentUncheckedUpdateManyWithoutAttachmentsInput: () => PGInputFactory<
      AttachmentUncheckedUpdateManyWithoutAttachmentsInputFactory<Types>,
      Types
    >
  }>
}
type AttachmentScalarWhereInputFactory<Types extends PGTypes> = {
  AND: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      AttachmentScalarWhereInputFactory<Types> | undefined,
      Types
    >
    AttachmentScalarWhereInput: () => PGInputFactory<
      Array<AttachmentScalarWhereInputFactory<Types>> | undefined,
      Types
    >
    AttachmentScalarWhereInputList: () => PGInputFactory<
      Array<AttachmentScalarWhereInputFactory<Types>> | undefined,
      Types
    >
  }>
  OR: () => PGInputFactory<
    Array<AttachmentScalarWhereInputFactory<Types>> | undefined,
    Types
  >
  NOT: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      AttachmentScalarWhereInputFactory<Types> | undefined,
      Types
    >
    AttachmentScalarWhereInput: () => PGInputFactory<
      Array<AttachmentScalarWhereInputFactory<Types>> | undefined,
      Types
    >
    AttachmentScalarWhereInputList: () => PGInputFactory<
      Array<AttachmentScalarWhereInputFactory<Types>> | undefined,
      Types
    >
  }>
  id: PGInputFactoryUnion<{
    __default: () => PGInputFactory<BigIntFilterFactory<Types> | undefined, Types>
    BigIntFilter: () => PGInputFactory<BigIntFilterFactory<Types> | undefined, Types>
    BigInt: PGInputField<bigint | undefined, 'bigInt', Types>
  }>
  name: PGInputFactoryUnion<{
    __default: () => PGInputFactory<StringFilterFactory<Types> | undefined, Types>
    StringFilter: () => PGInputFactory<StringFilterFactory<Types> | undefined, Types>
    String: PGInputField<string | undefined, 'string', Types>
  }>
  buffer: PGInputFactoryUnion<{
    __default: () => PGInputFactory<BytesFilterFactory<Types> | undefined, Types>
    BytesFilter: () => PGInputFactory<BytesFilterFactory<Types> | undefined, Types>
    Bytes: PGInputField<Buffer | undefined, 'bytes', Types>
  }>
  meta: () => PGInputFactory<JsonFilterFactory<Types> | undefined, Types>
  size: PGInputFactoryUnion<{
    __default: () => PGInputFactory<DecimalFilterFactory<Types> | undefined, Types>
    DecimalFilter: () => PGInputFactory<DecimalFilterFactory<Types> | undefined, Types>
    Decimal: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
  }>
  postId: PGInputFactoryUnion<{
    __default: () => PGInputFactory<IntFilterFactory<Types> | undefined, Types>
    IntFilter: () => PGInputFactory<IntFilterFactory<Types> | undefined, Types>
    Int: PGInputField<number | undefined, 'int', Types>
  }>
  createdAt: PGInputFactoryUnion<{
    __default: () => PGInputFactory<DateTimeFilterFactory<Types> | undefined, Types>
    DateTimeFilter: () => PGInputFactory<DateTimeFilterFactory<Types> | undefined, Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
  }>
  updatedAt: PGInputFactoryUnion<{
    __default: () => PGInputFactory<DateTimeFilterFactory<Types> | undefined, Types>
    DateTimeFilter: () => PGInputFactory<DateTimeFilterFactory<Types> | undefined, Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
  }>
}
type PostCreateWithoutAttachmentsInputFactory<Types extends PGTypes> = {
  title: PGInputField<string, 'string', Types>
  content: PGInputField<string, 'string', Types>
  isPublic: PGInputField<boolean, 'boolean', Types>
  author: () => PGInputFactory<UserCreateNestedOneWithoutPostsInputFactory<Types>, Types>
  createdAt: PGInputField<Date | undefined, 'dateTime', Types>
  updatedAt: PGInputField<Date | undefined, 'dateTime', Types>
}
type PostUncheckedCreateWithoutAttachmentsInputFactory<Types extends PGTypes> = {
  id: PGInputField<number | undefined, 'int', Types>
  title: PGInputField<string, 'string', Types>
  content: PGInputField<string, 'string', Types>
  isPublic: PGInputField<boolean, 'boolean', Types>
  authorId: PGInputField<number, 'int', Types>
  createdAt: PGInputField<Date | undefined, 'dateTime', Types>
  updatedAt: PGInputField<Date | undefined, 'dateTime', Types>
}
type PostCreateOrConnectWithoutAttachmentsInputFactory<Types extends PGTypes> = {
  where: () => PGInputFactory<PostWhereUniqueInputFactory<Types>, Types>
  create: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      PostCreateWithoutAttachmentsInputFactory<Types>,
      Types
    >
    PostCreateWithoutAttachmentsInput: () => PGInputFactory<
      PostCreateWithoutAttachmentsInputFactory<Types>,
      Types
    >
    PostUncheckedCreateWithoutAttachmentsInput: () => PGInputFactory<
      PostUncheckedCreateWithoutAttachmentsInputFactory<Types>,
      Types
    >
  }>
}
type PostUpsertWithoutAttachmentsInputFactory<Types extends PGTypes> = {
  update: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      PostUpdateWithoutAttachmentsInputFactory<Types>,
      Types
    >
    PostUpdateWithoutAttachmentsInput: () => PGInputFactory<
      PostUpdateWithoutAttachmentsInputFactory<Types>,
      Types
    >
    PostUncheckedUpdateWithoutAttachmentsInput: () => PGInputFactory<
      PostUncheckedUpdateWithoutAttachmentsInputFactory<Types>,
      Types
    >
  }>
  create: PGInputFactoryUnion<{
    __default: () => PGInputFactory<
      PostCreateWithoutAttachmentsInputFactory<Types>,
      Types
    >
    PostCreateWithoutAttachmentsInput: () => PGInputFactory<
      PostCreateWithoutAttachmentsInputFactory<Types>,
      Types
    >
    PostUncheckedCreateWithoutAttachmentsInput: () => PGInputFactory<
      PostUncheckedCreateWithoutAttachmentsInputFactory<Types>,
      Types
    >
  }>
}
type PostUpdateWithoutAttachmentsInputFactory<Types extends PGTypes> = {
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
  isPublic: PGInputFactoryUnion<{
    __default: PGInputField<boolean | undefined, 'boolean', Types>
    Boolean: PGInputField<boolean | undefined, 'boolean', Types>
    BoolFieldUpdateOperationsInput: () => PGInputFactory<
      BoolFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  author: () => PGInputFactory<
    UserUpdateOneRequiredWithoutPostsNestedInputFactory<Types> | undefined,
    Types
  >
  createdAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  updatedAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
}
type PostUncheckedUpdateWithoutAttachmentsInputFactory<Types extends PGTypes> = {
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
  isPublic: PGInputFactoryUnion<{
    __default: PGInputField<boolean | undefined, 'boolean', Types>
    Boolean: PGInputField<boolean | undefined, 'boolean', Types>
    BoolFieldUpdateOperationsInput: () => PGInputFactory<
      BoolFieldUpdateOperationsInputFactory<Types> | undefined,
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
  createdAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  updatedAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
}
type PostCreateManyAuthorInputFactory<Types extends PGTypes> = {
  id: PGInputField<number | undefined, 'int', Types>
  title: PGInputField<string, 'string', Types>
  content: PGInputField<string, 'string', Types>
  isPublic: PGInputField<boolean, 'boolean', Types>
  createdAt: PGInputField<Date | undefined, 'dateTime', Types>
  updatedAt: PGInputField<Date | undefined, 'dateTime', Types>
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
  isPublic: PGInputFactoryUnion<{
    __default: PGInputField<boolean | undefined, 'boolean', Types>
    Boolean: PGInputField<boolean | undefined, 'boolean', Types>
    BoolFieldUpdateOperationsInput: () => PGInputFactory<
      BoolFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  attachments: () => PGInputFactory<
    AttachmentUpdateManyWithoutPostNestedInputFactory<Types> | undefined,
    Types
  >
  createdAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  updatedAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
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
  isPublic: PGInputFactoryUnion<{
    __default: PGInputField<boolean | undefined, 'boolean', Types>
    Boolean: PGInputField<boolean | undefined, 'boolean', Types>
    BoolFieldUpdateOperationsInput: () => PGInputFactory<
      BoolFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  attachments: () => PGInputFactory<
    AttachmentUncheckedUpdateManyWithoutPostNestedInputFactory<Types> | undefined,
    Types
  >
  createdAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  updatedAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
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
  isPublic: PGInputFactoryUnion<{
    __default: PGInputField<boolean | undefined, 'boolean', Types>
    Boolean: PGInputField<boolean | undefined, 'boolean', Types>
    BoolFieldUpdateOperationsInput: () => PGInputFactory<
      BoolFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  createdAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  updatedAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
}
type AttachmentCreateManyPostInputFactory<Types extends PGTypes> = {
  id: PGInputField<bigint | undefined, 'bigInt', Types>
  name: PGInputField<string, 'string', Types>
  buffer: PGInputField<Buffer, 'bytes', Types>
  meta: PGInputFactoryUnion<{
    __default: PGInputField<JsonNullValueInputFactory, 'enum', Types>
    JsonNullValueInput: PGInputField<JsonNullValueInputFactory, 'enum', Types>
    Json: PGInputField<PGInputJson, 'json', Types>
  }>
  size: PGInputField<PGInputDecimal, 'decimal', Types>
  createdAt: PGInputField<Date | undefined, 'dateTime', Types>
  updatedAt: PGInputField<Date | undefined, 'dateTime', Types>
}
type AttachmentUpdateWithoutPostInputFactory<Types extends PGTypes> = {
  id: PGInputFactoryUnion<{
    __default: PGInputField<bigint | undefined, 'bigInt', Types>
    BigInt: PGInputField<bigint | undefined, 'bigInt', Types>
    BigIntFieldUpdateOperationsInput: () => PGInputFactory<
      BigIntFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  name: PGInputFactoryUnion<{
    __default: PGInputField<string | undefined, 'string', Types>
    String: PGInputField<string | undefined, 'string', Types>
    StringFieldUpdateOperationsInput: () => PGInputFactory<
      StringFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  buffer: PGInputFactoryUnion<{
    __default: PGInputField<Buffer | undefined, 'bytes', Types>
    Bytes: PGInputField<Buffer | undefined, 'bytes', Types>
    BytesFieldUpdateOperationsInput: () => PGInputFactory<
      BytesFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  meta: PGInputFactoryUnion<{
    __default: PGInputField<JsonNullValueInputFactory | undefined, 'enum', Types>
    JsonNullValueInput: PGInputField<JsonNullValueInputFactory | undefined, 'enum', Types>
    Json: PGInputField<PGInputJson | undefined, 'json', Types>
  }>
  size: PGInputFactoryUnion<{
    __default: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
    Decimal: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
    DecimalFieldUpdateOperationsInput: () => PGInputFactory<
      DecimalFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  createdAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  updatedAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
}
type AttachmentUncheckedUpdateWithoutPostInputFactory<Types extends PGTypes> = {
  id: PGInputFactoryUnion<{
    __default: PGInputField<bigint | undefined, 'bigInt', Types>
    BigInt: PGInputField<bigint | undefined, 'bigInt', Types>
    BigIntFieldUpdateOperationsInput: () => PGInputFactory<
      BigIntFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  name: PGInputFactoryUnion<{
    __default: PGInputField<string | undefined, 'string', Types>
    String: PGInputField<string | undefined, 'string', Types>
    StringFieldUpdateOperationsInput: () => PGInputFactory<
      StringFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  buffer: PGInputFactoryUnion<{
    __default: PGInputField<Buffer | undefined, 'bytes', Types>
    Bytes: PGInputField<Buffer | undefined, 'bytes', Types>
    BytesFieldUpdateOperationsInput: () => PGInputFactory<
      BytesFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  meta: PGInputFactoryUnion<{
    __default: PGInputField<JsonNullValueInputFactory | undefined, 'enum', Types>
    JsonNullValueInput: PGInputField<JsonNullValueInputFactory | undefined, 'enum', Types>
    Json: PGInputField<PGInputJson | undefined, 'json', Types>
  }>
  size: PGInputFactoryUnion<{
    __default: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
    Decimal: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
    DecimalFieldUpdateOperationsInput: () => PGInputFactory<
      DecimalFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  createdAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
  updatedAt: PGInputFactoryUnion<{
    __default: PGInputField<Date | undefined, 'dateTime', Types>
    DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
      DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
      Types
    >
  }>
}
type AttachmentUncheckedUpdateManyWithoutAttachmentsInputFactory<Types extends PGTypes> =
  {
    id: PGInputFactoryUnion<{
      __default: PGInputField<bigint | undefined, 'bigInt', Types>
      BigInt: PGInputField<bigint | undefined, 'bigInt', Types>
      BigIntFieldUpdateOperationsInput: () => PGInputFactory<
        BigIntFieldUpdateOperationsInputFactory<Types> | undefined,
        Types
      >
    }>
    name: PGInputFactoryUnion<{
      __default: PGInputField<string | undefined, 'string', Types>
      String: PGInputField<string | undefined, 'string', Types>
      StringFieldUpdateOperationsInput: () => PGInputFactory<
        StringFieldUpdateOperationsInputFactory<Types> | undefined,
        Types
      >
    }>
    buffer: PGInputFactoryUnion<{
      __default: PGInputField<Buffer | undefined, 'bytes', Types>
      Bytes: PGInputField<Buffer | undefined, 'bytes', Types>
      BytesFieldUpdateOperationsInput: () => PGInputFactory<
        BytesFieldUpdateOperationsInputFactory<Types> | undefined,
        Types
      >
    }>
    meta: PGInputFactoryUnion<{
      __default: PGInputField<JsonNullValueInputFactory | undefined, 'enum', Types>
      JsonNullValueInput: PGInputField<
        JsonNullValueInputFactory | undefined,
        'enum',
        Types
      >
      Json: PGInputField<PGInputJson | undefined, 'json', Types>
    }>
    size: PGInputFactoryUnion<{
      __default: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
      Decimal: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
      DecimalFieldUpdateOperationsInput: () => PGInputFactory<
        DecimalFieldUpdateOperationsInputFactory<Types> | undefined,
        Types
      >
    }>
    createdAt: PGInputFactoryUnion<{
      __default: PGInputField<Date | undefined, 'dateTime', Types>
      DateTime: PGInputField<Date | undefined, 'dateTime', Types>
      DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
        DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
        Types
      >
    }>
    updatedAt: PGInputFactoryUnion<{
      __default: PGInputField<Date | undefined, 'dateTime', Types>
      DateTime: PGInputField<Date | undefined, 'dateTime', Types>
      DateTimeFieldUpdateOperationsInput: () => PGInputFactory<
        DateTimeFieldUpdateOperationsInputFactory<Types> | undefined,
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
  findFirstAttachment: PGInputFactory<FindFirstAttachmentFactory<Types>, Types>
  findManyAttachment: PGInputFactory<FindManyAttachmentFactory<Types>, Types>
  aggregateAttachment: PGInputFactory<AggregateAttachmentFactory<Types>, Types>
  groupByAttachment: PGInputFactory<GroupByAttachmentFactory<Types>, Types>
  findUniqueAttachment: PGInputFactory<FindUniqueAttachmentFactory<Types>, Types>
  createOneUser: PGInputFactory<CreateOneUserFactory<Types>, Types>
  upsertOneUser: PGInputFactory<UpsertOneUserFactory<Types>, Types>
  createManyUser: PGInputFactory<CreateManyUserFactory<Types>, Types>
  deleteOneUser: PGInputFactory<DeleteOneUserFactory<Types>, Types>
  updateOneUser: PGInputFactory<UpdateOneUserFactory<Types>, Types>
  updateManyUser: PGInputFactory<UpdateManyUserFactory<Types>, Types>
  deleteManyUser: PGInputFactory<DeleteManyUserFactory<Types>, Types>
  createOnePost: PGInputFactory<CreateOnePostFactory<Types>, Types>
  upsertOnePost: PGInputFactory<UpsertOnePostFactory<Types>, Types>
  createManyPost: PGInputFactory<CreateManyPostFactory<Types>, Types>
  deleteOnePost: PGInputFactory<DeleteOnePostFactory<Types>, Types>
  updateOnePost: PGInputFactory<UpdateOnePostFactory<Types>, Types>
  updateManyPost: PGInputFactory<UpdateManyPostFactory<Types>, Types>
  deleteManyPost: PGInputFactory<DeleteManyPostFactory<Types>, Types>
  createOneAttachment: PGInputFactory<CreateOneAttachmentFactory<Types>, Types>
  upsertOneAttachment: PGInputFactory<UpsertOneAttachmentFactory<Types>, Types>
  createManyAttachment: PGInputFactory<CreateManyAttachmentFactory<Types>, Types>
  deleteOneAttachment: PGInputFactory<DeleteOneAttachmentFactory<Types>, Types>
  updateOneAttachment: PGInputFactory<UpdateOneAttachmentFactory<Types>, Types>
  updateManyAttachment: PGInputFactory<UpdateManyAttachmentFactory<Types>, Types>
  deleteManyAttachment: PGInputFactory<DeleteManyAttachmentFactory<Types>, Types>
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
  Attachment: RequiredNonNullable<Prisma.AttachmentFindManyArgs>
}
export type PrismaTypes = {
  Args: PrismaArgsMap
}

export const dmmf: DMMF.Document = JSON.parse(
  '{"datamodel":{"enums":[],"models":[{"name":"User","dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","default":{"name":"autoincrement","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"firstName","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"lastName","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"posts","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Post","relationName":"PostToUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},{"name":"Post","dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","default":{"name":"autoincrement","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"title","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"content","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"isPublic","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Boolean","isGenerated":false,"isUpdatedAt":false},{"name":"author","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","relationName":"PostToUser","relationFromFields":["authorId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"authorId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"attachments","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Attachment","relationName":"AttachmentToPost","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},{"name":"Attachment","dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"BigInt","default":{"name":"autoincrement","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"buffer","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Bytes","isGenerated":false,"isUpdatedAt":false},{"name":"meta","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Json","isGenerated":false,"isUpdatedAt":false},{"name":"size","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Decimal","isGenerated":false,"isUpdatedAt":false},{"name":"post","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Post","relationName":"AttachmentToPost","relationFromFields":["postId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"postId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false}],"types":[]},"schema":{"inputObjectTypes":{"prisma":[{"name":"UserWhereInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"AND","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"UserWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"OR","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"NOT","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"UserWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"IntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"Int","location":"scalar","isList":false}]},{"name":"firstName","isRequired":false,"isNullable":false,"inputTypes":[{"type":"StringFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"String","location":"scalar","isList":false}]},{"name":"lastName","isRequired":false,"isNullable":false,"inputTypes":[{"type":"StringFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"String","location":"scalar","isList":false}]},{"name":"posts","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostListRelationFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTimeFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"DateTime","location":"scalar","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTimeFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"DateTime","location":"scalar","isList":false}]}]},{"name":"UserOrderByWithRelationInput","constraints":{"maxNumFields":1,"minNumFields":0},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"firstName","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"lastName","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"posts","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostOrderByRelationAggregateInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]}]},{"name":"UserWhereUniqueInput","constraints":{"maxNumFields":1,"minNumFields":1},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]}]},{"name":"UserOrderByWithAggregationInput","constraints":{"maxNumFields":1,"minNumFields":0},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"firstName","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"lastName","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"_count","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserCountOrderByAggregateInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_avg","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserAvgOrderByAggregateInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_max","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserMaxOrderByAggregateInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_min","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserMinOrderByAggregateInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_sum","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserSumOrderByAggregateInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"UserScalarWhereWithAggregatesInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"AND","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserScalarWhereWithAggregatesInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"UserScalarWhereWithAggregatesInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"OR","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserScalarWhereWithAggregatesInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"NOT","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserScalarWhereWithAggregatesInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"UserScalarWhereWithAggregatesInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"IntWithAggregatesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"Int","location":"scalar","isList":false}]},{"name":"firstName","isRequired":false,"isNullable":false,"inputTypes":[{"type":"StringWithAggregatesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"String","location":"scalar","isList":false}]},{"name":"lastName","isRequired":false,"isNullable":false,"inputTypes":[{"type":"StringWithAggregatesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"String","location":"scalar","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTimeWithAggregatesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"DateTime","location":"scalar","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTimeWithAggregatesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"DateTime","location":"scalar","isList":false}]}]},{"name":"PostWhereInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"AND","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"OR","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"NOT","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"IntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"Int","location":"scalar","isList":false}]},{"name":"title","isRequired":false,"isNullable":false,"inputTypes":[{"type":"StringFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"String","location":"scalar","isList":false}]},{"name":"content","isRequired":false,"isNullable":false,"inputTypes":[{"type":"StringFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"String","location":"scalar","isList":false}]},{"name":"isPublic","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BoolFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"Boolean","location":"scalar","isList":false}]},{"name":"author","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserRelationFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"UserWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"authorId","isRequired":false,"isNullable":false,"inputTypes":[{"type":"IntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"Int","location":"scalar","isList":false}]},{"name":"attachments","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentListRelationFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTimeFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"DateTime","location":"scalar","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTimeFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"DateTime","location":"scalar","isList":false}]}]},{"name":"PostOrderByWithRelationInput","constraints":{"maxNumFields":1,"minNumFields":0},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"title","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"content","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"isPublic","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"author","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserOrderByWithRelationInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"authorId","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"attachments","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentOrderByRelationAggregateInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]}]},{"name":"PostWhereUniqueInput","constraints":{"maxNumFields":1,"minNumFields":1},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]}]},{"name":"PostOrderByWithAggregationInput","constraints":{"maxNumFields":1,"minNumFields":0},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"title","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"content","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"isPublic","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"authorId","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"_count","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostCountOrderByAggregateInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_avg","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostAvgOrderByAggregateInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_max","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostMaxOrderByAggregateInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_min","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostMinOrderByAggregateInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_sum","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostSumOrderByAggregateInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"PostScalarWhereWithAggregatesInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"AND","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostScalarWhereWithAggregatesInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostScalarWhereWithAggregatesInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"OR","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostScalarWhereWithAggregatesInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"NOT","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostScalarWhereWithAggregatesInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostScalarWhereWithAggregatesInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"IntWithAggregatesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"Int","location":"scalar","isList":false}]},{"name":"title","isRequired":false,"isNullable":false,"inputTypes":[{"type":"StringWithAggregatesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"String","location":"scalar","isList":false}]},{"name":"content","isRequired":false,"isNullable":false,"inputTypes":[{"type":"StringWithAggregatesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"String","location":"scalar","isList":false}]},{"name":"isPublic","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BoolWithAggregatesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"Boolean","location":"scalar","isList":false}]},{"name":"authorId","isRequired":false,"isNullable":false,"inputTypes":[{"type":"IntWithAggregatesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"Int","location":"scalar","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTimeWithAggregatesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"DateTime","location":"scalar","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTimeWithAggregatesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"DateTime","location":"scalar","isList":false}]}]},{"name":"AttachmentWhereInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"AND","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"OR","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"NOT","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigIntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"BigInt","location":"scalar","isList":false}]},{"name":"name","isRequired":false,"isNullable":false,"inputTypes":[{"type":"StringFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"String","location":"scalar","isList":false}]},{"name":"buffer","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BytesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"Bytes","location":"scalar","isList":false}]},{"name":"meta","isRequired":false,"isNullable":false,"inputTypes":[{"type":"JsonFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"size","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DecimalFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"Decimal","location":"scalar","isList":false}]},{"name":"post","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostRelationFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"postId","isRequired":false,"isNullable":false,"inputTypes":[{"type":"IntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"Int","location":"scalar","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTimeFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"DateTime","location":"scalar","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTimeFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"DateTime","location":"scalar","isList":false}]}]},{"name":"AttachmentOrderByWithRelationInput","constraints":{"maxNumFields":1,"minNumFields":0},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"name","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"buffer","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"meta","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"size","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"post","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostOrderByWithRelationInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"postId","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]}]},{"name":"AttachmentWhereUniqueInput","constraints":{"maxNumFields":1,"minNumFields":1},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false}]}]},{"name":"AttachmentOrderByWithAggregationInput","constraints":{"maxNumFields":1,"minNumFields":0},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"name","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"buffer","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"meta","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"size","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"postId","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"_count","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentCountOrderByAggregateInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_avg","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentAvgOrderByAggregateInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_max","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentMaxOrderByAggregateInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_min","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentMinOrderByAggregateInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_sum","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentSumOrderByAggregateInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"AttachmentScalarWhereWithAggregatesInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"AND","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentScalarWhereWithAggregatesInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentScalarWhereWithAggregatesInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"OR","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentScalarWhereWithAggregatesInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"NOT","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentScalarWhereWithAggregatesInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentScalarWhereWithAggregatesInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigIntWithAggregatesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"BigInt","location":"scalar","isList":false}]},{"name":"name","isRequired":false,"isNullable":false,"inputTypes":[{"type":"StringWithAggregatesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"String","location":"scalar","isList":false}]},{"name":"buffer","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BytesWithAggregatesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"Bytes","location":"scalar","isList":false}]},{"name":"meta","isRequired":false,"isNullable":false,"inputTypes":[{"type":"JsonWithAggregatesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"size","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DecimalWithAggregatesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"Decimal","location":"scalar","isList":false}]},{"name":"postId","isRequired":false,"isNullable":false,"inputTypes":[{"type":"IntWithAggregatesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"Int","location":"scalar","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTimeWithAggregatesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"DateTime","location":"scalar","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTimeWithAggregatesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"DateTime","location":"scalar","isList":false}]}]},{"name":"UserCreateInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"firstName","isRequired":true,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"lastName","isRequired":true,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"posts","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostCreateNestedManyWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]}]},{"name":"UserUncheckedCreateInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"firstName","isRequired":true,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"lastName","isRequired":true,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"posts","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostUncheckedCreateNestedManyWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]}]},{"name":"UserUpdateInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"firstName","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"StringFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"lastName","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"StringFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"posts","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostUpdateManyWithoutAuthorNestedInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"UserUncheckedUpdateInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false},{"type":"IntFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"firstName","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"StringFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"lastName","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"StringFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"posts","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostUncheckedUpdateManyWithoutAuthorNestedInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"UserCreateManyInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"firstName","isRequired":true,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"lastName","isRequired":true,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]}]},{"name":"UserUpdateManyMutationInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"firstName","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"StringFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"lastName","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"StringFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"UserUncheckedUpdateManyInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false},{"type":"IntFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"firstName","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"StringFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"lastName","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"StringFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"PostCreateInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"title","isRequired":true,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"content","isRequired":true,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"isPublic","isRequired":true,"isNullable":false,"inputTypes":[{"type":"Boolean","location":"scalar","isList":false}]},{"name":"author","isRequired":true,"isNullable":false,"inputTypes":[{"type":"UserCreateNestedOneWithoutPostsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"attachments","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentCreateNestedManyWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]}]},{"name":"PostUncheckedCreateInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"title","isRequired":true,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"content","isRequired":true,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"isPublic","isRequired":true,"isNullable":false,"inputTypes":[{"type":"Boolean","location":"scalar","isList":false}]},{"name":"authorId","isRequired":true,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"attachments","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentUncheckedCreateNestedManyWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]}]},{"name":"PostUpdateInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"title","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"StringFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"content","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"StringFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"isPublic","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Boolean","location":"scalar","isList":false},{"type":"BoolFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"author","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserUpdateOneRequiredWithoutPostsNestedInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"attachments","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentUpdateManyWithoutPostNestedInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"PostUncheckedUpdateInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false},{"type":"IntFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"title","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"StringFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"content","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"StringFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"isPublic","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Boolean","location":"scalar","isList":false},{"type":"BoolFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"authorId","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false},{"type":"IntFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"attachments","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentUncheckedUpdateManyWithoutPostNestedInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"PostCreateManyInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"title","isRequired":true,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"content","isRequired":true,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"isPublic","isRequired":true,"isNullable":false,"inputTypes":[{"type":"Boolean","location":"scalar","isList":false}]},{"name":"authorId","isRequired":true,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]}]},{"name":"PostUpdateManyMutationInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"title","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"StringFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"content","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"StringFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"isPublic","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Boolean","location":"scalar","isList":false},{"type":"BoolFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"PostUncheckedUpdateManyInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false},{"type":"IntFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"title","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"StringFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"content","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"StringFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"isPublic","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Boolean","location":"scalar","isList":false},{"type":"BoolFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"authorId","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false},{"type":"IntFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"AttachmentCreateInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false}]},{"name":"name","isRequired":true,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"buffer","isRequired":true,"isNullable":false,"inputTypes":[{"type":"Bytes","location":"scalar","isList":false}]},{"name":"meta","isRequired":true,"isNullable":false,"inputTypes":[{"type":"JsonNullValueInput","namespace":"prisma","location":"enumTypes","isList":false},{"type":"Json","location":"scalar","isList":false}]},{"name":"size","isRequired":true,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false}]},{"name":"post","isRequired":true,"isNullable":false,"inputTypes":[{"type":"PostCreateNestedOneWithoutAttachmentsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]}]},{"name":"AttachmentUncheckedCreateInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false}]},{"name":"name","isRequired":true,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"buffer","isRequired":true,"isNullable":false,"inputTypes":[{"type":"Bytes","location":"scalar","isList":false}]},{"name":"meta","isRequired":true,"isNullable":false,"inputTypes":[{"type":"JsonNullValueInput","namespace":"prisma","location":"enumTypes","isList":false},{"type":"Json","location":"scalar","isList":false}]},{"name":"size","isRequired":true,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false}]},{"name":"postId","isRequired":true,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]}]},{"name":"AttachmentUpdateInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false},{"type":"BigIntFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"name","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"StringFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"buffer","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Bytes","location":"scalar","isList":false},{"type":"BytesFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"meta","isRequired":false,"isNullable":false,"inputTypes":[{"type":"JsonNullValueInput","namespace":"prisma","location":"enumTypes","isList":false},{"type":"Json","location":"scalar","isList":false}]},{"name":"size","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false},{"type":"DecimalFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"post","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostUpdateOneRequiredWithoutAttachmentsNestedInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"AttachmentUncheckedUpdateInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false},{"type":"BigIntFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"name","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"StringFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"buffer","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Bytes","location":"scalar","isList":false},{"type":"BytesFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"meta","isRequired":false,"isNullable":false,"inputTypes":[{"type":"JsonNullValueInput","namespace":"prisma","location":"enumTypes","isList":false},{"type":"Json","location":"scalar","isList":false}]},{"name":"size","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false},{"type":"DecimalFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"postId","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false},{"type":"IntFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"AttachmentCreateManyInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false}]},{"name":"name","isRequired":true,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"buffer","isRequired":true,"isNullable":false,"inputTypes":[{"type":"Bytes","location":"scalar","isList":false}]},{"name":"meta","isRequired":true,"isNullable":false,"inputTypes":[{"type":"JsonNullValueInput","namespace":"prisma","location":"enumTypes","isList":false},{"type":"Json","location":"scalar","isList":false}]},{"name":"size","isRequired":true,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false}]},{"name":"postId","isRequired":true,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]}]},{"name":"AttachmentUpdateManyMutationInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false},{"type":"BigIntFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"name","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"StringFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"buffer","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Bytes","location":"scalar","isList":false},{"type":"BytesFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"meta","isRequired":false,"isNullable":false,"inputTypes":[{"type":"JsonNullValueInput","namespace":"prisma","location":"enumTypes","isList":false},{"type":"Json","location":"scalar","isList":false}]},{"name":"size","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false},{"type":"DecimalFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"AttachmentUncheckedUpdateManyInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false},{"type":"BigIntFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"name","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"StringFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"buffer","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Bytes","location":"scalar","isList":false},{"type":"BytesFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"meta","isRequired":false,"isNullable":false,"inputTypes":[{"type":"JsonNullValueInput","namespace":"prisma","location":"enumTypes","isList":false},{"type":"Json","location":"scalar","isList":false}]},{"name":"size","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false},{"type":"DecimalFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"postId","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false},{"type":"IntFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"IntFilter","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"equals","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"in","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":true}]},{"name":"notIn","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":true}]},{"name":"lt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"lte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"gt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"gte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"not","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false},{"type":"NestedIntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"StringFilter","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"equals","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"in","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":true}]},{"name":"notIn","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":true}]},{"name":"lt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"lte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"gt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"gte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"contains","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"startsWith","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"endsWith","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"mode","isRequired":false,"isNullable":false,"inputTypes":[{"type":"QueryMode","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"not","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"NestedStringFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"PostListRelationFilter","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"every","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"some","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"none","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"DateTimeFilter","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"equals","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]},{"name":"in","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":true}]},{"name":"notIn","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":true}]},{"name":"lt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]},{"name":"lte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]},{"name":"gt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]},{"name":"gte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]},{"name":"not","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"NestedDateTimeFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"PostOrderByRelationAggregateInput","constraints":{"maxNumFields":1,"minNumFields":1},"fields":[{"name":"_count","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]}]},{"name":"UserCountOrderByAggregateInput","constraints":{"maxNumFields":1,"minNumFields":1},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"firstName","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"lastName","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]}]},{"name":"UserAvgOrderByAggregateInput","constraints":{"maxNumFields":1,"minNumFields":1},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]}]},{"name":"UserMaxOrderByAggregateInput","constraints":{"maxNumFields":1,"minNumFields":1},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"firstName","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"lastName","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]}]},{"name":"UserMinOrderByAggregateInput","constraints":{"maxNumFields":1,"minNumFields":1},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"firstName","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"lastName","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]}]},{"name":"UserSumOrderByAggregateInput","constraints":{"maxNumFields":1,"minNumFields":1},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]}]},{"name":"IntWithAggregatesFilter","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"equals","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"in","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":true}]},{"name":"notIn","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":true}]},{"name":"lt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"lte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"gt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"gte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"not","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false},{"type":"NestedIntWithAggregatesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_count","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedIntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_avg","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedFloatFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_sum","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedIntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_min","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedIntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_max","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedIntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"StringWithAggregatesFilter","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"equals","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"in","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":true}]},{"name":"notIn","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":true}]},{"name":"lt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"lte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"gt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"gte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"contains","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"startsWith","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"endsWith","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"mode","isRequired":false,"isNullable":false,"inputTypes":[{"type":"QueryMode","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"not","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"NestedStringWithAggregatesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_count","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedIntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_min","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedStringFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_max","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedStringFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"DateTimeWithAggregatesFilter","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"equals","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]},{"name":"in","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":true}]},{"name":"notIn","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":true}]},{"name":"lt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]},{"name":"lte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]},{"name":"gt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]},{"name":"gte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]},{"name":"not","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"NestedDateTimeWithAggregatesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_count","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedIntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_min","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedDateTimeFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_max","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedDateTimeFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"BoolFilter","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"equals","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Boolean","location":"scalar","isList":false}]},{"name":"not","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Boolean","location":"scalar","isList":false},{"type":"NestedBoolFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"UserRelationFilter","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"is","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"isNot","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"AttachmentListRelationFilter","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"every","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"some","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"none","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"AttachmentOrderByRelationAggregateInput","constraints":{"maxNumFields":1,"minNumFields":1},"fields":[{"name":"_count","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]}]},{"name":"PostCountOrderByAggregateInput","constraints":{"maxNumFields":1,"minNumFields":1},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"title","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"content","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"isPublic","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"authorId","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]}]},{"name":"PostAvgOrderByAggregateInput","constraints":{"maxNumFields":1,"minNumFields":1},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"authorId","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]}]},{"name":"PostMaxOrderByAggregateInput","constraints":{"maxNumFields":1,"minNumFields":1},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"title","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"content","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"isPublic","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"authorId","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]}]},{"name":"PostMinOrderByAggregateInput","constraints":{"maxNumFields":1,"minNumFields":1},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"title","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"content","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"isPublic","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"authorId","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]}]},{"name":"PostSumOrderByAggregateInput","constraints":{"maxNumFields":1,"minNumFields":1},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"authorId","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]}]},{"name":"BoolWithAggregatesFilter","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"equals","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Boolean","location":"scalar","isList":false}]},{"name":"not","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Boolean","location":"scalar","isList":false},{"type":"NestedBoolWithAggregatesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_count","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedIntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_min","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedBoolFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_max","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedBoolFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"BigIntFilter","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"equals","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false}]},{"name":"in","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":true}]},{"name":"notIn","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":true}]},{"name":"lt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false}]},{"name":"lte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false}]},{"name":"gt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false}]},{"name":"gte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false}]},{"name":"not","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false},{"type":"NestedBigIntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"BytesFilter","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"equals","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Bytes","location":"scalar","isList":false}]},{"name":"in","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Bytes","location":"scalar","isList":true}]},{"name":"notIn","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Bytes","location":"scalar","isList":true}]},{"name":"not","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Bytes","location":"scalar","isList":false},{"type":"NestedBytesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"JsonFilter","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"equals","isRequired":false,"isNullable":false,"inputTypes":[{"type":"JsonNullValueFilter","namespace":"prisma","location":"enumTypes","isList":false},{"type":"Json","location":"scalar","isList":false}]},{"name":"path","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":true}]},{"name":"string_contains","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"string_starts_with","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"string_ends_with","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"array_contains","isRequired":false,"isNullable":true,"inputTypes":[{"type":"Json","location":"scalar","isList":false},{"type":"Null","location":"scalar","isList":false}]},{"name":"array_starts_with","isRequired":false,"isNullable":true,"inputTypes":[{"type":"Json","location":"scalar","isList":false},{"type":"Null","location":"scalar","isList":false}]},{"name":"array_ends_with","isRequired":false,"isNullable":true,"inputTypes":[{"type":"Json","location":"scalar","isList":false},{"type":"Null","location":"scalar","isList":false}]},{"name":"lt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Json","location":"scalar","isList":false}]},{"name":"lte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Json","location":"scalar","isList":false}]},{"name":"gt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Json","location":"scalar","isList":false}]},{"name":"gte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Json","location":"scalar","isList":false}]},{"name":"not","isRequired":false,"isNullable":false,"inputTypes":[{"type":"JsonNullValueFilter","namespace":"prisma","location":"enumTypes","isList":false},{"type":"Json","location":"scalar","isList":false}]}]},{"name":"DecimalFilter","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"equals","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false}]},{"name":"in","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":true}]},{"name":"notIn","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":true}]},{"name":"lt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false}]},{"name":"lte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false}]},{"name":"gt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false}]},{"name":"gte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false}]},{"name":"not","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false},{"type":"NestedDecimalFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"PostRelationFilter","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"is","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"isNot","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"AttachmentCountOrderByAggregateInput","constraints":{"maxNumFields":1,"minNumFields":1},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"name","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"buffer","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"meta","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"size","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"postId","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]}]},{"name":"AttachmentAvgOrderByAggregateInput","constraints":{"maxNumFields":1,"minNumFields":1},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"size","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"postId","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]}]},{"name":"AttachmentMaxOrderByAggregateInput","constraints":{"maxNumFields":1,"minNumFields":1},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"name","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"buffer","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"size","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"postId","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]}]},{"name":"AttachmentMinOrderByAggregateInput","constraints":{"maxNumFields":1,"minNumFields":1},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"name","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"buffer","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"size","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"postId","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]}]},{"name":"AttachmentSumOrderByAggregateInput","constraints":{"maxNumFields":1,"minNumFields":1},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"size","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"postId","isRequired":false,"isNullable":false,"inputTypes":[{"type":"SortOrder","namespace":"prisma","location":"enumTypes","isList":false}]}]},{"name":"BigIntWithAggregatesFilter","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"equals","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false}]},{"name":"in","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":true}]},{"name":"notIn","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":true}]},{"name":"lt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false}]},{"name":"lte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false}]},{"name":"gt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false}]},{"name":"gte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false}]},{"name":"not","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false},{"type":"NestedBigIntWithAggregatesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_count","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedIntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_avg","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedFloatFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_sum","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedBigIntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_min","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedBigIntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_max","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedBigIntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"BytesWithAggregatesFilter","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"equals","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Bytes","location":"scalar","isList":false}]},{"name":"in","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Bytes","location":"scalar","isList":true}]},{"name":"notIn","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Bytes","location":"scalar","isList":true}]},{"name":"not","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Bytes","location":"scalar","isList":false},{"type":"NestedBytesWithAggregatesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_count","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedIntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_min","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedBytesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_max","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedBytesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"JsonWithAggregatesFilter","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"equals","isRequired":false,"isNullable":false,"inputTypes":[{"type":"JsonNullValueFilter","namespace":"prisma","location":"enumTypes","isList":false},{"type":"Json","location":"scalar","isList":false}]},{"name":"path","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":true}]},{"name":"string_contains","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"string_starts_with","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"string_ends_with","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"array_contains","isRequired":false,"isNullable":true,"inputTypes":[{"type":"Json","location":"scalar","isList":false},{"type":"Null","location":"scalar","isList":false}]},{"name":"array_starts_with","isRequired":false,"isNullable":true,"inputTypes":[{"type":"Json","location":"scalar","isList":false},{"type":"Null","location":"scalar","isList":false}]},{"name":"array_ends_with","isRequired":false,"isNullable":true,"inputTypes":[{"type":"Json","location":"scalar","isList":false},{"type":"Null","location":"scalar","isList":false}]},{"name":"lt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Json","location":"scalar","isList":false}]},{"name":"lte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Json","location":"scalar","isList":false}]},{"name":"gt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Json","location":"scalar","isList":false}]},{"name":"gte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Json","location":"scalar","isList":false}]},{"name":"not","isRequired":false,"isNullable":false,"inputTypes":[{"type":"JsonNullValueFilter","namespace":"prisma","location":"enumTypes","isList":false},{"type":"Json","location":"scalar","isList":false}]},{"name":"_count","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedIntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_min","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedJsonFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_max","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedJsonFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"DecimalWithAggregatesFilter","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"equals","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false}]},{"name":"in","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":true}]},{"name":"notIn","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":true}]},{"name":"lt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false}]},{"name":"lte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false}]},{"name":"gt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false}]},{"name":"gte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false}]},{"name":"not","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false},{"type":"NestedDecimalWithAggregatesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_count","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedIntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_avg","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedDecimalFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_sum","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedDecimalFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_min","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedDecimalFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_max","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedDecimalFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"PostCreateNestedManyWithoutAuthorInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"create","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostCreateWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostCreateWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":true},{"type":"PostUncheckedCreateWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostUncheckedCreateWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"connectOrCreate","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostCreateOrConnectWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostCreateOrConnectWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"createMany","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostCreateManyAuthorInputEnvelope","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"connect","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]}]},{"name":"PostUncheckedCreateNestedManyWithoutAuthorInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"create","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostCreateWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostCreateWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":true},{"type":"PostUncheckedCreateWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostUncheckedCreateWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"connectOrCreate","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostCreateOrConnectWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostCreateOrConnectWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"createMany","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostCreateManyAuthorInputEnvelope","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"connect","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]}]},{"name":"StringFieldUpdateOperationsInput","constraints":{"maxNumFields":1,"minNumFields":1},"fields":[{"name":"set","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]}]},{"name":"PostUpdateManyWithoutAuthorNestedInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"create","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostCreateWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostCreateWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":true},{"type":"PostUncheckedCreateWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostUncheckedCreateWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"connectOrCreate","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostCreateOrConnectWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostCreateOrConnectWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"upsert","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostUpsertWithWhereUniqueWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostUpsertWithWhereUniqueWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"createMany","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostCreateManyAuthorInputEnvelope","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"set","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"disconnect","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"delete","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"connect","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"update","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostUpdateWithWhereUniqueWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostUpdateWithWhereUniqueWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"updateMany","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostUpdateManyWithWhereWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostUpdateManyWithWhereWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"deleteMany","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostScalarWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostScalarWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]}]},{"name":"DateTimeFieldUpdateOperationsInput","constraints":{"maxNumFields":1,"minNumFields":1},"fields":[{"name":"set","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]}]},{"name":"IntFieldUpdateOperationsInput","constraints":{"maxNumFields":1,"minNumFields":1},"fields":[{"name":"set","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"increment","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"decrement","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"multiply","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"divide","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]}]},{"name":"PostUncheckedUpdateManyWithoutAuthorNestedInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"create","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostCreateWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostCreateWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":true},{"type":"PostUncheckedCreateWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostUncheckedCreateWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"connectOrCreate","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostCreateOrConnectWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostCreateOrConnectWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"upsert","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostUpsertWithWhereUniqueWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostUpsertWithWhereUniqueWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"createMany","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostCreateManyAuthorInputEnvelope","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"set","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"disconnect","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"delete","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"connect","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"update","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostUpdateWithWhereUniqueWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostUpdateWithWhereUniqueWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"updateMany","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostUpdateManyWithWhereWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostUpdateManyWithWhereWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"deleteMany","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostScalarWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostScalarWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]}]},{"name":"UserCreateNestedOneWithoutPostsInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"create","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserCreateWithoutPostsInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"UserUncheckedCreateWithoutPostsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"connectOrCreate","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserCreateOrConnectWithoutPostsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"connect","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"AttachmentCreateNestedManyWithoutPostInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"create","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentCreateWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentCreateWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":true},{"type":"AttachmentUncheckedCreateWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentUncheckedCreateWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"connectOrCreate","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentCreateOrConnectWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentCreateOrConnectWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"createMany","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentCreateManyPostInputEnvelope","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"connect","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]}]},{"name":"AttachmentUncheckedCreateNestedManyWithoutPostInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"create","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentCreateWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentCreateWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":true},{"type":"AttachmentUncheckedCreateWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentUncheckedCreateWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"connectOrCreate","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentCreateOrConnectWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentCreateOrConnectWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"createMany","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentCreateManyPostInputEnvelope","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"connect","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]}]},{"name":"BoolFieldUpdateOperationsInput","constraints":{"maxNumFields":1,"minNumFields":1},"fields":[{"name":"set","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Boolean","location":"scalar","isList":false}]}]},{"name":"UserUpdateOneRequiredWithoutPostsNestedInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"create","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserCreateWithoutPostsInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"UserUncheckedCreateWithoutPostsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"connectOrCreate","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserCreateOrConnectWithoutPostsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"upsert","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserUpsertWithoutPostsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"connect","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"update","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserUpdateWithoutPostsInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"UserUncheckedUpdateWithoutPostsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"AttachmentUpdateManyWithoutPostNestedInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"create","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentCreateWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentCreateWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":true},{"type":"AttachmentUncheckedCreateWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentUncheckedCreateWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"connectOrCreate","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentCreateOrConnectWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentCreateOrConnectWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"upsert","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentUpsertWithWhereUniqueWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentUpsertWithWhereUniqueWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"createMany","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentCreateManyPostInputEnvelope","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"set","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"disconnect","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"delete","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"connect","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"update","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentUpdateWithWhereUniqueWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentUpdateWithWhereUniqueWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"updateMany","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentUpdateManyWithWhereWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentUpdateManyWithWhereWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"deleteMany","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentScalarWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentScalarWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]}]},{"name":"AttachmentUncheckedUpdateManyWithoutPostNestedInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"create","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentCreateWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentCreateWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":true},{"type":"AttachmentUncheckedCreateWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentUncheckedCreateWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"connectOrCreate","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentCreateOrConnectWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentCreateOrConnectWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"upsert","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentUpsertWithWhereUniqueWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentUpsertWithWhereUniqueWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"createMany","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentCreateManyPostInputEnvelope","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"set","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"disconnect","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"delete","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"connect","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"update","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentUpdateWithWhereUniqueWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentUpdateWithWhereUniqueWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"updateMany","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentUpdateManyWithWhereWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentUpdateManyWithWhereWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"deleteMany","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentScalarWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentScalarWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]}]},{"name":"PostCreateNestedOneWithoutAttachmentsInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"create","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostCreateWithoutAttachmentsInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostUncheckedCreateWithoutAttachmentsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"connectOrCreate","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostCreateOrConnectWithoutAttachmentsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"connect","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"BigIntFieldUpdateOperationsInput","constraints":{"maxNumFields":1,"minNumFields":1},"fields":[{"name":"set","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false}]},{"name":"increment","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false}]},{"name":"decrement","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false}]},{"name":"multiply","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false}]},{"name":"divide","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false}]}]},{"name":"BytesFieldUpdateOperationsInput","constraints":{"maxNumFields":1,"minNumFields":1},"fields":[{"name":"set","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Bytes","location":"scalar","isList":false}]}]},{"name":"DecimalFieldUpdateOperationsInput","constraints":{"maxNumFields":1,"minNumFields":1},"fields":[{"name":"set","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false}]},{"name":"increment","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false}]},{"name":"decrement","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false}]},{"name":"multiply","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false}]},{"name":"divide","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false}]}]},{"name":"PostUpdateOneRequiredWithoutAttachmentsNestedInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"create","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostCreateWithoutAttachmentsInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostUncheckedCreateWithoutAttachmentsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"connectOrCreate","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostCreateOrConnectWithoutAttachmentsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"upsert","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostUpsertWithoutAttachmentsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"connect","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"update","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostUpdateWithoutAttachmentsInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostUncheckedUpdateWithoutAttachmentsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"NestedIntFilter","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"equals","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"in","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":true}]},{"name":"notIn","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":true}]},{"name":"lt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"lte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"gt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"gte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"not","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false},{"type":"NestedIntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"NestedStringFilter","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"equals","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"in","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":true}]},{"name":"notIn","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":true}]},{"name":"lt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"lte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"gt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"gte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"contains","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"startsWith","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"endsWith","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"not","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"NestedStringFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"NestedDateTimeFilter","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"equals","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]},{"name":"in","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":true}]},{"name":"notIn","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":true}]},{"name":"lt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]},{"name":"lte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]},{"name":"gt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]},{"name":"gte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]},{"name":"not","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"NestedDateTimeFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"NestedIntWithAggregatesFilter","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"equals","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"in","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":true}]},{"name":"notIn","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":true}]},{"name":"lt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"lte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"gt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"gte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"not","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false},{"type":"NestedIntWithAggregatesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_count","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedIntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_avg","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedFloatFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_sum","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedIntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_min","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedIntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_max","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedIntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"NestedFloatFilter","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"equals","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Float","location":"scalar","isList":false}]},{"name":"in","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Float","location":"scalar","isList":true}]},{"name":"notIn","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Float","location":"scalar","isList":true}]},{"name":"lt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Float","location":"scalar","isList":false}]},{"name":"lte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Float","location":"scalar","isList":false}]},{"name":"gt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Float","location":"scalar","isList":false}]},{"name":"gte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Float","location":"scalar","isList":false}]},{"name":"not","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Float","location":"scalar","isList":false},{"type":"NestedFloatFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"NestedStringWithAggregatesFilter","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"equals","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"in","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":true}]},{"name":"notIn","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":true}]},{"name":"lt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"lte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"gt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"gte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"contains","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"startsWith","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"endsWith","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"not","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"NestedStringWithAggregatesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_count","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedIntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_min","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedStringFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_max","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedStringFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"NestedDateTimeWithAggregatesFilter","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"equals","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]},{"name":"in","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":true}]},{"name":"notIn","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":true}]},{"name":"lt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]},{"name":"lte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]},{"name":"gt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]},{"name":"gte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]},{"name":"not","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"NestedDateTimeWithAggregatesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_count","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedIntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_min","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedDateTimeFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_max","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedDateTimeFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"NestedBoolFilter","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"equals","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Boolean","location":"scalar","isList":false}]},{"name":"not","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Boolean","location":"scalar","isList":false},{"type":"NestedBoolFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"NestedBoolWithAggregatesFilter","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"equals","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Boolean","location":"scalar","isList":false}]},{"name":"not","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Boolean","location":"scalar","isList":false},{"type":"NestedBoolWithAggregatesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_count","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedIntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_min","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedBoolFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_max","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedBoolFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"NestedBigIntFilter","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"equals","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false}]},{"name":"in","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":true}]},{"name":"notIn","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":true}]},{"name":"lt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false}]},{"name":"lte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false}]},{"name":"gt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false}]},{"name":"gte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false}]},{"name":"not","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false},{"type":"NestedBigIntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"NestedBytesFilter","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"equals","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Bytes","location":"scalar","isList":false}]},{"name":"in","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Bytes","location":"scalar","isList":true}]},{"name":"notIn","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Bytes","location":"scalar","isList":true}]},{"name":"not","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Bytes","location":"scalar","isList":false},{"type":"NestedBytesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"NestedDecimalFilter","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"equals","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false}]},{"name":"in","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":true}]},{"name":"notIn","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":true}]},{"name":"lt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false}]},{"name":"lte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false}]},{"name":"gt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false}]},{"name":"gte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false}]},{"name":"not","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false},{"type":"NestedDecimalFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"NestedBigIntWithAggregatesFilter","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"equals","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false}]},{"name":"in","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":true}]},{"name":"notIn","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":true}]},{"name":"lt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false}]},{"name":"lte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false}]},{"name":"gt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false}]},{"name":"gte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false}]},{"name":"not","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false},{"type":"NestedBigIntWithAggregatesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_count","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedIntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_avg","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedFloatFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_sum","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedBigIntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_min","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedBigIntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_max","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedBigIntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"NestedBytesWithAggregatesFilter","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"equals","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Bytes","location":"scalar","isList":false}]},{"name":"in","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Bytes","location":"scalar","isList":true}]},{"name":"notIn","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Bytes","location":"scalar","isList":true}]},{"name":"not","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Bytes","location":"scalar","isList":false},{"type":"NestedBytesWithAggregatesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_count","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedIntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_min","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedBytesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_max","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedBytesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"NestedJsonFilter","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"equals","isRequired":false,"isNullable":false,"inputTypes":[{"type":"JsonNullValueFilter","namespace":"prisma","location":"enumTypes","isList":false},{"type":"Json","location":"scalar","isList":false}]},{"name":"path","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":true}]},{"name":"string_contains","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"string_starts_with","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"string_ends_with","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"array_contains","isRequired":false,"isNullable":true,"inputTypes":[{"type":"Json","location":"scalar","isList":false},{"type":"Null","location":"scalar","isList":false}]},{"name":"array_starts_with","isRequired":false,"isNullable":true,"inputTypes":[{"type":"Json","location":"scalar","isList":false},{"type":"Null","location":"scalar","isList":false}]},{"name":"array_ends_with","isRequired":false,"isNullable":true,"inputTypes":[{"type":"Json","location":"scalar","isList":false},{"type":"Null","location":"scalar","isList":false}]},{"name":"lt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Json","location":"scalar","isList":false}]},{"name":"lte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Json","location":"scalar","isList":false}]},{"name":"gt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Json","location":"scalar","isList":false}]},{"name":"gte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Json","location":"scalar","isList":false}]},{"name":"not","isRequired":false,"isNullable":false,"inputTypes":[{"type":"JsonNullValueFilter","namespace":"prisma","location":"enumTypes","isList":false},{"type":"Json","location":"scalar","isList":false}]}]},{"name":"NestedDecimalWithAggregatesFilter","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"equals","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false}]},{"name":"in","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":true}]},{"name":"notIn","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":true}]},{"name":"lt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false}]},{"name":"lte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false}]},{"name":"gt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false}]},{"name":"gte","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false}]},{"name":"not","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false},{"type":"NestedDecimalWithAggregatesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_count","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedIntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_avg","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedDecimalFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_sum","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedDecimalFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_min","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedDecimalFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"_max","isRequired":false,"isNullable":false,"inputTypes":[{"type":"NestedDecimalFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"PostCreateWithoutAuthorInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"title","isRequired":true,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"content","isRequired":true,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"isPublic","isRequired":true,"isNullable":false,"inputTypes":[{"type":"Boolean","location":"scalar","isList":false}]},{"name":"attachments","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentCreateNestedManyWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]}]},{"name":"PostUncheckedCreateWithoutAuthorInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"title","isRequired":true,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"content","isRequired":true,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"isPublic","isRequired":true,"isNullable":false,"inputTypes":[{"type":"Boolean","location":"scalar","isList":false}]},{"name":"attachments","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentUncheckedCreateNestedManyWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]}]},{"name":"PostCreateOrConnectWithoutAuthorInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"where","isRequired":true,"isNullable":false,"inputTypes":[{"type":"PostWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"create","isRequired":true,"isNullable":false,"inputTypes":[{"type":"PostCreateWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostUncheckedCreateWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"PostCreateManyAuthorInputEnvelope","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"data","isRequired":true,"isNullable":false,"inputTypes":[{"type":"PostCreateManyAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"skipDuplicates","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Boolean","location":"scalar","isList":false}]}]},{"name":"PostUpsertWithWhereUniqueWithoutAuthorInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"where","isRequired":true,"isNullable":false,"inputTypes":[{"type":"PostWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"update","isRequired":true,"isNullable":false,"inputTypes":[{"type":"PostUpdateWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostUncheckedUpdateWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"create","isRequired":true,"isNullable":false,"inputTypes":[{"type":"PostCreateWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostUncheckedCreateWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"PostUpdateWithWhereUniqueWithoutAuthorInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"where","isRequired":true,"isNullable":false,"inputTypes":[{"type":"PostWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"data","isRequired":true,"isNullable":false,"inputTypes":[{"type":"PostUpdateWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostUncheckedUpdateWithoutAuthorInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"PostUpdateManyWithWhereWithoutAuthorInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"where","isRequired":true,"isNullable":false,"inputTypes":[{"type":"PostScalarWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"data","isRequired":true,"isNullable":false,"inputTypes":[{"type":"PostUpdateManyMutationInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostUncheckedUpdateManyWithoutPostsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"PostScalarWhereInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"AND","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostScalarWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostScalarWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"OR","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostScalarWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"NOT","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostScalarWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostScalarWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"IntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"Int","location":"scalar","isList":false}]},{"name":"title","isRequired":false,"isNullable":false,"inputTypes":[{"type":"StringFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"String","location":"scalar","isList":false}]},{"name":"content","isRequired":false,"isNullable":false,"inputTypes":[{"type":"StringFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"String","location":"scalar","isList":false}]},{"name":"isPublic","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BoolFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"Boolean","location":"scalar","isList":false}]},{"name":"authorId","isRequired":false,"isNullable":false,"inputTypes":[{"type":"IntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"Int","location":"scalar","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTimeFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"DateTime","location":"scalar","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTimeFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"DateTime","location":"scalar","isList":false}]}]},{"name":"UserCreateWithoutPostsInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"firstName","isRequired":true,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"lastName","isRequired":true,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]}]},{"name":"UserUncheckedCreateWithoutPostsInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"firstName","isRequired":true,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"lastName","isRequired":true,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]}]},{"name":"UserCreateOrConnectWithoutPostsInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"where","isRequired":true,"isNullable":false,"inputTypes":[{"type":"UserWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"create","isRequired":true,"isNullable":false,"inputTypes":[{"type":"UserCreateWithoutPostsInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"UserUncheckedCreateWithoutPostsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"AttachmentCreateWithoutPostInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false}]},{"name":"name","isRequired":true,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"buffer","isRequired":true,"isNullable":false,"inputTypes":[{"type":"Bytes","location":"scalar","isList":false}]},{"name":"meta","isRequired":true,"isNullable":false,"inputTypes":[{"type":"JsonNullValueInput","namespace":"prisma","location":"enumTypes","isList":false},{"type":"Json","location":"scalar","isList":false}]},{"name":"size","isRequired":true,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]}]},{"name":"AttachmentUncheckedCreateWithoutPostInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false}]},{"name":"name","isRequired":true,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"buffer","isRequired":true,"isNullable":false,"inputTypes":[{"type":"Bytes","location":"scalar","isList":false}]},{"name":"meta","isRequired":true,"isNullable":false,"inputTypes":[{"type":"JsonNullValueInput","namespace":"prisma","location":"enumTypes","isList":false},{"type":"Json","location":"scalar","isList":false}]},{"name":"size","isRequired":true,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]}]},{"name":"AttachmentCreateOrConnectWithoutPostInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"where","isRequired":true,"isNullable":false,"inputTypes":[{"type":"AttachmentWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"create","isRequired":true,"isNullable":false,"inputTypes":[{"type":"AttachmentCreateWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentUncheckedCreateWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"AttachmentCreateManyPostInputEnvelope","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"data","isRequired":true,"isNullable":false,"inputTypes":[{"type":"AttachmentCreateManyPostInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"skipDuplicates","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Boolean","location":"scalar","isList":false}]}]},{"name":"UserUpsertWithoutPostsInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"update","isRequired":true,"isNullable":false,"inputTypes":[{"type":"UserUpdateWithoutPostsInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"UserUncheckedUpdateWithoutPostsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"create","isRequired":true,"isNullable":false,"inputTypes":[{"type":"UserCreateWithoutPostsInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"UserUncheckedCreateWithoutPostsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"UserUpdateWithoutPostsInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"firstName","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"StringFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"lastName","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"StringFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"UserUncheckedUpdateWithoutPostsInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false},{"type":"IntFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"firstName","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"StringFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"lastName","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"StringFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"AttachmentUpsertWithWhereUniqueWithoutPostInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"where","isRequired":true,"isNullable":false,"inputTypes":[{"type":"AttachmentWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"update","isRequired":true,"isNullable":false,"inputTypes":[{"type":"AttachmentUpdateWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentUncheckedUpdateWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"create","isRequired":true,"isNullable":false,"inputTypes":[{"type":"AttachmentCreateWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentUncheckedCreateWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"AttachmentUpdateWithWhereUniqueWithoutPostInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"where","isRequired":true,"isNullable":false,"inputTypes":[{"type":"AttachmentWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"data","isRequired":true,"isNullable":false,"inputTypes":[{"type":"AttachmentUpdateWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentUncheckedUpdateWithoutPostInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"AttachmentUpdateManyWithWhereWithoutPostInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"where","isRequired":true,"isNullable":false,"inputTypes":[{"type":"AttachmentScalarWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"data","isRequired":true,"isNullable":false,"inputTypes":[{"type":"AttachmentUpdateManyMutationInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentUncheckedUpdateManyWithoutAttachmentsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"AttachmentScalarWhereInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"AND","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentScalarWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentScalarWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"OR","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentScalarWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"NOT","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentScalarWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentScalarWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigIntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"BigInt","location":"scalar","isList":false}]},{"name":"name","isRequired":false,"isNullable":false,"inputTypes":[{"type":"StringFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"String","location":"scalar","isList":false}]},{"name":"buffer","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BytesFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"Bytes","location":"scalar","isList":false}]},{"name":"meta","isRequired":false,"isNullable":false,"inputTypes":[{"type":"JsonFilter","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"size","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DecimalFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"Decimal","location":"scalar","isList":false}]},{"name":"postId","isRequired":false,"isNullable":false,"inputTypes":[{"type":"IntFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"Int","location":"scalar","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTimeFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"DateTime","location":"scalar","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTimeFilter","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"DateTime","location":"scalar","isList":false}]}]},{"name":"PostCreateWithoutAttachmentsInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"title","isRequired":true,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"content","isRequired":true,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"isPublic","isRequired":true,"isNullable":false,"inputTypes":[{"type":"Boolean","location":"scalar","isList":false}]},{"name":"author","isRequired":true,"isNullable":false,"inputTypes":[{"type":"UserCreateNestedOneWithoutPostsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]}]},{"name":"PostUncheckedCreateWithoutAttachmentsInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"title","isRequired":true,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"content","isRequired":true,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"isPublic","isRequired":true,"isNullable":false,"inputTypes":[{"type":"Boolean","location":"scalar","isList":false}]},{"name":"authorId","isRequired":true,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]}]},{"name":"PostCreateOrConnectWithoutAttachmentsInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"where","isRequired":true,"isNullable":false,"inputTypes":[{"type":"PostWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"create","isRequired":true,"isNullable":false,"inputTypes":[{"type":"PostCreateWithoutAttachmentsInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostUncheckedCreateWithoutAttachmentsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"PostUpsertWithoutAttachmentsInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"update","isRequired":true,"isNullable":false,"inputTypes":[{"type":"PostUpdateWithoutAttachmentsInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostUncheckedUpdateWithoutAttachmentsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"create","isRequired":true,"isNullable":false,"inputTypes":[{"type":"PostCreateWithoutAttachmentsInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostUncheckedCreateWithoutAttachmentsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"PostUpdateWithoutAttachmentsInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"title","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"StringFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"content","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"StringFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"isPublic","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Boolean","location":"scalar","isList":false},{"type":"BoolFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"author","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserUpdateOneRequiredWithoutPostsNestedInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"PostUncheckedUpdateWithoutAttachmentsInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false},{"type":"IntFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"title","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"StringFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"content","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"StringFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"isPublic","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Boolean","location":"scalar","isList":false},{"type":"BoolFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"authorId","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false},{"type":"IntFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"PostCreateManyAuthorInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"title","isRequired":true,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"content","isRequired":true,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"isPublic","isRequired":true,"isNullable":false,"inputTypes":[{"type":"Boolean","location":"scalar","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]}]},{"name":"PostUpdateWithoutAuthorInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"title","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"StringFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"content","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"StringFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"isPublic","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Boolean","location":"scalar","isList":false},{"type":"BoolFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"attachments","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentUpdateManyWithoutPostNestedInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"PostUncheckedUpdateWithoutAuthorInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false},{"type":"IntFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"title","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"StringFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"content","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"StringFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"isPublic","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Boolean","location":"scalar","isList":false},{"type":"BoolFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"attachments","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentUncheckedUpdateManyWithoutPostNestedInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"PostUncheckedUpdateManyWithoutPostsInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false},{"type":"IntFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"title","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"StringFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"content","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"StringFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"isPublic","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Boolean","location":"scalar","isList":false},{"type":"BoolFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"AttachmentCreateManyPostInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false}]},{"name":"name","isRequired":true,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"buffer","isRequired":true,"isNullable":false,"inputTypes":[{"type":"Bytes","location":"scalar","isList":false}]},{"name":"meta","isRequired":true,"isNullable":false,"inputTypes":[{"type":"JsonNullValueInput","namespace":"prisma","location":"enumTypes","isList":false},{"type":"Json","location":"scalar","isList":false}]},{"name":"size","isRequired":true,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false}]}]},{"name":"AttachmentUpdateWithoutPostInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false},{"type":"BigIntFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"name","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"StringFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"buffer","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Bytes","location":"scalar","isList":false},{"type":"BytesFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"meta","isRequired":false,"isNullable":false,"inputTypes":[{"type":"JsonNullValueInput","namespace":"prisma","location":"enumTypes","isList":false},{"type":"Json","location":"scalar","isList":false}]},{"name":"size","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false},{"type":"DecimalFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"AttachmentUncheckedUpdateWithoutPostInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false},{"type":"BigIntFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"name","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"StringFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"buffer","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Bytes","location":"scalar","isList":false},{"type":"BytesFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"meta","isRequired":false,"isNullable":false,"inputTypes":[{"type":"JsonNullValueInput","namespace":"prisma","location":"enumTypes","isList":false},{"type":"Json","location":"scalar","isList":false}]},{"name":"size","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false},{"type":"DecimalFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]},{"name":"AttachmentUncheckedUpdateManyWithoutAttachmentsInput","constraints":{"maxNumFields":null,"minNumFields":null},"fields":[{"name":"id","isRequired":false,"isNullable":false,"inputTypes":[{"type":"BigInt","location":"scalar","isList":false},{"type":"BigIntFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"name","isRequired":false,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false},{"type":"StringFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"buffer","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Bytes","location":"scalar","isList":false},{"type":"BytesFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"meta","isRequired":false,"isNullable":false,"inputTypes":[{"type":"JsonNullValueInput","namespace":"prisma","location":"enumTypes","isList":false},{"type":"Json","location":"scalar","isList":false}]},{"name":"size","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Decimal","location":"scalar","isList":false},{"type":"DecimalFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"createdAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"updatedAt","isRequired":false,"isNullable":false,"inputTypes":[{"type":"DateTime","location":"scalar","isList":false},{"type":"DateTimeFieldUpdateOperationsInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}]}]},"outputObjectTypes":{"prisma":[{"name":"Query","fields":[{"name":"findFirstUser","args":[{"name":"where","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"orderBy","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserOrderByWithRelationInput","namespace":"prisma","location":"inputObjectTypes","isList":true},{"type":"UserOrderByWithRelationInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"cursor","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"take","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"skip","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"distinct","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserScalarFieldEnum","namespace":"prisma","location":"enumTypes","isList":true}]}],"isNullable":true,"outputType":{"type":"User","namespace":"model","location":"outputObjectTypes","isList":false}},{"name":"findManyUser","args":[{"name":"where","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"orderBy","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserOrderByWithRelationInput","namespace":"prisma","location":"inputObjectTypes","isList":true},{"type":"UserOrderByWithRelationInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"cursor","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"take","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"skip","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"distinct","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserScalarFieldEnum","namespace":"prisma","location":"enumTypes","isList":true}]}],"isNullable":false,"outputType":{"type":"User","namespace":"model","location":"outputObjectTypes","isList":true}},{"name":"aggregateUser","args":[{"name":"where","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"orderBy","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserOrderByWithRelationInput","namespace":"prisma","location":"inputObjectTypes","isList":true},{"type":"UserOrderByWithRelationInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"cursor","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"take","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"skip","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]}],"isNullable":false,"outputType":{"type":"AggregateUser","namespace":"prisma","location":"outputObjectTypes","isList":false}},{"name":"groupByUser","args":[{"name":"where","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"orderBy","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserOrderByWithAggregationInput","namespace":"prisma","location":"inputObjectTypes","isList":true},{"type":"UserOrderByWithAggregationInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"by","isRequired":true,"isNullable":false,"inputTypes":[{"type":"UserScalarFieldEnum","namespace":"prisma","location":"enumTypes","isList":true},{"type":"UserScalarFieldEnum","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"having","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserScalarWhereWithAggregatesInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"take","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"skip","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]}],"isNullable":false,"outputType":{"type":"UserGroupByOutputType","namespace":"prisma","location":"outputObjectTypes","isList":true}},{"name":"findUniqueUser","args":[{"name":"where","isRequired":true,"isNullable":false,"inputTypes":[{"type":"UserWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}],"isNullable":true,"outputType":{"type":"User","namespace":"model","location":"outputObjectTypes","isList":false}},{"name":"findFirstPost","args":[{"name":"where","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"orderBy","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostOrderByWithRelationInput","namespace":"prisma","location":"inputObjectTypes","isList":true},{"type":"PostOrderByWithRelationInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"cursor","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"take","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"skip","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"distinct","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostScalarFieldEnum","namespace":"prisma","location":"enumTypes","isList":true}]}],"isNullable":true,"outputType":{"type":"Post","namespace":"model","location":"outputObjectTypes","isList":false}},{"name":"findManyPost","args":[{"name":"where","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"orderBy","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostOrderByWithRelationInput","namespace":"prisma","location":"inputObjectTypes","isList":true},{"type":"PostOrderByWithRelationInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"cursor","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"take","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"skip","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"distinct","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostScalarFieldEnum","namespace":"prisma","location":"enumTypes","isList":true}]}],"isNullable":false,"outputType":{"type":"Post","namespace":"model","location":"outputObjectTypes","isList":true}},{"name":"aggregatePost","args":[{"name":"where","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"orderBy","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostOrderByWithRelationInput","namespace":"prisma","location":"inputObjectTypes","isList":true},{"type":"PostOrderByWithRelationInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"cursor","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"take","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"skip","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]}],"isNullable":false,"outputType":{"type":"AggregatePost","namespace":"prisma","location":"outputObjectTypes","isList":false}},{"name":"groupByPost","args":[{"name":"where","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"orderBy","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostOrderByWithAggregationInput","namespace":"prisma","location":"inputObjectTypes","isList":true},{"type":"PostOrderByWithAggregationInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"by","isRequired":true,"isNullable":false,"inputTypes":[{"type":"PostScalarFieldEnum","namespace":"prisma","location":"enumTypes","isList":true},{"type":"PostScalarFieldEnum","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"having","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostScalarWhereWithAggregatesInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"take","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"skip","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]}],"isNullable":false,"outputType":{"type":"PostGroupByOutputType","namespace":"prisma","location":"outputObjectTypes","isList":true}},{"name":"findUniquePost","args":[{"name":"where","isRequired":true,"isNullable":false,"inputTypes":[{"type":"PostWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}],"isNullable":true,"outputType":{"type":"Post","namespace":"model","location":"outputObjectTypes","isList":false}},{"name":"findFirstAttachment","args":[{"name":"where","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"orderBy","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentOrderByWithRelationInput","namespace":"prisma","location":"inputObjectTypes","isList":true},{"type":"AttachmentOrderByWithRelationInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"cursor","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"take","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"skip","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"distinct","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentScalarFieldEnum","namespace":"prisma","location":"enumTypes","isList":true}]}],"isNullable":true,"outputType":{"type":"Attachment","namespace":"model","location":"outputObjectTypes","isList":false}},{"name":"findManyAttachment","args":[{"name":"where","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"orderBy","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentOrderByWithRelationInput","namespace":"prisma","location":"inputObjectTypes","isList":true},{"type":"AttachmentOrderByWithRelationInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"cursor","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"take","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"skip","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"distinct","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentScalarFieldEnum","namespace":"prisma","location":"enumTypes","isList":true}]}],"isNullable":false,"outputType":{"type":"Attachment","namespace":"model","location":"outputObjectTypes","isList":true}},{"name":"aggregateAttachment","args":[{"name":"where","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"orderBy","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentOrderByWithRelationInput","namespace":"prisma","location":"inputObjectTypes","isList":true},{"type":"AttachmentOrderByWithRelationInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"cursor","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"take","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"skip","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]}],"isNullable":false,"outputType":{"type":"AggregateAttachment","namespace":"prisma","location":"outputObjectTypes","isList":false}},{"name":"groupByAttachment","args":[{"name":"where","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"orderBy","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentOrderByWithAggregationInput","namespace":"prisma","location":"inputObjectTypes","isList":true},{"type":"AttachmentOrderByWithAggregationInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"by","isRequired":true,"isNullable":false,"inputTypes":[{"type":"AttachmentScalarFieldEnum","namespace":"prisma","location":"enumTypes","isList":true},{"type":"AttachmentScalarFieldEnum","namespace":"prisma","location":"enumTypes","isList":false}]},{"name":"having","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentScalarWhereWithAggregatesInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"take","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"skip","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]}],"isNullable":false,"outputType":{"type":"AttachmentGroupByOutputType","namespace":"prisma","location":"outputObjectTypes","isList":true}},{"name":"findUniqueAttachment","args":[{"name":"where","isRequired":true,"isNullable":false,"inputTypes":[{"type":"AttachmentWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}],"isNullable":true,"outputType":{"type":"Attachment","namespace":"model","location":"outputObjectTypes","isList":false}}]},{"name":"Mutation","fields":[{"name":"createOneUser","args":[{"name":"data","isRequired":true,"isNullable":false,"inputTypes":[{"type":"UserCreateInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"UserUncheckedCreateInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}],"isNullable":false,"outputType":{"type":"User","namespace":"model","location":"outputObjectTypes","isList":false}},{"name":"upsertOneUser","args":[{"name":"where","isRequired":true,"isNullable":false,"inputTypes":[{"type":"UserWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"create","isRequired":true,"isNullable":false,"inputTypes":[{"type":"UserCreateInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"UserUncheckedCreateInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"update","isRequired":true,"isNullable":false,"inputTypes":[{"type":"UserUpdateInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"UserUncheckedUpdateInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}],"isNullable":false,"outputType":{"type":"User","namespace":"model","location":"outputObjectTypes","isList":false}},{"name":"createManyUser","args":[{"name":"data","isRequired":true,"isNullable":false,"inputTypes":[{"type":"UserCreateManyInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"skipDuplicates","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Boolean","location":"scalar","isList":false}]}],"isNullable":false,"outputType":{"type":"AffectedRowsOutput","namespace":"prisma","location":"outputObjectTypes","isList":false}},{"name":"deleteOneUser","args":[{"name":"where","isRequired":true,"isNullable":false,"inputTypes":[{"type":"UserWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}],"isNullable":true,"outputType":{"type":"User","namespace":"model","location":"outputObjectTypes","isList":false}},{"name":"updateOneUser","args":[{"name":"data","isRequired":true,"isNullable":false,"inputTypes":[{"type":"UserUpdateInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"UserUncheckedUpdateInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"where","isRequired":true,"isNullable":false,"inputTypes":[{"type":"UserWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}],"isNullable":true,"outputType":{"type":"User","namespace":"model","location":"outputObjectTypes","isList":false}},{"name":"updateManyUser","args":[{"name":"data","isRequired":true,"isNullable":false,"inputTypes":[{"type":"UserUpdateManyMutationInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"UserUncheckedUpdateManyInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"where","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}],"isNullable":false,"outputType":{"type":"AffectedRowsOutput","namespace":"prisma","location":"outputObjectTypes","isList":false}},{"name":"deleteManyUser","args":[{"name":"where","isRequired":false,"isNullable":false,"inputTypes":[{"type":"UserWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}],"isNullable":false,"outputType":{"type":"AffectedRowsOutput","namespace":"prisma","location":"outputObjectTypes","isList":false}},{"name":"createOnePost","args":[{"name":"data","isRequired":true,"isNullable":false,"inputTypes":[{"type":"PostCreateInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostUncheckedCreateInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}],"isNullable":false,"outputType":{"type":"Post","namespace":"model","location":"outputObjectTypes","isList":false}},{"name":"upsertOnePost","args":[{"name":"where","isRequired":true,"isNullable":false,"inputTypes":[{"type":"PostWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"create","isRequired":true,"isNullable":false,"inputTypes":[{"type":"PostCreateInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostUncheckedCreateInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"update","isRequired":true,"isNullable":false,"inputTypes":[{"type":"PostUpdateInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostUncheckedUpdateInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}],"isNullable":false,"outputType":{"type":"Post","namespace":"model","location":"outputObjectTypes","isList":false}},{"name":"createManyPost","args":[{"name":"data","isRequired":true,"isNullable":false,"inputTypes":[{"type":"PostCreateManyInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"skipDuplicates","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Boolean","location":"scalar","isList":false}]}],"isNullable":false,"outputType":{"type":"AffectedRowsOutput","namespace":"prisma","location":"outputObjectTypes","isList":false}},{"name":"deleteOnePost","args":[{"name":"where","isRequired":true,"isNullable":false,"inputTypes":[{"type":"PostWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}],"isNullable":true,"outputType":{"type":"Post","namespace":"model","location":"outputObjectTypes","isList":false}},{"name":"updateOnePost","args":[{"name":"data","isRequired":true,"isNullable":false,"inputTypes":[{"type":"PostUpdateInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostUncheckedUpdateInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"where","isRequired":true,"isNullable":false,"inputTypes":[{"type":"PostWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}],"isNullable":true,"outputType":{"type":"Post","namespace":"model","location":"outputObjectTypes","isList":false}},{"name":"updateManyPost","args":[{"name":"data","isRequired":true,"isNullable":false,"inputTypes":[{"type":"PostUpdateManyMutationInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"PostUncheckedUpdateManyInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"where","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}],"isNullable":false,"outputType":{"type":"AffectedRowsOutput","namespace":"prisma","location":"outputObjectTypes","isList":false}},{"name":"deleteManyPost","args":[{"name":"where","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}],"isNullable":false,"outputType":{"type":"AffectedRowsOutput","namespace":"prisma","location":"outputObjectTypes","isList":false}},{"name":"createOneAttachment","args":[{"name":"data","isRequired":true,"isNullable":false,"inputTypes":[{"type":"AttachmentCreateInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentUncheckedCreateInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}],"isNullable":false,"outputType":{"type":"Attachment","namespace":"model","location":"outputObjectTypes","isList":false}},{"name":"upsertOneAttachment","args":[{"name":"where","isRequired":true,"isNullable":false,"inputTypes":[{"type":"AttachmentWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"create","isRequired":true,"isNullable":false,"inputTypes":[{"type":"AttachmentCreateInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentUncheckedCreateInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"update","isRequired":true,"isNullable":false,"inputTypes":[{"type":"AttachmentUpdateInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentUncheckedUpdateInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}],"isNullable":false,"outputType":{"type":"Attachment","namespace":"model","location":"outputObjectTypes","isList":false}},{"name":"createManyAttachment","args":[{"name":"data","isRequired":true,"isNullable":false,"inputTypes":[{"type":"AttachmentCreateManyInput","namespace":"prisma","location":"inputObjectTypes","isList":true}]},{"name":"skipDuplicates","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Boolean","location":"scalar","isList":false}]}],"isNullable":false,"outputType":{"type":"AffectedRowsOutput","namespace":"prisma","location":"outputObjectTypes","isList":false}},{"name":"deleteOneAttachment","args":[{"name":"where","isRequired":true,"isNullable":false,"inputTypes":[{"type":"AttachmentWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}],"isNullable":true,"outputType":{"type":"Attachment","namespace":"model","location":"outputObjectTypes","isList":false}},{"name":"updateOneAttachment","args":[{"name":"data","isRequired":true,"isNullable":false,"inputTypes":[{"type":"AttachmentUpdateInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentUncheckedUpdateInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"where","isRequired":true,"isNullable":false,"inputTypes":[{"type":"AttachmentWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}],"isNullable":true,"outputType":{"type":"Attachment","namespace":"model","location":"outputObjectTypes","isList":false}},{"name":"updateManyAttachment","args":[{"name":"data","isRequired":true,"isNullable":false,"inputTypes":[{"type":"AttachmentUpdateManyMutationInput","namespace":"prisma","location":"inputObjectTypes","isList":false},{"type":"AttachmentUncheckedUpdateManyInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"where","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}],"isNullable":false,"outputType":{"type":"AffectedRowsOutput","namespace":"prisma","location":"outputObjectTypes","isList":false}},{"name":"deleteManyAttachment","args":[{"name":"where","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]}],"isNullable":false,"outputType":{"type":"AffectedRowsOutput","namespace":"prisma","location":"outputObjectTypes","isList":false}},{"name":"executeRaw","args":[{"name":"query","isRequired":true,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"parameters","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Json","location":"scalar","isList":false}]}],"isNullable":false,"outputType":{"type":"Json","location":"scalar","isList":false}},{"name":"queryRaw","args":[{"name":"query","isRequired":true,"isNullable":false,"inputTypes":[{"type":"String","location":"scalar","isList":false}]},{"name":"parameters","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Json","location":"scalar","isList":false}]}],"isNullable":false,"outputType":{"type":"Json","location":"scalar","isList":false}}]},{"name":"AggregateUser","fields":[{"name":"_count","args":[],"isNullable":true,"outputType":{"type":"UserCountAggregateOutputType","namespace":"prisma","location":"outputObjectTypes","isList":false}},{"name":"_avg","args":[],"isNullable":true,"outputType":{"type":"UserAvgAggregateOutputType","namespace":"prisma","location":"outputObjectTypes","isList":false}},{"name":"_sum","args":[],"isNullable":true,"outputType":{"type":"UserSumAggregateOutputType","namespace":"prisma","location":"outputObjectTypes","isList":false}},{"name":"_min","args":[],"isNullable":true,"outputType":{"type":"UserMinAggregateOutputType","namespace":"prisma","location":"outputObjectTypes","isList":false}},{"name":"_max","args":[],"isNullable":true,"outputType":{"type":"UserMaxAggregateOutputType","namespace":"prisma","location":"outputObjectTypes","isList":false}}]},{"name":"UserGroupByOutputType","fields":[{"name":"id","args":[],"isNullable":false,"outputType":{"type":"Int","location":"scalar","isList":false}},{"name":"firstName","args":[],"isNullable":false,"outputType":{"type":"String","location":"scalar","isList":false}},{"name":"lastName","args":[],"isNullable":false,"outputType":{"type":"String","location":"scalar","isList":false}},{"name":"createdAt","args":[],"isNullable":false,"outputType":{"type":"DateTime","location":"scalar","isList":false}},{"name":"updatedAt","args":[],"isNullable":false,"outputType":{"type":"DateTime","location":"scalar","isList":false}},{"name":"_count","args":[],"isNullable":true,"outputType":{"type":"UserCountAggregateOutputType","namespace":"prisma","location":"outputObjectTypes","isList":false}},{"name":"_avg","args":[],"isNullable":true,"outputType":{"type":"UserAvgAggregateOutputType","namespace":"prisma","location":"outputObjectTypes","isList":false}},{"name":"_sum","args":[],"isNullable":true,"outputType":{"type":"UserSumAggregateOutputType","namespace":"prisma","location":"outputObjectTypes","isList":false}},{"name":"_min","args":[],"isNullable":true,"outputType":{"type":"UserMinAggregateOutputType","namespace":"prisma","location":"outputObjectTypes","isList":false}},{"name":"_max","args":[],"isNullable":true,"outputType":{"type":"UserMaxAggregateOutputType","namespace":"prisma","location":"outputObjectTypes","isList":false}}]},{"name":"AggregatePost","fields":[{"name":"_count","args":[],"isNullable":true,"outputType":{"type":"PostCountAggregateOutputType","namespace":"prisma","location":"outputObjectTypes","isList":false}},{"name":"_avg","args":[],"isNullable":true,"outputType":{"type":"PostAvgAggregateOutputType","namespace":"prisma","location":"outputObjectTypes","isList":false}},{"name":"_sum","args":[],"isNullable":true,"outputType":{"type":"PostSumAggregateOutputType","namespace":"prisma","location":"outputObjectTypes","isList":false}},{"name":"_min","args":[],"isNullable":true,"outputType":{"type":"PostMinAggregateOutputType","namespace":"prisma","location":"outputObjectTypes","isList":false}},{"name":"_max","args":[],"isNullable":true,"outputType":{"type":"PostMaxAggregateOutputType","namespace":"prisma","location":"outputObjectTypes","isList":false}}]},{"name":"PostGroupByOutputType","fields":[{"name":"id","args":[],"isNullable":false,"outputType":{"type":"Int","location":"scalar","isList":false}},{"name":"title","args":[],"isNullable":false,"outputType":{"type":"String","location":"scalar","isList":false}},{"name":"content","args":[],"isNullable":false,"outputType":{"type":"String","location":"scalar","isList":false}},{"name":"isPublic","args":[],"isNullable":false,"outputType":{"type":"Boolean","location":"scalar","isList":false}},{"name":"authorId","args":[],"isNullable":false,"outputType":{"type":"Int","location":"scalar","isList":false}},{"name":"createdAt","args":[],"isNullable":false,"outputType":{"type":"DateTime","location":"scalar","isList":false}},{"name":"updatedAt","args":[],"isNullable":false,"outputType":{"type":"DateTime","location":"scalar","isList":false}},{"name":"_count","args":[],"isNullable":true,"outputType":{"type":"PostCountAggregateOutputType","namespace":"prisma","location":"outputObjectTypes","isList":false}},{"name":"_avg","args":[],"isNullable":true,"outputType":{"type":"PostAvgAggregateOutputType","namespace":"prisma","location":"outputObjectTypes","isList":false}},{"name":"_sum","args":[],"isNullable":true,"outputType":{"type":"PostSumAggregateOutputType","namespace":"prisma","location":"outputObjectTypes","isList":false}},{"name":"_min","args":[],"isNullable":true,"outputType":{"type":"PostMinAggregateOutputType","namespace":"prisma","location":"outputObjectTypes","isList":false}},{"name":"_max","args":[],"isNullable":true,"outputType":{"type":"PostMaxAggregateOutputType","namespace":"prisma","location":"outputObjectTypes","isList":false}}]},{"name":"AggregateAttachment","fields":[{"name":"_count","args":[],"isNullable":true,"outputType":{"type":"AttachmentCountAggregateOutputType","namespace":"prisma","location":"outputObjectTypes","isList":false}},{"name":"_avg","args":[],"isNullable":true,"outputType":{"type":"AttachmentAvgAggregateOutputType","namespace":"prisma","location":"outputObjectTypes","isList":false}},{"name":"_sum","args":[],"isNullable":true,"outputType":{"type":"AttachmentSumAggregateOutputType","namespace":"prisma","location":"outputObjectTypes","isList":false}},{"name":"_min","args":[],"isNullable":true,"outputType":{"type":"AttachmentMinAggregateOutputType","namespace":"prisma","location":"outputObjectTypes","isList":false}},{"name":"_max","args":[],"isNullable":true,"outputType":{"type":"AttachmentMaxAggregateOutputType","namespace":"prisma","location":"outputObjectTypes","isList":false}}]},{"name":"AttachmentGroupByOutputType","fields":[{"name":"id","args":[],"isNullable":false,"outputType":{"type":"BigInt","location":"scalar","isList":false}},{"name":"name","args":[],"isNullable":false,"outputType":{"type":"String","location":"scalar","isList":false}},{"name":"buffer","args":[],"isNullable":false,"outputType":{"type":"Bytes","location":"scalar","isList":false}},{"name":"meta","args":[],"isNullable":false,"outputType":{"type":"Json","location":"scalar","isList":false}},{"name":"size","args":[],"isNullable":false,"outputType":{"type":"Decimal","location":"scalar","isList":false}},{"name":"postId","args":[],"isNullable":false,"outputType":{"type":"Int","location":"scalar","isList":false}},{"name":"createdAt","args":[],"isNullable":false,"outputType":{"type":"DateTime","location":"scalar","isList":false}},{"name":"updatedAt","args":[],"isNullable":false,"outputType":{"type":"DateTime","location":"scalar","isList":false}},{"name":"_count","args":[],"isNullable":true,"outputType":{"type":"AttachmentCountAggregateOutputType","namespace":"prisma","location":"outputObjectTypes","isList":false}},{"name":"_avg","args":[],"isNullable":true,"outputType":{"type":"AttachmentAvgAggregateOutputType","namespace":"prisma","location":"outputObjectTypes","isList":false}},{"name":"_sum","args":[],"isNullable":true,"outputType":{"type":"AttachmentSumAggregateOutputType","namespace":"prisma","location":"outputObjectTypes","isList":false}},{"name":"_min","args":[],"isNullable":true,"outputType":{"type":"AttachmentMinAggregateOutputType","namespace":"prisma","location":"outputObjectTypes","isList":false}},{"name":"_max","args":[],"isNullable":true,"outputType":{"type":"AttachmentMaxAggregateOutputType","namespace":"prisma","location":"outputObjectTypes","isList":false}}]},{"name":"AffectedRowsOutput","fields":[{"name":"count","args":[],"isNullable":false,"outputType":{"type":"Int","location":"scalar","isList":false}}]},{"name":"UserCountOutputType","fields":[{"name":"posts","args":[],"isNullable":false,"outputType":{"type":"Int","location":"scalar","isList":false}}]},{"name":"UserCountAggregateOutputType","fields":[{"name":"id","args":[],"isNullable":false,"outputType":{"type":"Int","location":"scalar","isList":false}},{"name":"firstName","args":[],"isNullable":false,"outputType":{"type":"Int","location":"scalar","isList":false}},{"name":"lastName","args":[],"isNullable":false,"outputType":{"type":"Int","location":"scalar","isList":false}},{"name":"createdAt","args":[],"isNullable":false,"outputType":{"type":"Int","location":"scalar","isList":false}},{"name":"updatedAt","args":[],"isNullable":false,"outputType":{"type":"Int","location":"scalar","isList":false}},{"name":"_all","args":[],"isNullable":false,"outputType":{"type":"Int","location":"scalar","isList":false}}]},{"name":"UserAvgAggregateOutputType","fields":[{"name":"id","args":[],"isNullable":true,"outputType":{"type":"Float","location":"scalar","isList":false}}]},{"name":"UserSumAggregateOutputType","fields":[{"name":"id","args":[],"isNullable":true,"outputType":{"type":"Int","location":"scalar","isList":false}}]},{"name":"UserMinAggregateOutputType","fields":[{"name":"id","args":[],"isNullable":true,"outputType":{"type":"Int","location":"scalar","isList":false}},{"name":"firstName","args":[],"isNullable":true,"outputType":{"type":"String","location":"scalar","isList":false}},{"name":"lastName","args":[],"isNullable":true,"outputType":{"type":"String","location":"scalar","isList":false}},{"name":"createdAt","args":[],"isNullable":true,"outputType":{"type":"DateTime","location":"scalar","isList":false}},{"name":"updatedAt","args":[],"isNullable":true,"outputType":{"type":"DateTime","location":"scalar","isList":false}}]},{"name":"UserMaxAggregateOutputType","fields":[{"name":"id","args":[],"isNullable":true,"outputType":{"type":"Int","location":"scalar","isList":false}},{"name":"firstName","args":[],"isNullable":true,"outputType":{"type":"String","location":"scalar","isList":false}},{"name":"lastName","args":[],"isNullable":true,"outputType":{"type":"String","location":"scalar","isList":false}},{"name":"createdAt","args":[],"isNullable":true,"outputType":{"type":"DateTime","location":"scalar","isList":false}},{"name":"updatedAt","args":[],"isNullable":true,"outputType":{"type":"DateTime","location":"scalar","isList":false}}]},{"name":"PostCountOutputType","fields":[{"name":"attachments","args":[],"isNullable":false,"outputType":{"type":"Int","location":"scalar","isList":false}}]},{"name":"PostCountAggregateOutputType","fields":[{"name":"id","args":[],"isNullable":false,"outputType":{"type":"Int","location":"scalar","isList":false}},{"name":"title","args":[],"isNullable":false,"outputType":{"type":"Int","location":"scalar","isList":false}},{"name":"content","args":[],"isNullable":false,"outputType":{"type":"Int","location":"scalar","isList":false}},{"name":"isPublic","args":[],"isNullable":false,"outputType":{"type":"Int","location":"scalar","isList":false}},{"name":"authorId","args":[],"isNullable":false,"outputType":{"type":"Int","location":"scalar","isList":false}},{"name":"createdAt","args":[],"isNullable":false,"outputType":{"type":"Int","location":"scalar","isList":false}},{"name":"updatedAt","args":[],"isNullable":false,"outputType":{"type":"Int","location":"scalar","isList":false}},{"name":"_all","args":[],"isNullable":false,"outputType":{"type":"Int","location":"scalar","isList":false}}]},{"name":"PostAvgAggregateOutputType","fields":[{"name":"id","args":[],"isNullable":true,"outputType":{"type":"Float","location":"scalar","isList":false}},{"name":"authorId","args":[],"isNullable":true,"outputType":{"type":"Float","location":"scalar","isList":false}}]},{"name":"PostSumAggregateOutputType","fields":[{"name":"id","args":[],"isNullable":true,"outputType":{"type":"Int","location":"scalar","isList":false}},{"name":"authorId","args":[],"isNullable":true,"outputType":{"type":"Int","location":"scalar","isList":false}}]},{"name":"PostMinAggregateOutputType","fields":[{"name":"id","args":[],"isNullable":true,"outputType":{"type":"Int","location":"scalar","isList":false}},{"name":"title","args":[],"isNullable":true,"outputType":{"type":"String","location":"scalar","isList":false}},{"name":"content","args":[],"isNullable":true,"outputType":{"type":"String","location":"scalar","isList":false}},{"name":"isPublic","args":[],"isNullable":true,"outputType":{"type":"Boolean","location":"scalar","isList":false}},{"name":"authorId","args":[],"isNullable":true,"outputType":{"type":"Int","location":"scalar","isList":false}},{"name":"createdAt","args":[],"isNullable":true,"outputType":{"type":"DateTime","location":"scalar","isList":false}},{"name":"updatedAt","args":[],"isNullable":true,"outputType":{"type":"DateTime","location":"scalar","isList":false}}]},{"name":"PostMaxAggregateOutputType","fields":[{"name":"id","args":[],"isNullable":true,"outputType":{"type":"Int","location":"scalar","isList":false}},{"name":"title","args":[],"isNullable":true,"outputType":{"type":"String","location":"scalar","isList":false}},{"name":"content","args":[],"isNullable":true,"outputType":{"type":"String","location":"scalar","isList":false}},{"name":"isPublic","args":[],"isNullable":true,"outputType":{"type":"Boolean","location":"scalar","isList":false}},{"name":"authorId","args":[],"isNullable":true,"outputType":{"type":"Int","location":"scalar","isList":false}},{"name":"createdAt","args":[],"isNullable":true,"outputType":{"type":"DateTime","location":"scalar","isList":false}},{"name":"updatedAt","args":[],"isNullable":true,"outputType":{"type":"DateTime","location":"scalar","isList":false}}]},{"name":"AttachmentCountAggregateOutputType","fields":[{"name":"id","args":[],"isNullable":false,"outputType":{"type":"Int","location":"scalar","isList":false}},{"name":"name","args":[],"isNullable":false,"outputType":{"type":"Int","location":"scalar","isList":false}},{"name":"buffer","args":[],"isNullable":false,"outputType":{"type":"Int","location":"scalar","isList":false}},{"name":"meta","args":[],"isNullable":false,"outputType":{"type":"Int","location":"scalar","isList":false}},{"name":"size","args":[],"isNullable":false,"outputType":{"type":"Int","location":"scalar","isList":false}},{"name":"postId","args":[],"isNullable":false,"outputType":{"type":"Int","location":"scalar","isList":false}},{"name":"createdAt","args":[],"isNullable":false,"outputType":{"type":"Int","location":"scalar","isList":false}},{"name":"updatedAt","args":[],"isNullable":false,"outputType":{"type":"Int","location":"scalar","isList":false}},{"name":"_all","args":[],"isNullable":false,"outputType":{"type":"Int","location":"scalar","isList":false}}]},{"name":"AttachmentAvgAggregateOutputType","fields":[{"name":"id","args":[],"isNullable":true,"outputType":{"type":"Float","location":"scalar","isList":false}},{"name":"size","args":[],"isNullable":true,"outputType":{"type":"Decimal","location":"scalar","isList":false}},{"name":"postId","args":[],"isNullable":true,"outputType":{"type":"Float","location":"scalar","isList":false}}]},{"name":"AttachmentSumAggregateOutputType","fields":[{"name":"id","args":[],"isNullable":true,"outputType":{"type":"BigInt","location":"scalar","isList":false}},{"name":"size","args":[],"isNullable":true,"outputType":{"type":"Decimal","location":"scalar","isList":false}},{"name":"postId","args":[],"isNullable":true,"outputType":{"type":"Int","location":"scalar","isList":false}}]},{"name":"AttachmentMinAggregateOutputType","fields":[{"name":"id","args":[],"isNullable":true,"outputType":{"type":"BigInt","location":"scalar","isList":false}},{"name":"name","args":[],"isNullable":true,"outputType":{"type":"String","location":"scalar","isList":false}},{"name":"buffer","args":[],"isNullable":true,"outputType":{"type":"Bytes","location":"scalar","isList":false}},{"name":"size","args":[],"isNullable":true,"outputType":{"type":"Decimal","location":"scalar","isList":false}},{"name":"postId","args":[],"isNullable":true,"outputType":{"type":"Int","location":"scalar","isList":false}},{"name":"createdAt","args":[],"isNullable":true,"outputType":{"type":"DateTime","location":"scalar","isList":false}},{"name":"updatedAt","args":[],"isNullable":true,"outputType":{"type":"DateTime","location":"scalar","isList":false}}]},{"name":"AttachmentMaxAggregateOutputType","fields":[{"name":"id","args":[],"isNullable":true,"outputType":{"type":"BigInt","location":"scalar","isList":false}},{"name":"name","args":[],"isNullable":true,"outputType":{"type":"String","location":"scalar","isList":false}},{"name":"buffer","args":[],"isNullable":true,"outputType":{"type":"Bytes","location":"scalar","isList":false}},{"name":"size","args":[],"isNullable":true,"outputType":{"type":"Decimal","location":"scalar","isList":false}},{"name":"postId","args":[],"isNullable":true,"outputType":{"type":"Int","location":"scalar","isList":false}},{"name":"createdAt","args":[],"isNullable":true,"outputType":{"type":"DateTime","location":"scalar","isList":false}},{"name":"updatedAt","args":[],"isNullable":true,"outputType":{"type":"DateTime","location":"scalar","isList":false}}]}],"model":[{"name":"User","fields":[{"name":"id","args":[],"isNullable":false,"outputType":{"type":"Int","location":"scalar","isList":false}},{"name":"firstName","args":[],"isNullable":false,"outputType":{"type":"String","location":"scalar","isList":false}},{"name":"lastName","args":[],"isNullable":false,"outputType":{"type":"String","location":"scalar","isList":false}},{"name":"posts","args":[{"name":"where","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"orderBy","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostOrderByWithRelationInput","namespace":"prisma","location":"inputObjectTypes","isList":true},{"type":"PostOrderByWithRelationInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"cursor","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"take","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"skip","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"distinct","isRequired":false,"isNullable":false,"inputTypes":[{"type":"PostScalarFieldEnum","namespace":"prisma","location":"enumTypes","isList":true}]}],"isNullable":true,"outputType":{"type":"Post","namespace":"model","location":"outputObjectTypes","isList":true}},{"name":"createdAt","args":[],"isNullable":false,"outputType":{"type":"DateTime","location":"scalar","isList":false}},{"name":"updatedAt","args":[],"isNullable":false,"outputType":{"type":"DateTime","location":"scalar","isList":false}},{"name":"_count","args":[],"isNullable":false,"outputType":{"type":"UserCountOutputType","namespace":"prisma","location":"outputObjectTypes","isList":false}}]},{"name":"Post","fields":[{"name":"id","args":[],"isNullable":false,"outputType":{"type":"Int","location":"scalar","isList":false}},{"name":"title","args":[],"isNullable":false,"outputType":{"type":"String","location":"scalar","isList":false}},{"name":"content","args":[],"isNullable":false,"outputType":{"type":"String","location":"scalar","isList":false}},{"name":"isPublic","args":[],"isNullable":false,"outputType":{"type":"Boolean","location":"scalar","isList":false}},{"name":"author","args":[],"isNullable":false,"outputType":{"type":"User","namespace":"model","location":"outputObjectTypes","isList":false}},{"name":"authorId","args":[],"isNullable":false,"outputType":{"type":"Int","location":"scalar","isList":false}},{"name":"attachments","args":[{"name":"where","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentWhereInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"orderBy","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentOrderByWithRelationInput","namespace":"prisma","location":"inputObjectTypes","isList":true},{"type":"AttachmentOrderByWithRelationInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"cursor","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentWhereUniqueInput","namespace":"prisma","location":"inputObjectTypes","isList":false}]},{"name":"take","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"skip","isRequired":false,"isNullable":false,"inputTypes":[{"type":"Int","location":"scalar","isList":false}]},{"name":"distinct","isRequired":false,"isNullable":false,"inputTypes":[{"type":"AttachmentScalarFieldEnum","namespace":"prisma","location":"enumTypes","isList":true}]}],"isNullable":true,"outputType":{"type":"Attachment","namespace":"model","location":"outputObjectTypes","isList":true}},{"name":"createdAt","args":[],"isNullable":false,"outputType":{"type":"DateTime","location":"scalar","isList":false}},{"name":"updatedAt","args":[],"isNullable":false,"outputType":{"type":"DateTime","location":"scalar","isList":false}},{"name":"_count","args":[],"isNullable":false,"outputType":{"type":"PostCountOutputType","namespace":"prisma","location":"outputObjectTypes","isList":false}}]},{"name":"Attachment","fields":[{"name":"id","args":[],"isNullable":false,"outputType":{"type":"BigInt","location":"scalar","isList":false}},{"name":"name","args":[],"isNullable":false,"outputType":{"type":"String","location":"scalar","isList":false}},{"name":"buffer","args":[],"isNullable":false,"outputType":{"type":"Bytes","location":"scalar","isList":false}},{"name":"meta","args":[],"isNullable":false,"outputType":{"type":"Json","location":"scalar","isList":false}},{"name":"size","args":[],"isNullable":false,"outputType":{"type":"Decimal","location":"scalar","isList":false}},{"name":"post","args":[],"isNullable":false,"outputType":{"type":"Post","namespace":"model","location":"outputObjectTypes","isList":false}},{"name":"postId","args":[],"isNullable":false,"outputType":{"type":"Int","location":"scalar","isList":false}},{"name":"createdAt","args":[],"isNullable":false,"outputType":{"type":"DateTime","location":"scalar","isList":false}},{"name":"updatedAt","args":[],"isNullable":false,"outputType":{"type":"DateTime","location":"scalar","isList":false}}]}]},"enumTypes":{"prisma":[{"name":"UserScalarFieldEnum","values":["id","firstName","lastName","createdAt","updatedAt"]},{"name":"PostScalarFieldEnum","values":["id","title","content","isPublic","authorId","createdAt","updatedAt"]},{"name":"AttachmentScalarFieldEnum","values":["id","name","buffer","meta","size","postId","createdAt","updatedAt"]},{"name":"SortOrder","values":["asc","desc"]},{"name":"JsonNullValueInput","values":["JsonNull"]},{"name":"QueryMode","values":["default","insensitive"]},{"name":"JsonNullValueFilter","values":["DbNull","JsonNull","AnyNull"]}]}},"mappings":{"modelOperations":[{"model":"User","aggregate":"aggregateUser","createMany":"createManyUser","createOne":"createOneUser","deleteMany":"deleteManyUser","deleteOne":"deleteOneUser","findFirst":"findFirstUser","findMany":"findManyUser","findUnique":"findUniqueUser","groupBy":"groupByUser","updateMany":"updateManyUser","updateOne":"updateOneUser","upsertOne":"upsertOneUser"},{"model":"Post","aggregate":"aggregatePost","createMany":"createManyPost","createOne":"createOnePost","deleteMany":"deleteManyPost","deleteOne":"deleteOnePost","findFirst":"findFirstPost","findMany":"findManyPost","findUnique":"findUniquePost","groupBy":"groupByPost","updateMany":"updateManyPost","updateOne":"updateOnePost","upsertOne":"upsertOnePost"},{"model":"Attachment","aggregate":"aggregateAttachment","createMany":"createManyAttachment","createOne":"createOneAttachment","deleteMany":"deleteManyAttachment","deleteOne":"deleteOneAttachment","findFirst":"findFirstAttachment","findMany":"findManyAttachment","findUnique":"findUniqueAttachment","groupBy":"groupByAttachment","updateMany":"updateManyAttachment","updateOne":"updateOneAttachment","upsertOne":"upsertOneAttachment"}],"otherOperations":{"read":[],"write":["executeRaw","queryRaw"]}}}',
)
