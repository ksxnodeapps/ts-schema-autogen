import fsTree from '../../../fixtures/fs-tree/output-file-conflict'
import TJS from '../../../fixtures/tjs'
import { FakeFileSystem, FakePath, printResult } from '@tools/test-utils'

import {
  Status,
  OutputFileConflict,
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

describe('obvious conflicts', () => {
  const configPaths = [
    'obvious-conflicts/foo.json',
    'obvious-conflicts/bar.json'
  ]

  it('returns result matching snapshot', async () => {
    const { result } = await setup(configPaths)
    expect(result).toMatchSnapshot()
  })

  it('returns an OutputFileConflict', async () => {
    const { result } = await setup(configPaths)
    expect(result).toBeInstanceOf(OutputFileConflict)
  })

  it('returns result containing expected properties', async () => {
    const { result } = await setup(configPaths)
    expect(result).toMatchObject({
      code: Status.OutputFileConflict,
      error: expect.any(Map)
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
    expect(result.getStatusCode()).toBe(Status.OutputFileConflict)
  })
})

describe('not obvious conflicts', () => {
  const configPaths = [
    'not-obvious-conflicts/foo/.schema.autogen.json',
    'not-obvious-conflicts/bar.schema.autogen.json'
  ]

  it('returns result matching snapshot', async () => {
    const { result } = await setup(configPaths)
    expect(result).toMatchSnapshot()
  })

  it('returns an OutputFileConflict', async () => {
    const { result } = await setup(configPaths)
    expect(result).toBeInstanceOf(OutputFileConflict)
  })

  it('returns result containing expected properties', async () => {
    const { result } = await setup(configPaths)
    expect(result).toMatchObject({
      code: Status.OutputFileConflict,
      error: expect.any(Map)
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
    expect(result.getStatusCode()).toBe(Status.OutputFileConflict)
  })
})

describe('more than one conflicts', () => {
  const configPaths = [
    'more-than-one-conflicts/foo.json',
    'more-than-one-conflicts/bar.json',
    'more-than-one-conflicts/baz.json'
  ]

  it('returns result matching snapshot', async () => {
    const { result } = await setup(configPaths)
    expect(result).toMatchSnapshot()
  })

  it('returns an OutputFileConflict', async () => {
    const { result } = await setup(configPaths)
    expect(result).toBeInstanceOf(OutputFileConflict)
  })

  it('returns result containing expected properties', async () => {
    const { result } = await setup(configPaths)
    expect(result).toMatchObject({
      code: Status.OutputFileConflict,
      error: expect.any(Map)
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
    expect(result.getStatusCode()).toBe(Status.OutputFileConflict)
  })
})

describe('mixed with non conflicts', () => {
  const configPaths = [
    'mixed-with-non-conflicts/conflicted-foo.json',
    'mixed-with-non-conflicts/conflicted-bar.json',
    'mixed-with-non-conflicts/okay-foo.json',
    'mixed-with-non-conflicts/okay-bar.json'
  ]

  it('returns result matching snapshot', async () => {
    const { result } = await setup(configPaths)
    expect(result).toMatchSnapshot()
  })

  it('returns an OutputFileConflict', async () => {
    const { result } = await setup(configPaths)
    expect(result).toBeInstanceOf(OutputFileConflict)
  })

  it('returns result containing expected properties', async () => {
    const { result } = await setup(configPaths)
    expect(result).toMatchObject({
      code: Status.OutputFileConflict,
      error: expect.any(Map)
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
    expect(result.getStatusCode()).toBe(Status.OutputFileConflict)
  })
})
