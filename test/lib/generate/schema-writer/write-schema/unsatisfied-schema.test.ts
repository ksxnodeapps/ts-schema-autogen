import fsTree from '../../../../fixtures/fs-tree/unsatisfied-schema'
import TJS from '../../../../fixtures/tjs'
import { FakeFileSystem, FakePath, printResult } from '@tools/test-utils'

import {
  Status,
  UnsatisfiedSchema,
  MultipleFailures,
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

describe('single failure', () => {
  const configPaths = [
    'multiple-errors/.schema.autogen.json'
  ]

  it('returns result matching snapshot', async () => {
    const { result } = await setup(configPaths)
    expect(result).toMatchSnapshot()
  })

  it('returns an UnsatisfiedSchema', async () => {
    const { result } = await setup(configPaths)
    expect(result).toBeInstanceOf(UnsatisfiedSchema)
  })

  it('returns result containing expected properties', async () => {
    const { result } = await setup(configPaths)
    expect(result).toMatchObject({
      code: Status.UnsatisfiedSchema,
      error: expect.any(Array)
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
    expect(result.getStatusCode()).toBe(Status.UnsatisfiedSchema)
  })
})

describe('multiple failures', () => {
  const configPaths = [
    'string-instead-of-object/.schema.autogen.json',
    'missing-instruction/.schema.autogen.json',
    'invalid-instruction/.schema.autogen.json',
    'multiple-errors/.schema.autogen.json'
  ]

  it('returns result matching snapshot', async () => {
    const { result } = await setup(configPaths)
    expect(result).toMatchSnapshot()
  })

  it('returns an MultipleFailures', async () => {
    const { result } = await setup(configPaths)
    expect(result).toBeInstanceOf(MultipleFailures)
  })

  it('returns result containing expected properties', async () => {
    const { result } = await setup(configPaths)
    expect(result).toMatchObject({
      code: Status.MultipleFailures,
      error: expect.any(Array)
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
    expect(result.getStatusCode()).toBe(Status.UnsatisfiedSchema)
  })
})
