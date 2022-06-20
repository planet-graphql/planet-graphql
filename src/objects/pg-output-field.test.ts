import { createPGInputFieldBuilder } from '../builder/input'
import { DefaultScalars } from '../lib/scalars'
import { mergeDefaultOutputField } from '../test-utils'
import { PGTypes } from '../types/builder'
import { createOutputField } from './pg-output-field'

describe('PGOutputField', () => {
  describe('auth', () => {
    // Tests are in `src/features/auth.test.ts`
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
