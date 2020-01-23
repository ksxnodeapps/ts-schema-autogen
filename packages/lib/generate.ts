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

/** Instruction created by {@link generateUnit} and used by {@link SchemaWriter} to write schema files */
export interface FileWritingInstruction<Definition> {
  readonly schema: Definition
  readonly instruction: SymbolInstruction
}

/** Create a {@link FileWritingInstruction} from an `Instruction` */
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
    /** `typescript-json-schema` module to convert TypeScript types into JSON schemas */
    readonly tjs: TJS.Mod<Program, Definition>

    /** Instruction that tells types, input, and output */
    readonly instruction: Instruction
  }

  export interface Return<Definition>
  extends Generator<FileWritingInstruction<Definition>, void, unknown> {}
}

export const serialize = (schema: any, { indent }: OutputDescriptor) =>
  JSON.stringify(schema, undefined, getIndent(indent))

/** Write schema data to output files according to a list of {@link FileWritingInstruction} */
export async function writeSchemaFiles (param: writeSchemaFiles.Param): Promise<writeSchemaFiles.Return> {
  const { fsx, instruction } = param
  const duplicationCheckingArray: OutputDescriptor[] = []
  const duplicationMap = new Map<string, OutputDescriptor[]>()
  const writeFuncs: Array<() => Promise<unknown>> = []
  const writeErrors: FileWritingFailure[] = []

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
      writeFuncs.push(
        () => fsx
          .writeFile(filename, serialize(schema, desc))
          .catch(error => writeErrors.push(new FileWritingFailure(filename, error)))
      )
    }
  }

  if (duplicationMap.size) return new OutputFileConflict(duplicationMap)

  await Promise.all(writeFuncs.map(fn => fn()))
  if (writeErrors.length) return new MultipleFailures(writeErrors)

  return new Success(undefined)
}

export namespace writeSchemaFiles {
  export interface Param {
    /** `fs-extra` module to write schema files */
    readonly fsx: FSX.Mod

    /** List of writing instructions */
    readonly instruction: Iterable<FileWritingInstruction<any>>
  }

  export type Return =
    OutputFileConflict |
    MultipleFailures<FileWritingFailure[]> |
    Success<void>
}

/** Write schema files according to one or multiple configs */
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

  /**
   * Write schemas according to one config file
   * @param configPath Path to the config file
   */
  public async singleConfig (configPath: string): Promise<SchemaWriter.SingleConfigReturn<Def>> {
    const config = await this.loader.loadConfig(configPath)
    if (config.code) return config
    const writeInstruction = generateUnit(
      addProperty(this.param, 'instruction', config.value.instruction)
    )
    return new Success(writeInstruction)
  }

  /**
   * Write schemas according to multiple config files
   * @param configPaths List of paths to config files
   */
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
    /** `typescript-json-schema` module to convert TypeScript types into JSON schemas */
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
