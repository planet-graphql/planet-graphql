import { expectType } from 'ts-expect'
import type { PGTypes } from './builder'
import type { PGInput, PGInputField } from './input'
import type { PGInputFactory, PGInputFactoryUnion } from './input-factory'
import type { TypeEqual } from 'ts-expect'

describe.skip('PGInputFactory', () => {
  it('Type is evaluated correctly even if it contains circular references', () => {
    type UserWhereFactory = PGInputFactory<
      {
        AND: () => PGInputFactory<[UserWhereFactory['value']['fieldMap']], PGTypes>
        name: PGInputFactoryUnion<{
          StringFilter: () => PGInputFactory<
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
        posts: () => PGInputFactory<
          {
            every: () => PostWhereFactory
          },
          PGTypes
        >
      },
      PGTypes
    >

    type PostWhereFactory = PGInputFactory<
      {
        AND: () => PGInputFactory<[PostWhereFactory['value']['fieldMap']], PGTypes>
        title: () => PGInputFactory<
          {
            equals: PGInputField<string, 'string', PGTypes>
            in: PGInputField<string[], 'string', PGTypes>
          },
          PGTypes
        >
        author: () => UserWhereFactory
      },
      PGTypes
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
      .build({ wrap: true })

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
      .build()

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
