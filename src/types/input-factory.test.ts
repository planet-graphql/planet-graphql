import { expectType } from 'tsd'
import { z } from 'zod'
import {
  PGInputFactoryWrapper,
  PGInputFactoryUnion,
  PGInputFactory,
  PGInput2,
  PGInputField2,
} from './input-factory'

describe('PGInputFactory', () => {
  it('Type is evaluated correctly even if it contains circular references', () => {
    type UserWhereFactory = PGInputFactoryWrapper<
      {
        AND: () => PGInputFactoryWrapper<[UserWhereFactory['fieldMap']]>
        name: PGInputFactoryUnion<{
          StringFilter: () => PGInputFactoryWrapper<{
            equals: PGInputFactory<string, z.ZodString>
            in: PGInputFactory<string[], z.ZodArray<z.ZodString>>
          }>
          String: PGInputFactory<string, z.ZodString>
          __default: PGInputFactory<string, z.ZodString>
        }>
        age: PGInputFactory<number, z.ZodNumber>
        posts: () => PGInputFactoryWrapper<{
          every: () => PostWhereFactory
        }>
      },
      { prisma: string }
    >

    type PostWhereFactory = PGInputFactoryWrapper<
      {
        AND: () => PGInputFactoryWrapper<[PostWhereFactory['fieldMap']]>
        title: () => PGInputFactoryWrapper<{
          equals: PGInputFactory<string, z.ZodString>
          in: PGInputFactory<string[], z.ZodArray<z.ZodString>>
        }>
        author: () => UserWhereFactory
      },
      { prisma: string }
    >

    const userWhere: UserWhereFactory = null as any
    const postWhere: PostWhereFactory = null as any

    const userEdited = userWhere
      .edit((f) => ({
        name: f.name
          .select('StringFilter')
          .list()
          .nullish()
          .default([])
          .validation((value) => value?.equals === value?.in[0])
          .edit((f) => ({
            equals: f.equals
              .nullish()
              .default(null)
              .validation((schema) => schema.max(10)),
          })),
        posts: f.posts.edit((f) => ({
          every: f.every.edit((f) => ({
            title: f.title,
            author: f.author.edit((f) => ({
              age: f.age,
            })),
          })),
        })),
      }))
      .build('UserWhere', true)

    expectType<
      PGInputField2<
        PGInput2<{
          name: PGInputField2<
            | [
                PGInput2<{
                  equals: PGInputField2<string | null | undefined, z.ZodString>
                }>,
              ]
            | null
            | undefined
          >
          posts: PGInputField2<
            PGInput2<{
              every: PGInputField2<
                PGInput2<{
                  title: PGInputField2<
                    PGInput2<{
                      equals: PGInputField2<string, z.ZodString>
                      in: PGInputField2<string[], z.ZodArray<z.ZodString>>
                    }>
                  >
                  author: PGInputField2<
                    PGInput2<{
                      age: PGInputField2<number, z.ZodNumber>
                    }>
                  >
                }>
              >
            }>,
            z.ZodAny,
            { prisma: string }
          >
        }>,
        z.ZodAny,
        { prisma: string }
      >
    >(userEdited)

    const postEdited = postWhere
      .edit((f) => ({
        AND: f.AND.edit((f) => ({
          title: f.title,
        })),
        title: f.title.edit((f) => ({
          equals: f.equals,
          in: f.in,
        })),
      }))
      .build('PostWhere')

    expectType<{
      AND: PGInputField2<
        [
          PGInput2<{
            title: PGInputField2<
              PGInput2<{
                equals: PGInputField2<string, z.ZodString>
                in: PGInputField2<string[], z.ZodArray<z.ZodString>>
              }>
            >
          }>,
        ]
      >
      title: PGInputField2<
        PGInput2<{
          equals: PGInputField2<string, z.ZodString>
          in: PGInputField2<string[], z.ZodArray<z.ZodString>>
        }>
      >
    }>(postEdited)
  })
})
