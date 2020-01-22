import { addProperty } from '@tsfun/object'
import { ensureArray, concatIterable, getIndent } from '@ts-schema-autogen/utils'
import { listSymbolInstruction } from './instruction'
import { ensureOutputDescriptorArray } from './output-descriptor'
import { ConfigParseError, ConfigLoader } from './load-config'

import {
  Program,
  Definition,
  Instruction,
  SymbolInstruction,
  OutputDescriptor,
  TJS,
  FSX
} from '@ts-schema-autogen/types'

import {
  MultipleFailures,
  OutputFileConflict,
  FileWritingFailure,
  FileReadingFailure,
  TextParsingFailure,
  CircularReference,
  Success
} from '@ts-schema-autogen/status'

export interface FileWritingInstruction<Definition> {
  readonly schema: Definition
  readonly instruction: SymbolInstruction
}

export function * generateUnit<
  Prog = Program,
  Def = Definition
> (param: generateUnit.Param<Prog, Def>): generateUnit.Return<Def> {
  const { tjs, instruction } = param
  const { buildGenerator, getProgramFromFiles } = tjs
  if (!instruction.input) return
  const program = getProgramFromFiles(
    ensureArray(instruction.input),
    instruction.compilerOptions
  )
  const generator = buildGenerator(program, instruction.schemaSettings)

  for (const symbolInstruction of listSymbolInstruction(instruction)) {
    const schema = generator.getSchemaForSymbol(symbolInstruction.symbol)
    yield { instruction: symbolInstruction, schema }
  }
}

export namespace generateUnit {
  export interface Param<Program, Definition> {
    readonly tjs: TJS.Mod<Program, Definition>
    readonly instruction: Instruction
  }

  export interface Return<Definition>
  extends Generator<FileWritingInstruction<Definition>, void, unknown> {}
}

export const serialize = (schema: any, { indent }: OutputDescriptor) =>
  JSON.stringify(schema, undefined, getIndent(indent))

export async function writeSchemaFiles (param: writeSchemaFiles.Param): Promise<writeSchemaFiles.Return> {
  const { fsx, instruction } = param
  const duplicationCheckingArray: OutputDescriptor[] = []
  const duplicationMap = new Map<string, OutputDescriptor[]>()
  const writeFuncs: Array<() => Promise<void>> = []

  for (const { schema, instruction: { output } } of instruction) {
    const descriptors = ensureOutputDescriptorArray(output)

    for (const desc of descriptors) {
      const { filename } = desc

      const duplicatedFiles = descriptors.filter(x => x.filename === filename)
      if (duplicatedFiles.length > 1) {
        duplicationMap.set(filename, duplicatedFiles)
        continue
      }

      duplicationCheckingArray.push(desc)
      writeFuncs.push(() => fsx.writeFile(filename, serialize(schema, desc)))
    }
  }

  if (duplicationMap.size) return new OutputFileConflict(duplicationMap)

  const writeErrors: any[] = []
  await Promise.all(
    writeFuncs.map(fn => fn().catch(error => writeErrors.push(error)))
  )
  if (writeErrors.length) return new FileWritingFailure(writeErrors)

  return new Success(undefined)
}

export namespace writeSchemaFiles {
  export interface Param {
    readonly fsx: FSX.Mod
    readonly instruction: Iterable<FileWritingInstruction<any>>
  }

  export type Return =
    OutputFileConflict |
    FileWritingFailure |
    Success<void>
}

export class SchemaWriter<Prog = Program, Def = Definition> {
  constructor (
    private readonly param: SchemaWriter.ConstructorParam<Prog, Def>
  ) {}

  private readonly loader = new ConfigLoader(this.param)

  private static joinCfgRes<Def> (list: Iterable<SchemaWriter.SingleConfigReturn<Def>>) {
    const errors = []
    let instruction: Iterable<FileWritingInstruction<Def>> = []

    for (const item of list) {
      if (item.code) {
        errors.push(item)
      } else {
        instruction = concatIterable(instruction, item.value)
      }
    }

    return { errors, instruction }
  }

  public async singleConfig (configPath: string): Promise<SchemaWriter.SingleConfigReturn<Def>> {
    const config = await this.loader.loadConfig(configPath)
    if (config.code) return config
    const writeInstruction = generateUnit(
      addProperty(this.param, 'instruction', config.value.instruction)
    )
    return new Success(writeInstruction)
  }

  public async writeSchemas (configPaths: readonly string[]): Promise<SchemaWriter.WriteSchemaReturn> {
    const { errors, instruction } = SchemaWriter.joinCfgRes(
      await Promise.all(configPaths.map(x => this.singleConfig(x)))
    )
    if (errors.length) return new MultipleFailures(errors)

    return writeSchemaFiles({
      fsx: this.param.fsx,
      instruction
    })
  }
}

export namespace SchemaWriter {
  export interface ConstructorParam<Program, Definition> extends ConfigLoader.ConstructorParam {
    readonly tjs: TJS.Mod<Program, Definition>
  }

  export type SingleConfigReturn<Definition> =
    FileReadingFailure |
    FileWritingFailure |
    TextParsingFailure<ConfigParseError[]> |
    CircularReference<string[]> |
    OutputFileConflict |
    Success<Generator<FileWritingInstruction<Definition>, void>>

  type SingleConfigFailure = Exclude<SingleConfigReturn<never>, Success<any>>
  export type WriteSchemaReturn =
    MultipleFailures<SingleConfigFailure[]> |
    OutputFileConflict |
    FileWritingFailure |
    Success<void>
}
