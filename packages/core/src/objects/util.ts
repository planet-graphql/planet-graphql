import { GraphQLList, GraphQLNonNull } from 'graphql'
import { convertToGraphQLInputObject } from './pg-input'
import { convertToGraphQLInterface } from './pg-interface'
import { convertToGraphQLObject } from './pg-object'
import { convertToGraphQLUnion } from './pg-union'
import type { GraphqlTypeRef, PGBuilder } from '../types/builder'
import type { PGInput, PGInputField } from '../types/input'
import type { PGInterface, PGObject, PGOutputField, PGUnion } from '../types/output'
import type { GraphQLInputType, GraphQLOutputType } from 'graphql';

export function getGraphQLFieldConfigType<
  T extends PGInputField<any> | PGOutputField<any>,
>(
  pgField: T,
  builder: PGBuilder<any>,
  graphqlTypeRef: GraphqlTypeRef,
): T extends PGInputField<any> ? GraphQLInputType : GraphQLOutputType {
  const cache = builder.cache()
  const { enums, objects, interfaces, unions, inputs } = graphqlTypeRef()
  let type: any
  switch (pgField.value.kind) {
    case 'enum': {
      type = enums[pgField.value.type.name]
      break
    }
    case 'scalar': {
      type = cache.scalar[pgField.value.type].scalar
      break
    }
    case 'object': {
      const pgType: PGObject<any> | PGInterface<any> | PGUnion<any> | PGInput<any> =
        pgField.value.type()
      switch (pgType.kind) {
        case 'object': {
          type =
            objects[pgType.name] ??
            convertToGraphQLObject(pgType, builder, graphqlTypeRef)
          objects[pgType.name] = type
          break
        }
        case 'interface': {
          type =
            interfaces[pgType.name] ??
            convertToGraphQLInterface(pgType, builder, graphqlTypeRef)
          interfaces[pgType.name] = type
          break
        }
        case 'union': {
          type = unions[pgType.name] ?? convertToGraphQLUnion(pgType, graphqlTypeRef)
          unions[pgType.name] = type
          break
        }
        case 'input': {
          type =
            inputs[pgType.name] ??
            convertToGraphQLInputObject(pgType, builder, graphqlTypeRef)
          inputs[pgType.name] = type
        }
      }
    }
  }
  if (!pgField.value.isNullable && !pgField.value.isOptional) {
    type = new GraphQLNonNull(type)
  }
  if (pgField.value.isList) {
    type =
      !pgField.value.isNullable && !pgField.value.isOptional
        ? new GraphQLNonNull(new GraphQLList(type))
        : new GraphQLList(type)
  }
  return type
}
