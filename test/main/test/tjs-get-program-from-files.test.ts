import fsTree from '../../fixtures/fs-tree/tjs-get-program-from-files'
import TJS from '../../fixtures/tjs'
import { FakeConsole, FakeFileSystem, FakePath, FakeProcess } from '@tools/test-utils'

import {
  DEFAULT_IGNORED,
  DEFAULT_PATTERN,
  cmdTest
} from '@ts-schema-autogen/main'

async function setup () {
  const console = new FakeConsole()
  const fsx = new FakeFileSystem('/', { wdir: fsTree })
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

it('calls tjs.getProgramFromFiles', async () => {
  const { tjs } = await setup()
  expect(tjs.getProgramFromFiles.mock.calls).toMatchSnapshot()
})
