import createFsTree from '../../fixtures/fs-tree/test-success'
import TJS from '../../fixtures/tjs'
import { FakeConsole, FakeFileSystem, FakePath, FakeProcess } from '@tools/test-utils'

import {
  Status,
  DEFAULT_IGNORED,
  DEFAULT_PATTERN,
  cmdTest
} from '@ts-schema-autogen/main'

async function setup () {
  const console = new FakeConsole()
  const fsx = new FakeFileSystem('/', { wdir: createFsTree() })
  const path = new FakePath()
  const process = new FakeProcess('wdir')
  const tjs = new TJS()
  const result = await cmdTest({
    args: {
      ignored: DEFAULT_IGNORED,
      pattern: DEFAULT_PATTERN
    },
    modules: {
      console,
      fsx,
      path,
      process,
      tjs
    }
  })
  return {
    console,
    fsx,
    path,
    process,
    tjs,
    result
  }
}

it('returns Status.Success', async () => {
  const { result } = await setup()
  expect(result).toBe(Status.Success)
})

it('does not call fsx.outputFile', async () => {
  const { fsx } = await setup()
  expect(fsx.outputFile).not.toBeCalled()
})

it('calls console.info', async () => {
  const { console } = await setup()
  expect(console.info.mock.calls).toMatchSnapshot()
})

it('does not call console.error', async () => {
  const { console } = await setup()
  expect(console.error).not.toBeCalled()
})

it('messages', async () => {
  const { console } = await setup()
  expect(console.getString()).toMatchSnapshot()
})
