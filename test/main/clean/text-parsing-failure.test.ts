import fsTree from '../../fixtures/fs-tree/main-text-parsing-failure'
import TJS from '../../fixtures/tjs'
import { FakeConsole, FakeFileSystem, FakePath, FakeProcess } from '@tools/test-utils'

import {
  Status,
  DEFAULT_IGNORED,
  DEFAULT_PATTERN,
  cmdClean
} from '@ts-schema-autogen/main'

async function setup () {
  const console = new FakeConsole()
  const fsx = new FakeFileSystem('/', { wdir: fsTree })
  const path = new FakePath()
  const process = new FakeProcess('wdir')
  const tjs = new TJS()
  const result = await cmdClean({
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

it('returns status code that is not Status.Success', async () => {
  const { result } = await setup()
  expect(result).not.toBe(Status.Success)
})

it('calls console.error', async () => {
  const { console } = await setup()
  expect(console.error.mock.calls).toMatchSnapshot()
})

it('does not call console.info', async () => {
  const { console } = await setup()
  expect(console.info).not.toBeCalled()
})

it('messages', async () => {
  const { console } = await setup()
  expect(console.getString()).toMatchSnapshot()
})
