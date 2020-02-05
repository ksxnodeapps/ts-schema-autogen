import { addProperty, objectExtends } from '@tsfun/object'
import { ensureArray, concatIterable, getIndent } from '@ts-schema-autogen/utils'
import { listSymbolInstruction } from './instruction'
import { ensureOutputDescriptorArray } from './output-descriptor'
import { ConfigParseError, ConfigLoader } from './load-config'

import {
  Program,
  Definition,
  Settings,
  Instruction,
  SymbolInstruction,
  OutputDescriptor,
  TJS,
  Path
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
  MissingFileParser,
  GeneratorConstructingFailure,
  Success
} from '@ts-schema-autogen/status'

/** Instruction created by {@link generateUnit} and used by {@link SchemaWriter} to write schema files */
export interface FileWritingInstruction<Definition> {
  readonly schema: Definition
  readonly instruction: SymbolInstruction
}

/** Create a {@link FileWritingInstruction} from an `Instruction` */
export function generateUnit<
  Prog = Program,
  Def = Definition
> (param: generateUnit.Param<Prog, Def>): generateUnit.Return<Prog, Def> {
  const { tjs, instruction, resolvePath } = param
  const { buildGenerator, getProgramFromFiles } = tjs
  const program = getProgramFromFiles(
    ensureArray(instruction.input ?? []),
    instruction.compilerOptions
  )
  const settings = instruction.schemaSettings
  const generator = buildGenerator(program, settings)

  if (!generator) return new GeneratorConstructingFailure({ program, settings })

  function * generate (): Generator<FileWritingInstruction<Def>, void> {
    for (const symbolInstruction of listSymbolInstruction(instruction)) {
      const schema = generator!.getSchemaForSymbol(symbolInstruction.symbol)
      const output = ensureOutputDescriptorArray(symbolInstruction.output)
        .map(item => addProperty(item, 'filename', resolvePath(item.filename)))
      const instruction: SymbolInstruction = addProperty(symbolInstruction, 'output', output)
      yield { instruction, schema }
    }
  }

  return new Success({
    [Symbol.iterator]: generate
  })
}

export namespace generateUnit {
  export interface Param<Program, Definition> {
    /** `typescript-json-schema` module to convert TypeScript types into JSON schemas */
    readonly tjs: TJS.Mod<Program, Definition>

    /** Instruction that tells types, input, and output */
    readonly instruction: Instruction

    /** Path resolver */
    readonly resolvePath: PathResolver
  }

  export interface PathResolver {
    /**
     * Resolve output path
     * @param output Output path from instruction (relative to config file)
     * @returns Resolved path to pass to writer function (relative to working directory)
     */
    (output: string): string
  }

  export type Return<Program, Definition> =
    GeneratorConstructingFailure<Program, Settings | undefined> |
    Success<Iterable<FileWritingInstruction<Definition>>>
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

      const duplicatedFiles = duplicationCheckingArray.filter(x => x.filename === filename)
      if (duplicatedFiles.length) {
        if (duplicationMap.has(filename)) {
          duplicationMap.get(filename)!.push(desc)
        } else {
          duplicationMap.set(filename, [...duplicatedFiles, desc])
        }
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
  return MultipleFailures.maybe(actErrors) || new Success(undefined)
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
    MultipleFailures.Maybe<ActFailure | FileWritingFailure> |
    Success<void>
}

/** Write schema files according to one or multiple configs */
export class SchemaWriter<Prog = Program, Def = Definition> {
  constructor (
    private readonly param: SchemaWriter.ConstructorParam<Prog, Def>
  ) {}

  private readonly loader = new ConfigLoader(this.param)

  private static joinCfgRes<Prog, Def> (list: Iterable<SchemaWriter.SingleConfigReturn<Prog, Def>>) {
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
   * @param path Path module
   */
  public async singleConfig (configPath: string, path: Path.Mod): Promise<SchemaWriter.SingleConfigReturn<Prog, Def>> {
    const config = await this.loader.loadConfig(configPath)
    if (config.code) return config
    const { join } = path
    const dirname = path.dirname(configPath)
    const writeInstruction = generateUnit(
      objectExtends(this.param, {
        instruction: config.value.instruction,
        resolvePath: (filename: string) => join(dirname, filename)
      })
    )
    if (writeInstruction.code) return writeInstruction
    return new Success(writeInstruction.value)
  }

  private async mayWriteSchemas<ActFailure extends OutdatedFile> (
    act: processWriteInstructions.Act<ActFailure>,
    configPaths: readonly string[],
    path: Path.Mod
  ) {
    const { errors, instruction } = SchemaWriter.joinCfgRes(
      await Promise.all(configPaths.map(x => this.singleConfig(x, path)))
    )
    return MultipleFailures.maybe(errors) ||
      processWriteInstructions({ act, instruction })
  }

  /**
   * Write schemas according to multiple config files
   * @param configPaths List of paths to config files
   */
  public writeSchemas (configPaths: readonly string[]): Promise<SchemaWriter.WriteSchemaReturn<Prog, Def>> {
    const { outputFile } = this.param.fsx
    const act: processWriteInstructions.Act<never> =
      (filename, content) => outputFile(filename, content)
    return this.mayWriteSchemas(act, configPaths, this.param.path)
  }

  /**
   * Test if schema files referred to by config files are up-to-date
   * @param configPaths List of paths to config files
   */
  public testSchemas (configPaths: readonly string[]): Promise<SchemaWriter.TestSchemaReturn<Prog, Def>> {
    const { readFile } = this.param.fsx
    async function act (filename: string, expectedContent: string): Promise<OutdatedFile | void> {
      const receivedContent = await readFile(filename, 'utf8')
      if (expectedContent !== receivedContent) {
        return new OutdatedFile(filename, { expectedContent, receivedContent })
      }
    }
    return this.mayWriteSchemas(act, configPaths, this.param.path)
  }
}

export namespace SchemaWriter {
  export interface ConstructorParam<Program, Definition> extends ConfigLoader.ConstructorParam {
    /** `typescript-json-schema` module to convert TypeScript types into JSON schemas */
    readonly tjs: TJS.Mod<Program, Definition>
  }

  export type SingleConfigReturn<Program, Definition> =
    FileReadingFailure |
    FileWritingFailure |
    TextParsingFailure<ConfigParseError> |
    CircularReference |
    OutputFileConflict |
    MissingFileParser |
    GeneratorConstructingFailure<Program, Settings | undefined> |
    Success<Iterable<FileWritingInstruction<Definition>>>

  type SingleConfigFailure<Program, Definition> =
    Exclude<SingleConfigReturn<Program, Definition>, Success<any>>
  type WriteTestSchemaReturn<Extra extends Failure<any>, Program, Definition> =
    MultipleFailures.Maybe<SingleConfigFailure<Program, Definition> | Extra> |
    OutputFileConflict |
    FileWritingFailure |
    Success<void>

  export type WriteSchemaReturn<Program, Definition> =
    WriteTestSchemaReturn<never, Program, Definition>
  export type TestSchemaReturn<Program, Definition> =
    WriteTestSchemaReturn<OutdatedFile, Program, Definition>
}
