import fsTree from '../../../fixtures/fs-tree/valid-config-only'
import TJS from '../../../fixtures/tjs'
import { FakeFileSystem, FakePath } from '@tools/test-utils'

import {
  Success,
  SchemaWriter,
  createJsonConfigParser,
  createYamlConfigParser
} from '@ts-schema-autogen/lib'

const getParsers = () => Promise.all([
  createJsonConfigParser('JSON Parser'),
  createYamlConfigParser('YAML Parser')
])

async function setup (configPaths: readonly string[]) {
  const fsx = new FakeFileSystem('/', fsTree)
  const path = new FakePath()
  const tjs = new TJS()
  const schemaWriter = new SchemaWriter({
    fsx,
    path,
    tjs,
    parsers: await getParsers()
  })
  const result = await schemaWriter.writeSchemas(configPaths)
  return { fsx, path, tjs, result }
}

describe('one config file that specifies one output file', () => {
  const configPaths = ['yaml/single-symbol/single-output/output-filename/.schema.autogen.yaml']
  const expectedOutput = 'yaml/single-symbol/single-output/output-filename/output.schema.json'

  it('returns a Success', async () => {
    const { result } = await setup(configPaths)
    expect(result).toBeInstanceOf(Success)
  })

  it('calls outputFile once', async () => {
    const { fsx } = await setup(configPaths)
    expect(fsx.outputFile).toBeCalledTimes(1)
  })

  it('calls outputFile with expected argument', async () => {
    const { fsx } = await setup(configPaths)
    expect(fsx.outputFile).toBeCalledWith(expectedOutput, expect.any(String))
  })

  it('creates output file', async () => {
    const { fsx } = await setup(configPaths)
    const text = fsx.readFileSync(expectedOutput)
    const snapshot = JSON.parse(text)
    expect(snapshot).toMatchSnapshot()
  })
})

describe('multiple config files and multiple output', () => {
  async function getConfigPaths () {
    const path = new FakePath()
    const { product, map } = await import('iter-tools')
    const base = () => product(
      ['single-symbol', 'multiple-symbol'],
      ['single-output', 'multiple-output'],
      ['output-filename', 'output-descriptor']
    )
    const yaml = map(
      prefix => path.join('yaml', ...prefix, '.schema.autogen.yaml'),
      base()
    )
    const json = map(
      prefix => path.join('json', ...prefix, '.schema.autogen.json'),
      base()
    )
    return [...yaml, ...json]
  }

  it('returns a Success', async () => {
    const { result } = await setup(await getConfigPaths())
    expect(result).toBeInstanceOf(Success)
  })

  it('calls outputFile', async () => {
    const { fsx } = await setup(await getConfigPaths())
    const snapshot = fsx.outputFile.mock.calls
      .map(([filename, content]) => ({ filename, content: JSON.parse(content) }))
    expect(snapshot).toMatchSnapshot()
  })
})
