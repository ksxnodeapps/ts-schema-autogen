import validCfgOnly from '../../fixtures/fs-tree/valid-config-only'
import { FakeFileSystem, FakePath } from '@tools/test-utils'

import {
  ConfigLoader,
  createYamlFormatDescriptor,
  createJsonFormatDescriptor
} from '@ts-schema-autogen/lib'

const getParsers = () => Promise.all([
  createYamlFormatDescriptor('YAML Parser'),
  createJsonFormatDescriptor('JSON Parser')
])

describe('valid config', () => {
  async function setup (filename: string) {
    const fsx = new FakeFileSystem('/', validCfgOnly)
    const path = new FakePath()
    const configLoader = new ConfigLoader({
      fsx,
      path,
      parsers: await getParsers()
    })
    const result = configLoader.loadConfig(filename)
    return { filename, fsx, path, configLoader, result }
  }
})
