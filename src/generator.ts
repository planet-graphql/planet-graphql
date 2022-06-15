import path from 'path'
import { DMMF } from '@prisma/client/runtime'
import { generatorHandler } from '@prisma/generator-helper'
import _ from 'lodash'
import { Project, Writers } from 'ts-morph'
import { PGError } from './builder/utils'

const { objectType } = Writers

function getEnumTypeName(enumName: string): string {
  return `${enumName}ValuesType`
}

function getModelTypeName(modelName: string): string {
  return `${modelName}FieldMapType`
}

function getTSType(scalarType: string): string {
  switch (scalarType) {
    case 'String':
    case 'Json':
      return 'string'
    case 'Int':
    case 'Float':
      return 'number'
    case 'Boolean':
      return 'boolean'
    case 'BigInt':
      return 'bigint'
    case 'DateTime':
      return 'Date'
    case 'Bytes':
      return 'Buffer'
    case 'Decimal':
      return 'Decimal'
    default:
      throw new PGError(`"${scalarType}" is not supported yet.`, 'GeneratorError')
  }
}

function getPGFieldType(dmmf: DMMF.Field): string {
  let innerType = ''
  switch (dmmf.kind) {
    case 'enum':
      innerType = `PGEnum<${getEnumTypeName(dmmf.type)}>`
      break
    case 'object':
      innerType = `PGObject<${getModelTypeName(dmmf.type)}<Types>, { PrismaModelName: '${
        dmmf.type
      }' }, Types>`
      break
    case 'scalar':
      innerType = `${getTSType(dmmf.type)}`
      break
    default:
      throw new PGError(`"${dmmf.kind}" is not supported.`, 'GeneratorError')
  }
  if (dmmf.isList) {
    innerType = dmmf.kind === 'scalar' ? `${innerType}[]` : `Array<${innerType}>`
  }
  if (!dmmf.isRequired) {
    innerType = `${innerType} | null`
  }
  return `PGOutputField<${innerType}, any, PGOutputFieldOptionsDefault, Types>`
}

export function getInputsTypeProperty(arg: DMMF.SchemaArg): string {
  const nullishSuffix =
    (arg.isNullable ? ' | null' : '') + (arg.isRequired ? '' : ' | undefined')
  const getProperty: (inputType: DMMF.SchemaArgInputType) => string = (inputType) => {
    const listPrefix = inputType.isList ? 'Array<' : ''
    const listSuffix = inputType.isList ? '>' : ''
    if (inputType.location === 'inputObjectTypes') {
      return `() => PGInputFactoryWrapper<${listPrefix}${_.upperFirst(
        inputType.type as string,
      )}Factory<Types>${listSuffix}${nullishSuffix}, Types>`
    }
    if (inputType.location === 'scalar') {
      return `PGInputFactory<${
        inputType.isList
          ? `${
              inputType.type === 'Null' ? 'null' : getTSType(inputType.type as string)
            }[]`
          : inputType.type === 'Null'
          ? 'null'
          : getTSType(inputType.type as string)
      }${nullishSuffix}, '${_.lowerFirst(inputType.type as string)}', Types>`
    }
    if (inputType.location === 'enumTypes') {
      return `PGInputFactory<${
        inputType.isList
          ? `${_.upperFirst(inputType.type as string)}Factory[]`
          : `${_.upperFirst(inputType.type as string)}Factory`
      }${nullishSuffix}, 'enum', Types>`
    }
    return ''
  }

  if (arg.inputTypes.length > 1) {
    const unionObject = arg.inputTypes.reduce<{ [name: string]: string }>(
      (acc, inputType) => {
        if (acc.__default === undefined) acc.__default = getProperty(inputType)
        if (inputType.isList) {
          acc[(inputType.type as string) + 'List'] = getProperty(inputType)
        }
        acc[inputType.type as string] = getProperty(inputType)
        return acc
      },
      {},
    )
    return `PGInputFactoryUnion<{\n${Object.entries(unionObject)
      .map(([key, value]) => {
        return `${key}: ${value}`
      })
      .join(',\n')}\n}>`
  }
  return getProperty(arg.inputTypes[0])
}

