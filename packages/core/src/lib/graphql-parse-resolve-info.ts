/**
 * # The MIT License (MIT)
 *
 * Copyright © `2018` Benjie Gillam
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the “Software”), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
import {
  getNamedType,
  isCompositeType,
  GraphQLObjectType,
  GraphQLUnionType,
} from 'graphql'
import { getArgumentValues } from 'graphql/execution/values'
import type {
  GraphQLResolveInfo,
  GraphQLField,
  GraphQLCompositeType,
  GraphQLInterfaceType,
  GraphQLType,
  GraphQLNamedType,
  ASTNode,
  FieldNode,
  SelectionNode,
  FragmentSpreadNode,
  InlineFragmentNode,
  NamedTypeNode,
} from 'graphql'

type mixed = Record<string, any> | string | number | boolean | undefined | null

export interface FieldsByTypeName {
  [str: string]: {
    [str: string]: ResolveTree
  }
}

export interface ResolveTree {
  name: string
  alias: string
  args: {
    [str: string]: mixed
  }
  fieldsByTypeName: FieldsByTypeName
  loc: {
    start: number
    end: number
  }
}

function getArgVal(resolveInfo: GraphQLResolveInfo, argument: any): any {
  if (argument.kind === 'Variable') {
    return resolveInfo.variableValues[argument.name.value]
  } else if (argument.kind === 'BooleanValue') {
    return argument.value
  }
}

function argNameIsIf(arg: any): boolean {
  return arg?.name !== undefined ? arg.name.value === 'if' : false
}

function skipField(
  resolveInfo: GraphQLResolveInfo,
  { directives = [] }: SelectionNode,
): boolean {
  let skip = false
  for (const directive of directives) {
    const directiveName = directive.name.value
    if (Array.isArray(directive.arguments)) {
      const ifArgumentAst = directive.arguments.find((x) => argNameIsIf(x))
      if (ifArgumentAst !== undefined) {
        const argumentValueAst = ifArgumentAst.value
        if (directiveName === 'skip') {
          skip = skip || getArgVal(resolveInfo, argumentValueAst)
        } else if (directiveName === 'include') {
          // eslint-disable-next-line no-extra-boolean-cast
          skip = skip || !Boolean(getArgVal(resolveInfo, argumentValueAst))
        }
      }
    }
  }
  return skip
}

// Originally based on https://github.com/tjmehta/graphql-parse-fields

export function getAliasFromResolveInfo(resolveInfo: GraphQLResolveInfo): string {
  const asts: readonly FieldNode[] =
    // @ts-expect-error Property 'fieldASTs' does not exist on type 'GraphQLResolveInfo'.
    resolveInfo.fieldNodes ?? resolveInfo.fieldASTs
  for (let i = 0, l = asts.length; i < l; i++) {
    const val = asts[i]
    if (val.kind === 'Field') {
      const alias = val.alias?.value ?? val.name.value
      if (alias !== undefined) {
        return alias
      }
    }
  }
  throw new Error('Could not determine alias?!')
}

export interface ParseOptions {
  keepRoot?: boolean
  deep?: boolean
}

export function parseResolveInfo(
  resolveInfo: GraphQLResolveInfo,
  options: ParseOptions = {},
): ResolveTree | FieldsByTypeName | null | undefined {
  const fieldNodes: readonly FieldNode[] =
    // @ts-expect-error Property 'fieldASTs' does not exist on type 'GraphQLResolveInfo'.
    resolveInfo.fieldNodes ?? resolveInfo.fieldASTs

  const { parentType } = resolveInfo
  if (fieldNodes === undefined) {
    throw new Error('No fieldNodes provided!')
  }
  if (options.keepRoot == null) {
    options.keepRoot = false
  }
  if (options.deep == null) {
    options.deep = true
  }
  const tree = fieldTreeFromAST(fieldNodes, resolveInfo, {}, options, parentType)
  if (!options.keepRoot) {
    const typeKey = firstKey(tree)
    if (typeKey === undefined) {
      return null
    }
    const fields = tree[typeKey]
    const fieldKey = firstKey(fields)
    if (fieldKey === undefined) {
      return null
    }
    return fields[fieldKey]
  }
  return tree
}

function getFieldFromAST<TContext>(
  ast: ASTNode,
  parentType: GraphQLCompositeType,
): GraphQLField<GraphQLCompositeType, TContext> | undefined {
  if (ast.kind === 'Field') {
    const fieldNode: FieldNode = ast
    const fieldName = fieldNode.name.value
    if (!(parentType instanceof GraphQLUnionType)) {
      const type: GraphQLObjectType | GraphQLInterfaceType = parentType
      return type.getFields()[fieldName]
    } else {
      // XXX: TODO: Handle GraphQLUnionType
    }
  }
  return undefined
}

function fieldTreeFromAST<T extends SelectionNode>(
  inASTs: readonly T[] | T,
  resolveInfo: GraphQLResolveInfo,
  initTree: FieldsByTypeName,
  options: ParseOptions,
  parentType: GraphQLCompositeType,
  depth = '',
): FieldsByTypeName {
  const { variableValues } = resolveInfo
  const fragments = resolveInfo.fragments ?? {}
  const asts: readonly T[] = Array.isArray(inASTs) ? inASTs : [inASTs]
  if (initTree[parentType.name] === undefined) {
    initTree[parentType.name] = {}
  }
  return asts.reduce((tree, selectionVal: SelectionNode, idx) => {
    if (skipField(resolveInfo, selectionVal)) {
      // skip field
    } else if (selectionVal.kind === 'Field') {
      const val: FieldNode = selectionVal
      const name = val.name.value
      const isReserved = name[0] === '_' && name[1] === '_' && name !== '__id'
      if (!isReserved) {
        const alias: string = val.alias?.value ?? name
        const field = getFieldFromAST(val, parentType)
        if (field == null) {
          return tree
        }
        const fieldGqlTypeOrUndefined = getNamedType(field.type)
        if (fieldGqlTypeOrUndefined === undefined) {
          return tree
        }
        const fieldGqlType: GraphQLNamedType = fieldGqlTypeOrUndefined
        // FIXME: delete any
        const args: any = getArgumentValues(field as any, val, variableValues) ?? {}
        if (tree[parentType.name][alias] === undefined) {
          const newTreeRoot: ResolveTree = {
            name,
            alias,
            args,
            fieldsByTypeName: isCompositeType(fieldGqlType)
              ? {
                  [fieldGqlType.name]: {},
                }
              : {},
            loc: {
              start: selectionVal.loc?.start ?? 0,
              end: selectionVal.loc?.end ?? 0,
            },
          }
          tree[parentType.name][alias] = newTreeRoot
        }
        const selectionSet = val.selectionSet
        if (
          selectionSet != null &&
          options.deep === true &&
          isCompositeType(fieldGqlType)
        ) {
          const newParentType: GraphQLCompositeType = fieldGqlType
          fieldTreeFromAST(
            selectionSet.selections,
            resolveInfo,
            tree[parentType.name][alias].fieldsByTypeName,
            options,
            newParentType,
            `${depth ?? ''}  `,
          )
        } else {
          // No fields to add
        }
      }
    } else if (selectionVal.kind === 'FragmentSpread' && options.deep === true) {
      const val: FragmentSpreadNode = selectionVal
      const name = val.name.value
      const fragment = fragments[name]
      let fragmentType: GraphQLNamedType | null | undefined = parentType
      if (fragment.typeCondition !== undefined) {
        fragmentType = getType(resolveInfo, fragment.typeCondition)
      }
      if (fragmentType != null && isCompositeType(fragmentType)) {
        const newParentType: GraphQLCompositeType = fragmentType
        fieldTreeFromAST(
          fragment.selectionSet.selections,
          resolveInfo,
          tree,
          options,
          newParentType,
          `${depth ?? ''}  `,
        )
      }
    } else if (selectionVal.kind === 'InlineFragment' && options.deep === true) {
      const val: InlineFragmentNode = selectionVal
      const fragment = val
      let fragmentType: GraphQLNamedType | null | undefined = parentType
      if (fragment.typeCondition != null) {
        fragmentType = getType(resolveInfo, fragment.typeCondition)
      }
      if (fragmentType != null && isCompositeType(fragmentType)) {
        const newParentType: GraphQLCompositeType = fragmentType
        fieldTreeFromAST(
          fragment.selectionSet.selections,
          resolveInfo,
          tree,
          options,
          newParentType,
          `${depth ?? ''}  `,
        )
      }
    }
    // Ref: https://github.com/graphile/postgraphile/pull/342/files#diff-d6702ec9fed755c88b9d70b430fda4d8R148
    return tree
  }, initTree)
}

const hasOwnProperty = Object.prototype.hasOwnProperty
function firstKey(obj: Record<string, unknown>): string | undefined {
  for (const key in obj) {
    if (hasOwnProperty.call(obj, key)) {
      return key
    }
  }
}

function getType(
  resolveInfo: GraphQLResolveInfo,
  typeCondition: NamedTypeNode,
): GraphQLNamedType | undefined {
  const { schema } = resolveInfo
  const { kind, name } = typeCondition
  if (kind === 'NamedType') {
    const typeName = name.value
    return schema.getType(typeName)
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function simplifyParsedResolveInfoFragmentWithType(
  parsedResolveInfoFragment: ResolveTree,
  type: GraphQLType,
) {
  const { fieldsByTypeName } = parsedResolveInfoFragment
  const fields = {}
  const strippedType = getNamedType(type)
  if (isCompositeType(strippedType)) {
    Object.assign(fields, fieldsByTypeName[strippedType.name])
    if (strippedType instanceof GraphQLObjectType) {
      const objectType: GraphQLObjectType = strippedType
      // GraphQL ensures that the subfields cannot clash, so it's safe to simply overwrite them
      for (const anInterface of objectType.getInterfaces()) {
        Object.assign(fields, fieldsByTypeName[anInterface.name])
      }
    }
  }
  return {
    ...parsedResolveInfoFragment,
    fields,
  }
}

export const parse = parseResolveInfo
export const simplify = simplifyParsedResolveInfoFragmentWithType
export const getAlias = getAliasFromResolveInfo
