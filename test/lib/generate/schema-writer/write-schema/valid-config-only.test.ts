import fsTree from '../../../../fixtures/fs-tree/valid-config-only'
import TJS from '../../../../fixtures/tjs'
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

  it('calls getProgramFromFiles once', async () => {
    const { tjs } = await setup(configPaths)
    expect(tjs.getProgramFromFiles).toBeCalledTimes(1)
  })

  it('calls getProgramFromFiles with expected arguments', async () => {
    const { tjs } = await setup(configPaths)
    expect(tjs.getProgramFromFiles).toBeCalledWith(
      expect.any(Array),
      expect.any(Object)
    )
  })

  it('calls buildGenerator once', async () => {
    const { tjs } = await setup(configPaths)
    expect(tjs.buildGenerator).toBeCalledTimes(1)
  })

  it('calls buildGenerator with expected arguments', async () => {
    const { tjs } = await setup(configPaths)
    expect(tjs.buildGenerator).toBeCalledWith(
      expect.anything(),
      expect.any(Object)
    )
  })

  it('creates output file', async () => {
    const { fsx } = await setup(configPaths)
    const text = fsx.readFileSync(expectedOutput)
    const snapshot = JSON.parse(text)
    expect(snapshot).toMatchSnapshot()
  })
})

describe('one config file that specifies multiple output file', () => {
  const configPaths = ['yaml/multiple-symbol/multiple-output/output-descriptor/.schema.autogen.yaml']
  const fooOutputFiles = [
    'yaml/multiple-symbol/multiple-output/output-descriptor/foo.filename.schema.json',
    'yaml/multiple-symbol/multiple-output/output-descriptor/foo.default.schema.json',
    'yaml/multiple-symbol/multiple-output/output-descriptor/foo.custom.schema.json'
  ]
  const barOutputFiles = [
    'yaml/multiple-symbol/multiple-output/output-descriptor/bar.4.schema.json'
  ]

  it('returns a Success', async () => {
    const { result } = await setup(configPaths)
    expect(result).toBeInstanceOf(Success)
  })

  it('calls outputFile', async () => {
    const { fsx } = await setup(configPaths)
    const snapshot = fsx.outputFile.mock.calls
      .map(([filename, content]) => ({ filename, content: JSON.parse(content) }))
    expect(snapshot).toMatchSnapshot()
  })

  it('calls getProgramFromFiles once', async () => {
    const { tjs } = await setup(configPaths)
    expect(tjs.getProgramFromFiles).toBeCalledTimes(1)
  })

  it('calls getProgramFromFiles with expected arguments', async () => {
    const { tjs } = await setup(configPaths)
    expect(tjs.getProgramFromFiles).toBeCalledWith(
      expect.any(Array),
      expect.any(Object)
    )
  })

  it('calls buildGenerator once', async () => {
    const { tjs } = await setup(configPaths)
    expect(tjs.buildGenerator).toBeCalledTimes(1)
  })

  it('calls buildGenerator with expected arguments', async () => {
    const { tjs } = await setup(configPaths)
    expect(tjs.buildGenerator).toBeCalledWith(
      expect.anything(),
      expect.any(Object)
    )
  })

  describe('creates output files', () => {
    async function fetchOutput () {
      const { fsx, ...rest } = await setup(configPaths)
      const fooOutput = fooOutputFiles.map(filename => fsx.readFileSync(filename))
      const barOutput = barOutputFiles.map(filename => fsx.readFileSync(filename))
      return { ...rest, fsx, fooOutput, barOutput }
    }

    it('all output are the same object', async () => {
      const { fooOutput } = await fetchOutput()
      const first = JSON.parse(fooOutput[0])
      expect(fooOutput.map(json => JSON.parse(json))).toEqual([first, first, first])
    })

    it('all output are formatted according to instruction', async () => {
      const { fooOutput, barOutput } = await fetchOutput()
      const reformat = (json: string, indent?: number | string) =>
        JSON.stringify(JSON.parse(json), undefined, indent) + '\n'
      expect({
        fooOutput,
        barOutput
      }).toEqual({
        fooOutput: [
          reformat(fooOutput[0], 2),
          reformat(fooOutput[1], 2),
          reformat(fooOutput[2], '\t')
        ],
        barOutput: [
          reformat(barOutput[0], 4)
        ]
      })
    })
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
