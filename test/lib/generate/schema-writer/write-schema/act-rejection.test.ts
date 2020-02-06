import fsTree from '../../../../fixtures/fs-tree/act-rejection'
import TJS from '../../../../fixtures/tjs'
import { FakeFileSystem, FakePath, printResult } from '@tools/test-utils'

import {
  Status,
  FileWritingFailure,
  SchemaWriter,
  createJsonConfigParser
} from '@ts-schema-autogen/lib'

async function setup (configPaths: readonly string[]) {
  const fsx = new FakeFileSystem('/', fsTree)
  const path = new FakePath()
  const tjs = new TJS()
  const schemaWriter = new SchemaWriter({
    fsx,
    path,
    tjs,
    parsers: [
      await createJsonConfigParser('JSON Parser')
    ]
  })
  const result = await schemaWriter.writeSchemas(configPaths)
  return { fsx, path, tjs, result }
}

const configPaths = ['.schema.autogen.json']

it('returns result matching snapshot', async () => {
  const { result } = await setup(configPaths)
  expect(result).toMatchSnapshot()
})

it('returns a FileWritingFailure', async () => {
  const { result } = await setup(configPaths)
  expect(result).toBeInstanceOf(FileWritingFailure)
})

it('returns result containing expected properties', async () => {
  const { result } = await setup(configPaths)
  expect(result).toMatchObject({
    code: Status.FileWritingFailure,
    path: expect.any(String),
    error: expect.anything()
  })
})

it('status code', async () => {
  const { result } = await setup(configPaths)
  expect(result.getStatusCode()).toBe(Status.FileWritingFailure)
})

it('error messages', async () => {
  const { result } = await setup(configPaths)
  expect(printResult(result)).toMatchSnapshot()
})
