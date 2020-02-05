import createFsTree from '../../../../fixtures/fs-tree/test-success'
import TJS from '../../../../fixtures/tjs'
import { FakeFileSystem, FakePath } from '@tools/test-utils'

import {
  Status,
  Success,
  SchemaWriter,
  createJsonConfigParser
} from '@ts-schema-autogen/lib'

async function setup (configPaths: readonly string[]) {
  const fsx = new FakeFileSystem('/', createFsTree())
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

const configPaths = [
  'foo/.schema.autogen.json',
  'bar/.schema.autogen.json',
  'baz/.schema.autogen.json'
]

it('returns a Success', async () => {
  const { result } = await setup(configPaths)
  expect(result).toBeInstanceOf(Success)
})

it('returns result containing expected properties', async () => {
  const { result } = await setup(configPaths)
  expect(result).toHaveProperty('code', Status.Success)
})

it('status code', async () => {
  const { result } = await setup(configPaths)
  expect(result.getStatusCode()).toBe(Status.Success)
})
