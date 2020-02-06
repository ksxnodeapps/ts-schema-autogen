import createFsTree from '../../../fixtures/fs-tree/multiple-failures'
import TJS from '../../../fixtures/tjs'
import { FakeFileSystem, FakePath, printResult } from '@tools/test-utils'

import {
  Status,
  MultipleFailures,
  clean,
  createJsonConfigParser,
  createYamlConfigParser
} from '@ts-schema-autogen/lib'

const getParsers = () => Promise.all([
  createJsonConfigParser('JSON Parser'),
  createYamlConfigParser('YAML Parser')
])

async function setup (configFiles: readonly string[]) {
  const fsx = new FakeFileSystem('/', await createFsTree())
  const path = new FakePath()
  const tjs = new TJS()
  const result = await clean({
    configFiles,
    fsx,
    path,
    parsers: await getParsers()
  })
  return { fsx, path, tjs, result }
}

const configFiles = [
  'circular-reference/1/0.json',
  'circular-reference/2/0.json',
  'circular-reference/3/0.json',
  'file-reading-failure/single.json',
  'file-reading-failure/multiple.json',
  'output-file-conflict/obvious-conflicts/foo.json',
  'output-file-conflict/obvious-conflicts/bar.json',
  'text-parsing-failure/invalid-config',
  'valid-config-only/yaml/single-symbol/single-output/output-filename/.schema.autogen.yaml',
  'valid-config-only/yaml/single-symbol/single-output/output-descriptor/.schema.autogen.yaml',
  'valid-config-only/yaml/single-symbol/multiple-output/output-filename/.schema.autogen.yaml'
]

it('returns result matching snapshot', async () => {
  const { result } = await setup(configFiles)
  expect(result).toMatchSnapshot()
})

it('returns a MultipleFailures', async () => {
  const { result } = await setup(configFiles)
  expect(result).toBeInstanceOf(MultipleFailures)
})

it('returns a result containing expected properties', async () => {
  const { result } = await setup(configFiles)
  expect(result).toMatchObject({
    code: Status.MultipleFailures,
    error: expect.any(Array)
  })
})

it('error messages', async () => {
  const { result } = await setup(configFiles)
  expect(printResult(result)).toMatchSnapshot()
})

it('status code', async () => {
  const { result } = await setup(configFiles)
  expect(result.getStatusCode()).toBe(Status.MultipleFailures)
})
