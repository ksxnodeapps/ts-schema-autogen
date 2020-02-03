import { Result, tryExec } from '@tsfun/result'
import { Config } from '@ts-schema-autogen/types'

export interface ConfigParser {
  /** Name of the parser */
  readonly name: string

  /**
   * Should the loader accept the file?
   * @param filename Path to the file
   */
  testFileName (filename: string): boolean

  /**
   * Parse the file
   * @param text Content of the file in text
   * @param filename Path to the file
   */
  parseConfigText (text: string, filename: string): Result<Config, unknown>
}

export async function createJsonConfigParser (name: string): Promise<ConfigParser> {
  const { extname } = await import('path')
  const EXT = ['.json', '']
  const testFileName = (filename: string) => EXT.includes(extname(filename))
  const parseConfigText = (text: string) => tryExec(() => JSON.parse(text))
  return { name, testFileName, parseConfigText }
}

export async function createYamlConfigParser (name: string): Promise<ConfigParser> {
  const { extname } = await import('path')
  const { safeLoad } = await import('js-yaml')
  const EXT = ['.yaml', '.yml', '']
  const testFileName = (filename: string) => EXT.includes(extname(filename))
  const parseConfigText = (text: string, filename: string) => tryExec(() => safeLoad(text, { filename }))
  return { name, testFileName, parseConfigText }
}
