import { expectType } from 'tsd'
import { PGTypes } from './builder'
import { PGInput, PGInputField } from './input'
import {
  PGInputFactoryWrapper,
  PGInputFactoryUnion,
  PGInputFactory,
} from './input-factory'

describe('PGInputFactory', () => {
  it('Type is evaluated correctly even if it contains circular references', () => {
    type PGType = PGTypes<{
      Context: { prisma: string }
      PGGeneratedType: { models: {}; enums: {} }
    }>

    type UserWhereFactory = PGInputFactoryWrapper<
      {
        AND: () => PGInputFactoryWrapper<[UserWhereFactory['fieldMap']], PGType>
        name: PGInputFactoryUnion<{
          StringFilter: () => PGInputFactoryWrapper<
            {
              equals: PGInputFactory<string, 'string', PGType>
              in: PGInputFactory<string[], 'string', PGType>
            },
            PGType
          >
          String: PGInputFactory<string, 'string', PGType>
          __default: PGInputFactory<string, 'string', PGType>
        }>
        age: PGInputFactory<number, 'int', PGType>
        posts: () => PGInputFactoryWrapper<
          {
            every: () => PostWhereFactory
          },
          PGType
        >
      },
      PGType
    >

    type PostWhereFactory = PGInputFactoryWrapper<
      {
        AND: () => PGInputFactoryWrapper<[PostWhereFactory['fieldMap']], PGType>
        title: () => PGInputFactoryWrapper<
          {
            equals: PGInputFactory<string, 'string', PGType>
            in: PGInputFactory<string[], 'string', PGType>
          },
          PGType
        >
        author: () => UserWhereFactory
      },
      PGType
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
      PGInputField<
        PGInput<{
          name: PGInputField<
            | [
                PGInput<{
                  equals: PGInputField<string | null | undefined, 'string', PGType>
                }>,
              ]
            | null
            | undefined,
            'input',
            PGType
          >
          posts: PGInputField<
            PGInput<{
              every: PGInputField<
                PGInput<{
                  title: PGInputField<
                    PGInput<{
                      equals: PGInputField<string, 'string', PGType>
                      in: PGInputField<string[], 'string', PGType>
                    }>,
                    'input',
                    PGType
                  >
                  author: PGInputField<
                    PGInput<{
                      age: PGInputField<number, 'int', PGType>
                    }>,
                    'input',
                    PGType
                  >
                }>,
                'input',
                PGType
              >
            }>,
            'input',
            PGType
          >
        }>,
        'input',
        PGType
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
      AND: PGInputField<
        [
          PGInput<{
            title: PGInputField<
              PGInput<{
                equals: PGInputField<string, 'string', PGType>
                in: PGInputField<string[], 'string', PGType>
              }>,
              'input',
              PGType
            >
          }>,
        ]
      >
      title: PGInputField<
        PGInput<{
          equals: PGInputField<string, 'string', PGType>
          in: PGInputField<string[], 'string', PGType>
        }>,
        'input',
        PGType
      >
    }>(postEdited)
  })
})