export function shapeInputs(
  name: string,
  args: DMMF.SchemaArg[],
): {
  name: string
  type: Array<{
    name: string
    type: string
  }>
  inputTypes: string[]
} {
  return {
    name: `${_.upperFirst(name)}Factory`,
    type: args.map((arg) => ({
      name: arg.name,
      type: getInputsTypeProperty(arg),
    })),
    inputTypes: _.union(
      _.compact(
        args.flatMap((arg) =>
          arg.inputTypes.map((inputType) =>
            inputType.location === 'inputObjectTypes'
              ? `${inputType.type as string}Factory`
              : '',
          ),
        ),
      ),
    ),
  }
}

export function getInputFactories(schema: DMMF.Schema): Array<{
  name: string
  type: Array<{
    name: string
    type: string
  }>
}> {
  const getRecursiveInputs: (parents: DMMF.InputType[]) => void = (parents) => {
    if (parents.length === 0) return
    const inputsType = parents.map((parent) => {
      const result = shapeInputs(parent.name, parent.fields)
      factories.push(result)
      return result
    })
    const extractNewInputsName = inputsType
      .flatMap((t) => t.inputTypes)
      .filter((input) => !factories.map((f) => f.name).includes(input))
    return getRecursiveInputs(getInputObjectTypes(extractNewInputsName, schema))
  }
  const getInputObjectTypes: (
    names: string[],
    schema: DMMF.Schema,
  ) => DMMF.InputType[] = (names, schema) => {
    return schema.inputObjectTypes.prisma.filter((input) =>
      names.includes(`${input.name}Factory`),
    )
  }

  const roots = schema.outputObjectTypes.prisma
    .filter((x) => x.name === 'Query' || x.name === 'Mutation')
    .flatMap((x) => x.fields)
  const factories = roots.map((root) => shapeInputs(root.name, root.args))
  getRecursiveInputs(
    getInputObjectTypes(
      factories.flatMap((f) => f.inputTypes),
      schema,
    ),
  )
  return factories
}

