import { mergeDefaultInputField } from '../test-utils'
import { createInputField } from './pg-input-field'
import type { PGTypes } from '../types/builder'

describe('PGInputField', () => {
  describe('validation', () => {
    // Tests are in `src/features/validation.test.ts`
  })
})

describe('createInputField', () => {
  it('Returns a PGInputField', () => {
    const inputField = createInputField<string, 'string', PGTypes>({
      kind: 'scalar',
      type: 'string',
    })

    expect(inputField).toEqual(
      mergeDefaultInputField({
        kind: 'scalar',
        type: 'string',
      }),
    )
  })
})

describe('convertToGraphQLInputFieldConfig', () => {})

describe('getInputFieldDefaultValue', () => {})
