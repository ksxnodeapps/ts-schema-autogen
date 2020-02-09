import { createJoinFunction } from 'better-path-join'
import { Instruction, FSX, Path, OutputDescriptor } from '@ts-schema-autogen/types'
import { MaybeAsyncIterable } from '@ts-schema-autogen/utils'
import { FileRemovalFailure, MultipleFailures, Success } from '@ts-schema-autogen/status'
import { listSymbolInstruction } from './instruction'
import { ensureOutputDescriptorArray } from './output-descriptor'
import { ConfigParser } from './config-parser'
import { ConfigLoader } from './load-config'

/** Determine output files from instruction and delete them */
export function cleanUnit (param: cleanUnit.Param): cleanUnit.Return {
  const { directory } = param
  const { unlink } = param.fsx
  const join = createJoinFunction(param.path)
  function handleOutputDescriptor (desc: OutputDescriptor): cleanUnit.ReturnItem {
    const filename = join(directory, desc.filename)
    const execute = () => unlink(filename)
    return { filename, execute }
  }
  const result = listSymbolInstruction(param.instruction)
    .map(instruction => ensureOutputDescriptorArray(instruction.output))
    .flat()
    .map(handleOutputDescriptor)
  return result
}

export namespace cleanUnit {
  export interface Param {
    /** `fs-extra` module to perform file deletion */
    readonly fsx: FSX.Mod

    /** `path` module to resolve paths  */
    readonly path: Path.Mod

    /** Directory that clean targets belong to */
    readonly directory: string

    /** Instruction whose output files need to be deleted */
    readonly instruction: Instruction
  }

  export interface ReturnItem {
    /** Path to the deleted file */
    readonly filename: string

    /** Perform deletion */
    readonly execute: () => Promise<void>
  }

  export type Return = ReturnItem[]
}

/** Determine output files from multiple configs and delete them */
export async function clean (param: clean.Param): Promise<clean.Return> {
  const { fsx, path } = param
  const configLoader = new ConfigLoader(param)
  const deleteFunctions: Array<() => Promise<void>> = []
  const errors: Array<
    Exclude<ConfigLoader.LoaderReturn, Success<any>> |
    FileRemovalFailure
  > = []

  for await (const configFile of param.configFiles) {
    const configResult = await configLoader.loadConfig(configFile)
    if (configResult.code) {
      errors.push(configResult)
      continue
    }

    const removalInstructions = cleanUnit({
      fsx,
      path,
      directory: path.dirname(configFile),
      instruction: configResult.value.instruction
    })

    for (const { filename, execute } of removalInstructions) {
      const fn = () => execute().catch(error => {
        errors.push(new FileRemovalFailure(filename, error))
      })
      deleteFunctions.push(fn)
    }
  }

  // Problem: With eager deletion, `fast-traverse` calls `stat` upon files that no longer exist
  // Solution: Use lazy method of deletion
  // TODO: Add test to detect this problem
  // TODO: Fix fastTraverse
  await Promise.all(deleteFunctions.map(fn => fn()))
  return MultipleFailures.maybe(errors) || new Success(undefined)
}

export namespace clean {
  export interface Param {
    /** `fs-extra` module to perform file deletion */
    readonly fsx: FSX.Mod

    /** `path` module to get directory names and resolve paths */
    readonly path: Path.Mod

    /** Parsers to convert text data to structured data */
    readonly parsers: readonly ConfigParser[]

    /** List of config filenames */
    readonly configFiles: MaybeAsyncIterable<string>
  }

  type ConfigLoaderFailure = Exclude<ConfigLoader.LoaderReturn, Success<any>>
  export type Return =
    MultipleFailures.Maybe<ConfigLoaderFailure | FileRemovalFailure> |
    Success<void>
}
