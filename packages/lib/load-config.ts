import { ok, err } from '@tsfun/result'
import { PropertyPreference, addProperty, omit, deepMergeWithPreference } from '@tsfun/object'
import { ensureArray } from '@ts-schema-autogen/utils'
import { Config, FSX, Path } from '@ts-schema-autogen/types'
import { FileReadingFailure, FileParsingFailure, CircularReference, Success } from '@ts-schema-autogen/status'
import { FileFormatDescriptor } from './file-format-descriptor'

export interface ConfigParseError {
  loader: FileFormatDescriptor
  error: unknown
}

export async function loadConfigFile (param: loadConfigFile.Param): Promise<loadConfigFile.Return> {
  const { filename } = param
  const readingResult = await param.fsx.readFile(filename).then(ok, err)
  if (!readingResult.tag) return new FileReadingFailure(readingResult.error)
  const text = readingResult.value

  const parseErrors = []

  for (const loader of param.loaders) {
    if (!loader.testFileName(filename)) continue
    const parseResult = loader.parseConfigText(text, filename)
    if (parseResult.tag) return new Success(parseResult.value)
    parseErrors.push({ loader, error: parseResult.error })
  }

  return new FileParsingFailure(parseErrors)
}

export namespace loadConfigFile {
  export interface Param {
    readonly fsx: FSX.Mod
    readonly filename: string
    readonly loaders: Iterable<FileFormatDescriptor>
  }

  export type Return =
    FileReadingFailure |
    FileParsingFailure<ConfigParseError[]> |
    Success<Config>
}

export function mergeConfig (primary: Config, ...inherited: Config[]): Config {
  const newInstruction = inherited.reduce(
    (instruction, config) => deepMergeWithPreference(
      instruction,
      omit(config.instruction, MERGE_OMITTED_KEYS),
      MERGE_CONFLICT_RESOLVER
    ),
    primary.instruction
  )
  return addProperty(primary, 'instruction', newInstruction)
}
const MERGE_OMITTED_KEYS = ['input', 'list', 'output', 'symbol'] as const
const MERGE_CONFLICT_RESOLVER = ([value]: [unknown, unknown]) =>
  value === undefined ? PropertyPreference.Right : PropertyPreference.Left

export namespace loadConfig {
  export interface Param extends loadConfigFile.Param {
    readonly path: Path.Mod
  }

  export type Return =
    FileReadingFailure |
    FileParsingFailure<ConfigParseError[]>
}

export class ConfigLoader {
  constructor (private readonly param: ConfigLoader.ConstructorParam) {}
  private readonly simpleCache = new Map<string, Config>()

  private async prvLoadConfig (
    filename: string,
    circularGuard: string[]
  ): Promise<ConfigLoader.LoaderReturn> {
    const { simpleCache, param } = this
    const { dirname, resolve } = param.path

    if (circularGuard.includes(filename)) {
      return new CircularReference(circularGuard)
    }

    if (simpleCache.has(filename)) {
      return new Success(simpleCache.get(filename)!)
    }

    const lcfRet = await loadConfigFile(addProperty(param, 'filename', resolve(filename)))
    if (lcfRet.code) return lcfRet

    let config = lcfRet.value
    simpleCache.set(filename, config)

    if (!config.extends) return new Success(config)
    for (const path of ensureArray(config.extends)) {
      const absPath = resolve(dirname(filename), path)
      const res = await this.prvLoadConfig(absPath, circularGuard.concat(filename))
      if (res.code) return res
      config = mergeConfig(config, res.value)
    }
    return new Success(config)
  }

  public loadConfig (filename: string) {
    return this.prvLoadConfig(filename, [])
  }
}

export namespace ConfigLoader {
  export interface ConstructorParam {
    readonly fsx: FSX.Mod
    readonly path: Path.Mod
    readonly loaders: readonly FileFormatDescriptor[]
  }

  export type LoaderReturn =
    FileReadingFailure |
    FileParsingFailure<ConfigParseError[]> |
    CircularReference<string[]> |
    Success<Config>
}
