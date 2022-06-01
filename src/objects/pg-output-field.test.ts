import { expectType, TypeEqual } from 'ts-expect'
import { createPGInputFieldBuilder } from '../builder/input'
import { mergeDefaultOutputField } from '../builder/test-utils'
import { DefaultScalars } from '../lib/scalars'
import { PGTypes } from '../types/builder'
import { PGOutputField } from '../types/output'
import { createOutputField } from './pg-output-field'

describe('PGOutputField', () => {
  describe('list', () => {
    it('Arrays any T other than null and undefined', () => {
      type InputField = PGOutputField<string | null, any, undefined, PGTypes>
      type T = ReturnType<InputField['list']>
      expectType<TypeEqual<T, PGOutputField<string[] | null, any, undefined, PGTypes>>>(
        true,
      )
    })

    describe('already arrayed', () => {
      it('Does not change anything', () => {
        type InputField = PGOutputField<string[] | null, any, undefined, PGTypes>
        type T = ReturnType<InputField['list']>
        expectType<TypeEqual<T, PGOutputField<string[] | null, any, undefined, PGTypes>>>(
          true,
        )
      })
    })
  })
})

describe('createOutputField', () => {
  it('Returns a PGOutputField', () => {
    const inputFieldBuilder = createPGInputFieldBuilder<PGTypes>(DefaultScalars)
    const outputField = createOutputField<string, PGTypes>(
      {
        kind: 'scalar',
        type: 'string',
      },
      inputFieldBuilder,
    )

    expect(outputField).toEqual(
      mergeDefaultOutputField({
        kind: 'scalar',
        type: 'string',
      }),
    )
  })
})

describe('convertToGraphQLFieldConfig', () => {})
