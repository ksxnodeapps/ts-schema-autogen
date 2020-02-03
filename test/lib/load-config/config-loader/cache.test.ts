import fsTree from '../../../fixtures/fs-tree/cache'
import { FakeFileSystem, FakePath } from '@tools/test-utils'

import {
  ConfigLoader,
  createJsonConfigParser
} from '@ts-schema-autogen/lib'

async function loadFile (filename: string) {
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

async function loadCache () {
  const { configLoader, ...previous } = await loadFile('0.json')
  const result = await configLoader.loadConfig('1.json')
  return { configLoader, previous, result }
}

it('result matches snapshot', async () => {
  const { result } = await loadCache()
  expect(result).toMatchSnapshot()
})

it('result is the same with or without cache', async () => {
  const { result: withoutCache } = await loadFile('1.json')
  const { result: withCache } = await loadCache()
  expect(withCache).toEqual(withoutCache)
})
