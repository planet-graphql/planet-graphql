import { GraphQLInterfaceType } from 'graphql'
import _ from 'lodash'
import { convertToGraphQLFieldConfig } from './pg-output-field'
import type { GraphqlTypeRef, PGBuilder } from '../types/builder'
import type { PGInterface, PGOutputFieldMap } from '../types/output'

export function createPGInterface<T extends PGOutputFieldMap>(
  name: string,
  fieldMap: T,
): PGInterface<T> {
  return {
    name,
    kind: 'interface' as const,
    value: {
      fieldMap,
    },
  }
}

export function convertToGraphQLInterface(
  pgInterface: PGInterface<PGOutputFieldMap>,
  builder: PGBuilder<any>,
  graphqlTypeRef: GraphqlTypeRef,
): GraphQLInterfaceType {
  return new GraphQLInterfaceType({
    name: pgInterface.name,
    fields: () =>
      _.mapValues(pgInterface.value.fieldMap, (field, fieldName) =>
        convertToGraphQLFieldConfig(
          field,
          fieldName,
          pgInterface.name,
          builder,
          graphqlTypeRef,
        ),
      ),
  })
}
