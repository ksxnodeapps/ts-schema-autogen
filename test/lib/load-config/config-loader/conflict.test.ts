import { load } from 'js-yaml'
import { tryExec } from '@tsfun/result'
import fsTree from '../../../fixtures/fs-tree/conflict'
import { FakeFileSystem, FakePath } from '@tools/test-utils'

import {
  Success,
  ConfigLoader
} from '@ts-schema-autogen/lib'

async function setup (filename: string) {
  const fsx = new FakeFileSystem('/', fsTree)
  const path = new FakePath()
  const configLoader = new ConfigLoader({
    fsx,
    path,
    parsers: [{
      name: 'Unsafe YAML Parser',
      testFileName: () => true,
      parseConfigText: (text, filename) => tryExec(() => load(text, { filename }))
    }]
  })
  const result = await configLoader.loadConfig(filename)
  return { filename, fsx, path, configLoader, result }
}

describe('both are undefined', () => {
  const cfgFile = 'both-undefined/base.json'

  it('result matches snapshot', async () => {
    const { result } = await setup(cfgFile)
    expect(result).toMatchSnapshot()
  })

  it('result is a Success', async () => {
    const { result } = await setup(cfgFile)
    expect(result).toBeInstanceOf(Success)
  })

  it('result is a Success', async () => {
    const { result } = await setup(cfgFile)
    expect(result).toBeInstanceOf(Success)
  })

  it('result.value.instruction has expected properties', async () => {
    const { result } = await setup(cfgFile)
    expect(result).toHaveProperty(['value', 'instruction'], expect.objectContaining({
      compilerOptions: {
        a: {
          b: undefined
        },
        c: undefined
      },
      schemaSettings: {
        a: undefined,
        b: {
          c: undefined
        }
      }
    }))
  })
})

describe('base is undefined, extension is defined', () => {
  const cfgFile = 'undefined-base,defined-extension/base.json'

  it('result matches snapshot', async () => {
    const { result } = await setup(cfgFile)
    expect(result).toMatchSnapshot()
  })

  it('result is a Success', async () => {
    const { result } = await setup(cfgFile)
    expect(result).toBeInstanceOf(Success)
  })

  it('result is a Success', async () => {
    const { result } = await setup(cfgFile)
    expect(result).toBeInstanceOf(Success)
  })

  it('result.value.instruction has expected properties', async () => {
    const { result } = await setup(cfgFile)
    expect(result).toHaveProperty(['value', 'instruction'], expect.objectContaining({
      compilerOptions: {
        a: {
          b: 'extension'
        },
        c: 'extension'
      },
      schemaSettings: {
        a: 'extension',
        b: {
          c: 'extension'
        }
      }
    }))
  })
})

describe('base is defined, extension is undefined', () => {
  const cfgFile = 'defined-base,undefined-extension/base.json'

  it('result matches snapshot', async () => {
    const { result } = await setup(cfgFile)
    expect(result).toMatchSnapshot()
  })

  it('result is a Success', async () => {
    const { result } = await setup(cfgFile)
    expect(result).toBeInstanceOf(Success)
  })

  it('result is a Success', async () => {
    const { result } = await setup(cfgFile)
    expect(result).toBeInstanceOf(Success)
  })

  it('result.value.instruction has expected properties', async () => {
    const { result } = await setup(cfgFile)
    expect(result).toHaveProperty(['value', 'instruction'], expect.objectContaining({
      compilerOptions: {
        a: {
          b: 'base'
        },
        c: 'base'
      },
      schemaSettings: {
        a: 'base',
        b: {
          c: 'base'
        }
      }
    }))
  })
})

describe('both are defined', () => {
  const cfgFile = 'both-defined/base.json'

  it('result matches snapshot', async () => {
    const { result } = await setup(cfgFile)
    expect(result).toMatchSnapshot()
  })

  it('result is a Success', async () => {
    const { result } = await setup(cfgFile)
    expect(result).toBeInstanceOf(Success)
  })

  it('result is a Success', async () => {
    const { result } = await setup(cfgFile)
    expect(result).toBeInstanceOf(Success)
  })

  it('result.value.instruction has expected properties', async () => {
    const { result } = await setup(cfgFile)
    expect(result).toHaveProperty(['value', 'instruction'], expect.objectContaining({
      compilerOptions: {
        a: {
          b: 'base'
        },
        c: 'base'
      },
      schemaSettings: {
        a: 'base',
        b: {
          c: 'base'
        }
      }
    }))
  })
})
