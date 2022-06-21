import { expectType, TypeEqual } from 'ts-expect'
import { getPGBuilder } from '..'
import { PGTypes } from '../types/builder'
import { PGOutputField, PGOutputFieldOptionsDefault, PGInterface } from '../types/output'

describe('PGInterface', () => {
  describe('builder', () => {
    it('Returns a correctly typed PGInterface', () => {
      const builder = getPGBuilder()()
      const someInterface = builder.interface({
        name: 'SomeInterface',
        fields: (b) => ({
          id: b.id(),
        }),
      })

      type T = typeof someInterface
      expectType<
        TypeEqual<
          T,
          PGInterface<{
            id: PGOutputField<string, any, PGOutputFieldOptionsDefault, PGTypes>
          }>
        >
      >(true)
    })
  })
})
