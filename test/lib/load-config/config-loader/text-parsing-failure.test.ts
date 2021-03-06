import fsTree from '../../../fixtures/fs-tree/text-parsing-failure'
import { FakeFileSystem, FakePath, printResult } from '@tools/test-utils'

import {
  Status,
  TextParsingFailure,
  ConfigLoader,
  createYamlConfigParser,
  createJsonConfigParser
} from '@ts-schema-autogen/lib'

const getParsers = () => Promise.all([
  createJsonConfigParser('JSON Parser'),
  createYamlConfigParser('YAML Parser')
])

async function setup (filename: string) {
  const fsx = new FakeFileSystem('/', fsTree)
  const path = new FakePath()
  const parsers = await getParsers()
  const configLoader = new ConfigLoader({
    fsx,
    path,
    parsers
  })
  const result = await configLoader.loadConfig(filename)
  return { filename, fsx, path, parsers, configLoader, result }
}

const cfgFile = 'invalid-config'

it('result matches snapshot', async () => {
  const { result } = await setup(cfgFile)
  expect(result).toMatchSnapshot()
})

it('result has expected properties', async () => {
  const { parsers: [json, yaml], result } = await setup(cfgFile)
  expect(result).toMatchObject({
    code: Status.TextParsingFailure,
    error: [
      {
        error: expect.anything(),
        parser: json
      },
      {
        error: expect.anything(),
        parser: yaml
      }
    ]
  })
})

it('result is a TextParsingFailure', async () => {
  const { result } = await setup(cfgFile)
  expect(result).toBeInstanceOf(TextParsingFailure)
})

it('error messages', async () => {
  const { result } = await setup(cfgFile)
  expect(printResult(result)).toMatchSnapshot()
})

it('status code', async () => {
  const { result } = await setup(cfgFile)
  expect(result.getStatusCode()).toBe(Status.TextParsingFailure)
})
