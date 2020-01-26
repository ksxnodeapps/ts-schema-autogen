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
  TJS
} from '@ts-schema-autogen/types'

import {
  Failure,
  MultipleFailures,
  OutputFileConflict,
  FileWritingFailure,
  FileReadingFailure,
  TextParsingFailure,
  CircularReference,
  OutdatedFile,
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

  if (!generator) throw new Error('Failed to build generator')

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
  JSON.stringify(schema, undefined, getIndent(indent)) + '\n'

/** Call a function on a list of {@link FileWritingInstruction} */
export async function processWriteInstructions<ActFailure extends Failure<any>> (
  param: processWriteInstructions.Param<ActFailure>
): Promise<processWriteInstructions.Return<ActFailure>> {
  const { act, instruction } = param
  const duplicationCheckingArray: OutputDescriptor[] = []
  const duplicationMap = new Map<string, OutputDescriptor[]>()
  const actFuncs: Array<() => Promise<unknown>> = []
  const actErrors: Array<ActFailure | FileWritingFailure> = []

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
      actFuncs.push(
        () => act(filename, serialize(schema, desc))
          .then(failure => failure && actErrors.push(failure))
          .catch(error => actErrors.push(new FileWritingFailure(filename, error)))
      )
    }
  }

  if (duplicationMap.size) return new OutputFileConflict(duplicationMap)

  await Promise.all(actFuncs.map(fn => fn()))
  if (actErrors.length) return new MultipleFailures(actErrors)

  return new Success(undefined)
}

export namespace processWriteInstructions {
  export interface Param<Failure> {
    /** Function to be called on each {@link FileWritingInstruction} */
    readonly act: Act<Failure>

    /** List of writing instructions */
    readonly instruction: Iterable<FileWritingInstruction<any>>
  }

  export interface Act<Failure> {
    /**
     * @param filename Path to a file
     * @param content Content to write or compare to the file
     */
    (filename: string, content: string): Promise<Failure | void>
  }

  export type Return<ActFailure extends Failure<any>> =
    OutputFileConflict |
    MultipleFailures<Array<ActFailure | FileWritingFailure>> |
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

  private async mayWriteSchemas<ActFailure extends OutdatedFile> (
    act: processWriteInstructions.Act<ActFailure>,
    configPaths: readonly string[]
  ) {
    const { errors, instruction } = SchemaWriter.joinCfgRes(
      await Promise.all(configPaths.map(x => this.singleConfig(x)))
    )
    if (errors.length) return new MultipleFailures(errors)
    return processWriteInstructions({ act, instruction })
  }

  /**
   * Write schemas according to multiple config files
   * @param configPaths List of paths to config files
   */
  public writeSchemas (configPaths: readonly string[]): Promise<SchemaWriter.WriteSchemaReturn> {
    const { writeFile } = this.param.fsx
    const act: processWriteInstructions.Act<never> =
      (filename, content) => writeFile(filename, content, 'utf8')
    return this.mayWriteSchemas(act, configPaths)
  }

  /**
   * Test if schema files referred to by config files are up-to-date
   * @param configPaths List of paths to config files
   */
  public testSchemas (configPaths: readonly string[]): Promise<SchemaWriter.TestSchemaReturn> {
    const { readFile } = this.param.fsx
    async function act (filename: string, expectedContent: string): Promise<OutdatedFile | void> {
      const receivedContent = await readFile(filename, 'utf8')
      if (expectedContent !== receivedContent) {
        return new OutdatedFile(filename, { expectedContent, receivedContent })
      }
    }
    return this.mayWriteSchemas(act, configPaths)
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
    TextParsingFailure<ConfigParseError> |
    CircularReference |
    OutputFileConflict |
    Success<Generator<FileWritingInstruction<Definition>, void>>

  type SingleConfigFailure = Exclude<SingleConfigReturn<never>, Success<any>>
  type WriteTestSchemaReturn<Extra extends Failure<any>> =
    MultipleFailures<Array<SingleConfigFailure | Extra>> |
    OutputFileConflict |
    FileWritingFailure |
    Success<void>

  export type WriteSchemaReturn = WriteTestSchemaReturn<never>
  export type TestSchemaReturn = WriteTestSchemaReturn<OutdatedFile>
}
