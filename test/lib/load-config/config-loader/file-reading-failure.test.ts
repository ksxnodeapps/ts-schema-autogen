import fsTree from '../../../fixtures/fs-tree/valid-config-only'
import { FakeFileSystem, FakePath, printResult } from '@tools/test-utils'

import {
  Status,
  FileReadingFailure,
  ConfigLoader,
  createYamlFormatDescriptor,
  createJsonFormatDescriptor
} from '@ts-schema-autogen/lib'

const getParsers = () => Promise.all([
  createJsonFormatDescriptor('JSON Parser'),
  createYamlFormatDescriptor('YAML Parser')
])

async function setup (filename: string) {
  const fsx = new FakeFileSystem('/', fsTree)
  const path = new FakePath()
  const configLoader = new ConfigLoader({
    fsx,
    path,
    parsers: await getParsers()
  })
  const result = await configLoader.loadConfig(filename)
  return { filename, fsx, path, configLoader, result }
}

describe('when a directory is read as file', () => {
  const cfgFile = 'json/single-symbol/single-output/output-filename'

  it('result matches snapshot', async () => {
    const { result } = await setup(cfgFile)
    expect(result).toMatchSnapshot()
  })

  it('result has expected properties', async () => {
    const { result } = await setup(cfgFile)
    expect(result).toMatchObject({
      code: Status.FileReadingFailure,
      error: expect.anything(),
      path: cfgFile
    })
  })

  it('result is a FileReadingFailure', async () => {
    const { result } = await setup(cfgFile)
    expect(result).toBeInstanceOf(FileReadingFailure)
  })

  it('error messages', async () => {
    const { result } = await setup(cfgFile)
    expect(printResult(result)).toMatchSnapshot()
  })
})

describe('when file does not exist', () => {
  const cfgFile = '[DOES NOT EXIST]'

  it('result matches snapshot', async () => {
    const { result } = await setup(cfgFile)
    expect(result).toMatchSnapshot()
  })

  it('result has expected properties', async () => {
    const { result } = await setup(cfgFile)
    expect(result).toMatchObject({
      code: Status.FileReadingFailure,
      error: expect.anything(),
      path: cfgFile
    })
  })

  it('result is a FileReadingFailure', async () => {
    const { result } = await setup(cfgFile)
    expect(result).toBeInstanceOf(FileReadingFailure)
  })

  it('error messages', async () => {
    const { result } = await setup(cfgFile)
    expect(printResult(result)).toMatchSnapshot()
  })
})
