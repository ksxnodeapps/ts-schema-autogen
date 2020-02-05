import fsTree from '../../../../fixtures/fs-tree/valid-config-only'
import TJS from '../../../../fixtures/tjs'
import { FakeFileSystem, FakePath, printResult } from '@tools/test-utils'

import {
  Status,
  MissingFileParser,
  SchemaWriter
} from '@ts-schema-autogen/lib'

async function setup (configPaths: readonly string[]) {
  const fsx = new FakeFileSystem('/', fsTree)
  const path = new FakePath()
  const tjs = new TJS()
  const schemaWriter = new SchemaWriter({
    fsx,
    path,
    tjs,
    parsers: []
  })
  const result = await schemaWriter.writeSchemas(configPaths)
  return { fsx, path, tjs, result }
}

const configPaths = [
  'yaml/single-symbol/single-output/output-filename/.schema.autogen.yaml',
  'yaml/single-symbol/single-output/output-descriptor/.schema.autogen.yaml',
  'yaml/single-symbol/multiple-output/output-filename/.schema.autogen.yaml'
]

it('returns result matching snapshot', async () => {
  const { result } = await setup(configPaths)
  expect(result).toMatchSnapshot()
})

it('returns a MissingFileParser', async () => {
  const { result } = await setup(configPaths)
  expect(result).toBeInstanceOf(MissingFileParser)
})

it('returns result containing expected properties', async () => {
  const { result } = await setup(configPaths)
  expect(result).toHaveProperty('code', Status.MissingFileParser)
})

it('does not call outputFile', async () => {
  const { fsx } = await setup(configPaths)
  expect(fsx.outputFile).not.toBeCalled()
})

it('error messages', async () => {
  const { result } = await setup(configPaths)
  expect(printResult(result)).toMatchSnapshot()
})

it('status code', async () => {
  const { result } = await setup(configPaths)
  expect(result.getStatusCode()).toBe(Status.MissingFileParser)
})
