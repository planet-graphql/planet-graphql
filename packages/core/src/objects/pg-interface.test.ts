import { expectType } from 'ts-expect'
import { getPGBuilder } from '..'
import type { PGTypes } from '../types/builder'
import type { PGOutputField, PGOutputFieldOptionsDefault, PGInterface } from '../types/output'
import type { TypeEqual } from 'ts-expect';

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
