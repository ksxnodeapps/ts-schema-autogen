import fsTree from '../../../fixtures/fs-tree/unsatisfied-schema'
import { FakeFileSystem, FakePath, printResult } from '@tools/test-utils'

import {
  Status,
  UnsatisfiedSchema,
  ConfigLoader,
  createJsonConfigParser
} from '@ts-schema-autogen/lib'

async function setup (filename: string) {
  const fsx = new FakeFileSystem('/', fsTree)
  const path = new FakePath()
  const configLoader = new ConfigLoader({
    fsx,
    path,
    parsers: [
      await createJsonConfigParser('JSON Parser')
    ]
  })
  const result = await configLoader.loadConfig(filename)
  return { filename, fsx, path, configLoader, result }
}

const cfgFile = 'multiple-errors/.schema.autogen.json'

it('result matches snapshot', async () => {
  const { result } = await setup(cfgFile)
  expect(result).toMatchSnapshot()
})

it('result has expected properties', async () => {
  const { result } = await setup(cfgFile)
  expect(result).toMatchObject({
    code: Status.UnsatisfiedSchema,
    error: expect.any(Array)
  })
})

it('result is a CircularReference', async () => {
  const { result } = await setup(cfgFile)
  expect(result).toBeInstanceOf(UnsatisfiedSchema)
})

it('error messages', async () => {
  const { result } = await setup(cfgFile)
  expect(printResult(result)).toMatchSnapshot()
})

it('status code', async () => {
  const { result } = await setup(cfgFile)
  expect(result.getStatusCode()).toBe(Status.UnsatisfiedSchema)
})
