import fsTree from '../../../../fixtures/fs-tree/tjs-get-program-from-files'
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

describe('without input', () => {
  const configPaths = ['no-input/.schema.autogen.json']

  it('calls getProgramFromFiles once', async () => {
    const { tjs } = await setup(configPaths)
    expect(tjs.getProgramFromFiles).toBeCalledTimes(1)
  })

  it('calls getProgramFromFiles with files = []', async () => {
    const { tjs } = await setup(configPaths)
    expect(tjs.getProgramFromFiles).toBeCalledWith([], expect.anything())
  })
})

describe('with input being a filename', () => {
  const configPaths = ['input-filename/.schema.autogen.json']

  it('calls getProgramFromFiles once', async () => {
    const { tjs } = await setup(configPaths)
    expect(tjs.getProgramFromFiles).toBeCalledTimes(1)
  })

  it('calls getProgramFromFiles with files = [<Resolved Path>]', async () => {
    const { tjs } = await setup(configPaths)
    expect(tjs.getProgramFromFiles).toBeCalledWith(
      ['input-filename/input.ts'],
      expect.anything()
    )
  })
})

describe('with input being an array of filenames', () => {
  const configPaths = ['input-array/.schema.autogen.json']

  it('calls getProgramFromFiles once', async () => {
    const { tjs } = await setup(configPaths)
    expect(tjs.getProgramFromFiles).toBeCalledTimes(1)
  })

  it('calls getProgramFromFiles with files = [<Resolved Path>...]', async () => {
    const { tjs } = await setup(configPaths)
    expect(tjs.getProgramFromFiles).toBeCalledWith(
      [
        'input-array/input/abc.ts',
        'input-array/input/def.ts',
        'input-array/input/ghi.ts'
      ],
      expect.anything()
    )
  })
})

it('snapshot', async () => {
  const configPaths = [
    'no-input/.schema.autogen.json',
    'input-filename/.schema.autogen.json',
    'input-array/.schema.autogen.json'
  ]
  const { tjs } = await setup(configPaths)
  expect(tjs.getProgramFromFiles.mock.calls).toMatchSnapshot()
})
