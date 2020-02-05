import fsTree from '../../../../fixtures/fs-tree/no-input'
import TJS from '../../../../fixtures/tjs'
import { FakeFileSystem, FakePath } from '@tools/test-utils'

import {
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

describe('when input field is undefined', () => {
  const configPaths = ['no-input.schema.autogen.json']

  it('calls getProgramFromFiles once', async () => {
    const { tjs } = await setup(configPaths)
    expect(tjs.getProgramFromFiles).toBeCalledTimes(1)
  })

  it('calls getProgramFromFiles with empty array as input TypeScript files', async () => {
    const { tjs } = await setup(configPaths)
    expect(tjs.getProgramFromFiles).toBeCalledWith([], expect.anything())
  })
})

describe('when input field is an empty string', () => {
  const configPaths = ['empty-string-input.schema.autogen.json']

  it('calls getProgramFromFiles once', async () => {
    const { tjs } = await setup(configPaths)
    expect(tjs.getProgramFromFiles).toBeCalledTimes(1)
  })

  it('calls getProgramFromFiles with empty array as input TypeScript files', async () => {
    const { tjs } = await setup(configPaths)
    expect(tjs.getProgramFromFiles).toBeCalledWith([''], expect.anything())
  })
})
