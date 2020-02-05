import fsTree from '../../../fixtures/fs-tree/circular-reference'
import TJS from '../../../fixtures/tjs'
import { FakeFileSystem, FakePath, printResult } from '@tools/test-utils'

import {
  Status,
  CircularReference,
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

describe('one circular reference', () => {
  const configPaths = ['tree/0.json']

  it('returns result matching snapshot', async () => {
    const { result } = await setup(configPaths)
    expect(result).toMatchSnapshot()
  })

  it('returns a CircularReference', async () => {
    const { result } = await setup(configPaths)
    expect(result).toBeInstanceOf(CircularReference)
  })

  it('returns result containing expected properties', async () => {
    const { result } = await setup(configPaths)
    expect(result).toMatchObject({
      code: Status.CircularReference,
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
})

describe('multiple circular references', () => {
  const configPaths = [
    '1/0.json',
    '2/0.json',
    '3/0.json',
    'tree/0.json',
    'diamond/0.json'
  ]

  it('returns result matching snapshot', async () => {
    const { result } = await setup(configPaths)
    expect(result).toMatchSnapshot()
  })

  it('returns a MultipleFailures', async () => {
    const { result } = await setup(configPaths)
    expect(result).toBeInstanceOf(MultipleFailures)
  })

  it('returns result containing expected properties', async () => {
    const { result } = await setup(configPaths)
    expect(result).toHaveProperty('code', Status.MultipleFailures)
  })

  it('does not call outputFile', async () => {
    const { fsx } = await setup(configPaths)
    expect(fsx.outputFile).not.toBeCalled()
  })

  it('error messages', async () => {
    const { result } = await setup(configPaths)
    expect(printResult(result)).toMatchSnapshot()
  })
})
