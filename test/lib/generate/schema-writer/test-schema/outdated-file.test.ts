import createFsTree from '../../../../fixtures/fs-tree/outdated-file'
import TJS from '../../../../fixtures/tjs'
import { FakeFileSystem, FakePath, printResult } from '@tools/test-utils'

import {
  Status,
  OutdatedFile,
  MultipleFailures,
  SchemaWriter,
  createJsonConfigParser
} from '@ts-schema-autogen/lib'

async function setup (configPaths: readonly string[]) {
  const fsx = new FakeFileSystem('/', createFsTree())
  const path = new FakePath()
  const tjs = new TJS()
  const schemaWriter = new SchemaWriter({
    fsx,
    path,
    tjs,
    parsers: [
      await createJsonConfigParser('JSON Parser')
    ]
  })
  const result = await schemaWriter.testSchemas(configPaths)
  return { fsx, path, tjs, result }
}

describe('content mismatches', () => {
  describe('one output file from one config file is outdated', () => {
    const configPaths = [
      'content-mismatches/bar/.schema.autogen.json'
    ]

    it('returns a result matching snapshot', async () => {
      const { result } = await setup(configPaths)
      expect(result).toMatchSnapshot()
    })

    it('returns an OutdatedFile', async () => {
      const { result } = await setup(configPaths)
      expect(result).toBeInstanceOf(OutdatedFile)
    })

    it('returns a result containing expected properties', async () => {
      const { result } = await setup(configPaths)
      expect(result).toMatchObject({
        code: Status.OutdatedFile,
        error: {
          expectedContent: expect.any(String),
          receivedContent: expect.any(String)
        }
      })
    })

    it('error messages', async () => {
      const { result } = await setup(configPaths)
      expect(printResult(result)).toMatchSnapshot()
    })

    it('status code', async () => {
      const { result } = await setup(configPaths)
      expect(result.getStatusCode()).toBe(Status.OutdatedFile)
    })
  })

  describe('multiple output files from one config file is outdated', () => {
    const configPaths = [
      'content-mismatches/baz/.schema.autogen.json'
    ]

    it('returns a result matching snapshot', async () => {
      const { result } = await setup(configPaths)
      expect(result).toMatchSnapshot()
    })

    it('returns a MultipleFailures', async () => {
      const { result } = await setup(configPaths)
      expect(result).toBeInstanceOf(MultipleFailures)
    })

    it('returns a result containing expected properties', async () => {
      const { result } = await setup(configPaths)
      expect(result).toMatchObject({
        code: Status.MultipleFailures,
        error: [
          {
            code: Status.OutdatedFile,
            error: {
              expectedContent: expect.any(String),
              receivedContent: expect.any(String)
            }
          },
          {
            code: Status.OutdatedFile,
            error: {
              expectedContent: expect.any(String),
              receivedContent: expect.any(String)
            }
          }
        ]
      })
    })

    it('error messages', async () => {
      const { result } = await setup(configPaths)
      expect(printResult(result)).toMatchSnapshot()
    })

    it('status code', async () => {
      const { result } = await setup(configPaths)
      expect(result.getStatusCode()).toBe(Status.OutdatedFile)
    })
  })
})

describe('content missing', () => {
  describe('one output file from one config file is outdated', () => {
    const configPaths = [
      'content-missing/bar/.schema.autogen.json'
    ]

    it('returns a result matching snapshot', async () => {
      const { result } = await setup(configPaths)
      expect(result).toMatchSnapshot()
    })

    it('returns an OutdatedFile', async () => {
      const { result } = await setup(configPaths)
      expect(result).toBeInstanceOf(OutdatedFile)
    })

    it('returns a result containing expected properties', async () => {
      const { result } = await setup(configPaths)
      expect(result).toMatchObject({
        code: Status.OutdatedFile,
        error: {
          expectedContent: expect.any(String),
          receivedContent: null
        }
      })
    })

    it('error messages', async () => {
      const { result } = await setup(configPaths)
      expect(printResult(result)).toMatchSnapshot()
    })

    it('status code', async () => {
      const { result } = await setup(configPaths)
      expect(result.getStatusCode()).toBe(Status.OutdatedFile)
    })
  })

  describe('multiple output files from one config file is outdated', () => {
    const configPaths = [
      'content-missing/baz/.schema.autogen.json'
    ]

    it('returns a result matching snapshot', async () => {
      const { result } = await setup(configPaths)
      expect(result).toMatchSnapshot()
    })

    it('returns a MultipleFailures', async () => {
      const { result } = await setup(configPaths)
      expect(result).toBeInstanceOf(MultipleFailures)
    })

    it('returns a result containing expected properties', async () => {
      const { result } = await setup(configPaths)
      expect(result).toMatchObject({
        code: Status.MultipleFailures,
        error: [
          {
            code: Status.OutdatedFile,
            error: {
              expectedContent: expect.any(String),
              receivedContent: null
            }
          },
          {
            code: Status.OutdatedFile,
            error: {
              expectedContent: expect.any(String),
              receivedContent: null
            }
          }
        ]
      })
    })

    it('error messages', async () => {
      const { result } = await setup(configPaths)
      expect(printResult(result)).toMatchSnapshot()
    })

    it('status code', async () => {
      const { result } = await setup(configPaths)
      expect(result.getStatusCode()).toBe(Status.OutdatedFile)
    })
  })
})

describe('mixing all up-to-date with all out-of-date', () => {
  const configPaths = [
    'up-to-date/foo/.schema.autogen.json',
    'up-to-date/bar/.schema.autogen.json',
    'up-to-date/baz/.schema.autogen.json',
    'content-mismatches/foo/.schema.autogen.json',
    'content-mismatches/bar/.schema.autogen.json',
    'content-mismatches/baz/.schema.autogen.json',
    'content-missing/foo/.schema.autogen.json',
    'content-missing/bar/.schema.autogen.json',
    'content-missing/baz/.schema.autogen.json'
  ]

  it('returns a result matching snapshot', async () => {
    const { result } = await setup(configPaths)
    expect(result).toMatchSnapshot()
  })

  it('returns a MultipleFailures', async () => {
    const { result } = await setup(configPaths)
    expect(result).toBeInstanceOf(MultipleFailures)
  })

  it('returns a result containing expected properties', async () => {
    const { result } = await setup(configPaths)
    expect(result).toMatchObject({
      code: Status.MultipleFailures,
      error: expect.any(Array)
    })
  })

  it('error messages', async () => {
    const { result } = await setup(configPaths)
    expect(printResult(result)).toMatchSnapshot()
  })

  it('status code', async () => {
    const { result } = await setup(configPaths)
    expect(result.getStatusCode()).toBe(Status.OutdatedFile)
  })
})
