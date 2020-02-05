import fsTree from '../../../../fixtures/fs-tree/invalid-syntax'
import TJS from '../../../../fixtures/tjs'
import { FakeFileSystem, FakePath, printResult } from '@tools/test-utils'

import {
  Status,
  TextParsingFailure,
  SchemaWriter,
  createJsonConfigParser
} from '@ts-schema-autogen/lib'

async function setup (configPaths: readonly string[]) {
  const fsx = new FakeFileSystem('/', fsTree)
  const path = new FakePath()
  const tjs = new TJS()
  const parser = await createJsonConfigParser('JSON Parser')
  const schemaWriter = new SchemaWriter({
    fsx,
    path,
    tjs,
    parsers: [parser]
  })
  const result = await schemaWriter.writeSchemas(configPaths)
  return { fsx, path, tjs, parser, result }
}

const configPaths = ['invalid-config']

it('returns result matching snapshot', async () => {
  const { result } = await setup(configPaths)
  expect(result).toMatchSnapshot()
})

it('returns a TextParsingFailure', async () => {
  const { result } = await setup(configPaths)
  expect(result).toBeInstanceOf(TextParsingFailure)
})

it('returns result containing expected properties', async () => {
  const { result, parser } = await setup(configPaths)
  expect(result).toMatchObject({
    code: Status.TextParsingFailure,
    error: [{
      error: expect.anything(),
      parser
    }]
  })
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
  expect(result.getStatusCode()).toBe(Status.TextParsingFailure)
})
