import { Instruction, FSX, Path } from '@ts-schema-autogen/types'
import { MaybeAsyncIterable } from '@ts-schema-autogen/utils'
import { FileTreeRemovalFailure, MultipleFailures, Success } from '@ts-schema-autogen/status'
import { listSymbolInstruction } from './instruction'
import { ensureOutputDescriptorArray } from './output-descriptor'
import { ConfigParser } from './config-parser'
import { ConfigLoader } from './load-config'

/** Determine output files from instruction and delete them */
export function cleanUnit (param: cleanUnit.Param): cleanUnit.Return {
  const { remove } = param.fsx
  const result = listSymbolInstruction(param.instruction)
    .map(instruction => ensureOutputDescriptorArray(instruction.output))
    .reduce((acc, cur) => [...acc, ...cur], [])
    .map(({ filename }) => ({ filename, promise: remove(filename) }))
  return result
}

export namespace cleanUnit {
  export interface Param {
    /** `fs-extra` module to perform file deletion */
    readonly fsx: FSX.Mod

    /** Instruction whose output files need to be deleted */
    readonly instruction: Instruction
  }

  export interface ReturnItem {
    /** Path to the deleted file */
    readonly filename: string

    /** Promise that resolves when deletion completes */
    readonly promise: Promise<void>
  }

  export type Return = ReturnItem[]
}

/** Determine output files from multiple configs and delete them */
export async function clean (param: clean.Param): Promise<clean.Return> {
  const configLoader = new ConfigLoader(param)
  const errors: Array<
    Exclude<ConfigLoader.LoaderReturn, Success<any>> |
    FileTreeRemovalFailure<unknown>
  > = []

  for await (const configFile of param.configFiles) {
    const configResult = await configLoader.loadConfig(configFile)
    if (configResult.code) {
      errors.push(configResult)
      continue
    }

    const removalResults = cleanUnit({
      fsx: param.fsx,
      instruction: configResult.value.instruction
    })

    for (const { filename, promise } of removalResults) {
      await promise.catch(error =>
        errors.push(new FileTreeRemovalFailure(filename, error))
      )
    }
  }

  return errors.length
    ? new MultipleFailures(errors)
    : new Success(undefined)
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
    MultipleFailures<Array<ConfigLoaderFailure | FileTreeRemovalFailure<unknown>>> |
    Success<void>
}
