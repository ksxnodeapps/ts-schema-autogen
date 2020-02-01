import fsTree from '../../fixtures/fs-tree/valid-config-only'
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
  async function setup () {
    const fsx = new FakeFileSystem('/', fsTree)
    const path = new FakePath()
    const configLoader = new ConfigLoader({
      fsx,
      path,
      parsers: await getParsers()
    })
  }
})
