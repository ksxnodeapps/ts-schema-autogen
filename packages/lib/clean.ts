import { Instruction, FSX, Path } from '@ts-schema-autogen/types'
import { FileTreeRemovalFailure, Success } from '@ts-schema-autogen/status'
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
  const configResult = await new ConfigLoader(param).loadConfig(param.configFile)
  if (configResult.code) return configResult

  const removalPromises = cleanUnit({
    fsx: param.fsx,
    instruction: configResult.value.instruction
  })

  const removalErrors: any[] = []
  for (const promise of removalPromises) {
    await promise.catch(error => removalErrors.push(error))
  }

  return removalErrors.length
    ? new FileTreeRemovalFailure(removalErrors)
    : new Success(undefined)
}

export namespace clean {
  export interface Param {
    readonly fsx: FSX.Mod
    readonly path: Path.Mod
    readonly loaders: readonly FileFormatDescriptor[]
    readonly configFile: string
  }

  type ConfigLoaderFailure = Exclude<ConfigLoader.LoaderReturn, Success<any>>
  export type Return =
    ConfigLoaderFailure |
    FileTreeRemovalFailure<unknown[]> |
    Success<void>
}
