import { inspect } from 'util'
import fsTree from '../../fixtures/fs-tree/file-removal-failure'
import TJS from '../../fixtures/tjs'
import { FakeFileSystem, FakePath, printResult } from '@tools/test-utils'

import {
  Status,
  FileRemovalFailure,
  MultipleFailures,
  clean,
  createJsonConfigParser
} from '@ts-schema-autogen/lib'

class MockedFileSystem extends FakeFileSystem {
  public readonly unlink = jest.fn(
    (path: string) => path.endsWith('.removable')
      ? Promise.resolve()
      : Promise.reject(new RemovalError(path))
  )
}

class RemovalError extends Error {
  constructor (path: string) {
    super(`File or directory ${inspect(path)} cannot be deleted`)
  }

  public readonly name = this.constructor.name

  public [inspect.custom] () {
    return `${this.name}: ${this.message}`
  }
}

async function setup (configFiles: readonly string[]) {
  const fsx = new MockedFileSystem('/', fsTree)
  const path = new FakePath()
  const tjs = new TJS()
  const result = await clean({
    configFiles,
    fsx,
    path,
    parsers: [
      await createJsonConfigParser('JSON Parser')
    ]
  })
  return { fsx, path, tjs, result }
}

describe('one failure', () => {
  const configFiles = [
    'container/foo.json',
    'container/bar.json'
  ]

  it('returns a result matching snapshot', async () => {
    const { result } = await setup(configFiles)
    expect(result).toMatchSnapshot()
  })

  it('returns a FileRemovalFailure', async () => {
    const { result } = await setup(configFiles)
    expect(result).toBeInstanceOf(FileRemovalFailure)
  })

  it('returns a result containing expected properties', async () => {
    const { result } = await setup(configFiles)
    expect(result).toMatchObject({
      code: Status.FileRemovalFailure,
      path: expect.any(String),
      error: expect.any(RemovalError)
    })
  })

  it('error messages', async () => {
    const { result } = await setup(configFiles)
    expect(printResult(result)).toMatchSnapshot()
  })

  it('status code', async () => {
    const { result } = await setup(configFiles)
    expect(result.getStatusCode()).toBe(Status.FileRemovalFailure)
  })
})

describe('multiple failures', () => {
  const configFiles = [
    'container/foo.json',
    'container/bar.json',
    'container/baz.json'
  ]

  it('returns a result matching snapshot', async () => {
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
      error: [
        {
          code: Status.FileRemovalFailure,
          path: expect.any(String),
          error: expect.any(RemovalError)
        },
        {
          code: Status.FileRemovalFailure,
          path: expect.any(String),
          error: expect.any(RemovalError)
        }
      ]
    })
  })

  it('error messages', async () => {
    const { result } = await setup(configFiles)
    expect(printResult(result)).toMatchSnapshot()
  })

  it('status code', async () => {
    const { result } = await setup(configFiles)
    expect(result.getStatusCode()).toBe(Status.FileRemovalFailure)
  })
})
