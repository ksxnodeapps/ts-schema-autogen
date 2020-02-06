import fsTree from '../../fixtures/fs-tree/valid-config-only'
import TJS from '../../fixtures/tjs'
import { FakeFileSystem, FakePath } from '@tools/test-utils'

import {
  Success,
  clean,
  createJsonConfigParser,
  createYamlConfigParser
} from '@ts-schema-autogen/lib'

const getParsers = () => Promise.all([
  createJsonConfigParser('JSON Parser'),
  createYamlConfigParser('YAML Parser')
])

async function setup (configFiles: readonly string[]) {
  const fsx = new FakeFileSystem('/', fsTree)
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
  'yaml/single-symbol/single-output/output-filename/.schema.autogen.yaml',
  'yaml/single-symbol/single-output/output-descriptor/.schema.autogen.yaml',
  'yaml/single-symbol/multiple-output/output-filename/.schema.autogen.yaml',
  'yaml/multiple-symbol/single-output/output-filename/.schema.autogen.yaml',
  'json/single-symbol/single-output/output-filename/.schema.autogen.json'
]

it('returns a Success', async () => {
  const { result } = await setup(configFiles)
  expect(result).toBeInstanceOf(Success)
})

it('calls remove', async () => {
  const { fsx } = await setup(configFiles)
  expect(fsx.remove.mock.calls).toMatchSnapshot()
})
