import fs from 'fs'
import path from 'path'
import { generatorHandler } from '@prisma/generator-helper'
import _ from 'lodash'
import { Project, VariableDeclarationKind, Writers } from 'ts-morph'
import { PGError } from './builder/utils'
import type { DMMF } from '@prisma/generator-helper'
import type { SourceFile } from 'ts-morph'

const { objectType } = Writers

function getEnumTypeName(enumName: string): string {
  return `${enumName}ValuesType`
}

function getModelTypeName(modelName: string): string {
  return `${modelName}FieldMapType`
}

function getTSType(scalarType: string, inputOrOutput: 'input' | 'output'): string {
  switch (scalarType) {
    case 'String':
      return 'string'
    case 'Json':
      return inputOrOutput === 'input' ? 'PGInputJson' : 'PGJson'
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
      return inputOrOutput === 'input' ? 'PGInputDecimal' : 'PGDecimal'
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
      innerType = `PrismaObjectMap<TObjectRef, Types>['${dmmf.type}']`
      break
    case 'scalar':
      innerType = `${getTSType(dmmf.type, 'output')}`
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
      return `() => PGInputFactory<${listPrefix}${_.upperFirst(
        inputType.type as string,
      )}Factory<Types>${listSuffix}${nullishSuffix}, Types>`
    }
    if (inputType.location === 'scalar') {
      return `PGInputField<${
        inputType.isList
          ? `${
              inputType.type === 'Null'
                ? 'null'
                : getTSType(inputType.type as string, 'input')
            }[]`
          : inputType.type === 'Null'
          ? 'null'
          : getTSType(inputType.type as string, 'input')
      }${nullishSuffix}, '${_.lowerFirst(inputType.type as string)}', Types>`
    }
    if (inputType.location === 'enumTypes') {
      return `PGInputField<${
        inputType.isList
          ? `${_.upperFirst(inputType.type as string)}Factory[]`
          : `${_.upperFirst(inputType.type as string)}Factory`
      }${nullishSuffix}, 'enum', Types>`
    }
    return ''
  }

  const filteredInputTypes = arg.inputTypes.filter((x) => x.type !== 'Null')

  if (filteredInputTypes.length > 1) {
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
  return getProperty(filteredInputTypes[0])
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

export function addImports(sourceFile: SourceFile, prismaImportPath: string): void {
  sourceFile.addImportDeclarations([
    {
      namedImports: ['DMMF'],
      moduleSpecifier: `${prismaImportPath}/runtime`,
      isTypeOnly: true,
    },
    {
      namedImports: ['PGTypes', 'PGBuilder'],
      moduleSpecifier: '@planet-graphql/core/dist/types/builder',
      isTypeOnly: true,
    },
    {
      namedImports: [
        'PGEnum',
        'PGDecimal',
        'PGInputDecimal',
        'PGJson',
        'PGInputJson',
        'TypeOfPGFieldMap',
        'RequiredNonNullable',
      ],
      moduleSpecifier: '@planet-graphql/core/dist/types/common',
      isTypeOnly: true,
    },
    {
      namedImports: ['PGInputField'],
      moduleSpecifier: '@planet-graphql/core/dist/types/input',
      isTypeOnly: true,
    },
    {
      namedImports: ['PGInputFactory', 'PGInputFactoryUnion'],
      moduleSpecifier: '@planet-graphql/core/dist/types/input-factory',
      isTypeOnly: true,
    },
    {
      namedImports: [
        'PGOutputField',
        'PGOutputFieldOptionsDefault',
        'PGObject',
        'PGOutputFieldMap',
        'PGInterface',
        'PGOutputFieldBuilder',
        'ConvertPGInterfacesToFieldMap',
        'PGObjectOptionsDefault',
        'GetPrismaModelNames',
      ],
      moduleSpecifier: '@planet-graphql/core/dist/types/output',
      isTypeOnly: true,
    },
    {
      namedImports: ['PrismaObject'],
      moduleSpecifier: '@planet-graphql/core/dist/types/prisma-converter',
      isTypeOnly: true,
    },
  ])
}

export function addEnumTypes(
  sourceFile: SourceFile,
  dmmfEnums: DMMF.DatamodelEnum[],
): void {
  sourceFile.addTypeAliases(
    dmmfEnums.map((x) => ({
      name: getEnumTypeName(x.name),
      type: `["${x.values.map((v) => v.name).join('", "')}"]`,
    })),
  )

  sourceFile.addTypeAlias({
    name: 'PrismaEnumMap',
    type: objectType({
      properties: dmmfEnums.map((x) => ({
        name: x.name,
        type: `PGEnum<${getEnumTypeName(x.name)}>`,
      })),
    }),
  })
}

export function addModelTypes(sourceFile: SourceFile, dmmfModels: DMMF.Model[]): void {
  sourceFile.addTypeAliases(
    dmmfModels.map((m) => {
      return {
        name: getModelTypeName(m.name),
        type: objectType({
          properties: m.fields.map((f) => ({
            name: f.name,
            type: getPGFieldType(f),
          })),
        }),
        typeParameters: [
          { name: 'TObjectRef', constraint: '{ [key: string]: Function | undefined }' },
          { name: 'Types', constraint: 'PGTypes' },
        ],
      }
    }),
  )

  sourceFile
    .addTypeAlias({
      name: 'PrismaObjectMap',
      type: objectType({
        properties: dmmfModels.map((x) => ({
          name: x.name,
          type: `PrismaObject<TObjectRef, '${x.name}', PGObject<${getModelTypeName(
            x.name,
          )}<TObjectRef, Types>, undefined, { PrismaModelName: '${x.name}' }, Types>>`,
        })),
      }),
    })
    .addTypeParameters([
      { name: 'TObjectRef', constraint: '{ [key: string]: Function | undefined }' },
      { name: 'Types', constraint: 'PGTypes' },
    ])
}

export function addInputFactoryTypes(
  sourceFile: SourceFile,
  dmmfSchema: DMMF.Schema,
): void {
  sourceFile.addTypeAliases(
    [...dmmfSchema.enumTypes.prisma, ...(dmmfSchema.enumTypes.model ?? [])].map((e) => {
      return {
        name: `${e.name}Factory`,
        type: `PGEnum<[${e.values.map((v) => `'${v}'`).join(', ')}]>`,
      }
    }),
  )

  sourceFile.addTypeAliases(
    getInputFactories(dmmfSchema).map((factory) => {
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

  sourceFile
    .addInterface({
      name: 'PrismaInputFactoryMap',
      properties: dmmfSchema.outputObjectTypes.prisma
        .filter((x) => x.name === 'Query' || x.name === 'Mutation')
        .flatMap((x) =>
          x.fields.map((f) => ({
            name: f.name,
            type: `PGInputFactory<${_.upperFirst(f.name)}Factory<Types>, Types>`,
          })),
        ),
    })
    .addTypeParameter({
      name: 'Types',
      constraint: 'PGTypes',
    })
}

export function copyPrismaConverterInterfaces(sourceFile: SourceFile): void {
  const project = new Project()
  const file = project.addSourceFileAtPath(
    path.join(__dirname, '../src/types/prisma-converter.ts'),
  )
  const converterInterface = file.getInterfaceOrThrow('PGPrismaConverter')
  const converterBuilderType = file.getTypeAliasOrThrow('InitPGPrismaConverter')

  sourceFile.addInterface({ ...converterInterface.getStructure(), isExported: false })
  sourceFile.addTypeAlias({ ...converterBuilderType.getStructure(), isExported: false })
}

export function addPrismaTypes(sourceFile: SourceFile, dmmfModels: DMMF.Model[]): void {
  sourceFile.addTypeAlias({
    name: 'PrismaArgsMap',
    type: objectType({
      properties: dmmfModels.map((x) => ({
        name: x.name,
        type: `RequiredNonNullable<Prisma.${x.name}FindManyArgs>`,
      })),
    }),
  })

  sourceFile.addTypeAlias({
    name: 'PrismaTypes',
    type: objectType({
      properties: [
        {
          name: 'Args',
          type: 'PrismaArgsMap',
        },
      ],
    }),
    isExported: true,
  })
}

export function addConsts(sourceFile: SourceFile): void {
  sourceFile.addVariableStatements([
    {
      declarationKind: VariableDeclarationKind.Const,
      declarations: [
        {
          name: 'dmmf',
          type: 'DMMF.Document',
        },
      ],
      isExported: true,
    },
    {
      declarationKind: VariableDeclarationKind.Const,
      declarations: [
        {
          name: 'getPGPrismaConverter',
          type: 'InitPGPrismaConverter',
        },
      ],
      isExported: true,
    },
  ])
}

export function createJSFile(outputPath: string, dmmf: DMMF.Document): void {
  const filePath = `${outputPath}/index.js`
  const fileContent = `Object.defineProperty(exports, '__esModule', { value: true })

const {
  getInternalPGPrismaConverter,
} = require('@planet-graphql/core/dist/prisma-converter')

exports.getPGPrismaConverter = (builder, dmmf) =>
  getInternalPGPrismaConverter(builder, dmmf)

exports.dmmf = JSON.parse('${JSON.stringify(dmmf)}')
`
  fs.writeFileSync(filePath, fileContent, 'utf8')
}

export function createPackageJsonFile(outputPath: string): void {
  const filePath = `${outputPath}/package.json`
  const fileContent = `{
  "name": ".planet-graphql",
  "main": "index.js",
  "types": "index.d.ts"
}
`
  fs.writeFileSync(filePath, fileContent, 'utf8')
}

export async function generate(
  dmmf: DMMF.Document,
  outputPath: string,
  prismaImportPath: string,
): Promise<void> {
  const project = new Project()
  const typeFilePath = `${outputPath}/index.d.ts`
  const typeFile = project.createSourceFile(typeFilePath, undefined, { overwrite: true })

  addImports(typeFile, prismaImportPath)
  addEnumTypes(typeFile, dmmf.datamodel.enums)
  addModelTypes(typeFile, dmmf.datamodel.models)
  addInputFactoryTypes(typeFile, dmmf.schema)
  copyPrismaConverterInterfaces(typeFile)
  addPrismaTypes(typeFile, dmmf.datamodel.models)
  addConsts(typeFile)
  typeFile.formatText()

  // FIXME:
  // I think it would be easier to test if I just do `emitToMemory()` in generate
  // and saveFiles in the caller as shown below, but for some reason it doesn't work.
  // ```ts
  // const result = project.emitToMemory()
  // await result.saveFiles()
  // ```
  await project.save()

  createJSFile(outputPath, dmmf)
  createPackageJsonFile(outputPath)
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
    prettyName: 'PlanetGraphQL Generator',
    defaultOutput: 'node_modules/@planet-graphql/core/dist/generated',
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
