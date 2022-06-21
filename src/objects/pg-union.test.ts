import { expectType, TypeEqual } from 'ts-expect'
import { getPGBuilder } from '..'
import { PGTypes } from '../types/builder'
import {
  PGOutputField,
  PGObject,
  PGUnion,
  PGOutputFieldOptionsDefault,
  PGObjectOptionsDefault,
} from '../types/output'

describe('PGUnion', () => {
  describe('builder', () => {
    it('Returns a correctly typed PGUnion', () => {
      const builder = getPGBuilder()()
      const objectA = builder.object({
        name: 'A',
        fields: (b) => ({
          id: b.id(),
        }),
      })
      const objectB = builder.object({
        name: 'B',
        fields: (b) => ({
          int: b.int(),
        }),
      })
      const union = builder.union({
        name: 'SomeUnion',
        types: [objectA, objectB],
        resolveType: (value) => {
          if ('id' in value) {
            return objectA
          }
          if ('int' in value) {
            return objectB
          }
          return null
        },
      })

      type T = typeof union
      expectType<
        TypeEqual<
          T,
          PGUnion<
            Array<
              | PGObject<
                  {
                    id: PGOutputField<string, any, PGOutputFieldOptionsDefault, PGTypes>
                  },
                  undefined,
                  PGObjectOptionsDefault<PGTypes>,
                  PGTypes
                >
              | PGObject<
                  {
                    int: PGOutputField<number, any, PGOutputFieldOptionsDefault, PGTypes>
                  },
                  undefined,
                  PGObjectOptionsDefault<PGTypes>,
                  PGTypes
                >
            >
          >
        >
      >(true)
    })
  })
})
