import type { Prisma } from "../prisma-client";
import type { DMMF } from "../prisma-client/runtime";
import type { PGArgBuilder, PGArgBuilderUnion } from "@planet-graphql/core/dist/types/arg-builder";
import type { PGTypes, PGBuilder } from "@planet-graphql/core/dist/types/builder";
import type { PGEnum, PGDecimal, PGInputDecimal, PGJson, PGInputJson, TypeOfPGFieldMap, RequiredNonNullable } from "@planet-graphql/core/dist/types/common";
import type { PGInputField } from "@planet-graphql/core/dist/types/input";
import type { PGOutputField, PGOutputFieldOptionsDefault, PGObject, PGOutputFieldMap, PGInterface, PGOutputFieldBuilder, ConvertPGInterfacesToFieldMap, PGObjectOptionsDefault, GetPrismaModelNames } from "@planet-graphql/core/dist/types/output";
import type { PrismaObject } from "@planet-graphql/core/dist/types/prisma-converter";

type PrismaEnumMap = {};
type UserFieldMapType<TObjectRef extends { [key: string]: Function | undefined }, Types extends PGTypes> = {
    id: PGOutputField<number, any, PGOutputFieldOptionsDefault, Types>;
    firstName: PGOutputField<string, any, PGOutputFieldOptionsDefault, Types>;
    lastName: PGOutputField<string, any, PGOutputFieldOptionsDefault, Types>;
    posts: PGOutputField<Array<PrismaObjectMap<TObjectRef, Types>['Post']>, any, PGOutputFieldOptionsDefault, Types>;
    createdAt: PGOutputField<Date, any, PGOutputFieldOptionsDefault, Types>;
    updatedAt: PGOutputField<Date, any, PGOutputFieldOptionsDefault, Types>;
};
type PostFieldMapType<TObjectRef extends { [key: string]: Function | undefined }, Types extends PGTypes> = {
    id: PGOutputField<number, any, PGOutputFieldOptionsDefault, Types>;
    title: PGOutputField<string, any, PGOutputFieldOptionsDefault, Types>;
    content: PGOutputField<string, any, PGOutputFieldOptionsDefault, Types>;
    isPublic: PGOutputField<boolean, any, PGOutputFieldOptionsDefault, Types>;
    author: PGOutputField<PrismaObjectMap<TObjectRef, Types>['User'], any, PGOutputFieldOptionsDefault, Types>;
    authorId: PGOutputField<number, any, PGOutputFieldOptionsDefault, Types>;
    attachments: PGOutputField<Array<PrismaObjectMap<TObjectRef, Types>['Attachment']>, any, PGOutputFieldOptionsDefault, Types>;
    createdAt: PGOutputField<Date, any, PGOutputFieldOptionsDefault, Types>;
    updatedAt: PGOutputField<Date, any, PGOutputFieldOptionsDefault, Types>;
};
type AttachmentFieldMapType<TObjectRef extends { [key: string]: Function | undefined }, Types extends PGTypes> = {
    id: PGOutputField<bigint, any, PGOutputFieldOptionsDefault, Types>;
    name: PGOutputField<string, any, PGOutputFieldOptionsDefault, Types>;
    buffer: PGOutputField<Buffer, any, PGOutputFieldOptionsDefault, Types>;
    meta: PGOutputField<PGJson, any, PGOutputFieldOptionsDefault, Types>;
    size: PGOutputField<PGDecimal, any, PGOutputFieldOptionsDefault, Types>;
    post: PGOutputField<PrismaObjectMap<TObjectRef, Types>['Post'], any, PGOutputFieldOptionsDefault, Types>;
    postId: PGOutputField<number, any, PGOutputFieldOptionsDefault, Types>;
    createdAt: PGOutputField<Date, any, PGOutputFieldOptionsDefault, Types>;
    updatedAt: PGOutputField<Date, any, PGOutputFieldOptionsDefault, Types>;
};
type PrismaObjectMap<TObjectRef extends { [key: string]: Function | undefined }, Types extends PGTypes> = {
    User: PrismaObject<TObjectRef, 'User', UserFieldMapType<TObjectRef, Types>, Types>;
    Post: PrismaObject<TObjectRef, 'Post', PostFieldMapType<TObjectRef, Types>, Types>;
    Attachment: PrismaObject<TObjectRef, 'Attachment', AttachmentFieldMapType<TObjectRef, Types>, Types>;
};
type UserScalarFieldEnumValues = PGEnum<['id', 'firstName', 'lastName', 'createdAt', 'updatedAt']>;
type PostScalarFieldEnumValues = PGEnum<['id', 'title', 'content', 'isPublic', 'authorId', 'createdAt', 'updatedAt']>;
type AttachmentScalarFieldEnumValues = PGEnum<['id', 'name', 'buffer', 'meta', 'size', 'postId', 'createdAt', 'updatedAt']>;
type SortOrderValues = PGEnum<['asc', 'desc']>;
type JsonNullValueInputValues = PGEnum<['JsonNull']>;
type QueryModeValues = PGEnum<['default', 'insensitive']>;
type JsonNullValueFilterValues = PGEnum<['DbNull', 'JsonNull', 'AnyNull']>;
type FindFirstUserFieldMap<Types extends PGTypes> = {
    where: () => PGArgBuilder<UserWhereInputFieldMap<Types> | undefined, Types>;
    orderBy: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<Array<UserOrderByWithRelationInputFieldMap<Types>> | undefined, Types>,
        UserOrderByWithRelationInputList: () => PGArgBuilder<Array<UserOrderByWithRelationInputFieldMap<Types>> | undefined, Types>,
        UserOrderByWithRelationInput: () => PGArgBuilder<UserOrderByWithRelationInputFieldMap<Types> | undefined, Types>
    }>;
    cursor: () => PGArgBuilder<UserWhereUniqueInputFieldMap<Types> | undefined, Types>;
    take: PGInputField<number | undefined, 'int', Types>;
    skip: PGInputField<number | undefined, 'int', Types>;
    distinct: PGInputField<UserScalarFieldEnumValues[] | undefined, 'enum', Types>;
};
type FindManyUserFieldMap<Types extends PGTypes> = {
    where: () => PGArgBuilder<UserWhereInputFieldMap<Types> | undefined, Types>;
    orderBy: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<Array<UserOrderByWithRelationInputFieldMap<Types>> | undefined, Types>,
        UserOrderByWithRelationInputList: () => PGArgBuilder<Array<UserOrderByWithRelationInputFieldMap<Types>> | undefined, Types>,
        UserOrderByWithRelationInput: () => PGArgBuilder<UserOrderByWithRelationInputFieldMap<Types> | undefined, Types>
    }>;
    cursor: () => PGArgBuilder<UserWhereUniqueInputFieldMap<Types> | undefined, Types>;
    take: PGInputField<number | undefined, 'int', Types>;
    skip: PGInputField<number | undefined, 'int', Types>;
    distinct: PGInputField<UserScalarFieldEnumValues[] | undefined, 'enum', Types>;
};
type AggregateUserFieldMap<Types extends PGTypes> = {
    where: () => PGArgBuilder<UserWhereInputFieldMap<Types> | undefined, Types>;
    orderBy: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<Array<UserOrderByWithRelationInputFieldMap<Types>> | undefined, Types>,
        UserOrderByWithRelationInputList: () => PGArgBuilder<Array<UserOrderByWithRelationInputFieldMap<Types>> | undefined, Types>,
        UserOrderByWithRelationInput: () => PGArgBuilder<UserOrderByWithRelationInputFieldMap<Types> | undefined, Types>
    }>;
    cursor: () => PGArgBuilder<UserWhereUniqueInputFieldMap<Types> | undefined, Types>;
    take: PGInputField<number | undefined, 'int', Types>;
    skip: PGInputField<number | undefined, 'int', Types>;
};
type GroupByUserFieldMap<Types extends PGTypes> = {
    where: () => PGArgBuilder<UserWhereInputFieldMap<Types> | undefined, Types>;
    orderBy: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<Array<UserOrderByWithAggregationInputFieldMap<Types>> | undefined, Types>,
        UserOrderByWithAggregationInputList: () => PGArgBuilder<Array<UserOrderByWithAggregationInputFieldMap<Types>> | undefined, Types>,
        UserOrderByWithAggregationInput: () => PGArgBuilder<UserOrderByWithAggregationInputFieldMap<Types> | undefined, Types>
    }>;
    by: PGArgBuilderUnion<{
        __default: PGInputField<UserScalarFieldEnumValues[], 'enum', Types>,
        UserScalarFieldEnumList: PGInputField<UserScalarFieldEnumValues[], 'enum', Types>,
        UserScalarFieldEnum: PGInputField<UserScalarFieldEnumValues, 'enum', Types>
    }>;
    having: () => PGArgBuilder<UserScalarWhereWithAggregatesInputFieldMap<Types> | undefined, Types>;
    take: PGInputField<number | undefined, 'int', Types>;
    skip: PGInputField<number | undefined, 'int', Types>;
};
type FindUniqueUserFieldMap<Types extends PGTypes> = {
    where: () => PGArgBuilder<UserWhereUniqueInputFieldMap<Types>, Types>;
};
type FindFirstPostFieldMap<Types extends PGTypes> = {
    where: () => PGArgBuilder<PostWhereInputFieldMap<Types> | undefined, Types>;
    orderBy: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<Array<PostOrderByWithRelationInputFieldMap<Types>> | undefined, Types>,
        PostOrderByWithRelationInputList: () => PGArgBuilder<Array<PostOrderByWithRelationInputFieldMap<Types>> | undefined, Types>,
        PostOrderByWithRelationInput: () => PGArgBuilder<PostOrderByWithRelationInputFieldMap<Types> | undefined, Types>
    }>;
    cursor: () => PGArgBuilder<PostWhereUniqueInputFieldMap<Types> | undefined, Types>;
    take: PGInputField<number | undefined, 'int', Types>;
    skip: PGInputField<number | undefined, 'int', Types>;
    distinct: PGInputField<PostScalarFieldEnumValues[] | undefined, 'enum', Types>;
};
type FindManyPostFieldMap<Types extends PGTypes> = {
    where: () => PGArgBuilder<PostWhereInputFieldMap<Types> | undefined, Types>;
    orderBy: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<Array<PostOrderByWithRelationInputFieldMap<Types>> | undefined, Types>,
        PostOrderByWithRelationInputList: () => PGArgBuilder<Array<PostOrderByWithRelationInputFieldMap<Types>> | undefined, Types>,
        PostOrderByWithRelationInput: () => PGArgBuilder<PostOrderByWithRelationInputFieldMap<Types> | undefined, Types>
    }>;
    cursor: () => PGArgBuilder<PostWhereUniqueInputFieldMap<Types> | undefined, Types>;
    take: PGInputField<number | undefined, 'int', Types>;
    skip: PGInputField<number | undefined, 'int', Types>;
    distinct: PGInputField<PostScalarFieldEnumValues[] | undefined, 'enum', Types>;
};
type AggregatePostFieldMap<Types extends PGTypes> = {
    where: () => PGArgBuilder<PostWhereInputFieldMap<Types> | undefined, Types>;
    orderBy: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<Array<PostOrderByWithRelationInputFieldMap<Types>> | undefined, Types>,
        PostOrderByWithRelationInputList: () => PGArgBuilder<Array<PostOrderByWithRelationInputFieldMap<Types>> | undefined, Types>,
        PostOrderByWithRelationInput: () => PGArgBuilder<PostOrderByWithRelationInputFieldMap<Types> | undefined, Types>
    }>;
    cursor: () => PGArgBuilder<PostWhereUniqueInputFieldMap<Types> | undefined, Types>;
    take: PGInputField<number | undefined, 'int', Types>;
    skip: PGInputField<number | undefined, 'int', Types>;
};
type GroupByPostFieldMap<Types extends PGTypes> = {
    where: () => PGArgBuilder<PostWhereInputFieldMap<Types> | undefined, Types>;
    orderBy: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<Array<PostOrderByWithAggregationInputFieldMap<Types>> | undefined, Types>,
        PostOrderByWithAggregationInputList: () => PGArgBuilder<Array<PostOrderByWithAggregationInputFieldMap<Types>> | undefined, Types>,
        PostOrderByWithAggregationInput: () => PGArgBuilder<PostOrderByWithAggregationInputFieldMap<Types> | undefined, Types>
    }>;
    by: PGArgBuilderUnion<{
        __default: PGInputField<PostScalarFieldEnumValues[], 'enum', Types>,
        PostScalarFieldEnumList: PGInputField<PostScalarFieldEnumValues[], 'enum', Types>,
        PostScalarFieldEnum: PGInputField<PostScalarFieldEnumValues, 'enum', Types>
    }>;
    having: () => PGArgBuilder<PostScalarWhereWithAggregatesInputFieldMap<Types> | undefined, Types>;
    take: PGInputField<number | undefined, 'int', Types>;
    skip: PGInputField<number | undefined, 'int', Types>;
};
type FindUniquePostFieldMap<Types extends PGTypes> = {
    where: () => PGArgBuilder<PostWhereUniqueInputFieldMap<Types>, Types>;
};
type FindFirstAttachmentFieldMap<Types extends PGTypes> = {
    where: () => PGArgBuilder<AttachmentWhereInputFieldMap<Types> | undefined, Types>;
    orderBy: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<Array<AttachmentOrderByWithRelationInputFieldMap<Types>> | undefined, Types>,
        AttachmentOrderByWithRelationInputList: () => PGArgBuilder<Array<AttachmentOrderByWithRelationInputFieldMap<Types>> | undefined, Types>,
        AttachmentOrderByWithRelationInput: () => PGArgBuilder<AttachmentOrderByWithRelationInputFieldMap<Types> | undefined, Types>
    }>;
    cursor: () => PGArgBuilder<AttachmentWhereUniqueInputFieldMap<Types> | undefined, Types>;
    take: PGInputField<number | undefined, 'int', Types>;
    skip: PGInputField<number | undefined, 'int', Types>;
    distinct: PGInputField<AttachmentScalarFieldEnumValues[] | undefined, 'enum', Types>;
};
type FindManyAttachmentFieldMap<Types extends PGTypes> = {
    where: () => PGArgBuilder<AttachmentWhereInputFieldMap<Types> | undefined, Types>;
    orderBy: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<Array<AttachmentOrderByWithRelationInputFieldMap<Types>> | undefined, Types>,
        AttachmentOrderByWithRelationInputList: () => PGArgBuilder<Array<AttachmentOrderByWithRelationInputFieldMap<Types>> | undefined, Types>,
        AttachmentOrderByWithRelationInput: () => PGArgBuilder<AttachmentOrderByWithRelationInputFieldMap<Types> | undefined, Types>
    }>;
    cursor: () => PGArgBuilder<AttachmentWhereUniqueInputFieldMap<Types> | undefined, Types>;
    take: PGInputField<number | undefined, 'int', Types>;
    skip: PGInputField<number | undefined, 'int', Types>;
    distinct: PGInputField<AttachmentScalarFieldEnumValues[] | undefined, 'enum', Types>;
};
type AggregateAttachmentFieldMap<Types extends PGTypes> = {
    where: () => PGArgBuilder<AttachmentWhereInputFieldMap<Types> | undefined, Types>;
    orderBy: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<Array<AttachmentOrderByWithRelationInputFieldMap<Types>> | undefined, Types>,
        AttachmentOrderByWithRelationInputList: () => PGArgBuilder<Array<AttachmentOrderByWithRelationInputFieldMap<Types>> | undefined, Types>,
        AttachmentOrderByWithRelationInput: () => PGArgBuilder<AttachmentOrderByWithRelationInputFieldMap<Types> | undefined, Types>
    }>;
    cursor: () => PGArgBuilder<AttachmentWhereUniqueInputFieldMap<Types> | undefined, Types>;
    take: PGInputField<number | undefined, 'int', Types>;
    skip: PGInputField<number | undefined, 'int', Types>;
};
type GroupByAttachmentFieldMap<Types extends PGTypes> = {
    where: () => PGArgBuilder<AttachmentWhereInputFieldMap<Types> | undefined, Types>;
    orderBy: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<Array<AttachmentOrderByWithAggregationInputFieldMap<Types>> | undefined, Types>,
        AttachmentOrderByWithAggregationInputList: () => PGArgBuilder<Array<AttachmentOrderByWithAggregationInputFieldMap<Types>> | undefined, Types>,
        AttachmentOrderByWithAggregationInput: () => PGArgBuilder<AttachmentOrderByWithAggregationInputFieldMap<Types> | undefined, Types>
    }>;
    by: PGArgBuilderUnion<{
        __default: PGInputField<AttachmentScalarFieldEnumValues[], 'enum', Types>,
        AttachmentScalarFieldEnumList: PGInputField<AttachmentScalarFieldEnumValues[], 'enum', Types>,
        AttachmentScalarFieldEnum: PGInputField<AttachmentScalarFieldEnumValues, 'enum', Types>
    }>;
    having: () => PGArgBuilder<AttachmentScalarWhereWithAggregatesInputFieldMap<Types> | undefined, Types>;
    take: PGInputField<number | undefined, 'int', Types>;
    skip: PGInputField<number | undefined, 'int', Types>;
};
type FindUniqueAttachmentFieldMap<Types extends PGTypes> = {
    where: () => PGArgBuilder<AttachmentWhereUniqueInputFieldMap<Types>, Types>;
};
type CreateOneUserFieldMap<Types extends PGTypes> = {
    data: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<UserCreateInputFieldMap<Types>, Types>,
        UserCreateInput: () => PGArgBuilder<UserCreateInputFieldMap<Types>, Types>,
        UserUncheckedCreateInput: () => PGArgBuilder<UserUncheckedCreateInputFieldMap<Types>, Types>
    }>;
};
type UpsertOneUserFieldMap<Types extends PGTypes> = {
    where: () => PGArgBuilder<UserWhereUniqueInputFieldMap<Types>, Types>;
    create: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<UserCreateInputFieldMap<Types>, Types>,
        UserCreateInput: () => PGArgBuilder<UserCreateInputFieldMap<Types>, Types>,
        UserUncheckedCreateInput: () => PGArgBuilder<UserUncheckedCreateInputFieldMap<Types>, Types>
    }>;
    update: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<UserUpdateInputFieldMap<Types>, Types>,
        UserUpdateInput: () => PGArgBuilder<UserUpdateInputFieldMap<Types>, Types>,
        UserUncheckedUpdateInput: () => PGArgBuilder<UserUncheckedUpdateInputFieldMap<Types>, Types>
    }>;
};
type CreateManyUserFieldMap<Types extends PGTypes> = {
    data: () => PGArgBuilder<Array<UserCreateManyInputFieldMap<Types>>, Types>;
    skipDuplicates: PGInputField<boolean | undefined, 'boolean', Types>;
};
type DeleteOneUserFieldMap<Types extends PGTypes> = {
    where: () => PGArgBuilder<UserWhereUniqueInputFieldMap<Types>, Types>;
};
type UpdateOneUserFieldMap<Types extends PGTypes> = {
    data: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<UserUpdateInputFieldMap<Types>, Types>,
        UserUpdateInput: () => PGArgBuilder<UserUpdateInputFieldMap<Types>, Types>,
        UserUncheckedUpdateInput: () => PGArgBuilder<UserUncheckedUpdateInputFieldMap<Types>, Types>
    }>;
    where: () => PGArgBuilder<UserWhereUniqueInputFieldMap<Types>, Types>;
};
type UpdateManyUserFieldMap<Types extends PGTypes> = {
    data: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<UserUpdateManyMutationInputFieldMap<Types>, Types>,
        UserUpdateManyMutationInput: () => PGArgBuilder<UserUpdateManyMutationInputFieldMap<Types>, Types>,
        UserUncheckedUpdateManyInput: () => PGArgBuilder<UserUncheckedUpdateManyInputFieldMap<Types>, Types>
    }>;
    where: () => PGArgBuilder<UserWhereInputFieldMap<Types> | undefined, Types>;
};
type DeleteManyUserFieldMap<Types extends PGTypes> = {
    where: () => PGArgBuilder<UserWhereInputFieldMap<Types> | undefined, Types>;
};
type CreateOnePostFieldMap<Types extends PGTypes> = {
    data: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostCreateInputFieldMap<Types>, Types>,
        PostCreateInput: () => PGArgBuilder<PostCreateInputFieldMap<Types>, Types>,
        PostUncheckedCreateInput: () => PGArgBuilder<PostUncheckedCreateInputFieldMap<Types>, Types>
    }>;
};
type UpsertOnePostFieldMap<Types extends PGTypes> = {
    where: () => PGArgBuilder<PostWhereUniqueInputFieldMap<Types>, Types>;
    create: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostCreateInputFieldMap<Types>, Types>,
        PostCreateInput: () => PGArgBuilder<PostCreateInputFieldMap<Types>, Types>,
        PostUncheckedCreateInput: () => PGArgBuilder<PostUncheckedCreateInputFieldMap<Types>, Types>
    }>;
    update: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostUpdateInputFieldMap<Types>, Types>,
        PostUpdateInput: () => PGArgBuilder<PostUpdateInputFieldMap<Types>, Types>,
        PostUncheckedUpdateInput: () => PGArgBuilder<PostUncheckedUpdateInputFieldMap<Types>, Types>
    }>;
};
type CreateManyPostFieldMap<Types extends PGTypes> = {
    data: () => PGArgBuilder<Array<PostCreateManyInputFieldMap<Types>>, Types>;
    skipDuplicates: PGInputField<boolean | undefined, 'boolean', Types>;
};
type DeleteOnePostFieldMap<Types extends PGTypes> = {
    where: () => PGArgBuilder<PostWhereUniqueInputFieldMap<Types>, Types>;
};
type UpdateOnePostFieldMap<Types extends PGTypes> = {
    data: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostUpdateInputFieldMap<Types>, Types>,
        PostUpdateInput: () => PGArgBuilder<PostUpdateInputFieldMap<Types>, Types>,
        PostUncheckedUpdateInput: () => PGArgBuilder<PostUncheckedUpdateInputFieldMap<Types>, Types>
    }>;
    where: () => PGArgBuilder<PostWhereUniqueInputFieldMap<Types>, Types>;
};
type UpdateManyPostFieldMap<Types extends PGTypes> = {
    data: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostUpdateManyMutationInputFieldMap<Types>, Types>,
        PostUpdateManyMutationInput: () => PGArgBuilder<PostUpdateManyMutationInputFieldMap<Types>, Types>,
        PostUncheckedUpdateManyInput: () => PGArgBuilder<PostUncheckedUpdateManyInputFieldMap<Types>, Types>
    }>;
    where: () => PGArgBuilder<PostWhereInputFieldMap<Types> | undefined, Types>;
};
type DeleteManyPostFieldMap<Types extends PGTypes> = {
    where: () => PGArgBuilder<PostWhereInputFieldMap<Types> | undefined, Types>;
};
type CreateOneAttachmentFieldMap<Types extends PGTypes> = {
    data: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentCreateInputFieldMap<Types>, Types>,
        AttachmentCreateInput: () => PGArgBuilder<AttachmentCreateInputFieldMap<Types>, Types>,
        AttachmentUncheckedCreateInput: () => PGArgBuilder<AttachmentUncheckedCreateInputFieldMap<Types>, Types>
    }>;
};
type UpsertOneAttachmentFieldMap<Types extends PGTypes> = {
    where: () => PGArgBuilder<AttachmentWhereUniqueInputFieldMap<Types>, Types>;
    create: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentCreateInputFieldMap<Types>, Types>,
        AttachmentCreateInput: () => PGArgBuilder<AttachmentCreateInputFieldMap<Types>, Types>,
        AttachmentUncheckedCreateInput: () => PGArgBuilder<AttachmentUncheckedCreateInputFieldMap<Types>, Types>
    }>;
    update: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentUpdateInputFieldMap<Types>, Types>,
        AttachmentUpdateInput: () => PGArgBuilder<AttachmentUpdateInputFieldMap<Types>, Types>,
        AttachmentUncheckedUpdateInput: () => PGArgBuilder<AttachmentUncheckedUpdateInputFieldMap<Types>, Types>
    }>;
};
type CreateManyAttachmentFieldMap<Types extends PGTypes> = {
    data: () => PGArgBuilder<Array<AttachmentCreateManyInputFieldMap<Types>>, Types>;
    skipDuplicates: PGInputField<boolean | undefined, 'boolean', Types>;
};
type DeleteOneAttachmentFieldMap<Types extends PGTypes> = {
    where: () => PGArgBuilder<AttachmentWhereUniqueInputFieldMap<Types>, Types>;
};
type UpdateOneAttachmentFieldMap<Types extends PGTypes> = {
    data: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentUpdateInputFieldMap<Types>, Types>,
        AttachmentUpdateInput: () => PGArgBuilder<AttachmentUpdateInputFieldMap<Types>, Types>,
        AttachmentUncheckedUpdateInput: () => PGArgBuilder<AttachmentUncheckedUpdateInputFieldMap<Types>, Types>
    }>;
    where: () => PGArgBuilder<AttachmentWhereUniqueInputFieldMap<Types>, Types>;
};
type UpdateManyAttachmentFieldMap<Types extends PGTypes> = {
    data: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentUpdateManyMutationInputFieldMap<Types>, Types>,
        AttachmentUpdateManyMutationInput: () => PGArgBuilder<AttachmentUpdateManyMutationInputFieldMap<Types>, Types>,
        AttachmentUncheckedUpdateManyInput: () => PGArgBuilder<AttachmentUncheckedUpdateManyInputFieldMap<Types>, Types>
    }>;
    where: () => PGArgBuilder<AttachmentWhereInputFieldMap<Types> | undefined, Types>;
};
type DeleteManyAttachmentFieldMap<Types extends PGTypes> = {
    where: () => PGArgBuilder<AttachmentWhereInputFieldMap<Types> | undefined, Types>;
};
type ExecuteRawFieldMap<Types extends PGTypes> = {
    query: PGInputField<string, 'string', Types>;
    parameters: PGInputField<PGInputJson | undefined, 'json', Types>;
};
type QueryRawFieldMap<Types extends PGTypes> = {
    query: PGInputField<string, 'string', Types>;
    parameters: PGInputField<PGInputJson | undefined, 'json', Types>;
};
type UserWhereInputFieldMap<Types extends PGTypes> = {
    AND: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<UserWhereInputFieldMap<Types> | undefined, Types>,
        UserWhereInput: () => PGArgBuilder<Array<UserWhereInputFieldMap<Types>> | undefined, Types>,
        UserWhereInputList: () => PGArgBuilder<Array<UserWhereInputFieldMap<Types>> | undefined, Types>
    }>;
    OR: () => PGArgBuilder<Array<UserWhereInputFieldMap<Types>> | undefined, Types>;
    NOT: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<UserWhereInputFieldMap<Types> | undefined, Types>,
        UserWhereInput: () => PGArgBuilder<Array<UserWhereInputFieldMap<Types>> | undefined, Types>,
        UserWhereInputList: () => PGArgBuilder<Array<UserWhereInputFieldMap<Types>> | undefined, Types>
    }>;
    id: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<IntFilterFieldMap<Types> | undefined, Types>,
        IntFilter: () => PGArgBuilder<IntFilterFieldMap<Types> | undefined, Types>,
        Int: PGInputField<number | undefined, 'int', Types>
    }>;
    firstName: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<StringFilterFieldMap<Types> | undefined, Types>,
        StringFilter: () => PGArgBuilder<StringFilterFieldMap<Types> | undefined, Types>,
        String: PGInputField<string | undefined, 'string', Types>
    }>;
    lastName: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<StringFilterFieldMap<Types> | undefined, Types>,
        StringFilter: () => PGArgBuilder<StringFilterFieldMap<Types> | undefined, Types>,
        String: PGInputField<string | undefined, 'string', Types>
    }>;
    posts: () => PGArgBuilder<PostListRelationFilterFieldMap<Types> | undefined, Types>;
    createdAt: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<DateTimeFilterFieldMap<Types> | undefined, Types>,
        DateTimeFilter: () => PGArgBuilder<DateTimeFilterFieldMap<Types> | undefined, Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    }>;
    updatedAt: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<DateTimeFilterFieldMap<Types> | undefined, Types>,
        DateTimeFilter: () => PGArgBuilder<DateTimeFilterFieldMap<Types> | undefined, Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    }>;
};
type UserOrderByWithRelationInputFieldMap<Types extends PGTypes> = {
    id: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    firstName: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    lastName: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    posts: () => PGArgBuilder<PostOrderByRelationAggregateInputFieldMap<Types> | undefined, Types>;
    createdAt: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    updatedAt: PGInputField<SortOrderValues | undefined, 'enum', Types>;
};
type UserWhereUniqueInputFieldMap<Types extends PGTypes> = {
    id: PGInputField<number | undefined, 'int', Types>;
};
type UserOrderByWithAggregationInputFieldMap<Types extends PGTypes> = {
    id: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    firstName: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    lastName: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    createdAt: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    updatedAt: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    _count: () => PGArgBuilder<UserCountOrderByAggregateInputFieldMap<Types> | undefined, Types>;
    _avg: () => PGArgBuilder<UserAvgOrderByAggregateInputFieldMap<Types> | undefined, Types>;
    _max: () => PGArgBuilder<UserMaxOrderByAggregateInputFieldMap<Types> | undefined, Types>;
    _min: () => PGArgBuilder<UserMinOrderByAggregateInputFieldMap<Types> | undefined, Types>;
    _sum: () => PGArgBuilder<UserSumOrderByAggregateInputFieldMap<Types> | undefined, Types>;
};
type UserScalarWhereWithAggregatesInputFieldMap<Types extends PGTypes> = {
    AND: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<UserScalarWhereWithAggregatesInputFieldMap<Types> | undefined, Types>,
        UserScalarWhereWithAggregatesInput: () => PGArgBuilder<Array<UserScalarWhereWithAggregatesInputFieldMap<Types>> | undefined, Types>,
        UserScalarWhereWithAggregatesInputList: () => PGArgBuilder<Array<UserScalarWhereWithAggregatesInputFieldMap<Types>> | undefined, Types>
    }>;
    OR: () => PGArgBuilder<Array<UserScalarWhereWithAggregatesInputFieldMap<Types>> | undefined, Types>;
    NOT: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<UserScalarWhereWithAggregatesInputFieldMap<Types> | undefined, Types>,
        UserScalarWhereWithAggregatesInput: () => PGArgBuilder<Array<UserScalarWhereWithAggregatesInputFieldMap<Types>> | undefined, Types>,
        UserScalarWhereWithAggregatesInputList: () => PGArgBuilder<Array<UserScalarWhereWithAggregatesInputFieldMap<Types>> | undefined, Types>
    }>;
    id: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<IntWithAggregatesFilterFieldMap<Types> | undefined, Types>,
        IntWithAggregatesFilter: () => PGArgBuilder<IntWithAggregatesFilterFieldMap<Types> | undefined, Types>,
        Int: PGInputField<number | undefined, 'int', Types>
    }>;
    firstName: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<StringWithAggregatesFilterFieldMap<Types> | undefined, Types>,
        StringWithAggregatesFilter: () => PGArgBuilder<StringWithAggregatesFilterFieldMap<Types> | undefined, Types>,
        String: PGInputField<string | undefined, 'string', Types>
    }>;
    lastName: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<StringWithAggregatesFilterFieldMap<Types> | undefined, Types>,
        StringWithAggregatesFilter: () => PGArgBuilder<StringWithAggregatesFilterFieldMap<Types> | undefined, Types>,
        String: PGInputField<string | undefined, 'string', Types>
    }>;
    createdAt: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<DateTimeWithAggregatesFilterFieldMap<Types> | undefined, Types>,
        DateTimeWithAggregatesFilter: () => PGArgBuilder<DateTimeWithAggregatesFilterFieldMap<Types> | undefined, Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    }>;
    updatedAt: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<DateTimeWithAggregatesFilterFieldMap<Types> | undefined, Types>,
        DateTimeWithAggregatesFilter: () => PGArgBuilder<DateTimeWithAggregatesFilterFieldMap<Types> | undefined, Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    }>;
};
type PostWhereInputFieldMap<Types extends PGTypes> = {
    AND: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostWhereInputFieldMap<Types> | undefined, Types>,
        PostWhereInput: () => PGArgBuilder<Array<PostWhereInputFieldMap<Types>> | undefined, Types>,
        PostWhereInputList: () => PGArgBuilder<Array<PostWhereInputFieldMap<Types>> | undefined, Types>
    }>;
    OR: () => PGArgBuilder<Array<PostWhereInputFieldMap<Types>> | undefined, Types>;
    NOT: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostWhereInputFieldMap<Types> | undefined, Types>,
        PostWhereInput: () => PGArgBuilder<Array<PostWhereInputFieldMap<Types>> | undefined, Types>,
        PostWhereInputList: () => PGArgBuilder<Array<PostWhereInputFieldMap<Types>> | undefined, Types>
    }>;
    id: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<IntFilterFieldMap<Types> | undefined, Types>,
        IntFilter: () => PGArgBuilder<IntFilterFieldMap<Types> | undefined, Types>,
        Int: PGInputField<number | undefined, 'int', Types>
    }>;
    title: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<StringFilterFieldMap<Types> | undefined, Types>,
        StringFilter: () => PGArgBuilder<StringFilterFieldMap<Types> | undefined, Types>,
        String: PGInputField<string | undefined, 'string', Types>
    }>;
    content: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<StringFilterFieldMap<Types> | undefined, Types>,
        StringFilter: () => PGArgBuilder<StringFilterFieldMap<Types> | undefined, Types>,
        String: PGInputField<string | undefined, 'string', Types>
    }>;
    isPublic: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<BoolFilterFieldMap<Types> | undefined, Types>,
        BoolFilter: () => PGArgBuilder<BoolFilterFieldMap<Types> | undefined, Types>,
        Boolean: PGInputField<boolean | undefined, 'boolean', Types>
    }>;
    author: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<UserRelationFilterFieldMap<Types> | undefined, Types>,
        UserRelationFilter: () => PGArgBuilder<UserRelationFilterFieldMap<Types> | undefined, Types>,
        UserWhereInput: () => PGArgBuilder<UserWhereInputFieldMap<Types> | undefined, Types>
    }>;
    authorId: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<IntFilterFieldMap<Types> | undefined, Types>,
        IntFilter: () => PGArgBuilder<IntFilterFieldMap<Types> | undefined, Types>,
        Int: PGInputField<number | undefined, 'int', Types>
    }>;
    attachments: () => PGArgBuilder<AttachmentListRelationFilterFieldMap<Types> | undefined, Types>;
    createdAt: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<DateTimeFilterFieldMap<Types> | undefined, Types>,
        DateTimeFilter: () => PGArgBuilder<DateTimeFilterFieldMap<Types> | undefined, Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    }>;
    updatedAt: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<DateTimeFilterFieldMap<Types> | undefined, Types>,
        DateTimeFilter: () => PGArgBuilder<DateTimeFilterFieldMap<Types> | undefined, Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    }>;
};
type PostOrderByWithRelationInputFieldMap<Types extends PGTypes> = {
    id: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    title: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    content: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    isPublic: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    author: () => PGArgBuilder<UserOrderByWithRelationInputFieldMap<Types> | undefined, Types>;
    authorId: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    attachments: () => PGArgBuilder<AttachmentOrderByRelationAggregateInputFieldMap<Types> | undefined, Types>;
    createdAt: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    updatedAt: PGInputField<SortOrderValues | undefined, 'enum', Types>;
};
type PostWhereUniqueInputFieldMap<Types extends PGTypes> = {
    id: PGInputField<number | undefined, 'int', Types>;
};
type PostOrderByWithAggregationInputFieldMap<Types extends PGTypes> = {
    id: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    title: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    content: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    isPublic: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    authorId: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    createdAt: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    updatedAt: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    _count: () => PGArgBuilder<PostCountOrderByAggregateInputFieldMap<Types> | undefined, Types>;
    _avg: () => PGArgBuilder<PostAvgOrderByAggregateInputFieldMap<Types> | undefined, Types>;
    _max: () => PGArgBuilder<PostMaxOrderByAggregateInputFieldMap<Types> | undefined, Types>;
    _min: () => PGArgBuilder<PostMinOrderByAggregateInputFieldMap<Types> | undefined, Types>;
    _sum: () => PGArgBuilder<PostSumOrderByAggregateInputFieldMap<Types> | undefined, Types>;
};
type PostScalarWhereWithAggregatesInputFieldMap<Types extends PGTypes> = {
    AND: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostScalarWhereWithAggregatesInputFieldMap<Types> | undefined, Types>,
        PostScalarWhereWithAggregatesInput: () => PGArgBuilder<Array<PostScalarWhereWithAggregatesInputFieldMap<Types>> | undefined, Types>,
        PostScalarWhereWithAggregatesInputList: () => PGArgBuilder<Array<PostScalarWhereWithAggregatesInputFieldMap<Types>> | undefined, Types>
    }>;
    OR: () => PGArgBuilder<Array<PostScalarWhereWithAggregatesInputFieldMap<Types>> | undefined, Types>;
    NOT: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostScalarWhereWithAggregatesInputFieldMap<Types> | undefined, Types>,
        PostScalarWhereWithAggregatesInput: () => PGArgBuilder<Array<PostScalarWhereWithAggregatesInputFieldMap<Types>> | undefined, Types>,
        PostScalarWhereWithAggregatesInputList: () => PGArgBuilder<Array<PostScalarWhereWithAggregatesInputFieldMap<Types>> | undefined, Types>
    }>;
    id: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<IntWithAggregatesFilterFieldMap<Types> | undefined, Types>,
        IntWithAggregatesFilter: () => PGArgBuilder<IntWithAggregatesFilterFieldMap<Types> | undefined, Types>,
        Int: PGInputField<number | undefined, 'int', Types>
    }>;
    title: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<StringWithAggregatesFilterFieldMap<Types> | undefined, Types>,
        StringWithAggregatesFilter: () => PGArgBuilder<StringWithAggregatesFilterFieldMap<Types> | undefined, Types>,
        String: PGInputField<string | undefined, 'string', Types>
    }>;
    content: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<StringWithAggregatesFilterFieldMap<Types> | undefined, Types>,
        StringWithAggregatesFilter: () => PGArgBuilder<StringWithAggregatesFilterFieldMap<Types> | undefined, Types>,
        String: PGInputField<string | undefined, 'string', Types>
    }>;
    isPublic: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<BoolWithAggregatesFilterFieldMap<Types> | undefined, Types>,
        BoolWithAggregatesFilter: () => PGArgBuilder<BoolWithAggregatesFilterFieldMap<Types> | undefined, Types>,
        Boolean: PGInputField<boolean | undefined, 'boolean', Types>
    }>;
    authorId: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<IntWithAggregatesFilterFieldMap<Types> | undefined, Types>,
        IntWithAggregatesFilter: () => PGArgBuilder<IntWithAggregatesFilterFieldMap<Types> | undefined, Types>,
        Int: PGInputField<number | undefined, 'int', Types>
    }>;
    createdAt: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<DateTimeWithAggregatesFilterFieldMap<Types> | undefined, Types>,
        DateTimeWithAggregatesFilter: () => PGArgBuilder<DateTimeWithAggregatesFilterFieldMap<Types> | undefined, Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    }>;
    updatedAt: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<DateTimeWithAggregatesFilterFieldMap<Types> | undefined, Types>,
        DateTimeWithAggregatesFilter: () => PGArgBuilder<DateTimeWithAggregatesFilterFieldMap<Types> | undefined, Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    }>;
};
type AttachmentWhereInputFieldMap<Types extends PGTypes> = {
    AND: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentWhereInputFieldMap<Types> | undefined, Types>,
        AttachmentWhereInput: () => PGArgBuilder<Array<AttachmentWhereInputFieldMap<Types>> | undefined, Types>,
        AttachmentWhereInputList: () => PGArgBuilder<Array<AttachmentWhereInputFieldMap<Types>> | undefined, Types>
    }>;
    OR: () => PGArgBuilder<Array<AttachmentWhereInputFieldMap<Types>> | undefined, Types>;
    NOT: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentWhereInputFieldMap<Types> | undefined, Types>,
        AttachmentWhereInput: () => PGArgBuilder<Array<AttachmentWhereInputFieldMap<Types>> | undefined, Types>,
        AttachmentWhereInputList: () => PGArgBuilder<Array<AttachmentWhereInputFieldMap<Types>> | undefined, Types>
    }>;
    id: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<BigIntFilterFieldMap<Types> | undefined, Types>,
        BigIntFilter: () => PGArgBuilder<BigIntFilterFieldMap<Types> | undefined, Types>,
        BigInt: PGInputField<bigint | undefined, 'bigInt', Types>
    }>;
    name: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<StringFilterFieldMap<Types> | undefined, Types>,
        StringFilter: () => PGArgBuilder<StringFilterFieldMap<Types> | undefined, Types>,
        String: PGInputField<string | undefined, 'string', Types>
    }>;
    buffer: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<BytesFilterFieldMap<Types> | undefined, Types>,
        BytesFilter: () => PGArgBuilder<BytesFilterFieldMap<Types> | undefined, Types>,
        Bytes: PGInputField<Buffer | undefined, 'bytes', Types>
    }>;
    meta: () => PGArgBuilder<JsonFilterFieldMap<Types> | undefined, Types>;
    size: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<DecimalFilterFieldMap<Types> | undefined, Types>,
        DecimalFilter: () => PGArgBuilder<DecimalFilterFieldMap<Types> | undefined, Types>,
        Decimal: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
    }>;
    post: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostRelationFilterFieldMap<Types> | undefined, Types>,
        PostRelationFilter: () => PGArgBuilder<PostRelationFilterFieldMap<Types> | undefined, Types>,
        PostWhereInput: () => PGArgBuilder<PostWhereInputFieldMap<Types> | undefined, Types>
    }>;
    postId: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<IntFilterFieldMap<Types> | undefined, Types>,
        IntFilter: () => PGArgBuilder<IntFilterFieldMap<Types> | undefined, Types>,
        Int: PGInputField<number | undefined, 'int', Types>
    }>;
    createdAt: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<DateTimeFilterFieldMap<Types> | undefined, Types>,
        DateTimeFilter: () => PGArgBuilder<DateTimeFilterFieldMap<Types> | undefined, Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    }>;
    updatedAt: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<DateTimeFilterFieldMap<Types> | undefined, Types>,
        DateTimeFilter: () => PGArgBuilder<DateTimeFilterFieldMap<Types> | undefined, Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    }>;
};
type AttachmentOrderByWithRelationInputFieldMap<Types extends PGTypes> = {
    id: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    name: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    buffer: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    meta: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    size: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    post: () => PGArgBuilder<PostOrderByWithRelationInputFieldMap<Types> | undefined, Types>;
    postId: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    createdAt: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    updatedAt: PGInputField<SortOrderValues | undefined, 'enum', Types>;
};
type AttachmentWhereUniqueInputFieldMap<Types extends PGTypes> = {
    id: PGInputField<bigint | undefined, 'bigInt', Types>;
};
type AttachmentOrderByWithAggregationInputFieldMap<Types extends PGTypes> = {
    id: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    name: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    buffer: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    meta: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    size: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    postId: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    createdAt: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    updatedAt: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    _count: () => PGArgBuilder<AttachmentCountOrderByAggregateInputFieldMap<Types> | undefined, Types>;
    _avg: () => PGArgBuilder<AttachmentAvgOrderByAggregateInputFieldMap<Types> | undefined, Types>;
    _max: () => PGArgBuilder<AttachmentMaxOrderByAggregateInputFieldMap<Types> | undefined, Types>;
    _min: () => PGArgBuilder<AttachmentMinOrderByAggregateInputFieldMap<Types> | undefined, Types>;
    _sum: () => PGArgBuilder<AttachmentSumOrderByAggregateInputFieldMap<Types> | undefined, Types>;
};
type AttachmentScalarWhereWithAggregatesInputFieldMap<Types extends PGTypes> = {
    AND: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentScalarWhereWithAggregatesInputFieldMap<Types> | undefined, Types>,
        AttachmentScalarWhereWithAggregatesInput: () => PGArgBuilder<Array<AttachmentScalarWhereWithAggregatesInputFieldMap<Types>> | undefined, Types>,
        AttachmentScalarWhereWithAggregatesInputList: () => PGArgBuilder<Array<AttachmentScalarWhereWithAggregatesInputFieldMap<Types>> | undefined, Types>
    }>;
    OR: () => PGArgBuilder<Array<AttachmentScalarWhereWithAggregatesInputFieldMap<Types>> | undefined, Types>;
    NOT: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentScalarWhereWithAggregatesInputFieldMap<Types> | undefined, Types>,
        AttachmentScalarWhereWithAggregatesInput: () => PGArgBuilder<Array<AttachmentScalarWhereWithAggregatesInputFieldMap<Types>> | undefined, Types>,
        AttachmentScalarWhereWithAggregatesInputList: () => PGArgBuilder<Array<AttachmentScalarWhereWithAggregatesInputFieldMap<Types>> | undefined, Types>
    }>;
    id: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<BigIntWithAggregatesFilterFieldMap<Types> | undefined, Types>,
        BigIntWithAggregatesFilter: () => PGArgBuilder<BigIntWithAggregatesFilterFieldMap<Types> | undefined, Types>,
        BigInt: PGInputField<bigint | undefined, 'bigInt', Types>
    }>;
    name: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<StringWithAggregatesFilterFieldMap<Types> | undefined, Types>,
        StringWithAggregatesFilter: () => PGArgBuilder<StringWithAggregatesFilterFieldMap<Types> | undefined, Types>,
        String: PGInputField<string | undefined, 'string', Types>
    }>;
    buffer: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<BytesWithAggregatesFilterFieldMap<Types> | undefined, Types>,
        BytesWithAggregatesFilter: () => PGArgBuilder<BytesWithAggregatesFilterFieldMap<Types> | undefined, Types>,
        Bytes: PGInputField<Buffer | undefined, 'bytes', Types>
    }>;
    meta: () => PGArgBuilder<JsonWithAggregatesFilterFieldMap<Types> | undefined, Types>;
    size: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<DecimalWithAggregatesFilterFieldMap<Types> | undefined, Types>,
        DecimalWithAggregatesFilter: () => PGArgBuilder<DecimalWithAggregatesFilterFieldMap<Types> | undefined, Types>,
        Decimal: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
    }>;
    postId: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<IntWithAggregatesFilterFieldMap<Types> | undefined, Types>,
        IntWithAggregatesFilter: () => PGArgBuilder<IntWithAggregatesFilterFieldMap<Types> | undefined, Types>,
        Int: PGInputField<number | undefined, 'int', Types>
    }>;
    createdAt: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<DateTimeWithAggregatesFilterFieldMap<Types> | undefined, Types>,
        DateTimeWithAggregatesFilter: () => PGArgBuilder<DateTimeWithAggregatesFilterFieldMap<Types> | undefined, Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    }>;
    updatedAt: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<DateTimeWithAggregatesFilterFieldMap<Types> | undefined, Types>,
        DateTimeWithAggregatesFilter: () => PGArgBuilder<DateTimeWithAggregatesFilterFieldMap<Types> | undefined, Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    }>;
};
type UserCreateInputFieldMap<Types extends PGTypes> = {
    firstName: PGInputField<string, 'string', Types>;
    lastName: PGInputField<string, 'string', Types>;
    posts: () => PGArgBuilder<PostCreateNestedManyWithoutAuthorInputFieldMap<Types> | undefined, Types>;
    createdAt: PGInputField<Date | undefined, 'dateTime', Types>;
    updatedAt: PGInputField<Date | undefined, 'dateTime', Types>;
};
type UserUncheckedCreateInputFieldMap<Types extends PGTypes> = {
    id: PGInputField<number | undefined, 'int', Types>;
    firstName: PGInputField<string, 'string', Types>;
    lastName: PGInputField<string, 'string', Types>;
    posts: () => PGArgBuilder<PostUncheckedCreateNestedManyWithoutAuthorInputFieldMap<Types> | undefined, Types>;
    createdAt: PGInputField<Date | undefined, 'dateTime', Types>;
    updatedAt: PGInputField<Date | undefined, 'dateTime', Types>;
};
type UserUpdateInputFieldMap<Types extends PGTypes> = {
    firstName: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        StringFieldUpdateOperationsInput: () => PGArgBuilder<StringFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    lastName: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        StringFieldUpdateOperationsInput: () => PGArgBuilder<StringFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    posts: () => PGArgBuilder<PostUpdateManyWithoutAuthorNestedInputFieldMap<Types> | undefined, Types>;
    createdAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    updatedAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
};
type UserUncheckedUpdateInputFieldMap<Types extends PGTypes> = {
    id: PGArgBuilderUnion<{
        __default: PGInputField<number | undefined, 'int', Types>,
        Int: PGInputField<number | undefined, 'int', Types>,
        IntFieldUpdateOperationsInput: () => PGArgBuilder<IntFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    firstName: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        StringFieldUpdateOperationsInput: () => PGArgBuilder<StringFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    lastName: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        StringFieldUpdateOperationsInput: () => PGArgBuilder<StringFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    posts: () => PGArgBuilder<PostUncheckedUpdateManyWithoutAuthorNestedInputFieldMap<Types> | undefined, Types>;
    createdAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    updatedAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
};
type UserCreateManyInputFieldMap<Types extends PGTypes> = {
    id: PGInputField<number | undefined, 'int', Types>;
    firstName: PGInputField<string, 'string', Types>;
    lastName: PGInputField<string, 'string', Types>;
    createdAt: PGInputField<Date | undefined, 'dateTime', Types>;
    updatedAt: PGInputField<Date | undefined, 'dateTime', Types>;
};
type UserUpdateManyMutationInputFieldMap<Types extends PGTypes> = {
    firstName: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        StringFieldUpdateOperationsInput: () => PGArgBuilder<StringFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    lastName: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        StringFieldUpdateOperationsInput: () => PGArgBuilder<StringFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    createdAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    updatedAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
};
type UserUncheckedUpdateManyInputFieldMap<Types extends PGTypes> = {
    id: PGArgBuilderUnion<{
        __default: PGInputField<number | undefined, 'int', Types>,
        Int: PGInputField<number | undefined, 'int', Types>,
        IntFieldUpdateOperationsInput: () => PGArgBuilder<IntFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    firstName: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        StringFieldUpdateOperationsInput: () => PGArgBuilder<StringFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    lastName: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        StringFieldUpdateOperationsInput: () => PGArgBuilder<StringFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    createdAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    updatedAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
};
type PostCreateInputFieldMap<Types extends PGTypes> = {
    title: PGInputField<string, 'string', Types>;
    content: PGInputField<string, 'string', Types>;
    isPublic: PGInputField<boolean, 'boolean', Types>;
    author: () => PGArgBuilder<UserCreateNestedOneWithoutPostsInputFieldMap<Types>, Types>;
    attachments: () => PGArgBuilder<AttachmentCreateNestedManyWithoutPostInputFieldMap<Types> | undefined, Types>;
    createdAt: PGInputField<Date | undefined, 'dateTime', Types>;
    updatedAt: PGInputField<Date | undefined, 'dateTime', Types>;
};
type PostUncheckedCreateInputFieldMap<Types extends PGTypes> = {
    id: PGInputField<number | undefined, 'int', Types>;
    title: PGInputField<string, 'string', Types>;
    content: PGInputField<string, 'string', Types>;
    isPublic: PGInputField<boolean, 'boolean', Types>;
    authorId: PGInputField<number, 'int', Types>;
    attachments: () => PGArgBuilder<AttachmentUncheckedCreateNestedManyWithoutPostInputFieldMap<Types> | undefined, Types>;
    createdAt: PGInputField<Date | undefined, 'dateTime', Types>;
    updatedAt: PGInputField<Date | undefined, 'dateTime', Types>;
};
type PostUpdateInputFieldMap<Types extends PGTypes> = {
    title: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        StringFieldUpdateOperationsInput: () => PGArgBuilder<StringFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    content: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        StringFieldUpdateOperationsInput: () => PGArgBuilder<StringFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    isPublic: PGArgBuilderUnion<{
        __default: PGInputField<boolean | undefined, 'boolean', Types>,
        Boolean: PGInputField<boolean | undefined, 'boolean', Types>,
        BoolFieldUpdateOperationsInput: () => PGArgBuilder<BoolFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    author: () => PGArgBuilder<UserUpdateOneRequiredWithoutPostsNestedInputFieldMap<Types> | undefined, Types>;
    attachments: () => PGArgBuilder<AttachmentUpdateManyWithoutPostNestedInputFieldMap<Types> | undefined, Types>;
    createdAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    updatedAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
};
type PostUncheckedUpdateInputFieldMap<Types extends PGTypes> = {
    id: PGArgBuilderUnion<{
        __default: PGInputField<number | undefined, 'int', Types>,
        Int: PGInputField<number | undefined, 'int', Types>,
        IntFieldUpdateOperationsInput: () => PGArgBuilder<IntFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    title: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        StringFieldUpdateOperationsInput: () => PGArgBuilder<StringFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    content: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        StringFieldUpdateOperationsInput: () => PGArgBuilder<StringFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    isPublic: PGArgBuilderUnion<{
        __default: PGInputField<boolean | undefined, 'boolean', Types>,
        Boolean: PGInputField<boolean | undefined, 'boolean', Types>,
        BoolFieldUpdateOperationsInput: () => PGArgBuilder<BoolFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    authorId: PGArgBuilderUnion<{
        __default: PGInputField<number | undefined, 'int', Types>,
        Int: PGInputField<number | undefined, 'int', Types>,
        IntFieldUpdateOperationsInput: () => PGArgBuilder<IntFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    attachments: () => PGArgBuilder<AttachmentUncheckedUpdateManyWithoutPostNestedInputFieldMap<Types> | undefined, Types>;
    createdAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    updatedAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
};
type PostCreateManyInputFieldMap<Types extends PGTypes> = {
    id: PGInputField<number | undefined, 'int', Types>;
    title: PGInputField<string, 'string', Types>;
    content: PGInputField<string, 'string', Types>;
    isPublic: PGInputField<boolean, 'boolean', Types>;
    authorId: PGInputField<number, 'int', Types>;
    createdAt: PGInputField<Date | undefined, 'dateTime', Types>;
    updatedAt: PGInputField<Date | undefined, 'dateTime', Types>;
};
type PostUpdateManyMutationInputFieldMap<Types extends PGTypes> = {
    title: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        StringFieldUpdateOperationsInput: () => PGArgBuilder<StringFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    content: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        StringFieldUpdateOperationsInput: () => PGArgBuilder<StringFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    isPublic: PGArgBuilderUnion<{
        __default: PGInputField<boolean | undefined, 'boolean', Types>,
        Boolean: PGInputField<boolean | undefined, 'boolean', Types>,
        BoolFieldUpdateOperationsInput: () => PGArgBuilder<BoolFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    createdAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    updatedAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
};
type PostUncheckedUpdateManyInputFieldMap<Types extends PGTypes> = {
    id: PGArgBuilderUnion<{
        __default: PGInputField<number | undefined, 'int', Types>,
        Int: PGInputField<number | undefined, 'int', Types>,
        IntFieldUpdateOperationsInput: () => PGArgBuilder<IntFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    title: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        StringFieldUpdateOperationsInput: () => PGArgBuilder<StringFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    content: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        StringFieldUpdateOperationsInput: () => PGArgBuilder<StringFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    isPublic: PGArgBuilderUnion<{
        __default: PGInputField<boolean | undefined, 'boolean', Types>,
        Boolean: PGInputField<boolean | undefined, 'boolean', Types>,
        BoolFieldUpdateOperationsInput: () => PGArgBuilder<BoolFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    authorId: PGArgBuilderUnion<{
        __default: PGInputField<number | undefined, 'int', Types>,
        Int: PGInputField<number | undefined, 'int', Types>,
        IntFieldUpdateOperationsInput: () => PGArgBuilder<IntFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    createdAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    updatedAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
};
type AttachmentCreateInputFieldMap<Types extends PGTypes> = {
    id: PGInputField<bigint | undefined, 'bigInt', Types>;
    name: PGInputField<string, 'string', Types>;
    buffer: PGInputField<Buffer, 'bytes', Types>;
    meta: PGArgBuilderUnion<{
        __default: PGInputField<JsonNullValueInputValues, 'enum', Types>,
        JsonNullValueInput: PGInputField<JsonNullValueInputValues, 'enum', Types>,
        Json: PGInputField<PGInputJson, 'json', Types>
    }>;
    size: PGInputField<PGInputDecimal, 'decimal', Types>;
    post: () => PGArgBuilder<PostCreateNestedOneWithoutAttachmentsInputFieldMap<Types>, Types>;
    createdAt: PGInputField<Date | undefined, 'dateTime', Types>;
    updatedAt: PGInputField<Date | undefined, 'dateTime', Types>;
};
type AttachmentUncheckedCreateInputFieldMap<Types extends PGTypes> = {
    id: PGInputField<bigint | undefined, 'bigInt', Types>;
    name: PGInputField<string, 'string', Types>;
    buffer: PGInputField<Buffer, 'bytes', Types>;
    meta: PGArgBuilderUnion<{
        __default: PGInputField<JsonNullValueInputValues, 'enum', Types>,
        JsonNullValueInput: PGInputField<JsonNullValueInputValues, 'enum', Types>,
        Json: PGInputField<PGInputJson, 'json', Types>
    }>;
    size: PGInputField<PGInputDecimal, 'decimal', Types>;
    postId: PGInputField<number, 'int', Types>;
    createdAt: PGInputField<Date | undefined, 'dateTime', Types>;
    updatedAt: PGInputField<Date | undefined, 'dateTime', Types>;
};
type AttachmentUpdateInputFieldMap<Types extends PGTypes> = {
    id: PGArgBuilderUnion<{
        __default: PGInputField<bigint | undefined, 'bigInt', Types>,
        BigInt: PGInputField<bigint | undefined, 'bigInt', Types>,
        BigIntFieldUpdateOperationsInput: () => PGArgBuilder<BigIntFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    name: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        StringFieldUpdateOperationsInput: () => PGArgBuilder<StringFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    buffer: PGArgBuilderUnion<{
        __default: PGInputField<Buffer | undefined, 'bytes', Types>,
        Bytes: PGInputField<Buffer | undefined, 'bytes', Types>,
        BytesFieldUpdateOperationsInput: () => PGArgBuilder<BytesFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    meta: PGArgBuilderUnion<{
        __default: PGInputField<JsonNullValueInputValues | undefined, 'enum', Types>,
        JsonNullValueInput: PGInputField<JsonNullValueInputValues | undefined, 'enum', Types>,
        Json: PGInputField<PGInputJson | undefined, 'json', Types>
    }>;
    size: PGArgBuilderUnion<{
        __default: PGInputField<PGInputDecimal | undefined, 'decimal', Types>,
        Decimal: PGInputField<PGInputDecimal | undefined, 'decimal', Types>,
        DecimalFieldUpdateOperationsInput: () => PGArgBuilder<DecimalFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    post: () => PGArgBuilder<PostUpdateOneRequiredWithoutAttachmentsNestedInputFieldMap<Types> | undefined, Types>;
    createdAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    updatedAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
};
type AttachmentUncheckedUpdateInputFieldMap<Types extends PGTypes> = {
    id: PGArgBuilderUnion<{
        __default: PGInputField<bigint | undefined, 'bigInt', Types>,
        BigInt: PGInputField<bigint | undefined, 'bigInt', Types>,
        BigIntFieldUpdateOperationsInput: () => PGArgBuilder<BigIntFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    name: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        StringFieldUpdateOperationsInput: () => PGArgBuilder<StringFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    buffer: PGArgBuilderUnion<{
        __default: PGInputField<Buffer | undefined, 'bytes', Types>,
        Bytes: PGInputField<Buffer | undefined, 'bytes', Types>,
        BytesFieldUpdateOperationsInput: () => PGArgBuilder<BytesFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    meta: PGArgBuilderUnion<{
        __default: PGInputField<JsonNullValueInputValues | undefined, 'enum', Types>,
        JsonNullValueInput: PGInputField<JsonNullValueInputValues | undefined, 'enum', Types>,
        Json: PGInputField<PGInputJson | undefined, 'json', Types>
    }>;
    size: PGArgBuilderUnion<{
        __default: PGInputField<PGInputDecimal | undefined, 'decimal', Types>,
        Decimal: PGInputField<PGInputDecimal | undefined, 'decimal', Types>,
        DecimalFieldUpdateOperationsInput: () => PGArgBuilder<DecimalFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    postId: PGArgBuilderUnion<{
        __default: PGInputField<number | undefined, 'int', Types>,
        Int: PGInputField<number | undefined, 'int', Types>,
        IntFieldUpdateOperationsInput: () => PGArgBuilder<IntFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    createdAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    updatedAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
};
type AttachmentCreateManyInputFieldMap<Types extends PGTypes> = {
    id: PGInputField<bigint | undefined, 'bigInt', Types>;
    name: PGInputField<string, 'string', Types>;
    buffer: PGInputField<Buffer, 'bytes', Types>;
    meta: PGArgBuilderUnion<{
        __default: PGInputField<JsonNullValueInputValues, 'enum', Types>,
        JsonNullValueInput: PGInputField<JsonNullValueInputValues, 'enum', Types>,
        Json: PGInputField<PGInputJson, 'json', Types>
    }>;
    size: PGInputField<PGInputDecimal, 'decimal', Types>;
    postId: PGInputField<number, 'int', Types>;
    createdAt: PGInputField<Date | undefined, 'dateTime', Types>;
    updatedAt: PGInputField<Date | undefined, 'dateTime', Types>;
};
type AttachmentUpdateManyMutationInputFieldMap<Types extends PGTypes> = {
    id: PGArgBuilderUnion<{
        __default: PGInputField<bigint | undefined, 'bigInt', Types>,
        BigInt: PGInputField<bigint | undefined, 'bigInt', Types>,
        BigIntFieldUpdateOperationsInput: () => PGArgBuilder<BigIntFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    name: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        StringFieldUpdateOperationsInput: () => PGArgBuilder<StringFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    buffer: PGArgBuilderUnion<{
        __default: PGInputField<Buffer | undefined, 'bytes', Types>,
        Bytes: PGInputField<Buffer | undefined, 'bytes', Types>,
        BytesFieldUpdateOperationsInput: () => PGArgBuilder<BytesFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    meta: PGArgBuilderUnion<{
        __default: PGInputField<JsonNullValueInputValues | undefined, 'enum', Types>,
        JsonNullValueInput: PGInputField<JsonNullValueInputValues | undefined, 'enum', Types>,
        Json: PGInputField<PGInputJson | undefined, 'json', Types>
    }>;
    size: PGArgBuilderUnion<{
        __default: PGInputField<PGInputDecimal | undefined, 'decimal', Types>,
        Decimal: PGInputField<PGInputDecimal | undefined, 'decimal', Types>,
        DecimalFieldUpdateOperationsInput: () => PGArgBuilder<DecimalFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    createdAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    updatedAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
};
type AttachmentUncheckedUpdateManyInputFieldMap<Types extends PGTypes> = {
    id: PGArgBuilderUnion<{
        __default: PGInputField<bigint | undefined, 'bigInt', Types>,
        BigInt: PGInputField<bigint | undefined, 'bigInt', Types>,
        BigIntFieldUpdateOperationsInput: () => PGArgBuilder<BigIntFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    name: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        StringFieldUpdateOperationsInput: () => PGArgBuilder<StringFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    buffer: PGArgBuilderUnion<{
        __default: PGInputField<Buffer | undefined, 'bytes', Types>,
        Bytes: PGInputField<Buffer | undefined, 'bytes', Types>,
        BytesFieldUpdateOperationsInput: () => PGArgBuilder<BytesFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    meta: PGArgBuilderUnion<{
        __default: PGInputField<JsonNullValueInputValues | undefined, 'enum', Types>,
        JsonNullValueInput: PGInputField<JsonNullValueInputValues | undefined, 'enum', Types>,
        Json: PGInputField<PGInputJson | undefined, 'json', Types>
    }>;
    size: PGArgBuilderUnion<{
        __default: PGInputField<PGInputDecimal | undefined, 'decimal', Types>,
        Decimal: PGInputField<PGInputDecimal | undefined, 'decimal', Types>,
        DecimalFieldUpdateOperationsInput: () => PGArgBuilder<DecimalFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    postId: PGArgBuilderUnion<{
        __default: PGInputField<number | undefined, 'int', Types>,
        Int: PGInputField<number | undefined, 'int', Types>,
        IntFieldUpdateOperationsInput: () => PGArgBuilder<IntFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    createdAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    updatedAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
};
type IntFilterFieldMap<Types extends PGTypes> = {
    equals: PGInputField<number | undefined, 'int', Types>;
    in: PGInputField<number[] | undefined, 'int', Types>;
    notIn: PGInputField<number[] | undefined, 'int', Types>;
    lt: PGInputField<number | undefined, 'int', Types>;
    lte: PGInputField<number | undefined, 'int', Types>;
    gt: PGInputField<number | undefined, 'int', Types>;
    gte: PGInputField<number | undefined, 'int', Types>;
    not: PGArgBuilderUnion<{
        __default: PGInputField<number | undefined, 'int', Types>,
        Int: PGInputField<number | undefined, 'int', Types>,
        NestedIntFilter: () => PGArgBuilder<NestedIntFilterFieldMap<Types> | undefined, Types>
    }>;
};
type StringFilterFieldMap<Types extends PGTypes> = {
    equals: PGInputField<string | undefined, 'string', Types>;
    in: PGInputField<string[] | undefined, 'string', Types>;
    notIn: PGInputField<string[] | undefined, 'string', Types>;
    lt: PGInputField<string | undefined, 'string', Types>;
    lte: PGInputField<string | undefined, 'string', Types>;
    gt: PGInputField<string | undefined, 'string', Types>;
    gte: PGInputField<string | undefined, 'string', Types>;
    contains: PGInputField<string | undefined, 'string', Types>;
    startsWith: PGInputField<string | undefined, 'string', Types>;
    endsWith: PGInputField<string | undefined, 'string', Types>;
    mode: PGInputField<QueryModeValues | undefined, 'enum', Types>;
    not: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        NestedStringFilter: () => PGArgBuilder<NestedStringFilterFieldMap<Types> | undefined, Types>
    }>;
};
type PostListRelationFilterFieldMap<Types extends PGTypes> = {
    every: () => PGArgBuilder<PostWhereInputFieldMap<Types> | undefined, Types>;
    some: () => PGArgBuilder<PostWhereInputFieldMap<Types> | undefined, Types>;
    none: () => PGArgBuilder<PostWhereInputFieldMap<Types> | undefined, Types>;
};
type DateTimeFilterFieldMap<Types extends PGTypes> = {
    equals: PGInputField<Date | undefined, 'dateTime', Types>;
    in: PGInputField<Date[] | undefined, 'dateTime', Types>;
    notIn: PGInputField<Date[] | undefined, 'dateTime', Types>;
    lt: PGInputField<Date | undefined, 'dateTime', Types>;
    lte: PGInputField<Date | undefined, 'dateTime', Types>;
    gt: PGInputField<Date | undefined, 'dateTime', Types>;
    gte: PGInputField<Date | undefined, 'dateTime', Types>;
    not: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        NestedDateTimeFilter: () => PGArgBuilder<NestedDateTimeFilterFieldMap<Types> | undefined, Types>
    }>;
};
type PostOrderByRelationAggregateInputFieldMap<Types extends PGTypes> = {
    _count: PGInputField<SortOrderValues | undefined, 'enum', Types>;
};
type UserCountOrderByAggregateInputFieldMap<Types extends PGTypes> = {
    id: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    firstName: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    lastName: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    createdAt: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    updatedAt: PGInputField<SortOrderValues | undefined, 'enum', Types>;
};
type UserAvgOrderByAggregateInputFieldMap<Types extends PGTypes> = {
    id: PGInputField<SortOrderValues | undefined, 'enum', Types>;
};
type UserMaxOrderByAggregateInputFieldMap<Types extends PGTypes> = {
    id: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    firstName: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    lastName: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    createdAt: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    updatedAt: PGInputField<SortOrderValues | undefined, 'enum', Types>;
};
type UserMinOrderByAggregateInputFieldMap<Types extends PGTypes> = {
    id: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    firstName: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    lastName: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    createdAt: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    updatedAt: PGInputField<SortOrderValues | undefined, 'enum', Types>;
};
type UserSumOrderByAggregateInputFieldMap<Types extends PGTypes> = {
    id: PGInputField<SortOrderValues | undefined, 'enum', Types>;
};
type IntWithAggregatesFilterFieldMap<Types extends PGTypes> = {
    equals: PGInputField<number | undefined, 'int', Types>;
    in: PGInputField<number[] | undefined, 'int', Types>;
    notIn: PGInputField<number[] | undefined, 'int', Types>;
    lt: PGInputField<number | undefined, 'int', Types>;
    lte: PGInputField<number | undefined, 'int', Types>;
    gt: PGInputField<number | undefined, 'int', Types>;
    gte: PGInputField<number | undefined, 'int', Types>;
    not: PGArgBuilderUnion<{
        __default: PGInputField<number | undefined, 'int', Types>,
        Int: PGInputField<number | undefined, 'int', Types>,
        NestedIntWithAggregatesFilter: () => PGArgBuilder<NestedIntWithAggregatesFilterFieldMap<Types> | undefined, Types>
    }>;
    _count: () => PGArgBuilder<NestedIntFilterFieldMap<Types> | undefined, Types>;
    _avg: () => PGArgBuilder<NestedFloatFilterFieldMap<Types> | undefined, Types>;
    _sum: () => PGArgBuilder<NestedIntFilterFieldMap<Types> | undefined, Types>;
    _min: () => PGArgBuilder<NestedIntFilterFieldMap<Types> | undefined, Types>;
    _max: () => PGArgBuilder<NestedIntFilterFieldMap<Types> | undefined, Types>;
};
type StringWithAggregatesFilterFieldMap<Types extends PGTypes> = {
    equals: PGInputField<string | undefined, 'string', Types>;
    in: PGInputField<string[] | undefined, 'string', Types>;
    notIn: PGInputField<string[] | undefined, 'string', Types>;
    lt: PGInputField<string | undefined, 'string', Types>;
    lte: PGInputField<string | undefined, 'string', Types>;
    gt: PGInputField<string | undefined, 'string', Types>;
    gte: PGInputField<string | undefined, 'string', Types>;
    contains: PGInputField<string | undefined, 'string', Types>;
    startsWith: PGInputField<string | undefined, 'string', Types>;
    endsWith: PGInputField<string | undefined, 'string', Types>;
    mode: PGInputField<QueryModeValues | undefined, 'enum', Types>;
    not: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        NestedStringWithAggregatesFilter: () => PGArgBuilder<NestedStringWithAggregatesFilterFieldMap<Types> | undefined, Types>
    }>;
    _count: () => PGArgBuilder<NestedIntFilterFieldMap<Types> | undefined, Types>;
    _min: () => PGArgBuilder<NestedStringFilterFieldMap<Types> | undefined, Types>;
    _max: () => PGArgBuilder<NestedStringFilterFieldMap<Types> | undefined, Types>;
};
type DateTimeWithAggregatesFilterFieldMap<Types extends PGTypes> = {
    equals: PGInputField<Date | undefined, 'dateTime', Types>;
    in: PGInputField<Date[] | undefined, 'dateTime', Types>;
    notIn: PGInputField<Date[] | undefined, 'dateTime', Types>;
    lt: PGInputField<Date | undefined, 'dateTime', Types>;
    lte: PGInputField<Date | undefined, 'dateTime', Types>;
    gt: PGInputField<Date | undefined, 'dateTime', Types>;
    gte: PGInputField<Date | undefined, 'dateTime', Types>;
    not: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        NestedDateTimeWithAggregatesFilter: () => PGArgBuilder<NestedDateTimeWithAggregatesFilterFieldMap<Types> | undefined, Types>
    }>;
    _count: () => PGArgBuilder<NestedIntFilterFieldMap<Types> | undefined, Types>;
    _min: () => PGArgBuilder<NestedDateTimeFilterFieldMap<Types> | undefined, Types>;
    _max: () => PGArgBuilder<NestedDateTimeFilterFieldMap<Types> | undefined, Types>;
};
type BoolFilterFieldMap<Types extends PGTypes> = {
    equals: PGInputField<boolean | undefined, 'boolean', Types>;
    not: PGArgBuilderUnion<{
        __default: PGInputField<boolean | undefined, 'boolean', Types>,
        Boolean: PGInputField<boolean | undefined, 'boolean', Types>,
        NestedBoolFilter: () => PGArgBuilder<NestedBoolFilterFieldMap<Types> | undefined, Types>
    }>;
};
type UserRelationFilterFieldMap<Types extends PGTypes> = {
    is: () => PGArgBuilder<UserWhereInputFieldMap<Types> | undefined, Types>;
    isNot: () => PGArgBuilder<UserWhereInputFieldMap<Types> | undefined, Types>;
};
type AttachmentListRelationFilterFieldMap<Types extends PGTypes> = {
    every: () => PGArgBuilder<AttachmentWhereInputFieldMap<Types> | undefined, Types>;
    some: () => PGArgBuilder<AttachmentWhereInputFieldMap<Types> | undefined, Types>;
    none: () => PGArgBuilder<AttachmentWhereInputFieldMap<Types> | undefined, Types>;
};
type AttachmentOrderByRelationAggregateInputFieldMap<Types extends PGTypes> = {
    _count: PGInputField<SortOrderValues | undefined, 'enum', Types>;
};
type PostCountOrderByAggregateInputFieldMap<Types extends PGTypes> = {
    id: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    title: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    content: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    isPublic: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    authorId: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    createdAt: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    updatedAt: PGInputField<SortOrderValues | undefined, 'enum', Types>;
};
type PostAvgOrderByAggregateInputFieldMap<Types extends PGTypes> = {
    id: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    authorId: PGInputField<SortOrderValues | undefined, 'enum', Types>;
};
type PostMaxOrderByAggregateInputFieldMap<Types extends PGTypes> = {
    id: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    title: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    content: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    isPublic: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    authorId: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    createdAt: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    updatedAt: PGInputField<SortOrderValues | undefined, 'enum', Types>;
};
type PostMinOrderByAggregateInputFieldMap<Types extends PGTypes> = {
    id: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    title: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    content: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    isPublic: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    authorId: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    createdAt: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    updatedAt: PGInputField<SortOrderValues | undefined, 'enum', Types>;
};
type PostSumOrderByAggregateInputFieldMap<Types extends PGTypes> = {
    id: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    authorId: PGInputField<SortOrderValues | undefined, 'enum', Types>;
};
type BoolWithAggregatesFilterFieldMap<Types extends PGTypes> = {
    equals: PGInputField<boolean | undefined, 'boolean', Types>;
    not: PGArgBuilderUnion<{
        __default: PGInputField<boolean | undefined, 'boolean', Types>,
        Boolean: PGInputField<boolean | undefined, 'boolean', Types>,
        NestedBoolWithAggregatesFilter: () => PGArgBuilder<NestedBoolWithAggregatesFilterFieldMap<Types> | undefined, Types>
    }>;
    _count: () => PGArgBuilder<NestedIntFilterFieldMap<Types> | undefined, Types>;
    _min: () => PGArgBuilder<NestedBoolFilterFieldMap<Types> | undefined, Types>;
    _max: () => PGArgBuilder<NestedBoolFilterFieldMap<Types> | undefined, Types>;
};
type BigIntFilterFieldMap<Types extends PGTypes> = {
    equals: PGInputField<bigint | undefined, 'bigInt', Types>;
    in: PGInputField<bigint[] | undefined, 'bigInt', Types>;
    notIn: PGInputField<bigint[] | undefined, 'bigInt', Types>;
    lt: PGInputField<bigint | undefined, 'bigInt', Types>;
    lte: PGInputField<bigint | undefined, 'bigInt', Types>;
    gt: PGInputField<bigint | undefined, 'bigInt', Types>;
    gte: PGInputField<bigint | undefined, 'bigInt', Types>;
    not: PGArgBuilderUnion<{
        __default: PGInputField<bigint | undefined, 'bigInt', Types>,
        BigInt: PGInputField<bigint | undefined, 'bigInt', Types>,
        NestedBigIntFilter: () => PGArgBuilder<NestedBigIntFilterFieldMap<Types> | undefined, Types>
    }>;
};
type BytesFilterFieldMap<Types extends PGTypes> = {
    equals: PGInputField<Buffer | undefined, 'bytes', Types>;
    in: PGInputField<Buffer[] | undefined, 'bytes', Types>;
    notIn: PGInputField<Buffer[] | undefined, 'bytes', Types>;
    not: PGArgBuilderUnion<{
        __default: PGInputField<Buffer | undefined, 'bytes', Types>,
        Bytes: PGInputField<Buffer | undefined, 'bytes', Types>,
        NestedBytesFilter: () => PGArgBuilder<NestedBytesFilterFieldMap<Types> | undefined, Types>
    }>;
};
type JsonFilterFieldMap<Types extends PGTypes> = {
    equals: PGArgBuilderUnion<{
        __default: PGInputField<JsonNullValueFilterValues | undefined, 'enum', Types>,
        JsonNullValueFilter: PGInputField<JsonNullValueFilterValues | undefined, 'enum', Types>,
        Json: PGInputField<PGInputJson | undefined, 'json', Types>
    }>;
    path: PGInputField<string[] | undefined, 'string', Types>;
    string_contains: PGInputField<string | undefined, 'string', Types>;
    string_starts_with: PGInputField<string | undefined, 'string', Types>;
    string_ends_with: PGInputField<string | undefined, 'string', Types>;
    array_contains: PGInputField<PGInputJson | null | undefined, 'json', Types>;
    array_starts_with: PGInputField<PGInputJson | null | undefined, 'json', Types>;
    array_ends_with: PGInputField<PGInputJson | null | undefined, 'json', Types>;
    lt: PGInputField<PGInputJson | undefined, 'json', Types>;
    lte: PGInputField<PGInputJson | undefined, 'json', Types>;
    gt: PGInputField<PGInputJson | undefined, 'json', Types>;
    gte: PGInputField<PGInputJson | undefined, 'json', Types>;
    not: PGArgBuilderUnion<{
        __default: PGInputField<JsonNullValueFilterValues | undefined, 'enum', Types>,
        JsonNullValueFilter: PGInputField<JsonNullValueFilterValues | undefined, 'enum', Types>,
        Json: PGInputField<PGInputJson | undefined, 'json', Types>
    }>;
};
type DecimalFilterFieldMap<Types extends PGTypes> = {
    equals: PGInputField<PGInputDecimal | undefined, 'decimal', Types>;
    in: PGInputField<PGInputDecimal[] | undefined, 'decimal', Types>;
    notIn: PGInputField<PGInputDecimal[] | undefined, 'decimal', Types>;
    lt: PGInputField<PGInputDecimal | undefined, 'decimal', Types>;
    lte: PGInputField<PGInputDecimal | undefined, 'decimal', Types>;
    gt: PGInputField<PGInputDecimal | undefined, 'decimal', Types>;
    gte: PGInputField<PGInputDecimal | undefined, 'decimal', Types>;
    not: PGArgBuilderUnion<{
        __default: PGInputField<PGInputDecimal | undefined, 'decimal', Types>,
        Decimal: PGInputField<PGInputDecimal | undefined, 'decimal', Types>,
        NestedDecimalFilter: () => PGArgBuilder<NestedDecimalFilterFieldMap<Types> | undefined, Types>
    }>;
};
type PostRelationFilterFieldMap<Types extends PGTypes> = {
    is: () => PGArgBuilder<PostWhereInputFieldMap<Types> | undefined, Types>;
    isNot: () => PGArgBuilder<PostWhereInputFieldMap<Types> | undefined, Types>;
};
type AttachmentCountOrderByAggregateInputFieldMap<Types extends PGTypes> = {
    id: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    name: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    buffer: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    meta: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    size: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    postId: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    createdAt: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    updatedAt: PGInputField<SortOrderValues | undefined, 'enum', Types>;
};
type AttachmentAvgOrderByAggregateInputFieldMap<Types extends PGTypes> = {
    id: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    size: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    postId: PGInputField<SortOrderValues | undefined, 'enum', Types>;
};
type AttachmentMaxOrderByAggregateInputFieldMap<Types extends PGTypes> = {
    id: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    name: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    buffer: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    size: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    postId: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    createdAt: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    updatedAt: PGInputField<SortOrderValues | undefined, 'enum', Types>;
};
type AttachmentMinOrderByAggregateInputFieldMap<Types extends PGTypes> = {
    id: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    name: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    buffer: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    size: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    postId: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    createdAt: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    updatedAt: PGInputField<SortOrderValues | undefined, 'enum', Types>;
};
type AttachmentSumOrderByAggregateInputFieldMap<Types extends PGTypes> = {
    id: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    size: PGInputField<SortOrderValues | undefined, 'enum', Types>;
    postId: PGInputField<SortOrderValues | undefined, 'enum', Types>;
};
type BigIntWithAggregatesFilterFieldMap<Types extends PGTypes> = {
    equals: PGInputField<bigint | undefined, 'bigInt', Types>;
    in: PGInputField<bigint[] | undefined, 'bigInt', Types>;
    notIn: PGInputField<bigint[] | undefined, 'bigInt', Types>;
    lt: PGInputField<bigint | undefined, 'bigInt', Types>;
    lte: PGInputField<bigint | undefined, 'bigInt', Types>;
    gt: PGInputField<bigint | undefined, 'bigInt', Types>;
    gte: PGInputField<bigint | undefined, 'bigInt', Types>;
    not: PGArgBuilderUnion<{
        __default: PGInputField<bigint | undefined, 'bigInt', Types>,
        BigInt: PGInputField<bigint | undefined, 'bigInt', Types>,
        NestedBigIntWithAggregatesFilter: () => PGArgBuilder<NestedBigIntWithAggregatesFilterFieldMap<Types> | undefined, Types>
    }>;
    _count: () => PGArgBuilder<NestedIntFilterFieldMap<Types> | undefined, Types>;
    _avg: () => PGArgBuilder<NestedFloatFilterFieldMap<Types> | undefined, Types>;
    _sum: () => PGArgBuilder<NestedBigIntFilterFieldMap<Types> | undefined, Types>;
    _min: () => PGArgBuilder<NestedBigIntFilterFieldMap<Types> | undefined, Types>;
    _max: () => PGArgBuilder<NestedBigIntFilterFieldMap<Types> | undefined, Types>;
};
type BytesWithAggregatesFilterFieldMap<Types extends PGTypes> = {
    equals: PGInputField<Buffer | undefined, 'bytes', Types>;
    in: PGInputField<Buffer[] | undefined, 'bytes', Types>;
    notIn: PGInputField<Buffer[] | undefined, 'bytes', Types>;
    not: PGArgBuilderUnion<{
        __default: PGInputField<Buffer | undefined, 'bytes', Types>,
        Bytes: PGInputField<Buffer | undefined, 'bytes', Types>,
        NestedBytesWithAggregatesFilter: () => PGArgBuilder<NestedBytesWithAggregatesFilterFieldMap<Types> | undefined, Types>
    }>;
    _count: () => PGArgBuilder<NestedIntFilterFieldMap<Types> | undefined, Types>;
    _min: () => PGArgBuilder<NestedBytesFilterFieldMap<Types> | undefined, Types>;
    _max: () => PGArgBuilder<NestedBytesFilterFieldMap<Types> | undefined, Types>;
};
type JsonWithAggregatesFilterFieldMap<Types extends PGTypes> = {
    equals: PGArgBuilderUnion<{
        __default: PGInputField<JsonNullValueFilterValues | undefined, 'enum', Types>,
        JsonNullValueFilter: PGInputField<JsonNullValueFilterValues | undefined, 'enum', Types>,
        Json: PGInputField<PGInputJson | undefined, 'json', Types>
    }>;
    path: PGInputField<string[] | undefined, 'string', Types>;
    string_contains: PGInputField<string | undefined, 'string', Types>;
    string_starts_with: PGInputField<string | undefined, 'string', Types>;
    string_ends_with: PGInputField<string | undefined, 'string', Types>;
    array_contains: PGInputField<PGInputJson | null | undefined, 'json', Types>;
    array_starts_with: PGInputField<PGInputJson | null | undefined, 'json', Types>;
    array_ends_with: PGInputField<PGInputJson | null | undefined, 'json', Types>;
    lt: PGInputField<PGInputJson | undefined, 'json', Types>;
    lte: PGInputField<PGInputJson | undefined, 'json', Types>;
    gt: PGInputField<PGInputJson | undefined, 'json', Types>;
    gte: PGInputField<PGInputJson | undefined, 'json', Types>;
    not: PGArgBuilderUnion<{
        __default: PGInputField<JsonNullValueFilterValues | undefined, 'enum', Types>,
        JsonNullValueFilter: PGInputField<JsonNullValueFilterValues | undefined, 'enum', Types>,
        Json: PGInputField<PGInputJson | undefined, 'json', Types>
    }>;
    _count: () => PGArgBuilder<NestedIntFilterFieldMap<Types> | undefined, Types>;
    _min: () => PGArgBuilder<NestedJsonFilterFieldMap<Types> | undefined, Types>;
    _max: () => PGArgBuilder<NestedJsonFilterFieldMap<Types> | undefined, Types>;
};
type DecimalWithAggregatesFilterFieldMap<Types extends PGTypes> = {
    equals: PGInputField<PGInputDecimal | undefined, 'decimal', Types>;
    in: PGInputField<PGInputDecimal[] | undefined, 'decimal', Types>;
    notIn: PGInputField<PGInputDecimal[] | undefined, 'decimal', Types>;
    lt: PGInputField<PGInputDecimal | undefined, 'decimal', Types>;
    lte: PGInputField<PGInputDecimal | undefined, 'decimal', Types>;
    gt: PGInputField<PGInputDecimal | undefined, 'decimal', Types>;
    gte: PGInputField<PGInputDecimal | undefined, 'decimal', Types>;
    not: PGArgBuilderUnion<{
        __default: PGInputField<PGInputDecimal | undefined, 'decimal', Types>,
        Decimal: PGInputField<PGInputDecimal | undefined, 'decimal', Types>,
        NestedDecimalWithAggregatesFilter: () => PGArgBuilder<NestedDecimalWithAggregatesFilterFieldMap<Types> | undefined, Types>
    }>;
    _count: () => PGArgBuilder<NestedIntFilterFieldMap<Types> | undefined, Types>;
    _avg: () => PGArgBuilder<NestedDecimalFilterFieldMap<Types> | undefined, Types>;
    _sum: () => PGArgBuilder<NestedDecimalFilterFieldMap<Types> | undefined, Types>;
    _min: () => PGArgBuilder<NestedDecimalFilterFieldMap<Types> | undefined, Types>;
    _max: () => PGArgBuilder<NestedDecimalFilterFieldMap<Types> | undefined, Types>;
};
type PostCreateNestedManyWithoutAuthorInputFieldMap<Types extends PGTypes> = {
    create: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostCreateWithoutAuthorInputFieldMap<Types> | undefined, Types>,
        PostCreateWithoutAuthorInput: () => PGArgBuilder<Array<PostCreateWithoutAuthorInputFieldMap<Types>> | undefined, Types>,
        PostCreateWithoutAuthorInputList: () => PGArgBuilder<Array<PostCreateWithoutAuthorInputFieldMap<Types>> | undefined, Types>,
        PostUncheckedCreateWithoutAuthorInput: () => PGArgBuilder<Array<PostUncheckedCreateWithoutAuthorInputFieldMap<Types>> | undefined, Types>,
        PostUncheckedCreateWithoutAuthorInputList: () => PGArgBuilder<Array<PostUncheckedCreateWithoutAuthorInputFieldMap<Types>> | undefined, Types>
    }>;
    connectOrCreate: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostCreateOrConnectWithoutAuthorInputFieldMap<Types> | undefined, Types>,
        PostCreateOrConnectWithoutAuthorInput: () => PGArgBuilder<Array<PostCreateOrConnectWithoutAuthorInputFieldMap<Types>> | undefined, Types>,
        PostCreateOrConnectWithoutAuthorInputList: () => PGArgBuilder<Array<PostCreateOrConnectWithoutAuthorInputFieldMap<Types>> | undefined, Types>
    }>;
    createMany: () => PGArgBuilder<PostCreateManyAuthorInputEnvelopeFieldMap<Types> | undefined, Types>;
    connect: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostWhereUniqueInputFieldMap<Types> | undefined, Types>,
        PostWhereUniqueInput: () => PGArgBuilder<Array<PostWhereUniqueInputFieldMap<Types>> | undefined, Types>,
        PostWhereUniqueInputList: () => PGArgBuilder<Array<PostWhereUniqueInputFieldMap<Types>> | undefined, Types>
    }>;
};
type PostUncheckedCreateNestedManyWithoutAuthorInputFieldMap<Types extends PGTypes> = {
    create: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostCreateWithoutAuthorInputFieldMap<Types> | undefined, Types>,
        PostCreateWithoutAuthorInput: () => PGArgBuilder<Array<PostCreateWithoutAuthorInputFieldMap<Types>> | undefined, Types>,
        PostCreateWithoutAuthorInputList: () => PGArgBuilder<Array<PostCreateWithoutAuthorInputFieldMap<Types>> | undefined, Types>,
        PostUncheckedCreateWithoutAuthorInput: () => PGArgBuilder<Array<PostUncheckedCreateWithoutAuthorInputFieldMap<Types>> | undefined, Types>,
        PostUncheckedCreateWithoutAuthorInputList: () => PGArgBuilder<Array<PostUncheckedCreateWithoutAuthorInputFieldMap<Types>> | undefined, Types>
    }>;
    connectOrCreate: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostCreateOrConnectWithoutAuthorInputFieldMap<Types> | undefined, Types>,
        PostCreateOrConnectWithoutAuthorInput: () => PGArgBuilder<Array<PostCreateOrConnectWithoutAuthorInputFieldMap<Types>> | undefined, Types>,
        PostCreateOrConnectWithoutAuthorInputList: () => PGArgBuilder<Array<PostCreateOrConnectWithoutAuthorInputFieldMap<Types>> | undefined, Types>
    }>;
    createMany: () => PGArgBuilder<PostCreateManyAuthorInputEnvelopeFieldMap<Types> | undefined, Types>;
    connect: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostWhereUniqueInputFieldMap<Types> | undefined, Types>,
        PostWhereUniqueInput: () => PGArgBuilder<Array<PostWhereUniqueInputFieldMap<Types>> | undefined, Types>,
        PostWhereUniqueInputList: () => PGArgBuilder<Array<PostWhereUniqueInputFieldMap<Types>> | undefined, Types>
    }>;
};
type StringFieldUpdateOperationsInputFieldMap<Types extends PGTypes> = {
    set: PGInputField<string | undefined, 'string', Types>;
};
type PostUpdateManyWithoutAuthorNestedInputFieldMap<Types extends PGTypes> = {
    create: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostCreateWithoutAuthorInputFieldMap<Types> | undefined, Types>,
        PostCreateWithoutAuthorInput: () => PGArgBuilder<Array<PostCreateWithoutAuthorInputFieldMap<Types>> | undefined, Types>,
        PostCreateWithoutAuthorInputList: () => PGArgBuilder<Array<PostCreateWithoutAuthorInputFieldMap<Types>> | undefined, Types>,
        PostUncheckedCreateWithoutAuthorInput: () => PGArgBuilder<Array<PostUncheckedCreateWithoutAuthorInputFieldMap<Types>> | undefined, Types>,
        PostUncheckedCreateWithoutAuthorInputList: () => PGArgBuilder<Array<PostUncheckedCreateWithoutAuthorInputFieldMap<Types>> | undefined, Types>
    }>;
    connectOrCreate: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostCreateOrConnectWithoutAuthorInputFieldMap<Types> | undefined, Types>,
        PostCreateOrConnectWithoutAuthorInput: () => PGArgBuilder<Array<PostCreateOrConnectWithoutAuthorInputFieldMap<Types>> | undefined, Types>,
        PostCreateOrConnectWithoutAuthorInputList: () => PGArgBuilder<Array<PostCreateOrConnectWithoutAuthorInputFieldMap<Types>> | undefined, Types>
    }>;
    upsert: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostUpsertWithWhereUniqueWithoutAuthorInputFieldMap<Types> | undefined, Types>,
        PostUpsertWithWhereUniqueWithoutAuthorInput: () => PGArgBuilder<Array<PostUpsertWithWhereUniqueWithoutAuthorInputFieldMap<Types>> | undefined, Types>,
        PostUpsertWithWhereUniqueWithoutAuthorInputList: () => PGArgBuilder<Array<PostUpsertWithWhereUniqueWithoutAuthorInputFieldMap<Types>> | undefined, Types>
    }>;
    createMany: () => PGArgBuilder<PostCreateManyAuthorInputEnvelopeFieldMap<Types> | undefined, Types>;
    set: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostWhereUniqueInputFieldMap<Types> | undefined, Types>,
        PostWhereUniqueInput: () => PGArgBuilder<Array<PostWhereUniqueInputFieldMap<Types>> | undefined, Types>,
        PostWhereUniqueInputList: () => PGArgBuilder<Array<PostWhereUniqueInputFieldMap<Types>> | undefined, Types>
    }>;
    disconnect: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostWhereUniqueInputFieldMap<Types> | undefined, Types>,
        PostWhereUniqueInput: () => PGArgBuilder<Array<PostWhereUniqueInputFieldMap<Types>> | undefined, Types>,
        PostWhereUniqueInputList: () => PGArgBuilder<Array<PostWhereUniqueInputFieldMap<Types>> | undefined, Types>
    }>;
    delete: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostWhereUniqueInputFieldMap<Types> | undefined, Types>,
        PostWhereUniqueInput: () => PGArgBuilder<Array<PostWhereUniqueInputFieldMap<Types>> | undefined, Types>,
        PostWhereUniqueInputList: () => PGArgBuilder<Array<PostWhereUniqueInputFieldMap<Types>> | undefined, Types>
    }>;
    connect: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostWhereUniqueInputFieldMap<Types> | undefined, Types>,
        PostWhereUniqueInput: () => PGArgBuilder<Array<PostWhereUniqueInputFieldMap<Types>> | undefined, Types>,
        PostWhereUniqueInputList: () => PGArgBuilder<Array<PostWhereUniqueInputFieldMap<Types>> | undefined, Types>
    }>;
    update: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostUpdateWithWhereUniqueWithoutAuthorInputFieldMap<Types> | undefined, Types>,
        PostUpdateWithWhereUniqueWithoutAuthorInput: () => PGArgBuilder<Array<PostUpdateWithWhereUniqueWithoutAuthorInputFieldMap<Types>> | undefined, Types>,
        PostUpdateWithWhereUniqueWithoutAuthorInputList: () => PGArgBuilder<Array<PostUpdateWithWhereUniqueWithoutAuthorInputFieldMap<Types>> | undefined, Types>
    }>;
    updateMany: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostUpdateManyWithWhereWithoutAuthorInputFieldMap<Types> | undefined, Types>,
        PostUpdateManyWithWhereWithoutAuthorInput: () => PGArgBuilder<Array<PostUpdateManyWithWhereWithoutAuthorInputFieldMap<Types>> | undefined, Types>,
        PostUpdateManyWithWhereWithoutAuthorInputList: () => PGArgBuilder<Array<PostUpdateManyWithWhereWithoutAuthorInputFieldMap<Types>> | undefined, Types>
    }>;
    deleteMany: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostScalarWhereInputFieldMap<Types> | undefined, Types>,
        PostScalarWhereInput: () => PGArgBuilder<Array<PostScalarWhereInputFieldMap<Types>> | undefined, Types>,
        PostScalarWhereInputList: () => PGArgBuilder<Array<PostScalarWhereInputFieldMap<Types>> | undefined, Types>
    }>;
};
type DateTimeFieldUpdateOperationsInputFieldMap<Types extends PGTypes> = {
    set: PGInputField<Date | undefined, 'dateTime', Types>;
};
type IntFieldUpdateOperationsInputFieldMap<Types extends PGTypes> = {
    set: PGInputField<number | undefined, 'int', Types>;
    increment: PGInputField<number | undefined, 'int', Types>;
    decrement: PGInputField<number | undefined, 'int', Types>;
    multiply: PGInputField<number | undefined, 'int', Types>;
    divide: PGInputField<number | undefined, 'int', Types>;
};
type PostUncheckedUpdateManyWithoutAuthorNestedInputFieldMap<Types extends PGTypes> = {
    create: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostCreateWithoutAuthorInputFieldMap<Types> | undefined, Types>,
        PostCreateWithoutAuthorInput: () => PGArgBuilder<Array<PostCreateWithoutAuthorInputFieldMap<Types>> | undefined, Types>,
        PostCreateWithoutAuthorInputList: () => PGArgBuilder<Array<PostCreateWithoutAuthorInputFieldMap<Types>> | undefined, Types>,
        PostUncheckedCreateWithoutAuthorInput: () => PGArgBuilder<Array<PostUncheckedCreateWithoutAuthorInputFieldMap<Types>> | undefined, Types>,
        PostUncheckedCreateWithoutAuthorInputList: () => PGArgBuilder<Array<PostUncheckedCreateWithoutAuthorInputFieldMap<Types>> | undefined, Types>
    }>;
    connectOrCreate: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostCreateOrConnectWithoutAuthorInputFieldMap<Types> | undefined, Types>,
        PostCreateOrConnectWithoutAuthorInput: () => PGArgBuilder<Array<PostCreateOrConnectWithoutAuthorInputFieldMap<Types>> | undefined, Types>,
        PostCreateOrConnectWithoutAuthorInputList: () => PGArgBuilder<Array<PostCreateOrConnectWithoutAuthorInputFieldMap<Types>> | undefined, Types>
    }>;
    upsert: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostUpsertWithWhereUniqueWithoutAuthorInputFieldMap<Types> | undefined, Types>,
        PostUpsertWithWhereUniqueWithoutAuthorInput: () => PGArgBuilder<Array<PostUpsertWithWhereUniqueWithoutAuthorInputFieldMap<Types>> | undefined, Types>,
        PostUpsertWithWhereUniqueWithoutAuthorInputList: () => PGArgBuilder<Array<PostUpsertWithWhereUniqueWithoutAuthorInputFieldMap<Types>> | undefined, Types>
    }>;
    createMany: () => PGArgBuilder<PostCreateManyAuthorInputEnvelopeFieldMap<Types> | undefined, Types>;
    set: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostWhereUniqueInputFieldMap<Types> | undefined, Types>,
        PostWhereUniqueInput: () => PGArgBuilder<Array<PostWhereUniqueInputFieldMap<Types>> | undefined, Types>,
        PostWhereUniqueInputList: () => PGArgBuilder<Array<PostWhereUniqueInputFieldMap<Types>> | undefined, Types>
    }>;
    disconnect: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostWhereUniqueInputFieldMap<Types> | undefined, Types>,
        PostWhereUniqueInput: () => PGArgBuilder<Array<PostWhereUniqueInputFieldMap<Types>> | undefined, Types>,
        PostWhereUniqueInputList: () => PGArgBuilder<Array<PostWhereUniqueInputFieldMap<Types>> | undefined, Types>
    }>;
    delete: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostWhereUniqueInputFieldMap<Types> | undefined, Types>,
        PostWhereUniqueInput: () => PGArgBuilder<Array<PostWhereUniqueInputFieldMap<Types>> | undefined, Types>,
        PostWhereUniqueInputList: () => PGArgBuilder<Array<PostWhereUniqueInputFieldMap<Types>> | undefined, Types>
    }>;
    connect: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostWhereUniqueInputFieldMap<Types> | undefined, Types>,
        PostWhereUniqueInput: () => PGArgBuilder<Array<PostWhereUniqueInputFieldMap<Types>> | undefined, Types>,
        PostWhereUniqueInputList: () => PGArgBuilder<Array<PostWhereUniqueInputFieldMap<Types>> | undefined, Types>
    }>;
    update: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostUpdateWithWhereUniqueWithoutAuthorInputFieldMap<Types> | undefined, Types>,
        PostUpdateWithWhereUniqueWithoutAuthorInput: () => PGArgBuilder<Array<PostUpdateWithWhereUniqueWithoutAuthorInputFieldMap<Types>> | undefined, Types>,
        PostUpdateWithWhereUniqueWithoutAuthorInputList: () => PGArgBuilder<Array<PostUpdateWithWhereUniqueWithoutAuthorInputFieldMap<Types>> | undefined, Types>
    }>;
    updateMany: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostUpdateManyWithWhereWithoutAuthorInputFieldMap<Types> | undefined, Types>,
        PostUpdateManyWithWhereWithoutAuthorInput: () => PGArgBuilder<Array<PostUpdateManyWithWhereWithoutAuthorInputFieldMap<Types>> | undefined, Types>,
        PostUpdateManyWithWhereWithoutAuthorInputList: () => PGArgBuilder<Array<PostUpdateManyWithWhereWithoutAuthorInputFieldMap<Types>> | undefined, Types>
    }>;
    deleteMany: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostScalarWhereInputFieldMap<Types> | undefined, Types>,
        PostScalarWhereInput: () => PGArgBuilder<Array<PostScalarWhereInputFieldMap<Types>> | undefined, Types>,
        PostScalarWhereInputList: () => PGArgBuilder<Array<PostScalarWhereInputFieldMap<Types>> | undefined, Types>
    }>;
};
type UserCreateNestedOneWithoutPostsInputFieldMap<Types extends PGTypes> = {
    create: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<UserCreateWithoutPostsInputFieldMap<Types> | undefined, Types>,
        UserCreateWithoutPostsInput: () => PGArgBuilder<UserCreateWithoutPostsInputFieldMap<Types> | undefined, Types>,
        UserUncheckedCreateWithoutPostsInput: () => PGArgBuilder<UserUncheckedCreateWithoutPostsInputFieldMap<Types> | undefined, Types>
    }>;
    connectOrCreate: () => PGArgBuilder<UserCreateOrConnectWithoutPostsInputFieldMap<Types> | undefined, Types>;
    connect: () => PGArgBuilder<UserWhereUniqueInputFieldMap<Types> | undefined, Types>;
};
type AttachmentCreateNestedManyWithoutPostInputFieldMap<Types extends PGTypes> = {
    create: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentCreateWithoutPostInputFieldMap<Types> | undefined, Types>,
        AttachmentCreateWithoutPostInput: () => PGArgBuilder<Array<AttachmentCreateWithoutPostInputFieldMap<Types>> | undefined, Types>,
        AttachmentCreateWithoutPostInputList: () => PGArgBuilder<Array<AttachmentCreateWithoutPostInputFieldMap<Types>> | undefined, Types>,
        AttachmentUncheckedCreateWithoutPostInput: () => PGArgBuilder<Array<AttachmentUncheckedCreateWithoutPostInputFieldMap<Types>> | undefined, Types>,
        AttachmentUncheckedCreateWithoutPostInputList: () => PGArgBuilder<Array<AttachmentUncheckedCreateWithoutPostInputFieldMap<Types>> | undefined, Types>
    }>;
    connectOrCreate: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentCreateOrConnectWithoutPostInputFieldMap<Types> | undefined, Types>,
        AttachmentCreateOrConnectWithoutPostInput: () => PGArgBuilder<Array<AttachmentCreateOrConnectWithoutPostInputFieldMap<Types>> | undefined, Types>,
        AttachmentCreateOrConnectWithoutPostInputList: () => PGArgBuilder<Array<AttachmentCreateOrConnectWithoutPostInputFieldMap<Types>> | undefined, Types>
    }>;
    createMany: () => PGArgBuilder<AttachmentCreateManyPostInputEnvelopeFieldMap<Types> | undefined, Types>;
    connect: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentWhereUniqueInputFieldMap<Types> | undefined, Types>,
        AttachmentWhereUniqueInput: () => PGArgBuilder<Array<AttachmentWhereUniqueInputFieldMap<Types>> | undefined, Types>,
        AttachmentWhereUniqueInputList: () => PGArgBuilder<Array<AttachmentWhereUniqueInputFieldMap<Types>> | undefined, Types>
    }>;
};
type AttachmentUncheckedCreateNestedManyWithoutPostInputFieldMap<Types extends PGTypes> = {
    create: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentCreateWithoutPostInputFieldMap<Types> | undefined, Types>,
        AttachmentCreateWithoutPostInput: () => PGArgBuilder<Array<AttachmentCreateWithoutPostInputFieldMap<Types>> | undefined, Types>,
        AttachmentCreateWithoutPostInputList: () => PGArgBuilder<Array<AttachmentCreateWithoutPostInputFieldMap<Types>> | undefined, Types>,
        AttachmentUncheckedCreateWithoutPostInput: () => PGArgBuilder<Array<AttachmentUncheckedCreateWithoutPostInputFieldMap<Types>> | undefined, Types>,
        AttachmentUncheckedCreateWithoutPostInputList: () => PGArgBuilder<Array<AttachmentUncheckedCreateWithoutPostInputFieldMap<Types>> | undefined, Types>
    }>;
    connectOrCreate: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentCreateOrConnectWithoutPostInputFieldMap<Types> | undefined, Types>,
        AttachmentCreateOrConnectWithoutPostInput: () => PGArgBuilder<Array<AttachmentCreateOrConnectWithoutPostInputFieldMap<Types>> | undefined, Types>,
        AttachmentCreateOrConnectWithoutPostInputList: () => PGArgBuilder<Array<AttachmentCreateOrConnectWithoutPostInputFieldMap<Types>> | undefined, Types>
    }>;
    createMany: () => PGArgBuilder<AttachmentCreateManyPostInputEnvelopeFieldMap<Types> | undefined, Types>;
    connect: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentWhereUniqueInputFieldMap<Types> | undefined, Types>,
        AttachmentWhereUniqueInput: () => PGArgBuilder<Array<AttachmentWhereUniqueInputFieldMap<Types>> | undefined, Types>,
        AttachmentWhereUniqueInputList: () => PGArgBuilder<Array<AttachmentWhereUniqueInputFieldMap<Types>> | undefined, Types>
    }>;
};
type BoolFieldUpdateOperationsInputFieldMap<Types extends PGTypes> = {
    set: PGInputField<boolean | undefined, 'boolean', Types>;
};
type UserUpdateOneRequiredWithoutPostsNestedInputFieldMap<Types extends PGTypes> = {
    create: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<UserCreateWithoutPostsInputFieldMap<Types> | undefined, Types>,
        UserCreateWithoutPostsInput: () => PGArgBuilder<UserCreateWithoutPostsInputFieldMap<Types> | undefined, Types>,
        UserUncheckedCreateWithoutPostsInput: () => PGArgBuilder<UserUncheckedCreateWithoutPostsInputFieldMap<Types> | undefined, Types>
    }>;
    connectOrCreate: () => PGArgBuilder<UserCreateOrConnectWithoutPostsInputFieldMap<Types> | undefined, Types>;
    upsert: () => PGArgBuilder<UserUpsertWithoutPostsInputFieldMap<Types> | undefined, Types>;
    connect: () => PGArgBuilder<UserWhereUniqueInputFieldMap<Types> | undefined, Types>;
    update: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<UserUpdateWithoutPostsInputFieldMap<Types> | undefined, Types>,
        UserUpdateWithoutPostsInput: () => PGArgBuilder<UserUpdateWithoutPostsInputFieldMap<Types> | undefined, Types>,
        UserUncheckedUpdateWithoutPostsInput: () => PGArgBuilder<UserUncheckedUpdateWithoutPostsInputFieldMap<Types> | undefined, Types>
    }>;
};
type AttachmentUpdateManyWithoutPostNestedInputFieldMap<Types extends PGTypes> = {
    create: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentCreateWithoutPostInputFieldMap<Types> | undefined, Types>,
        AttachmentCreateWithoutPostInput: () => PGArgBuilder<Array<AttachmentCreateWithoutPostInputFieldMap<Types>> | undefined, Types>,
        AttachmentCreateWithoutPostInputList: () => PGArgBuilder<Array<AttachmentCreateWithoutPostInputFieldMap<Types>> | undefined, Types>,
        AttachmentUncheckedCreateWithoutPostInput: () => PGArgBuilder<Array<AttachmentUncheckedCreateWithoutPostInputFieldMap<Types>> | undefined, Types>,
        AttachmentUncheckedCreateWithoutPostInputList: () => PGArgBuilder<Array<AttachmentUncheckedCreateWithoutPostInputFieldMap<Types>> | undefined, Types>
    }>;
    connectOrCreate: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentCreateOrConnectWithoutPostInputFieldMap<Types> | undefined, Types>,
        AttachmentCreateOrConnectWithoutPostInput: () => PGArgBuilder<Array<AttachmentCreateOrConnectWithoutPostInputFieldMap<Types>> | undefined, Types>,
        AttachmentCreateOrConnectWithoutPostInputList: () => PGArgBuilder<Array<AttachmentCreateOrConnectWithoutPostInputFieldMap<Types>> | undefined, Types>
    }>;
    upsert: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentUpsertWithWhereUniqueWithoutPostInputFieldMap<Types> | undefined, Types>,
        AttachmentUpsertWithWhereUniqueWithoutPostInput: () => PGArgBuilder<Array<AttachmentUpsertWithWhereUniqueWithoutPostInputFieldMap<Types>> | undefined, Types>,
        AttachmentUpsertWithWhereUniqueWithoutPostInputList: () => PGArgBuilder<Array<AttachmentUpsertWithWhereUniqueWithoutPostInputFieldMap<Types>> | undefined, Types>
    }>;
    createMany: () => PGArgBuilder<AttachmentCreateManyPostInputEnvelopeFieldMap<Types> | undefined, Types>;
    set: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentWhereUniqueInputFieldMap<Types> | undefined, Types>,
        AttachmentWhereUniqueInput: () => PGArgBuilder<Array<AttachmentWhereUniqueInputFieldMap<Types>> | undefined, Types>,
        AttachmentWhereUniqueInputList: () => PGArgBuilder<Array<AttachmentWhereUniqueInputFieldMap<Types>> | undefined, Types>
    }>;
    disconnect: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentWhereUniqueInputFieldMap<Types> | undefined, Types>,
        AttachmentWhereUniqueInput: () => PGArgBuilder<Array<AttachmentWhereUniqueInputFieldMap<Types>> | undefined, Types>,
        AttachmentWhereUniqueInputList: () => PGArgBuilder<Array<AttachmentWhereUniqueInputFieldMap<Types>> | undefined, Types>
    }>;
    delete: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentWhereUniqueInputFieldMap<Types> | undefined, Types>,
        AttachmentWhereUniqueInput: () => PGArgBuilder<Array<AttachmentWhereUniqueInputFieldMap<Types>> | undefined, Types>,
        AttachmentWhereUniqueInputList: () => PGArgBuilder<Array<AttachmentWhereUniqueInputFieldMap<Types>> | undefined, Types>
    }>;
    connect: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentWhereUniqueInputFieldMap<Types> | undefined, Types>,
        AttachmentWhereUniqueInput: () => PGArgBuilder<Array<AttachmentWhereUniqueInputFieldMap<Types>> | undefined, Types>,
        AttachmentWhereUniqueInputList: () => PGArgBuilder<Array<AttachmentWhereUniqueInputFieldMap<Types>> | undefined, Types>
    }>;
    update: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentUpdateWithWhereUniqueWithoutPostInputFieldMap<Types> | undefined, Types>,
        AttachmentUpdateWithWhereUniqueWithoutPostInput: () => PGArgBuilder<Array<AttachmentUpdateWithWhereUniqueWithoutPostInputFieldMap<Types>> | undefined, Types>,
        AttachmentUpdateWithWhereUniqueWithoutPostInputList: () => PGArgBuilder<Array<AttachmentUpdateWithWhereUniqueWithoutPostInputFieldMap<Types>> | undefined, Types>
    }>;
    updateMany: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentUpdateManyWithWhereWithoutPostInputFieldMap<Types> | undefined, Types>,
        AttachmentUpdateManyWithWhereWithoutPostInput: () => PGArgBuilder<Array<AttachmentUpdateManyWithWhereWithoutPostInputFieldMap<Types>> | undefined, Types>,
        AttachmentUpdateManyWithWhereWithoutPostInputList: () => PGArgBuilder<Array<AttachmentUpdateManyWithWhereWithoutPostInputFieldMap<Types>> | undefined, Types>
    }>;
    deleteMany: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentScalarWhereInputFieldMap<Types> | undefined, Types>,
        AttachmentScalarWhereInput: () => PGArgBuilder<Array<AttachmentScalarWhereInputFieldMap<Types>> | undefined, Types>,
        AttachmentScalarWhereInputList: () => PGArgBuilder<Array<AttachmentScalarWhereInputFieldMap<Types>> | undefined, Types>
    }>;
};
type AttachmentUncheckedUpdateManyWithoutPostNestedInputFieldMap<Types extends PGTypes> = {
    create: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentCreateWithoutPostInputFieldMap<Types> | undefined, Types>,
        AttachmentCreateWithoutPostInput: () => PGArgBuilder<Array<AttachmentCreateWithoutPostInputFieldMap<Types>> | undefined, Types>,
        AttachmentCreateWithoutPostInputList: () => PGArgBuilder<Array<AttachmentCreateWithoutPostInputFieldMap<Types>> | undefined, Types>,
        AttachmentUncheckedCreateWithoutPostInput: () => PGArgBuilder<Array<AttachmentUncheckedCreateWithoutPostInputFieldMap<Types>> | undefined, Types>,
        AttachmentUncheckedCreateWithoutPostInputList: () => PGArgBuilder<Array<AttachmentUncheckedCreateWithoutPostInputFieldMap<Types>> | undefined, Types>
    }>;
    connectOrCreate: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentCreateOrConnectWithoutPostInputFieldMap<Types> | undefined, Types>,
        AttachmentCreateOrConnectWithoutPostInput: () => PGArgBuilder<Array<AttachmentCreateOrConnectWithoutPostInputFieldMap<Types>> | undefined, Types>,
        AttachmentCreateOrConnectWithoutPostInputList: () => PGArgBuilder<Array<AttachmentCreateOrConnectWithoutPostInputFieldMap<Types>> | undefined, Types>
    }>;
    upsert: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentUpsertWithWhereUniqueWithoutPostInputFieldMap<Types> | undefined, Types>,
        AttachmentUpsertWithWhereUniqueWithoutPostInput: () => PGArgBuilder<Array<AttachmentUpsertWithWhereUniqueWithoutPostInputFieldMap<Types>> | undefined, Types>,
        AttachmentUpsertWithWhereUniqueWithoutPostInputList: () => PGArgBuilder<Array<AttachmentUpsertWithWhereUniqueWithoutPostInputFieldMap<Types>> | undefined, Types>
    }>;
    createMany: () => PGArgBuilder<AttachmentCreateManyPostInputEnvelopeFieldMap<Types> | undefined, Types>;
    set: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentWhereUniqueInputFieldMap<Types> | undefined, Types>,
        AttachmentWhereUniqueInput: () => PGArgBuilder<Array<AttachmentWhereUniqueInputFieldMap<Types>> | undefined, Types>,
        AttachmentWhereUniqueInputList: () => PGArgBuilder<Array<AttachmentWhereUniqueInputFieldMap<Types>> | undefined, Types>
    }>;
    disconnect: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentWhereUniqueInputFieldMap<Types> | undefined, Types>,
        AttachmentWhereUniqueInput: () => PGArgBuilder<Array<AttachmentWhereUniqueInputFieldMap<Types>> | undefined, Types>,
        AttachmentWhereUniqueInputList: () => PGArgBuilder<Array<AttachmentWhereUniqueInputFieldMap<Types>> | undefined, Types>
    }>;
    delete: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentWhereUniqueInputFieldMap<Types> | undefined, Types>,
        AttachmentWhereUniqueInput: () => PGArgBuilder<Array<AttachmentWhereUniqueInputFieldMap<Types>> | undefined, Types>,
        AttachmentWhereUniqueInputList: () => PGArgBuilder<Array<AttachmentWhereUniqueInputFieldMap<Types>> | undefined, Types>
    }>;
    connect: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentWhereUniqueInputFieldMap<Types> | undefined, Types>,
        AttachmentWhereUniqueInput: () => PGArgBuilder<Array<AttachmentWhereUniqueInputFieldMap<Types>> | undefined, Types>,
        AttachmentWhereUniqueInputList: () => PGArgBuilder<Array<AttachmentWhereUniqueInputFieldMap<Types>> | undefined, Types>
    }>;
    update: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentUpdateWithWhereUniqueWithoutPostInputFieldMap<Types> | undefined, Types>,
        AttachmentUpdateWithWhereUniqueWithoutPostInput: () => PGArgBuilder<Array<AttachmentUpdateWithWhereUniqueWithoutPostInputFieldMap<Types>> | undefined, Types>,
        AttachmentUpdateWithWhereUniqueWithoutPostInputList: () => PGArgBuilder<Array<AttachmentUpdateWithWhereUniqueWithoutPostInputFieldMap<Types>> | undefined, Types>
    }>;
    updateMany: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentUpdateManyWithWhereWithoutPostInputFieldMap<Types> | undefined, Types>,
        AttachmentUpdateManyWithWhereWithoutPostInput: () => PGArgBuilder<Array<AttachmentUpdateManyWithWhereWithoutPostInputFieldMap<Types>> | undefined, Types>,
        AttachmentUpdateManyWithWhereWithoutPostInputList: () => PGArgBuilder<Array<AttachmentUpdateManyWithWhereWithoutPostInputFieldMap<Types>> | undefined, Types>
    }>;
    deleteMany: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentScalarWhereInputFieldMap<Types> | undefined, Types>,
        AttachmentScalarWhereInput: () => PGArgBuilder<Array<AttachmentScalarWhereInputFieldMap<Types>> | undefined, Types>,
        AttachmentScalarWhereInputList: () => PGArgBuilder<Array<AttachmentScalarWhereInputFieldMap<Types>> | undefined, Types>
    }>;
};
type PostCreateNestedOneWithoutAttachmentsInputFieldMap<Types extends PGTypes> = {
    create: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostCreateWithoutAttachmentsInputFieldMap<Types> | undefined, Types>,
        PostCreateWithoutAttachmentsInput: () => PGArgBuilder<PostCreateWithoutAttachmentsInputFieldMap<Types> | undefined, Types>,
        PostUncheckedCreateWithoutAttachmentsInput: () => PGArgBuilder<PostUncheckedCreateWithoutAttachmentsInputFieldMap<Types> | undefined, Types>
    }>;
    connectOrCreate: () => PGArgBuilder<PostCreateOrConnectWithoutAttachmentsInputFieldMap<Types> | undefined, Types>;
    connect: () => PGArgBuilder<PostWhereUniqueInputFieldMap<Types> | undefined, Types>;
};
type BigIntFieldUpdateOperationsInputFieldMap<Types extends PGTypes> = {
    set: PGInputField<bigint | undefined, 'bigInt', Types>;
    increment: PGInputField<bigint | undefined, 'bigInt', Types>;
    decrement: PGInputField<bigint | undefined, 'bigInt', Types>;
    multiply: PGInputField<bigint | undefined, 'bigInt', Types>;
    divide: PGInputField<bigint | undefined, 'bigInt', Types>;
};
type BytesFieldUpdateOperationsInputFieldMap<Types extends PGTypes> = {
    set: PGInputField<Buffer | undefined, 'bytes', Types>;
};
type DecimalFieldUpdateOperationsInputFieldMap<Types extends PGTypes> = {
    set: PGInputField<PGInputDecimal | undefined, 'decimal', Types>;
    increment: PGInputField<PGInputDecimal | undefined, 'decimal', Types>;
    decrement: PGInputField<PGInputDecimal | undefined, 'decimal', Types>;
    multiply: PGInputField<PGInputDecimal | undefined, 'decimal', Types>;
    divide: PGInputField<PGInputDecimal | undefined, 'decimal', Types>;
};
type PostUpdateOneRequiredWithoutAttachmentsNestedInputFieldMap<Types extends PGTypes> = {
    create: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostCreateWithoutAttachmentsInputFieldMap<Types> | undefined, Types>,
        PostCreateWithoutAttachmentsInput: () => PGArgBuilder<PostCreateWithoutAttachmentsInputFieldMap<Types> | undefined, Types>,
        PostUncheckedCreateWithoutAttachmentsInput: () => PGArgBuilder<PostUncheckedCreateWithoutAttachmentsInputFieldMap<Types> | undefined, Types>
    }>;
    connectOrCreate: () => PGArgBuilder<PostCreateOrConnectWithoutAttachmentsInputFieldMap<Types> | undefined, Types>;
    upsert: () => PGArgBuilder<PostUpsertWithoutAttachmentsInputFieldMap<Types> | undefined, Types>;
    connect: () => PGArgBuilder<PostWhereUniqueInputFieldMap<Types> | undefined, Types>;
    update: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostUpdateWithoutAttachmentsInputFieldMap<Types> | undefined, Types>,
        PostUpdateWithoutAttachmentsInput: () => PGArgBuilder<PostUpdateWithoutAttachmentsInputFieldMap<Types> | undefined, Types>,
        PostUncheckedUpdateWithoutAttachmentsInput: () => PGArgBuilder<PostUncheckedUpdateWithoutAttachmentsInputFieldMap<Types> | undefined, Types>
    }>;
};
type NestedIntFilterFieldMap<Types extends PGTypes> = {
    equals: PGInputField<number | undefined, 'int', Types>;
    in: PGInputField<number[] | undefined, 'int', Types>;
    notIn: PGInputField<number[] | undefined, 'int', Types>;
    lt: PGInputField<number | undefined, 'int', Types>;
    lte: PGInputField<number | undefined, 'int', Types>;
    gt: PGInputField<number | undefined, 'int', Types>;
    gte: PGInputField<number | undefined, 'int', Types>;
    not: PGArgBuilderUnion<{
        __default: PGInputField<number | undefined, 'int', Types>,
        Int: PGInputField<number | undefined, 'int', Types>,
        NestedIntFilter: () => PGArgBuilder<NestedIntFilterFieldMap<Types> | undefined, Types>
    }>;
};
type NestedStringFilterFieldMap<Types extends PGTypes> = {
    equals: PGInputField<string | undefined, 'string', Types>;
    in: PGInputField<string[] | undefined, 'string', Types>;
    notIn: PGInputField<string[] | undefined, 'string', Types>;
    lt: PGInputField<string | undefined, 'string', Types>;
    lte: PGInputField<string | undefined, 'string', Types>;
    gt: PGInputField<string | undefined, 'string', Types>;
    gte: PGInputField<string | undefined, 'string', Types>;
    contains: PGInputField<string | undefined, 'string', Types>;
    startsWith: PGInputField<string | undefined, 'string', Types>;
    endsWith: PGInputField<string | undefined, 'string', Types>;
    not: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        NestedStringFilter: () => PGArgBuilder<NestedStringFilterFieldMap<Types> | undefined, Types>
    }>;
};
type NestedDateTimeFilterFieldMap<Types extends PGTypes> = {
    equals: PGInputField<Date | undefined, 'dateTime', Types>;
    in: PGInputField<Date[] | undefined, 'dateTime', Types>;
    notIn: PGInputField<Date[] | undefined, 'dateTime', Types>;
    lt: PGInputField<Date | undefined, 'dateTime', Types>;
    lte: PGInputField<Date | undefined, 'dateTime', Types>;
    gt: PGInputField<Date | undefined, 'dateTime', Types>;
    gte: PGInputField<Date | undefined, 'dateTime', Types>;
    not: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        NestedDateTimeFilter: () => PGArgBuilder<NestedDateTimeFilterFieldMap<Types> | undefined, Types>
    }>;
};
type NestedIntWithAggregatesFilterFieldMap<Types extends PGTypes> = {
    equals: PGInputField<number | undefined, 'int', Types>;
    in: PGInputField<number[] | undefined, 'int', Types>;
    notIn: PGInputField<number[] | undefined, 'int', Types>;
    lt: PGInputField<number | undefined, 'int', Types>;
    lte: PGInputField<number | undefined, 'int', Types>;
    gt: PGInputField<number | undefined, 'int', Types>;
    gte: PGInputField<number | undefined, 'int', Types>;
    not: PGArgBuilderUnion<{
        __default: PGInputField<number | undefined, 'int', Types>,
        Int: PGInputField<number | undefined, 'int', Types>,
        NestedIntWithAggregatesFilter: () => PGArgBuilder<NestedIntWithAggregatesFilterFieldMap<Types> | undefined, Types>
    }>;
    _count: () => PGArgBuilder<NestedIntFilterFieldMap<Types> | undefined, Types>;
    _avg: () => PGArgBuilder<NestedFloatFilterFieldMap<Types> | undefined, Types>;
    _sum: () => PGArgBuilder<NestedIntFilterFieldMap<Types> | undefined, Types>;
    _min: () => PGArgBuilder<NestedIntFilterFieldMap<Types> | undefined, Types>;
    _max: () => PGArgBuilder<NestedIntFilterFieldMap<Types> | undefined, Types>;
};
type NestedFloatFilterFieldMap<Types extends PGTypes> = {
    equals: PGInputField<number | undefined, 'float', Types>;
    in: PGInputField<number[] | undefined, 'float', Types>;
    notIn: PGInputField<number[] | undefined, 'float', Types>;
    lt: PGInputField<number | undefined, 'float', Types>;
    lte: PGInputField<number | undefined, 'float', Types>;
    gt: PGInputField<number | undefined, 'float', Types>;
    gte: PGInputField<number | undefined, 'float', Types>;
    not: PGArgBuilderUnion<{
        __default: PGInputField<number | undefined, 'float', Types>,
        Float: PGInputField<number | undefined, 'float', Types>,
        NestedFloatFilter: () => PGArgBuilder<NestedFloatFilterFieldMap<Types> | undefined, Types>
    }>;
};
type NestedStringWithAggregatesFilterFieldMap<Types extends PGTypes> = {
    equals: PGInputField<string | undefined, 'string', Types>;
    in: PGInputField<string[] | undefined, 'string', Types>;
    notIn: PGInputField<string[] | undefined, 'string', Types>;
    lt: PGInputField<string | undefined, 'string', Types>;
    lte: PGInputField<string | undefined, 'string', Types>;
    gt: PGInputField<string | undefined, 'string', Types>;
    gte: PGInputField<string | undefined, 'string', Types>;
    contains: PGInputField<string | undefined, 'string', Types>;
    startsWith: PGInputField<string | undefined, 'string', Types>;
    endsWith: PGInputField<string | undefined, 'string', Types>;
    not: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        NestedStringWithAggregatesFilter: () => PGArgBuilder<NestedStringWithAggregatesFilterFieldMap<Types> | undefined, Types>
    }>;
    _count: () => PGArgBuilder<NestedIntFilterFieldMap<Types> | undefined, Types>;
    _min: () => PGArgBuilder<NestedStringFilterFieldMap<Types> | undefined, Types>;
    _max: () => PGArgBuilder<NestedStringFilterFieldMap<Types> | undefined, Types>;
};
type NestedDateTimeWithAggregatesFilterFieldMap<Types extends PGTypes> = {
    equals: PGInputField<Date | undefined, 'dateTime', Types>;
    in: PGInputField<Date[] | undefined, 'dateTime', Types>;
    notIn: PGInputField<Date[] | undefined, 'dateTime', Types>;
    lt: PGInputField<Date | undefined, 'dateTime', Types>;
    lte: PGInputField<Date | undefined, 'dateTime', Types>;
    gt: PGInputField<Date | undefined, 'dateTime', Types>;
    gte: PGInputField<Date | undefined, 'dateTime', Types>;
    not: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        NestedDateTimeWithAggregatesFilter: () => PGArgBuilder<NestedDateTimeWithAggregatesFilterFieldMap<Types> | undefined, Types>
    }>;
    _count: () => PGArgBuilder<NestedIntFilterFieldMap<Types> | undefined, Types>;
    _min: () => PGArgBuilder<NestedDateTimeFilterFieldMap<Types> | undefined, Types>;
    _max: () => PGArgBuilder<NestedDateTimeFilterFieldMap<Types> | undefined, Types>;
};
type NestedBoolFilterFieldMap<Types extends PGTypes> = {
    equals: PGInputField<boolean | undefined, 'boolean', Types>;
    not: PGArgBuilderUnion<{
        __default: PGInputField<boolean | undefined, 'boolean', Types>,
        Boolean: PGInputField<boolean | undefined, 'boolean', Types>,
        NestedBoolFilter: () => PGArgBuilder<NestedBoolFilterFieldMap<Types> | undefined, Types>
    }>;
};
type NestedBoolWithAggregatesFilterFieldMap<Types extends PGTypes> = {
    equals: PGInputField<boolean | undefined, 'boolean', Types>;
    not: PGArgBuilderUnion<{
        __default: PGInputField<boolean | undefined, 'boolean', Types>,
        Boolean: PGInputField<boolean | undefined, 'boolean', Types>,
        NestedBoolWithAggregatesFilter: () => PGArgBuilder<NestedBoolWithAggregatesFilterFieldMap<Types> | undefined, Types>
    }>;
    _count: () => PGArgBuilder<NestedIntFilterFieldMap<Types> | undefined, Types>;
    _min: () => PGArgBuilder<NestedBoolFilterFieldMap<Types> | undefined, Types>;
    _max: () => PGArgBuilder<NestedBoolFilterFieldMap<Types> | undefined, Types>;
};
type NestedBigIntFilterFieldMap<Types extends PGTypes> = {
    equals: PGInputField<bigint | undefined, 'bigInt', Types>;
    in: PGInputField<bigint[] | undefined, 'bigInt', Types>;
    notIn: PGInputField<bigint[] | undefined, 'bigInt', Types>;
    lt: PGInputField<bigint | undefined, 'bigInt', Types>;
    lte: PGInputField<bigint | undefined, 'bigInt', Types>;
    gt: PGInputField<bigint | undefined, 'bigInt', Types>;
    gte: PGInputField<bigint | undefined, 'bigInt', Types>;
    not: PGArgBuilderUnion<{
        __default: PGInputField<bigint | undefined, 'bigInt', Types>,
        BigInt: PGInputField<bigint | undefined, 'bigInt', Types>,
        NestedBigIntFilter: () => PGArgBuilder<NestedBigIntFilterFieldMap<Types> | undefined, Types>
    }>;
};
type NestedBytesFilterFieldMap<Types extends PGTypes> = {
    equals: PGInputField<Buffer | undefined, 'bytes', Types>;
    in: PGInputField<Buffer[] | undefined, 'bytes', Types>;
    notIn: PGInputField<Buffer[] | undefined, 'bytes', Types>;
    not: PGArgBuilderUnion<{
        __default: PGInputField<Buffer | undefined, 'bytes', Types>,
        Bytes: PGInputField<Buffer | undefined, 'bytes', Types>,
        NestedBytesFilter: () => PGArgBuilder<NestedBytesFilterFieldMap<Types> | undefined, Types>
    }>;
};
type NestedDecimalFilterFieldMap<Types extends PGTypes> = {
    equals: PGInputField<PGInputDecimal | undefined, 'decimal', Types>;
    in: PGInputField<PGInputDecimal[] | undefined, 'decimal', Types>;
    notIn: PGInputField<PGInputDecimal[] | undefined, 'decimal', Types>;
    lt: PGInputField<PGInputDecimal | undefined, 'decimal', Types>;
    lte: PGInputField<PGInputDecimal | undefined, 'decimal', Types>;
    gt: PGInputField<PGInputDecimal | undefined, 'decimal', Types>;
    gte: PGInputField<PGInputDecimal | undefined, 'decimal', Types>;
    not: PGArgBuilderUnion<{
        __default: PGInputField<PGInputDecimal | undefined, 'decimal', Types>,
        Decimal: PGInputField<PGInputDecimal | undefined, 'decimal', Types>,
        NestedDecimalFilter: () => PGArgBuilder<NestedDecimalFilterFieldMap<Types> | undefined, Types>
    }>;
};
type NestedBigIntWithAggregatesFilterFieldMap<Types extends PGTypes> = {
    equals: PGInputField<bigint | undefined, 'bigInt', Types>;
    in: PGInputField<bigint[] | undefined, 'bigInt', Types>;
    notIn: PGInputField<bigint[] | undefined, 'bigInt', Types>;
    lt: PGInputField<bigint | undefined, 'bigInt', Types>;
    lte: PGInputField<bigint | undefined, 'bigInt', Types>;
    gt: PGInputField<bigint | undefined, 'bigInt', Types>;
    gte: PGInputField<bigint | undefined, 'bigInt', Types>;
    not: PGArgBuilderUnion<{
        __default: PGInputField<bigint | undefined, 'bigInt', Types>,
        BigInt: PGInputField<bigint | undefined, 'bigInt', Types>,
        NestedBigIntWithAggregatesFilter: () => PGArgBuilder<NestedBigIntWithAggregatesFilterFieldMap<Types> | undefined, Types>
    }>;
    _count: () => PGArgBuilder<NestedIntFilterFieldMap<Types> | undefined, Types>;
    _avg: () => PGArgBuilder<NestedFloatFilterFieldMap<Types> | undefined, Types>;
    _sum: () => PGArgBuilder<NestedBigIntFilterFieldMap<Types> | undefined, Types>;
    _min: () => PGArgBuilder<NestedBigIntFilterFieldMap<Types> | undefined, Types>;
    _max: () => PGArgBuilder<NestedBigIntFilterFieldMap<Types> | undefined, Types>;
};
type NestedBytesWithAggregatesFilterFieldMap<Types extends PGTypes> = {
    equals: PGInputField<Buffer | undefined, 'bytes', Types>;
    in: PGInputField<Buffer[] | undefined, 'bytes', Types>;
    notIn: PGInputField<Buffer[] | undefined, 'bytes', Types>;
    not: PGArgBuilderUnion<{
        __default: PGInputField<Buffer | undefined, 'bytes', Types>,
        Bytes: PGInputField<Buffer | undefined, 'bytes', Types>,
        NestedBytesWithAggregatesFilter: () => PGArgBuilder<NestedBytesWithAggregatesFilterFieldMap<Types> | undefined, Types>
    }>;
    _count: () => PGArgBuilder<NestedIntFilterFieldMap<Types> | undefined, Types>;
    _min: () => PGArgBuilder<NestedBytesFilterFieldMap<Types> | undefined, Types>;
    _max: () => PGArgBuilder<NestedBytesFilterFieldMap<Types> | undefined, Types>;
};
type NestedJsonFilterFieldMap<Types extends PGTypes> = {
    equals: PGArgBuilderUnion<{
        __default: PGInputField<JsonNullValueFilterValues | undefined, 'enum', Types>,
        JsonNullValueFilter: PGInputField<JsonNullValueFilterValues | undefined, 'enum', Types>,
        Json: PGInputField<PGInputJson | undefined, 'json', Types>
    }>;
    path: PGInputField<string[] | undefined, 'string', Types>;
    string_contains: PGInputField<string | undefined, 'string', Types>;
    string_starts_with: PGInputField<string | undefined, 'string', Types>;
    string_ends_with: PGInputField<string | undefined, 'string', Types>;
    array_contains: PGInputField<PGInputJson | null | undefined, 'json', Types>;
    array_starts_with: PGInputField<PGInputJson | null | undefined, 'json', Types>;
    array_ends_with: PGInputField<PGInputJson | null | undefined, 'json', Types>;
    lt: PGInputField<PGInputJson | undefined, 'json', Types>;
    lte: PGInputField<PGInputJson | undefined, 'json', Types>;
    gt: PGInputField<PGInputJson | undefined, 'json', Types>;
    gte: PGInputField<PGInputJson | undefined, 'json', Types>;
    not: PGArgBuilderUnion<{
        __default: PGInputField<JsonNullValueFilterValues | undefined, 'enum', Types>,
        JsonNullValueFilter: PGInputField<JsonNullValueFilterValues | undefined, 'enum', Types>,
        Json: PGInputField<PGInputJson | undefined, 'json', Types>
    }>;
};
type NestedDecimalWithAggregatesFilterFieldMap<Types extends PGTypes> = {
    equals: PGInputField<PGInputDecimal | undefined, 'decimal', Types>;
    in: PGInputField<PGInputDecimal[] | undefined, 'decimal', Types>;
    notIn: PGInputField<PGInputDecimal[] | undefined, 'decimal', Types>;
    lt: PGInputField<PGInputDecimal | undefined, 'decimal', Types>;
    lte: PGInputField<PGInputDecimal | undefined, 'decimal', Types>;
    gt: PGInputField<PGInputDecimal | undefined, 'decimal', Types>;
    gte: PGInputField<PGInputDecimal | undefined, 'decimal', Types>;
    not: PGArgBuilderUnion<{
        __default: PGInputField<PGInputDecimal | undefined, 'decimal', Types>,
        Decimal: PGInputField<PGInputDecimal | undefined, 'decimal', Types>,
        NestedDecimalWithAggregatesFilter: () => PGArgBuilder<NestedDecimalWithAggregatesFilterFieldMap<Types> | undefined, Types>
    }>;
    _count: () => PGArgBuilder<NestedIntFilterFieldMap<Types> | undefined, Types>;
    _avg: () => PGArgBuilder<NestedDecimalFilterFieldMap<Types> | undefined, Types>;
    _sum: () => PGArgBuilder<NestedDecimalFilterFieldMap<Types> | undefined, Types>;
    _min: () => PGArgBuilder<NestedDecimalFilterFieldMap<Types> | undefined, Types>;
    _max: () => PGArgBuilder<NestedDecimalFilterFieldMap<Types> | undefined, Types>;
};
type PostCreateWithoutAuthorInputFieldMap<Types extends PGTypes> = {
    title: PGInputField<string, 'string', Types>;
    content: PGInputField<string, 'string', Types>;
    isPublic: PGInputField<boolean, 'boolean', Types>;
    attachments: () => PGArgBuilder<AttachmentCreateNestedManyWithoutPostInputFieldMap<Types> | undefined, Types>;
    createdAt: PGInputField<Date | undefined, 'dateTime', Types>;
    updatedAt: PGInputField<Date | undefined, 'dateTime', Types>;
};
type PostUncheckedCreateWithoutAuthorInputFieldMap<Types extends PGTypes> = {
    id: PGInputField<number | undefined, 'int', Types>;
    title: PGInputField<string, 'string', Types>;
    content: PGInputField<string, 'string', Types>;
    isPublic: PGInputField<boolean, 'boolean', Types>;
    attachments: () => PGArgBuilder<AttachmentUncheckedCreateNestedManyWithoutPostInputFieldMap<Types> | undefined, Types>;
    createdAt: PGInputField<Date | undefined, 'dateTime', Types>;
    updatedAt: PGInputField<Date | undefined, 'dateTime', Types>;
};
type PostCreateOrConnectWithoutAuthorInputFieldMap<Types extends PGTypes> = {
    where: () => PGArgBuilder<PostWhereUniqueInputFieldMap<Types>, Types>;
    create: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostCreateWithoutAuthorInputFieldMap<Types>, Types>,
        PostCreateWithoutAuthorInput: () => PGArgBuilder<PostCreateWithoutAuthorInputFieldMap<Types>, Types>,
        PostUncheckedCreateWithoutAuthorInput: () => PGArgBuilder<PostUncheckedCreateWithoutAuthorInputFieldMap<Types>, Types>
    }>;
};
type PostCreateManyAuthorInputEnvelopeFieldMap<Types extends PGTypes> = {
    data: () => PGArgBuilder<Array<PostCreateManyAuthorInputFieldMap<Types>>, Types>;
    skipDuplicates: PGInputField<boolean | undefined, 'boolean', Types>;
};
type PostUpsertWithWhereUniqueWithoutAuthorInputFieldMap<Types extends PGTypes> = {
    where: () => PGArgBuilder<PostWhereUniqueInputFieldMap<Types>, Types>;
    update: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostUpdateWithoutAuthorInputFieldMap<Types>, Types>,
        PostUpdateWithoutAuthorInput: () => PGArgBuilder<PostUpdateWithoutAuthorInputFieldMap<Types>, Types>,
        PostUncheckedUpdateWithoutAuthorInput: () => PGArgBuilder<PostUncheckedUpdateWithoutAuthorInputFieldMap<Types>, Types>
    }>;
    create: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostCreateWithoutAuthorInputFieldMap<Types>, Types>,
        PostCreateWithoutAuthorInput: () => PGArgBuilder<PostCreateWithoutAuthorInputFieldMap<Types>, Types>,
        PostUncheckedCreateWithoutAuthorInput: () => PGArgBuilder<PostUncheckedCreateWithoutAuthorInputFieldMap<Types>, Types>
    }>;
};
type PostUpdateWithWhereUniqueWithoutAuthorInputFieldMap<Types extends PGTypes> = {
    where: () => PGArgBuilder<PostWhereUniqueInputFieldMap<Types>, Types>;
    data: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostUpdateWithoutAuthorInputFieldMap<Types>, Types>,
        PostUpdateWithoutAuthorInput: () => PGArgBuilder<PostUpdateWithoutAuthorInputFieldMap<Types>, Types>,
        PostUncheckedUpdateWithoutAuthorInput: () => PGArgBuilder<PostUncheckedUpdateWithoutAuthorInputFieldMap<Types>, Types>
    }>;
};
type PostUpdateManyWithWhereWithoutAuthorInputFieldMap<Types extends PGTypes> = {
    where: () => PGArgBuilder<PostScalarWhereInputFieldMap<Types>, Types>;
    data: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostUpdateManyMutationInputFieldMap<Types>, Types>,
        PostUpdateManyMutationInput: () => PGArgBuilder<PostUpdateManyMutationInputFieldMap<Types>, Types>,
        PostUncheckedUpdateManyWithoutPostsInput: () => PGArgBuilder<PostUncheckedUpdateManyWithoutPostsInputFieldMap<Types>, Types>
    }>;
};
type PostScalarWhereInputFieldMap<Types extends PGTypes> = {
    AND: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostScalarWhereInputFieldMap<Types> | undefined, Types>,
        PostScalarWhereInput: () => PGArgBuilder<Array<PostScalarWhereInputFieldMap<Types>> | undefined, Types>,
        PostScalarWhereInputList: () => PGArgBuilder<Array<PostScalarWhereInputFieldMap<Types>> | undefined, Types>
    }>;
    OR: () => PGArgBuilder<Array<PostScalarWhereInputFieldMap<Types>> | undefined, Types>;
    NOT: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostScalarWhereInputFieldMap<Types> | undefined, Types>,
        PostScalarWhereInput: () => PGArgBuilder<Array<PostScalarWhereInputFieldMap<Types>> | undefined, Types>,
        PostScalarWhereInputList: () => PGArgBuilder<Array<PostScalarWhereInputFieldMap<Types>> | undefined, Types>
    }>;
    id: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<IntFilterFieldMap<Types> | undefined, Types>,
        IntFilter: () => PGArgBuilder<IntFilterFieldMap<Types> | undefined, Types>,
        Int: PGInputField<number | undefined, 'int', Types>
    }>;
    title: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<StringFilterFieldMap<Types> | undefined, Types>,
        StringFilter: () => PGArgBuilder<StringFilterFieldMap<Types> | undefined, Types>,
        String: PGInputField<string | undefined, 'string', Types>
    }>;
    content: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<StringFilterFieldMap<Types> | undefined, Types>,
        StringFilter: () => PGArgBuilder<StringFilterFieldMap<Types> | undefined, Types>,
        String: PGInputField<string | undefined, 'string', Types>
    }>;
    isPublic: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<BoolFilterFieldMap<Types> | undefined, Types>,
        BoolFilter: () => PGArgBuilder<BoolFilterFieldMap<Types> | undefined, Types>,
        Boolean: PGInputField<boolean | undefined, 'boolean', Types>
    }>;
    authorId: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<IntFilterFieldMap<Types> | undefined, Types>,
        IntFilter: () => PGArgBuilder<IntFilterFieldMap<Types> | undefined, Types>,
        Int: PGInputField<number | undefined, 'int', Types>
    }>;
    createdAt: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<DateTimeFilterFieldMap<Types> | undefined, Types>,
        DateTimeFilter: () => PGArgBuilder<DateTimeFilterFieldMap<Types> | undefined, Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    }>;
    updatedAt: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<DateTimeFilterFieldMap<Types> | undefined, Types>,
        DateTimeFilter: () => PGArgBuilder<DateTimeFilterFieldMap<Types> | undefined, Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    }>;
};
type UserCreateWithoutPostsInputFieldMap<Types extends PGTypes> = {
    firstName: PGInputField<string, 'string', Types>;
    lastName: PGInputField<string, 'string', Types>;
    createdAt: PGInputField<Date | undefined, 'dateTime', Types>;
    updatedAt: PGInputField<Date | undefined, 'dateTime', Types>;
};
type UserUncheckedCreateWithoutPostsInputFieldMap<Types extends PGTypes> = {
    id: PGInputField<number | undefined, 'int', Types>;
    firstName: PGInputField<string, 'string', Types>;
    lastName: PGInputField<string, 'string', Types>;
    createdAt: PGInputField<Date | undefined, 'dateTime', Types>;
    updatedAt: PGInputField<Date | undefined, 'dateTime', Types>;
};
type UserCreateOrConnectWithoutPostsInputFieldMap<Types extends PGTypes> = {
    where: () => PGArgBuilder<UserWhereUniqueInputFieldMap<Types>, Types>;
    create: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<UserCreateWithoutPostsInputFieldMap<Types>, Types>,
        UserCreateWithoutPostsInput: () => PGArgBuilder<UserCreateWithoutPostsInputFieldMap<Types>, Types>,
        UserUncheckedCreateWithoutPostsInput: () => PGArgBuilder<UserUncheckedCreateWithoutPostsInputFieldMap<Types>, Types>
    }>;
};
type AttachmentCreateWithoutPostInputFieldMap<Types extends PGTypes> = {
    id: PGInputField<bigint | undefined, 'bigInt', Types>;
    name: PGInputField<string, 'string', Types>;
    buffer: PGInputField<Buffer, 'bytes', Types>;
    meta: PGArgBuilderUnion<{
        __default: PGInputField<JsonNullValueInputValues, 'enum', Types>,
        JsonNullValueInput: PGInputField<JsonNullValueInputValues, 'enum', Types>,
        Json: PGInputField<PGInputJson, 'json', Types>
    }>;
    size: PGInputField<PGInputDecimal, 'decimal', Types>;
    createdAt: PGInputField<Date | undefined, 'dateTime', Types>;
    updatedAt: PGInputField<Date | undefined, 'dateTime', Types>;
};
type AttachmentUncheckedCreateWithoutPostInputFieldMap<Types extends PGTypes> = {
    id: PGInputField<bigint | undefined, 'bigInt', Types>;
    name: PGInputField<string, 'string', Types>;
    buffer: PGInputField<Buffer, 'bytes', Types>;
    meta: PGArgBuilderUnion<{
        __default: PGInputField<JsonNullValueInputValues, 'enum', Types>,
        JsonNullValueInput: PGInputField<JsonNullValueInputValues, 'enum', Types>,
        Json: PGInputField<PGInputJson, 'json', Types>
    }>;
    size: PGInputField<PGInputDecimal, 'decimal', Types>;
    createdAt: PGInputField<Date | undefined, 'dateTime', Types>;
    updatedAt: PGInputField<Date | undefined, 'dateTime', Types>;
};
type AttachmentCreateOrConnectWithoutPostInputFieldMap<Types extends PGTypes> = {
    where: () => PGArgBuilder<AttachmentWhereUniqueInputFieldMap<Types>, Types>;
    create: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentCreateWithoutPostInputFieldMap<Types>, Types>,
        AttachmentCreateWithoutPostInput: () => PGArgBuilder<AttachmentCreateWithoutPostInputFieldMap<Types>, Types>,
        AttachmentUncheckedCreateWithoutPostInput: () => PGArgBuilder<AttachmentUncheckedCreateWithoutPostInputFieldMap<Types>, Types>
    }>;
};
type AttachmentCreateManyPostInputEnvelopeFieldMap<Types extends PGTypes> = {
    data: () => PGArgBuilder<Array<AttachmentCreateManyPostInputFieldMap<Types>>, Types>;
    skipDuplicates: PGInputField<boolean | undefined, 'boolean', Types>;
};
type UserUpsertWithoutPostsInputFieldMap<Types extends PGTypes> = {
    update: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<UserUpdateWithoutPostsInputFieldMap<Types>, Types>,
        UserUpdateWithoutPostsInput: () => PGArgBuilder<UserUpdateWithoutPostsInputFieldMap<Types>, Types>,
        UserUncheckedUpdateWithoutPostsInput: () => PGArgBuilder<UserUncheckedUpdateWithoutPostsInputFieldMap<Types>, Types>
    }>;
    create: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<UserCreateWithoutPostsInputFieldMap<Types>, Types>,
        UserCreateWithoutPostsInput: () => PGArgBuilder<UserCreateWithoutPostsInputFieldMap<Types>, Types>,
        UserUncheckedCreateWithoutPostsInput: () => PGArgBuilder<UserUncheckedCreateWithoutPostsInputFieldMap<Types>, Types>
    }>;
};
type UserUpdateWithoutPostsInputFieldMap<Types extends PGTypes> = {
    firstName: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        StringFieldUpdateOperationsInput: () => PGArgBuilder<StringFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    lastName: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        StringFieldUpdateOperationsInput: () => PGArgBuilder<StringFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    createdAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    updatedAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
};
type UserUncheckedUpdateWithoutPostsInputFieldMap<Types extends PGTypes> = {
    id: PGArgBuilderUnion<{
        __default: PGInputField<number | undefined, 'int', Types>,
        Int: PGInputField<number | undefined, 'int', Types>,
        IntFieldUpdateOperationsInput: () => PGArgBuilder<IntFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    firstName: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        StringFieldUpdateOperationsInput: () => PGArgBuilder<StringFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    lastName: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        StringFieldUpdateOperationsInput: () => PGArgBuilder<StringFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    createdAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    updatedAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
};
type AttachmentUpsertWithWhereUniqueWithoutPostInputFieldMap<Types extends PGTypes> = {
    where: () => PGArgBuilder<AttachmentWhereUniqueInputFieldMap<Types>, Types>;
    update: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentUpdateWithoutPostInputFieldMap<Types>, Types>,
        AttachmentUpdateWithoutPostInput: () => PGArgBuilder<AttachmentUpdateWithoutPostInputFieldMap<Types>, Types>,
        AttachmentUncheckedUpdateWithoutPostInput: () => PGArgBuilder<AttachmentUncheckedUpdateWithoutPostInputFieldMap<Types>, Types>
    }>;
    create: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentCreateWithoutPostInputFieldMap<Types>, Types>,
        AttachmentCreateWithoutPostInput: () => PGArgBuilder<AttachmentCreateWithoutPostInputFieldMap<Types>, Types>,
        AttachmentUncheckedCreateWithoutPostInput: () => PGArgBuilder<AttachmentUncheckedCreateWithoutPostInputFieldMap<Types>, Types>
    }>;
};
type AttachmentUpdateWithWhereUniqueWithoutPostInputFieldMap<Types extends PGTypes> = {
    where: () => PGArgBuilder<AttachmentWhereUniqueInputFieldMap<Types>, Types>;
    data: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentUpdateWithoutPostInputFieldMap<Types>, Types>,
        AttachmentUpdateWithoutPostInput: () => PGArgBuilder<AttachmentUpdateWithoutPostInputFieldMap<Types>, Types>,
        AttachmentUncheckedUpdateWithoutPostInput: () => PGArgBuilder<AttachmentUncheckedUpdateWithoutPostInputFieldMap<Types>, Types>
    }>;
};
type AttachmentUpdateManyWithWhereWithoutPostInputFieldMap<Types extends PGTypes> = {
    where: () => PGArgBuilder<AttachmentScalarWhereInputFieldMap<Types>, Types>;
    data: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentUpdateManyMutationInputFieldMap<Types>, Types>,
        AttachmentUpdateManyMutationInput: () => PGArgBuilder<AttachmentUpdateManyMutationInputFieldMap<Types>, Types>,
        AttachmentUncheckedUpdateManyWithoutAttachmentsInput: () => PGArgBuilder<AttachmentUncheckedUpdateManyWithoutAttachmentsInputFieldMap<Types>, Types>
    }>;
};
type AttachmentScalarWhereInputFieldMap<Types extends PGTypes> = {
    AND: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentScalarWhereInputFieldMap<Types> | undefined, Types>,
        AttachmentScalarWhereInput: () => PGArgBuilder<Array<AttachmentScalarWhereInputFieldMap<Types>> | undefined, Types>,
        AttachmentScalarWhereInputList: () => PGArgBuilder<Array<AttachmentScalarWhereInputFieldMap<Types>> | undefined, Types>
    }>;
    OR: () => PGArgBuilder<Array<AttachmentScalarWhereInputFieldMap<Types>> | undefined, Types>;
    NOT: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<AttachmentScalarWhereInputFieldMap<Types> | undefined, Types>,
        AttachmentScalarWhereInput: () => PGArgBuilder<Array<AttachmentScalarWhereInputFieldMap<Types>> | undefined, Types>,
        AttachmentScalarWhereInputList: () => PGArgBuilder<Array<AttachmentScalarWhereInputFieldMap<Types>> | undefined, Types>
    }>;
    id: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<BigIntFilterFieldMap<Types> | undefined, Types>,
        BigIntFilter: () => PGArgBuilder<BigIntFilterFieldMap<Types> | undefined, Types>,
        BigInt: PGInputField<bigint | undefined, 'bigInt', Types>
    }>;
    name: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<StringFilterFieldMap<Types> | undefined, Types>,
        StringFilter: () => PGArgBuilder<StringFilterFieldMap<Types> | undefined, Types>,
        String: PGInputField<string | undefined, 'string', Types>
    }>;
    buffer: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<BytesFilterFieldMap<Types> | undefined, Types>,
        BytesFilter: () => PGArgBuilder<BytesFilterFieldMap<Types> | undefined, Types>,
        Bytes: PGInputField<Buffer | undefined, 'bytes', Types>
    }>;
    meta: () => PGArgBuilder<JsonFilterFieldMap<Types> | undefined, Types>;
    size: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<DecimalFilterFieldMap<Types> | undefined, Types>,
        DecimalFilter: () => PGArgBuilder<DecimalFilterFieldMap<Types> | undefined, Types>,
        Decimal: PGInputField<PGInputDecimal | undefined, 'decimal', Types>
    }>;
    postId: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<IntFilterFieldMap<Types> | undefined, Types>,
        IntFilter: () => PGArgBuilder<IntFilterFieldMap<Types> | undefined, Types>,
        Int: PGInputField<number | undefined, 'int', Types>
    }>;
    createdAt: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<DateTimeFilterFieldMap<Types> | undefined, Types>,
        DateTimeFilter: () => PGArgBuilder<DateTimeFilterFieldMap<Types> | undefined, Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    }>;
    updatedAt: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<DateTimeFilterFieldMap<Types> | undefined, Types>,
        DateTimeFilter: () => PGArgBuilder<DateTimeFilterFieldMap<Types> | undefined, Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>
    }>;
};
type PostCreateWithoutAttachmentsInputFieldMap<Types extends PGTypes> = {
    title: PGInputField<string, 'string', Types>;
    content: PGInputField<string, 'string', Types>;
    isPublic: PGInputField<boolean, 'boolean', Types>;
    author: () => PGArgBuilder<UserCreateNestedOneWithoutPostsInputFieldMap<Types>, Types>;
    createdAt: PGInputField<Date | undefined, 'dateTime', Types>;
    updatedAt: PGInputField<Date | undefined, 'dateTime', Types>;
};
type PostUncheckedCreateWithoutAttachmentsInputFieldMap<Types extends PGTypes> = {
    id: PGInputField<number | undefined, 'int', Types>;
    title: PGInputField<string, 'string', Types>;
    content: PGInputField<string, 'string', Types>;
    isPublic: PGInputField<boolean, 'boolean', Types>;
    authorId: PGInputField<number, 'int', Types>;
    createdAt: PGInputField<Date | undefined, 'dateTime', Types>;
    updatedAt: PGInputField<Date | undefined, 'dateTime', Types>;
};
type PostCreateOrConnectWithoutAttachmentsInputFieldMap<Types extends PGTypes> = {
    where: () => PGArgBuilder<PostWhereUniqueInputFieldMap<Types>, Types>;
    create: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostCreateWithoutAttachmentsInputFieldMap<Types>, Types>,
        PostCreateWithoutAttachmentsInput: () => PGArgBuilder<PostCreateWithoutAttachmentsInputFieldMap<Types>, Types>,
        PostUncheckedCreateWithoutAttachmentsInput: () => PGArgBuilder<PostUncheckedCreateWithoutAttachmentsInputFieldMap<Types>, Types>
    }>;
};
type PostUpsertWithoutAttachmentsInputFieldMap<Types extends PGTypes> = {
    update: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostUpdateWithoutAttachmentsInputFieldMap<Types>, Types>,
        PostUpdateWithoutAttachmentsInput: () => PGArgBuilder<PostUpdateWithoutAttachmentsInputFieldMap<Types>, Types>,
        PostUncheckedUpdateWithoutAttachmentsInput: () => PGArgBuilder<PostUncheckedUpdateWithoutAttachmentsInputFieldMap<Types>, Types>
    }>;
    create: PGArgBuilderUnion<{
        __default: () => PGArgBuilder<PostCreateWithoutAttachmentsInputFieldMap<Types>, Types>,
        PostCreateWithoutAttachmentsInput: () => PGArgBuilder<PostCreateWithoutAttachmentsInputFieldMap<Types>, Types>,
        PostUncheckedCreateWithoutAttachmentsInput: () => PGArgBuilder<PostUncheckedCreateWithoutAttachmentsInputFieldMap<Types>, Types>
    }>;
};
type PostUpdateWithoutAttachmentsInputFieldMap<Types extends PGTypes> = {
    title: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        StringFieldUpdateOperationsInput: () => PGArgBuilder<StringFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    content: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        StringFieldUpdateOperationsInput: () => PGArgBuilder<StringFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    isPublic: PGArgBuilderUnion<{
        __default: PGInputField<boolean | undefined, 'boolean', Types>,
        Boolean: PGInputField<boolean | undefined, 'boolean', Types>,
        BoolFieldUpdateOperationsInput: () => PGArgBuilder<BoolFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    author: () => PGArgBuilder<UserUpdateOneRequiredWithoutPostsNestedInputFieldMap<Types> | undefined, Types>;
    createdAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    updatedAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
};
type PostUncheckedUpdateWithoutAttachmentsInputFieldMap<Types extends PGTypes> = {
    id: PGArgBuilderUnion<{
        __default: PGInputField<number | undefined, 'int', Types>,
        Int: PGInputField<number | undefined, 'int', Types>,
        IntFieldUpdateOperationsInput: () => PGArgBuilder<IntFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    title: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        StringFieldUpdateOperationsInput: () => PGArgBuilder<StringFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    content: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        StringFieldUpdateOperationsInput: () => PGArgBuilder<StringFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    isPublic: PGArgBuilderUnion<{
        __default: PGInputField<boolean | undefined, 'boolean', Types>,
        Boolean: PGInputField<boolean | undefined, 'boolean', Types>,
        BoolFieldUpdateOperationsInput: () => PGArgBuilder<BoolFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    authorId: PGArgBuilderUnion<{
        __default: PGInputField<number | undefined, 'int', Types>,
        Int: PGInputField<number | undefined, 'int', Types>,
        IntFieldUpdateOperationsInput: () => PGArgBuilder<IntFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    createdAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    updatedAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
};
type PostCreateManyAuthorInputFieldMap<Types extends PGTypes> = {
    id: PGInputField<number | undefined, 'int', Types>;
    title: PGInputField<string, 'string', Types>;
    content: PGInputField<string, 'string', Types>;
    isPublic: PGInputField<boolean, 'boolean', Types>;
    createdAt: PGInputField<Date | undefined, 'dateTime', Types>;
    updatedAt: PGInputField<Date | undefined, 'dateTime', Types>;
};
type PostUpdateWithoutAuthorInputFieldMap<Types extends PGTypes> = {
    title: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        StringFieldUpdateOperationsInput: () => PGArgBuilder<StringFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    content: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        StringFieldUpdateOperationsInput: () => PGArgBuilder<StringFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    isPublic: PGArgBuilderUnion<{
        __default: PGInputField<boolean | undefined, 'boolean', Types>,
        Boolean: PGInputField<boolean | undefined, 'boolean', Types>,
        BoolFieldUpdateOperationsInput: () => PGArgBuilder<BoolFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    attachments: () => PGArgBuilder<AttachmentUpdateManyWithoutPostNestedInputFieldMap<Types> | undefined, Types>;
    createdAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    updatedAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
};
type PostUncheckedUpdateWithoutAuthorInputFieldMap<Types extends PGTypes> = {
    id: PGArgBuilderUnion<{
        __default: PGInputField<number | undefined, 'int', Types>,
        Int: PGInputField<number | undefined, 'int', Types>,
        IntFieldUpdateOperationsInput: () => PGArgBuilder<IntFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    title: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        StringFieldUpdateOperationsInput: () => PGArgBuilder<StringFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    content: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        StringFieldUpdateOperationsInput: () => PGArgBuilder<StringFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    isPublic: PGArgBuilderUnion<{
        __default: PGInputField<boolean | undefined, 'boolean', Types>,
        Boolean: PGInputField<boolean | undefined, 'boolean', Types>,
        BoolFieldUpdateOperationsInput: () => PGArgBuilder<BoolFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    attachments: () => PGArgBuilder<AttachmentUncheckedUpdateManyWithoutPostNestedInputFieldMap<Types> | undefined, Types>;
    createdAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    updatedAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
};
type PostUncheckedUpdateManyWithoutPostsInputFieldMap<Types extends PGTypes> = {
    id: PGArgBuilderUnion<{
        __default: PGInputField<number | undefined, 'int', Types>,
        Int: PGInputField<number | undefined, 'int', Types>,
        IntFieldUpdateOperationsInput: () => PGArgBuilder<IntFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    title: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        StringFieldUpdateOperationsInput: () => PGArgBuilder<StringFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    content: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        StringFieldUpdateOperationsInput: () => PGArgBuilder<StringFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    isPublic: PGArgBuilderUnion<{
        __default: PGInputField<boolean | undefined, 'boolean', Types>,
        Boolean: PGInputField<boolean | undefined, 'boolean', Types>,
        BoolFieldUpdateOperationsInput: () => PGArgBuilder<BoolFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    createdAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    updatedAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
};
type AttachmentCreateManyPostInputFieldMap<Types extends PGTypes> = {
    id: PGInputField<bigint | undefined, 'bigInt', Types>;
    name: PGInputField<string, 'string', Types>;
    buffer: PGInputField<Buffer, 'bytes', Types>;
    meta: PGArgBuilderUnion<{
        __default: PGInputField<JsonNullValueInputValues, 'enum', Types>,
        JsonNullValueInput: PGInputField<JsonNullValueInputValues, 'enum', Types>,
        Json: PGInputField<PGInputJson, 'json', Types>
    }>;
    size: PGInputField<PGInputDecimal, 'decimal', Types>;
    createdAt: PGInputField<Date | undefined, 'dateTime', Types>;
    updatedAt: PGInputField<Date | undefined, 'dateTime', Types>;
};
type AttachmentUpdateWithoutPostInputFieldMap<Types extends PGTypes> = {
    id: PGArgBuilderUnion<{
        __default: PGInputField<bigint | undefined, 'bigInt', Types>,
        BigInt: PGInputField<bigint | undefined, 'bigInt', Types>,
        BigIntFieldUpdateOperationsInput: () => PGArgBuilder<BigIntFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    name: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        StringFieldUpdateOperationsInput: () => PGArgBuilder<StringFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    buffer: PGArgBuilderUnion<{
        __default: PGInputField<Buffer | undefined, 'bytes', Types>,
        Bytes: PGInputField<Buffer | undefined, 'bytes', Types>,
        BytesFieldUpdateOperationsInput: () => PGArgBuilder<BytesFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    meta: PGArgBuilderUnion<{
        __default: PGInputField<JsonNullValueInputValues | undefined, 'enum', Types>,
        JsonNullValueInput: PGInputField<JsonNullValueInputValues | undefined, 'enum', Types>,
        Json: PGInputField<PGInputJson | undefined, 'json', Types>
    }>;
    size: PGArgBuilderUnion<{
        __default: PGInputField<PGInputDecimal | undefined, 'decimal', Types>,
        Decimal: PGInputField<PGInputDecimal | undefined, 'decimal', Types>,
        DecimalFieldUpdateOperationsInput: () => PGArgBuilder<DecimalFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    createdAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    updatedAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
};
type AttachmentUncheckedUpdateWithoutPostInputFieldMap<Types extends PGTypes> = {
    id: PGArgBuilderUnion<{
        __default: PGInputField<bigint | undefined, 'bigInt', Types>,
        BigInt: PGInputField<bigint | undefined, 'bigInt', Types>,
        BigIntFieldUpdateOperationsInput: () => PGArgBuilder<BigIntFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    name: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        StringFieldUpdateOperationsInput: () => PGArgBuilder<StringFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    buffer: PGArgBuilderUnion<{
        __default: PGInputField<Buffer | undefined, 'bytes', Types>,
        Bytes: PGInputField<Buffer | undefined, 'bytes', Types>,
        BytesFieldUpdateOperationsInput: () => PGArgBuilder<BytesFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    meta: PGArgBuilderUnion<{
        __default: PGInputField<JsonNullValueInputValues | undefined, 'enum', Types>,
        JsonNullValueInput: PGInputField<JsonNullValueInputValues | undefined, 'enum', Types>,
        Json: PGInputField<PGInputJson | undefined, 'json', Types>
    }>;
    size: PGArgBuilderUnion<{
        __default: PGInputField<PGInputDecimal | undefined, 'decimal', Types>,
        Decimal: PGInputField<PGInputDecimal | undefined, 'decimal', Types>,
        DecimalFieldUpdateOperationsInput: () => PGArgBuilder<DecimalFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    createdAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    updatedAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
};
type AttachmentUncheckedUpdateManyWithoutAttachmentsInputFieldMap<Types extends PGTypes> = {
    id: PGArgBuilderUnion<{
        __default: PGInputField<bigint | undefined, 'bigInt', Types>,
        BigInt: PGInputField<bigint | undefined, 'bigInt', Types>,
        BigIntFieldUpdateOperationsInput: () => PGArgBuilder<BigIntFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    name: PGArgBuilderUnion<{
        __default: PGInputField<string | undefined, 'string', Types>,
        String: PGInputField<string | undefined, 'string', Types>,
        StringFieldUpdateOperationsInput: () => PGArgBuilder<StringFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    buffer: PGArgBuilderUnion<{
        __default: PGInputField<Buffer | undefined, 'bytes', Types>,
        Bytes: PGInputField<Buffer | undefined, 'bytes', Types>,
        BytesFieldUpdateOperationsInput: () => PGArgBuilder<BytesFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    meta: PGArgBuilderUnion<{
        __default: PGInputField<JsonNullValueInputValues | undefined, 'enum', Types>,
        JsonNullValueInput: PGInputField<JsonNullValueInputValues | undefined, 'enum', Types>,
        Json: PGInputField<PGInputJson | undefined, 'json', Types>
    }>;
    size: PGArgBuilderUnion<{
        __default: PGInputField<PGInputDecimal | undefined, 'decimal', Types>,
        Decimal: PGInputField<PGInputDecimal | undefined, 'decimal', Types>,
        DecimalFieldUpdateOperationsInput: () => PGArgBuilder<DecimalFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    createdAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
    updatedAt: PGArgBuilderUnion<{
        __default: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTime: PGInputField<Date | undefined, 'dateTime', Types>,
        DateTimeFieldUpdateOperationsInput: () => PGArgBuilder<DateTimeFieldUpdateOperationsInputFieldMap<Types> | undefined, Types>
    }>;
};

interface PrismaArgBuilderMap<Types extends PGTypes> {
    findFirstUser: PGArgBuilder<FindFirstUserFieldMap<Types>, Types>;
    findManyUser: PGArgBuilder<FindManyUserFieldMap<Types>, Types>;
    aggregateUser: PGArgBuilder<AggregateUserFieldMap<Types>, Types>;
    groupByUser: PGArgBuilder<GroupByUserFieldMap<Types>, Types>;
    findUniqueUser: PGArgBuilder<FindUniqueUserFieldMap<Types>, Types>;
    findFirstPost: PGArgBuilder<FindFirstPostFieldMap<Types>, Types>;
    findManyPost: PGArgBuilder<FindManyPostFieldMap<Types>, Types>;
    aggregatePost: PGArgBuilder<AggregatePostFieldMap<Types>, Types>;
    groupByPost: PGArgBuilder<GroupByPostFieldMap<Types>, Types>;
    findUniquePost: PGArgBuilder<FindUniquePostFieldMap<Types>, Types>;
    findFirstAttachment: PGArgBuilder<FindFirstAttachmentFieldMap<Types>, Types>;
    findManyAttachment: PGArgBuilder<FindManyAttachmentFieldMap<Types>, Types>;
    aggregateAttachment: PGArgBuilder<AggregateAttachmentFieldMap<Types>, Types>;
    groupByAttachment: PGArgBuilder<GroupByAttachmentFieldMap<Types>, Types>;
    findUniqueAttachment: PGArgBuilder<FindUniqueAttachmentFieldMap<Types>, Types>;
    createOneUser: PGArgBuilder<CreateOneUserFieldMap<Types>, Types>;
    upsertOneUser: PGArgBuilder<UpsertOneUserFieldMap<Types>, Types>;
    createManyUser: PGArgBuilder<CreateManyUserFieldMap<Types>, Types>;
    deleteOneUser: PGArgBuilder<DeleteOneUserFieldMap<Types>, Types>;
    updateOneUser: PGArgBuilder<UpdateOneUserFieldMap<Types>, Types>;
    updateManyUser: PGArgBuilder<UpdateManyUserFieldMap<Types>, Types>;
    deleteManyUser: PGArgBuilder<DeleteManyUserFieldMap<Types>, Types>;
    createOnePost: PGArgBuilder<CreateOnePostFieldMap<Types>, Types>;
    upsertOnePost: PGArgBuilder<UpsertOnePostFieldMap<Types>, Types>;
    createManyPost: PGArgBuilder<CreateManyPostFieldMap<Types>, Types>;
    deleteOnePost: PGArgBuilder<DeleteOnePostFieldMap<Types>, Types>;
    updateOnePost: PGArgBuilder<UpdateOnePostFieldMap<Types>, Types>;
    updateManyPost: PGArgBuilder<UpdateManyPostFieldMap<Types>, Types>;
    deleteManyPost: PGArgBuilder<DeleteManyPostFieldMap<Types>, Types>;
    createOneAttachment: PGArgBuilder<CreateOneAttachmentFieldMap<Types>, Types>;
    upsertOneAttachment: PGArgBuilder<UpsertOneAttachmentFieldMap<Types>, Types>;
    createManyAttachment: PGArgBuilder<CreateManyAttachmentFieldMap<Types>, Types>;
    deleteOneAttachment: PGArgBuilder<DeleteOneAttachmentFieldMap<Types>, Types>;
    updateOneAttachment: PGArgBuilder<UpdateOneAttachmentFieldMap<Types>, Types>;
    updateManyAttachment: PGArgBuilder<UpdateManyAttachmentFieldMap<Types>, Types>;
    deleteManyAttachment: PGArgBuilder<DeleteManyAttachmentFieldMap<Types>, Types>;
    executeRaw: PGArgBuilder<ExecuteRawFieldMap<Types>, Types>;
    queryRaw: PGArgBuilder<QueryRawFieldMap<Types>, Types>;
}

interface PGPrismaConverter<Types extends PGTypes> {
    convertTypes: <
        TObjectRef extends { [P in keyof PrismaObjectMap<{}, Types>]?: Function },
        >(
        updatedObjectRef?: TObjectRef,
    ) => {
        objects: {
            [P in keyof PrismaObjectMap<TObjectRef, Types>]: ReturnType<
                PrismaObjectMap<TObjectRef, Types>[P]
            >
        }
        enums: PrismaEnumMap
        getRelations: <TName extends keyof PrismaObjectMap<{}, Types>>(
            name: TName,
        ) => Omit<PrismaObjectMap<TObjectRef, Types>, TName>
    };
    convertBuilders: () => {
        args: PrismaArgBuilderMap<Types>
    };
    redefine: <
        TName extends Exclude<keyof PrismaObjectMap<{}, Types>, undefined | number>,
        TFieldMap extends PGOutputFieldMap,
        TObjectRef extends { [P in keyof PrismaObjectMap<{}, Types>]?: Function } = {},
        TInterfaces extends Array<PGInterface<any>> | undefined = undefined,
        >(config: {
            name: TName
            fields: (
                f: ReturnType<PrismaObjectMap<TObjectRef, Types>[TName]> extends infer U
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
            relations: () => TObjectRef
        }) => PGObject<
            TFieldMap & ConvertPGInterfacesToFieldMap<TInterfaces>,
            TInterfaces,
            TName extends GetPrismaModelNames<Types>
            ? { PrismaModelName: TName }
            : PGObjectOptionsDefault<Types>,
            Types
        >;
}

type InitPGPrismaConverter = <Types extends PGTypes>(
    builder: PGBuilder<Types>,
    dmmf: DMMF.Document,
) => PGPrismaConverter<Types>;
type PrismaArgsMap = {
    User: RequiredNonNullable<Prisma.UserFindManyArgs>;
    Post: RequiredNonNullable<Prisma.PostFindManyArgs>;
    Attachment: RequiredNonNullable<Prisma.AttachmentFindManyArgs>;
};
export type PrismaTypes = {
    Args: PrismaArgsMap;
};

export const dmmf: DMMF.Document;
export const getPGPrismaConverter: InitPGPrismaConverter;