export async function generate(
  dmmf: DMMF.Document,
  outputPath: string,
  prismaImportPath: string,
): Promise<void> {
  const project = new Project()
  const outputFile = project.createSourceFile(outputPath, undefined, { overwrite: true })
  outputFile.addImportDeclaration({
    namedImports: ['Prisma'],
    moduleSpecifier: prismaImportPath,
  })
  outputFile.addImportDeclaration({
    namedImports: ['Decimal'],
    moduleSpecifier: `${prismaImportPath}/runtime`,
  })
  outputFile.addImportDeclaration({
    namedImports: ['PGTypes', 'PGBuilder'],
    moduleSpecifier: '@prismagql/prismagql/lib/types/builder',
  })
  outputFile.addImportDeclaration({
    namedImports: ['PGEnum', 'RequiredNonNullable'],
    moduleSpecifier: '@prismagql/prismagql/lib/types/common',
  })
  outputFile.addImportDeclaration({
    namedImports: ['PGObject', 'PGOutputField', 'PGOutputFieldOptionsDefault'],
    moduleSpecifier: '@prismagql/prismagql/lib/types/output',
  })
  outputFile.addImportDeclaration({
    namedImports: ['PGInputFactoryWrapper', 'PGInputFactoryUnion', 'PGInputFactory'],
    moduleSpecifier: '@prismagql/prismagql/lib/types/input-factory',
  })
  outputFile.addTypeAliases(
    dmmf.datamodel.enums.map((x) => ({
      name: getEnumTypeName(x.name),
      type: `["${x.values.map((v) => v.name).join('", "')}"]`,
    })),
  )
  outputFile.addTypeAliases(
    dmmf.datamodel.models.map((m) => {
      return {
        name: getModelTypeName(m.name),
        // FIXME:
        // I would like to fix the indent that is going wrong.
        // At first glance, it looks like a problem on the ts-morph side.
        type: objectType({
          properties: m.fields.map((f) => ({
            name: f.name,
            type: getPGFieldType(f),
          })),
        }),
        typeParameters: [{ name: 'Types', constraint: 'PGTypes' }],
      }
    }),
  )
  outputFile.addTypeAlias({
    name: 'PGfyResponseEnums',
    type: objectType({
      properties: dmmf.datamodel.enums.map((x) => ({
        name: x.name,
        type: `PGEnum<${getEnumTypeName(x.name)}>`,
      })),
    }),
  })
  outputFile
    .addTypeAlias({
      name: 'PGfyResponseObjects',
      type: objectType({
        properties: dmmf.datamodel.models.map((x) => ({
          name: x.name,
          type: `PGObject<${getModelTypeName(x.name)}<Types>, { PrismaModelName: '${
            x.name
          }' }, Types>`,
        })),
      }),
    })
    .addTypeParameter({
      name: 'Types',
      constraint: 'PGTypes',
    })
  outputFile.addTypeAlias({
    name: 'PGfyResponseModels',
    type: objectType({
      properties: dmmf.datamodel.models.map((x) => ({
        name: x.name,
        type: `RequiredNonNullable<Prisma.${x.name}FindManyArgs>`,
      })),
    }),
  })
  outputFile.addTypeAliases(
    [...dmmf.schema.enumTypes.prisma, ...(dmmf.schema.enumTypes.model ?? [])].map((e) => {
      return {
        name: `${e.name}Factory`,
        type: `PGEnum<[${e.values.map((v) => `'${v}'`).join(', ')}]>`,
      }
    }),
  )
  outputFile.addTypeAliases(
    getInputFactories(dmmf.schema).map((factory) => {
      return {
        name: factory.name,
        typeParameters: [
          {
            name: 'Types',
            constraint: 'PGTypes',
          },
        ],
        type: objectType({
          properties: factory.type,
        }),
      }
    }),
  )
  outputFile
    .addInterface({
      name: 'Inputs',
      properties: dmmf.schema.outputObjectTypes.prisma
        .filter((x) => x.name === 'Query' || x.name === 'Mutation')
        .flatMap((x) =>
          x.fields.map((f) => ({
            name: f.name,
            type: `PGInputFactoryWrapper<${_.upperFirst(f.name)}Factory<Types>, Types>`,
          })),
        ),
    })
    .addTypeParameter({
      name: 'Types',
      constraint: 'PGTypes',
    })
  outputFile
    .addTypeAlias({
      name: 'PGfyResponse',
      type: `T extends PGBuilder<infer U>
? {
   enums: PGfyResponseEnums
   objects: PGfyResponseObjects<U>
   inputs: Inputs<U>
  }
: any`,
    })
    .addTypeParameter({
      name: 'T',
      constraint: 'PGBuilder',
    })
  outputFile.addInterface({
    name: 'PrismaGeneratedType',
    properties: [
      { name: 'Args', type: 'PGfyResponseModels' },
      {
        name: 'PGfy',
        type: `<T extends PGBuilder<any>>(
  builder: T,
  dmmf: DMMF.Document,
) => PGfyResponse<T>`,
      },
    ],
    isExported: true,
  })

  // FIXME:
  // I think it would be easier to test if I just do `emitToMemory()` in generate
  // and saveFiles in the caller as shown below, but for some reason it doesn't work.
  // ```ts
  // const result = project.emitToMemory()
  // await result.saveFiles()
  // ```
  await project.save()
}

export function getPrismaImportPath(
  outputPath: string,
  prismaClientOutputPath?: string,
): string {
  if (
    prismaClientOutputPath === undefined ||
    prismaClientOutputPath.includes('/node_modules/')
  ) {
    return '@prisma/client'
  }
  return path.relative(outputPath, prismaClientOutputPath)
}

generatorHandler({
  onManifest: () => ({
    prettyName: 'PrismaGQL Generator',
    defaultOutput: 'node_modules/@prismagql/prismagql/lib/generated/generated.d.ts',
  }),
  onGenerate: async (options) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const outputPath = options.generator.output!.value
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const prismaClientConfig = options.otherGenerators.find((x) => x.name === 'client')
    const prismaImportPath = getPrismaImportPath(
      outputPath,
      prismaClientConfig?.output?.value,
    )
    await generate(options.dmmf, outputPath, prismaImportPath)
  },
})
