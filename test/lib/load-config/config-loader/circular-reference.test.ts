import fsTree from '../../../fixtures/fs-tree/circular-reference'
import { FakeFileSystem, FakePath, printResult } from '@tools/test-utils'

import {
  Status,
  CircularReference,
  ConfigLoader,
  createYamlFormatDescriptor,
  createJsonFormatDescriptor
} from '@ts-schema-autogen/lib'

const getParsers = () => Promise.all([
  createJsonFormatDescriptor('JSON Parser'),
  createYamlFormatDescriptor('YAML Parser')
])

async function setup (filename: string) {
  const fsx = new FakeFileSystem('/', fsTree)
  const path = new FakePath()
  const parsers = await getParsers()
  const configLoader = new ConfigLoader({
    fsx,
    path,
    parsers
  })
  const result = await configLoader.loadConfig(filename)
  return { filename, fsx, path, parsers, configLoader, result }
}

describe('0 → 0', () => {
  const cfgFile = '1/0.json'

  it('result matches snapshot', async () => {
    const { result } = await setup(cfgFile)
    expect(result).toMatchSnapshot()
  })

  it('result has expected properties', async () => {
    const { result } = await setup(cfgFile)
    expect(result).toMatchObject({
      code: Status.CircularReference,
      error: expect.any(Array)
    })
  })

  it('result is a CircularReference', async () => {
    const { result } = await setup(cfgFile)
    expect(result).toBeInstanceOf(CircularReference)
  })

  it('error messages', async () => {
    const { result } = await setup(cfgFile)
    expect(printResult(result)).toMatchSnapshot()
  })
})

describe('0 → 1 → 0', () => {
  const cfgFile = '2/0.json'

  it('result matches snapshot', async () => {
    const { result } = await setup(cfgFile)
    expect(result).toMatchSnapshot()
  })

  it('result has expected properties', async () => {
    const { result } = await setup(cfgFile)
    expect(result).toMatchObject({
      code: Status.CircularReference,
      error: expect.any(Array)
    })
  })

  it('result is a CircularReference', async () => {
    const { result } = await setup(cfgFile)
    expect(result).toBeInstanceOf(CircularReference)
  })

  it('error messages', async () => {
    const { result } = await setup(cfgFile)
    expect(printResult(result)).toMatchSnapshot()
  })
})

describe('0 → 1 → 2 → 0', () => {
  const cfgFile = '3/0.json'

  it('result matches snapshot', async () => {
    const { result } = await setup(cfgFile)
    expect(result).toMatchSnapshot()
  })

  it('result has expected properties', async () => {
    const { result } = await setup(cfgFile)
    expect(result).toMatchObject({
      code: Status.CircularReference,
      error: expect.any(Array)
    })
  })

  it('result is a CircularReference', async () => {
    const { result } = await setup(cfgFile)
    expect(result).toBeInstanceOf(CircularReference)
  })

  it('error messages', async () => {
    const { result } = await setup(cfgFile)
    expect(printResult(result)).toMatchSnapshot()
  })
})

describe('0 → (a0 → a1 → a0, b0 → b1 → b0)', () => {
  const cfgFile = 'tree/0.json'

  it('result matches snapshot', async () => {
    const { result } = await setup(cfgFile)
    expect(result).toMatchSnapshot()
  })

  it('result has expected properties', async () => {
    const { result } = await setup(cfgFile)
    expect(result).toMatchObject({
      code: Status.CircularReference,
      error: expect.any(Array)
    })
  })

  it('result is a CircularReference', async () => {
    const { result } = await setup(cfgFile)
    expect(result).toBeInstanceOf(CircularReference)
  })

  it('error messages', async () => {
    const { result } = await setup(cfgFile)
    expect(printResult(result)).toMatchSnapshot()
  })
})

describe('0 → 1 → (a0 → a1 → 3 → 1, b0 → b1 → 3 → 1, c0 → c1 → 3 → 4)', () => {
  const cfgFile = 'tree/0.json'

  it('result matches snapshot', async () => {
    const { result } = await setup(cfgFile)
    expect(result).toMatchSnapshot()
  })

  it('result has expected properties', async () => {
    const { result } = await setup(cfgFile)
    expect(result).toMatchObject({
      code: Status.CircularReference,
      error: expect.any(Array)
    })
  })

  it('result is a CircularReference', async () => {
    const { result } = await setup(cfgFile)
    expect(result).toBeInstanceOf(CircularReference)
  })

  it('error messages', async () => {
    const { result } = await setup(cfgFile)
    expect(printResult(result)).toMatchSnapshot()
  })
})
