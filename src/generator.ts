import path from 'path'
import { DMMF } from '@prisma/client/runtime'
import { generatorHandler } from '@prisma/generator-helper'
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
      innerType = `PGModel<${getModelTypeName(dmmf.type)}>`
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
  return `PGField<${innerType}>`
}

export async function generate(
  datamodel: DMMF.Datamodel,
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
    namedImports: ['PGEnum', 'PGField', 'PGModel'],
    moduleSpecifier: './pg',
  })
  outputFile.addTypeAliases(
    datamodel.enums.map((x) => ({
      name: getEnumTypeName(x.name),
      type: `["${x.values.map((v) => v.name).join('", "')}"]`,
    })),
  )
  outputFile.addTypeAliases(
    datamodel.models.map((x) => ({
      name: getModelTypeName(x.name),
      // FIXME:
      // I would like to fix the indent that is going wrong.
      // At first glance, it looks like a problem on the ts-morph side.
      type: objectType({
        properties: x.fields.map((f) => ({
          name: f.name,
          type: getPGFieldType(f),
        })),
      }),
    })),
  )
  outputFile.addTypeAlias({
    name: 'PGfyResponseEnums',
    type: objectType({
      properties: datamodel.enums.map((x) => ({
        name: x.name,
        type: `PGEnum<${getEnumTypeName(x.name)}>`,
      })),
    }),
  })
  outputFile.addTypeAlias({
    name: 'PGfyResponseModels',
    type: objectType({
      properties: datamodel.models.map((x) => ({
        name: x.name,
        type: `PGModel<${getModelTypeName(x.name)}, Prisma.${x.name}WhereInput>`,
      })),
    }),
  })
  outputFile.addInterface({
    name: 'PGfyResponse',
    properties: [
      { name: 'enums', type: 'PGfyResponseEnums' },
      { name: 'models', type: 'PGfyResponseModels' },
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
    defaultOutput: 'prismagql/generated.ts',
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
    await generate(options.dmmf.datamodel, outputPath, prismaImportPath)
  },
})
