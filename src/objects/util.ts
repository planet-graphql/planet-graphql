import { GraphQLInputType, GraphQLList, GraphQLNonNull, GraphQLOutputType } from 'graphql'
import { GraphqlTypeRef, PGBuilder } from '../types/builder'
import { PGInputField } from '../types/input'
import { PGOutputField } from '../types/output'
import { convertToGraphQLInputObject } from './pg-input'
import { convertToGraphQLObject } from './pg-object'

export function getGraphQLFieldConfigType<
  T extends PGInputField<any> | PGOutputField<any>,
>(
  pgField: T,
  builder: PGBuilder<any>,
  graphqlTypeRef: GraphqlTypeRef,
): T extends PGInputField<any> ? GraphQLInputType : GraphQLOutputType {
  const cache = builder.cache()
  const { enums, objects, inputs } = graphqlTypeRef()
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
      const pgInputOrPgOutput = pgField.value.type()
      const isPGInput = 'default' in pgField
      if (isPGInput) {
        // NOTE:
        // The reason for considering the case where `inputs[name]` and `outputs[name]` are
        // undefined is that PGOutput/PGInput may be generated only after field.value.type() is executed.
        // An example is the following pattern:
        // ```ts
        // pg.mutation('createUser', (f) =>
        //   f
        //     .object(() => user)
        //     .args(f) => ({
        //       input: f.input(() =>
        //         pg.input({
        //           name: 'CreateUserInput',
        //           fields: (f) => (f) => ({
        //             name: f.string(),
        //           }),
        //         }),
        //       ),
        //     }))
        //     ...
        // )
        // ```
        if (inputs[pgInputOrPgOutput.name] !== undefined) {
          type = inputs[pgInputOrPgOutput.name]
        } else {
          type = convertToGraphQLInputObject(pgInputOrPgOutput, builder, graphqlTypeRef)
          inputs[pgInputOrPgOutput.name] = type
        }
      } else {
        if (objects[pgInputOrPgOutput.name] !== undefined) {
          type = objects[pgInputOrPgOutput.name]
        } else {
          type = convertToGraphQLObject(pgInputOrPgOutput, builder, graphqlTypeRef)
          objects[pgField.value.type().name] = type
        }
      }
    }
  }
  if (!pgField.value.isNullable && !pgField.value.isOptional) {
    type = new GraphQLNonNull(type)
  }
  if (pgField.value.isList) {
    type =
      !pgField.value.isNullable || !pgField.value.isOptional
        ? new GraphQLNonNull(new GraphQLList(type))
        : new GraphQLList(type)
  }
  return type
}
