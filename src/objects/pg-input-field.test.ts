import { mergeDefaultInputField } from '../builder/test-utils'
import { PGTypes } from '../types/builder'
import { createInputField } from './pg-input-field'

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
