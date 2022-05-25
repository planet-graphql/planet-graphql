import { expectType, TypeEqual } from 'ts-expect'
import { PGTypes } from './builder'
import { PGInput, PGInputField } from './input'
import {
  PGInputFactoryWrapper,
  PGInputFactoryUnion,
  PGInputFactory,
} from './input-factory'

describe.skip('PGInputFactory', () => {
  it('Type is evaluated correctly even if it contains circular references', () => {
    type UserWhereFactory = PGInputFactoryWrapper<
      {
        AND: () => PGInputFactoryWrapper<[UserWhereFactory['fieldMap']], PGTypes>
        name: PGInputFactoryUnion<{
          StringFilter: () => PGInputFactoryWrapper<
            {
              equals: PGInputFactory<string, 'string', PGTypes>
              in: PGInputFactory<string[], 'string', PGTypes>
            },
            PGTypes
          >
          String: PGInputFactory<string, 'string', PGTypes>
          __default: PGInputFactory<string, 'string', PGTypes>
        }>
        age: PGInputFactory<number, 'int', PGTypes>
        posts: () => PGInputFactoryWrapper<
          {
            every: () => PostWhereFactory
          },
          PGTypes
        >
      },
      PGTypes
    >

    type PostWhereFactory = PGInputFactoryWrapper<
      {
        AND: () => PGInputFactoryWrapper<[PostWhereFactory['fieldMap']], PGTypes>
        title: () => PGInputFactoryWrapper<
          {
            equals: PGInputFactory<string, 'string', PGTypes>
            in: PGInputFactory<string[], 'string', PGTypes>
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
      .build('UserWhere', true)

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
      .build('PostWhere')

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
