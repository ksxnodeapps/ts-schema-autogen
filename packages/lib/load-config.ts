import { ok, err } from '@tsfun/result'
import { PropertyPreference, addProperty, omit, deepMergeWithPreference } from '@tsfun/object'
import { ensureArray } from '@ts-schema-autogen/utils'
import { Config, FSX, Path } from '@ts-schema-autogen/types'
import { FileReadingFailure, TextParsingFailure, CircularReference, Success } from '@ts-schema-autogen/status'
import { ConfigParser } from './config-parser'

/** Error carried by {@link TextParsingFailure} */
export interface ConfigParseError {
  /** Used parser */
  parser: ConfigParser

  /** Error that `loader.parseConfigText` thrown */
  error: unknown
}

/** Load a config file */
export async function loadConfigFile (param: loadConfigFile.Param): Promise<loadConfigFile.Return> {
  const { filename } = param
  const readingResult = await param.fsx.readFile(filename).then(ok, err)
  if (!readingResult.tag) return new FileReadingFailure(filename, readingResult.error)
  const text = readingResult.value

  const parseErrors = []

  for (const parser of param.parsers) {
    if (!parser.testFileName(filename)) continue
    const parseResult = parser.parseConfigText(text, filename)
    if (parseResult.tag) return new Success(parseResult.value)
    parseErrors.push({ parser, error: parseResult.error })
  }

  return new TextParsingFailure(parseErrors)
}

export namespace loadConfigFile {
  export interface Param {
    /** `fs-extra` module to read config file */
    readonly fsx: FSX.Mod

    /** Path to the config file */
    readonly filename: string

    /** List of parsers to be attempted on the config file */
    readonly parsers: Iterable<ConfigParser>
  }

  export type Return =
    FileReadingFailure |
    TextParsingFailure<ConfigParseError[]> |
    Success<Config>
}

/** Merge a config with extensions */
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

/** Load and cache config files */
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

  /** Load a config file from cache or from filesystem */
  public loadConfig (filename: string) {
    return this.prvLoadConfig(filename, [])
  }
}

export namespace ConfigLoader {
  export interface ConstructorParam {
    /** `fs-extra` module to read config files */
    readonly fsx: FSX.Mod

    /** `path` module */
    readonly path: Path.Mod

    /** Parsers to be attempted on each config file */
    readonly parsers: readonly ConfigParser[]
  }

  export type LoaderReturn =
    FileReadingFailure |
    TextParsingFailure<ConfigParseError[]> |
    CircularReference<string[]> |
    Success<Config>
}
