import fsTree from '../../../fixtures/fs-tree/valid-config-only'
import { FakeFileSystem, FakePath } from '@tools/test-utils'

import {
  Status,
  MissingFileParser,
  ConfigLoader
} from '@ts-schema-autogen/lib'

async function setup (filename: string) {
  const fsx = new FakeFileSystem('/', fsTree)
  const path = new FakePath()
  const configLoader = new ConfigLoader({
    fsx,
    path,
    parsers: []
  })
  const result = await configLoader.loadConfig(filename)
  return { filename, fsx, path, configLoader, result }
}

const cfgFile = 'yaml/single-symbol/single-output/output-filename/.schema.autogen.yaml'

it('result matches snapshot', async () => {
  const { result } = await setup(cfgFile)
  expect(result).toMatchSnapshot()
})

it('result has expected properties', async () => {
  const { result } = await setup(cfgFile)
  expect(result).toHaveProperty('code', Status.MissingFileParser)
})

it('result is a MissingFileParser', async () => {
  const { result } = await setup(cfgFile)
  expect(result).toBeInstanceOf(MissingFileParser)
})
