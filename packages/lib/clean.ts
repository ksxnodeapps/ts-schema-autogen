import { Instruction, FSX, Path } from '@ts-schema-autogen/types'
import { FileTreeRemovalFailure, MultipleFailures, Success } from '@ts-schema-autogen/status'
import { listSymbolInstruction } from './instruction'
import { ensureOutputDescriptorArray } from './output-descriptor'
import { FileFormatDescriptor } from './file-format-descriptor'
import { ConfigLoader } from './load-config'

export function cleanUnit (param: cleanUnit.Param) {
  const { remove } = param.fsx
  const promises = listSymbolInstruction(param.instruction)
    .map(instruction => ensureOutputDescriptorArray(instruction.output))
    .reduce((acc, cur) => [...acc, ...cur], [])
    .map(desc => remove(desc.filename))
  return promises
}

export namespace cleanUnit {
  export interface Param {
    readonly fsx: FSX.Mod
    readonly instruction: Instruction
  }
}

export async function clean (param: clean.Param): Promise<clean.Return> {
  const configLoader = new ConfigLoader(param)
  const errors: Array<
    Exclude<ConfigLoader.LoaderReturn, Success<any>> |
    FileTreeRemovalFailure<unknown>
  > = []

  for (const configFile of param.configFiles) {
    const configResult = await configLoader.loadConfig(configFile)
    if (configResult.code) {
      errors.push(configResult)
      continue
    }

    const removalPromises = cleanUnit({
      fsx: param.fsx,
      instruction: configResult.value.instruction
    })

    for (const promise of removalPromises) {
      await promise.catch(error => errors.push(new FileTreeRemovalFailure(error)))
    }
  }

  return errors.length
    ? new MultipleFailures(errors)
    : new Success(undefined)
}

export namespace clean {
  export interface Param {
    readonly fsx: FSX.Mod
    readonly path: Path.Mod
    readonly loaders: readonly FileFormatDescriptor[]
    readonly configFiles: Iterable<string>
  }

  type ConfigLoaderFailure = Exclude<ConfigLoader.LoaderReturn, Success<any>>
  export type Return =
    MultipleFailures<Array<ConfigLoaderFailure | FileTreeRemovalFailure<unknown>>> |
    Success<void>
}
