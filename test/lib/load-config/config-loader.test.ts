import validCfgOnly from '../../fixtures/fs-tree/valid-config-only'
import { FakeFileSystem, FakePath } from '@tools/test-utils'

import {
  Status,
  Success,
  ConfigLoader,
  createYamlFormatDescriptor,
  createJsonFormatDescriptor
} from '@ts-schema-autogen/lib'

const getParsers = () => Promise.all([
  createJsonFormatDescriptor('JSON Parser'),
  createYamlFormatDescriptor('YAML Parser')
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
    const result = await configLoader.loadConfig(filename)
    return { filename, fsx, path, configLoader, result }
  }

  describe('yaml/single-symbol/single-output/output-filename/.schema.autogen.yaml', () => {
    const cfgFile = 'yaml/single-symbol/single-output/output-filename/.schema.autogen.yaml'

    it('result matches snapshot', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toMatchSnapshot()
    })

    it('result contains expected properties', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toMatchObject({
        code: Status.Success,
        error: undefined,
        value: expect.any(Object)
      })
    })

    it('result is a Success', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toBeInstanceOf(Success)
    })
  })

  describe('json/single-symbol/single-output/output-filename/.schema.autogen.json', () => {
    const cfgFile = 'json/single-symbol/single-output/output-filename/.schema.autogen.json'

    it('result matches snapshot', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toMatchSnapshot()
    })

    it('result contains expected properties', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toMatchObject({
        code: Status.Success,
        error: undefined,
        value: expect.any(Object)
      })
    })

    it('result is a Success', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toBeInstanceOf(Success)
    })
  })

  describe('yaml/single-symbol/single-output/output-descriptor/.schema.autogen.yaml', () => {
    const cfgFile = 'yaml/single-symbol/single-output/output-descriptor/.schema.autogen.yaml'

    it('result matches snapshot', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toMatchSnapshot()
    })

    it('result contains expected properties', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toMatchObject({
        code: Status.Success,
        error: undefined,
        value: expect.any(Object)
      })
    })

    it('result is a Success', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toBeInstanceOf(Success)
    })
  })

  describe('json/single-symbol/single-output/output-descriptor/.schema.autogen.json', () => {
    const cfgFile = 'json/single-symbol/single-output/output-descriptor/.schema.autogen.json'

    it('result matches snapshot', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toMatchSnapshot()
    })

    it('result contains expected properties', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toMatchObject({
        code: Status.Success,
        error: undefined,
        value: expect.any(Object)
      })
    })

    it('result is a Success', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toBeInstanceOf(Success)
    })
  })

  describe('yaml/single-symbol/multiple-output/output-filename/.schema.autogen.yaml', () => {
    const cfgFile = 'yaml/single-symbol/multiple-output/output-filename/.schema.autogen.yaml'

    it('result matches snapshot', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toMatchSnapshot()
    })

    it('result contains expected properties', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toMatchObject({
        code: Status.Success,
        error: undefined,
        value: expect.any(Object)
      })
    })

    it('result is a Success', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toBeInstanceOf(Success)
    })
  })

  describe('json/single-symbol/multiple-output/output-filename/.schema.autogen.json', () => {
    const cfgFile = 'json/single-symbol/multiple-output/output-filename/.schema.autogen.json'

    it('result matches snapshot', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toMatchSnapshot()
    })

    it('result contains expected properties', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toMatchObject({
        code: Status.Success,
        error: undefined,
        value: expect.any(Object)
      })
    })

    it('result is a Success', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toBeInstanceOf(Success)
    })
  })

  describe('yaml/single-symbol/multiple-output/output-descriptor/.schema.autogen.yaml', () => {
    const cfgFile = 'yaml/single-symbol/multiple-output/output-descriptor/.schema.autogen.yaml'

    it('result matches snapshot', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toMatchSnapshot()
    })

    it('result contains expected properties', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toMatchObject({
        code: Status.Success,
        error: undefined,
        value: expect.any(Object)
      })
    })

    it('result is a Success', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toBeInstanceOf(Success)
    })
  })

  describe('json/single-symbol/multiple-output/output-descriptor/.schema.autogen.json', () => {
    const cfgFile = 'json/single-symbol/multiple-output/output-descriptor/.schema.autogen.json'

    it('result matches snapshot', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toMatchSnapshot()
    })

    it('result contains expected properties', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toMatchObject({
        code: Status.Success,
        error: undefined,
        value: expect.any(Object)
      })
    })

    it('result is a Success', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toBeInstanceOf(Success)
    })
  })

  describe('yaml/multiple-symbol/single-output/output-filename/.schema.autogen.yaml', () => {
    const cfgFile = 'yaml/multiple-symbol/single-output/output-filename/.schema.autogen.yaml'

    it('result matches snapshot', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toMatchSnapshot()
    })

    it('result contains expected properties', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toMatchObject({
        code: Status.Success,
        error: undefined,
        value: expect.any(Object)
      })
    })

    it('result is a Success', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toBeInstanceOf(Success)
    })
  })

  describe('json/multiple-symbol/single-output/output-filename/.schema.autogen.json', () => {
    const cfgFile = 'json/multiple-symbol/single-output/output-filename/.schema.autogen.json'

    it('result matches snapshot', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toMatchSnapshot()
    })

    it('result contains expected properties', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toMatchObject({
        code: Status.Success,
        error: undefined,
        value: expect.any(Object)
      })
    })

    it('result is a Success', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toBeInstanceOf(Success)
    })
  })

  describe('yaml/multiple-symbol/single-output/output-descriptor/.schema.autogen.yaml', () => {
    const cfgFile = 'yaml/multiple-symbol/single-output/output-descriptor/.schema.autogen.yaml'

    it('result matches snapshot', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toMatchSnapshot()
    })

    it('result contains expected properties', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toMatchObject({
        code: Status.Success,
        error: undefined,
        value: expect.any(Object)
      })
    })

    it('result is a Success', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toBeInstanceOf(Success)
    })
  })

  describe('json/multiple-symbol/single-output/output-descriptor/.schema.autogen.json', () => {
    const cfgFile = 'json/multiple-symbol/single-output/output-descriptor/.schema.autogen.json'

    it('result matches snapshot', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toMatchSnapshot()
    })

    it('result contains expected properties', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toMatchObject({
        code: Status.Success,
        error: undefined,
        value: expect.any(Object)
      })
    })

    it('result is a Success', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toBeInstanceOf(Success)
    })
  })

  describe('yaml/multiple-symbol/multiple-output/output-filename/.schema.autogen.yaml', () => {
    const cfgFile = 'yaml/multiple-symbol/multiple-output/output-filename/.schema.autogen.yaml'

    it('result matches snapshot', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toMatchSnapshot()
    })

    it('result contains expected properties', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toMatchObject({
        code: Status.Success,
        error: undefined,
        value: expect.any(Object)
      })
    })

    it('result is a Success', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toBeInstanceOf(Success)
    })
  })

  describe('json/multiple-symbol/multiple-output/output-filename/.schema.autogen.json', () => {
    const cfgFile = 'json/multiple-symbol/multiple-output/output-filename/.schema.autogen.json'

    it('result matches snapshot', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toMatchSnapshot()
    })

    it('result contains expected properties', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toMatchObject({
        code: Status.Success,
        error: undefined,
        value: expect.any(Object)
      })
    })

    it('result is a Success', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toBeInstanceOf(Success)
    })
  })

  describe('yaml/multiple-symbol/multiple-output/output-descriptor/.schema.autogen.yaml', () => {
    const cfgFile = 'yaml/multiple-symbol/multiple-output/output-descriptor/.schema.autogen.yaml'

    it('result matches snapshot', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toMatchSnapshot()
    })

    it('result contains expected properties', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toMatchObject({
        code: Status.Success,
        error: undefined,
        value: expect.any(Object)
      })
    })

    it('result is a Success', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toBeInstanceOf(Success)
    })
  })

  describe('json/multiple-symbol/multiple-output/output-descriptor/.schema.autogen.json', () => {
    const cfgFile = 'json/multiple-symbol/multiple-output/output-descriptor/.schema.autogen.json'

    it('result matches snapshot', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toMatchSnapshot()
    })

    it('result contains expected properties', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toMatchObject({
        code: Status.Success,
        error: undefined,
        value: expect.any(Object)
      })
    })

    it('result is a Success', async () => {
      const { result } = await setup(cfgFile)
      expect(result).toBeInstanceOf(Success)
    })
  })
})
