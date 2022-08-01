import { expectType } from 'ts-expect'
import type { PGArgBuilder, PGArgBuilderUnion } from './arg-builder'
import type { PGTypes } from './builder'
import type { PGInput, PGInputField } from './input'
import type { TypeEqual } from 'ts-expect'

describe.skip('PGArgBuilder', () => {
  it('Type is evaluated correctly even if it contains circular references', () => {
    type UserWhereArgBuilder = PGArgBuilder<
      {
        AND: () => PGArgBuilder<[UserWhereArgBuilder['value']['fieldMap']], PGTypes>
        name: PGArgBuilderUnion<{
          StringFilter: () => PGArgBuilder<
            {
              equals: PGInputField<string, 'string', PGTypes>
              in: PGInputField<string[], 'string', PGTypes>
            },
            PGTypes
          >
          String: PGInputField<string, 'string', PGTypes>
          __default: PGInputField<string, 'string', PGTypes>
        }>
        age: PGInputField<number, 'int', PGTypes>
        posts: () => PGArgBuilder<
          {
            every: () => PostWhereArgBuilder
          },
          PGTypes
        >
      },
      PGTypes
    >

    type PostWhereArgBuilder = PGArgBuilder<
      {
        AND: () => PGArgBuilder<[PostWhereArgBuilder['value']['fieldMap']], PGTypes>
        title: () => PGArgBuilder<
          {
            equals: PGInputField<string, 'string', PGTypes>
            in: PGInputField<string[], 'string', PGTypes>
          },
          PGTypes
        >
        author: () => UserWhereArgBuilder
      },
      PGTypes
    >

    const userWhere: UserWhereArgBuilder = null as any
    const postWhere: PostWhereArgBuilder = null as any

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
      .build({ type: true, wrap: true })

    expectType<
      TypeEqual<
        typeof userEdited,
        PGInputField<
          PGInput<{
            name: PGInputField<
              | [
                  PGInput<{
                    equals: PGInputField<string | null | undefined, 'string', PGTypes>
                  }>,
                ]
              | null
              | undefined,
              'input',
              PGTypes
            >
            posts: PGInputField<
              PGInput<{
                every: PGInputField<
                  PGInput<{
                    title: PGInputField<
                      PGInput<{
                        equals: PGInputField<string, 'string', PGTypes>
                        in: PGInputField<string[], 'string', PGTypes>
                      }>,
                      'input',
                      PGTypes
                    >
                    author: PGInputField<
                      PGInput<{
                        age: PGInputField<number, 'int', PGTypes>
                      }>,
                      'input',
                      PGTypes
                    >
                  }>,
                  'input',
                  PGTypes
                >
              }>,
              'input',
              PGTypes
            >
          }>,
          'input',
          PGTypes
        >
      >
    >(true)

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
      .build({ type: true })

    expectType<
      TypeEqual<
        typeof postEdited,
        {
          AND: PGInputField<
            [
              PGInput<{
                title: PGInputField<
                  PGInput<{
                    equals: PGInputField<string, 'string', PGTypes>
                    in: PGInputField<string[], 'string', PGTypes>
                  }>,
                  'input',
                  PGTypes
                >
              }>,
            ],
            'input',
            PGTypes
          >
          title: PGInputField<
            PGInput<{
              equals: PGInputField<string, 'string', PGTypes>
              in: PGInputField<string[], 'string', PGTypes>
            }>,
            'input',
            PGTypes
          >
        }
      >
    >(true)
  })
})
