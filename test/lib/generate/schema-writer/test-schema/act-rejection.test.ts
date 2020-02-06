import fsTree from '../../../../fixtures/fs-tree/act-rejection'
import TJS from '../../../../fixtures/tjs'
import { FakeFileSystem, FakePath, printResult } from '@tools/test-utils'

import {
  Status,
  FileReadingFailure,
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
  const result = await schemaWriter.testSchemas(configPaths)
  return { fsx, path, tjs, result }
}

const configPaths = ['.schema.autogen.json']

it('returns result matching snapshot', async () => {
  const { result } = await setup(configPaths)
  expect(result).toMatchSnapshot()
})

it('returns a FileReadingFailure', async () => {
  const { result } = await setup(configPaths)
  expect(result).toBeInstanceOf(FileReadingFailure)
})

it('returns result containing expected properties', async () => {
  const { result } = await setup(configPaths)
  expect(result).toMatchObject({
    code: Status.FileReadingFailure,
    path: expect.any(String),
    error: expect.anything()
  })
})

it('status code', async () => {
  const { result } = await setup(configPaths)
  expect(result.getStatusCode()).toBe(Status.FileReadingFailure)
})

it('error messages', async () => {
  const { result } = await setup(configPaths)
  expect(printResult(result)).toMatchSnapshot()
})
