import fsTree from '../../../../fixtures/fs-tree/file-reading-failure'
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
  const result = await schemaWriter.writeSchemas(configPaths)
  return { fsx, path, tjs, result }
}

describe('a ← -', () => {
  const configPaths = ['single.json']

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
      error: expect.anything()
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
    expect(result.getStatusCode()).toBe(Status.FileReadingFailure)
  })
})

describe('a ← ( - - - )', () => {
  const configPaths = ['multiple.json']

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
      error: expect.anything()
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
    expect(result.getStatusCode()).toBe(Status.FileReadingFailure)
  })
})

describe('a ← b ← -', () => {
  const configPaths = ['indirect.json']

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
      error: expect.anything()
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
    expect(result.getStatusCode()).toBe(Status.FileReadingFailure)
  })
})

describe('a ← b/', () => {
  const configPaths = ['directory.json']

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
      error: expect.anything()
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
    expect(result.getStatusCode()).toBe(Status.FileReadingFailure)
  })
})
