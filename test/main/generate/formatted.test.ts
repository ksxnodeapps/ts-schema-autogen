import fsTree from '../../fixtures/fs-tree/main-formatted'
import TJS from '../../fixtures/tjs'
import { FakeConsole, FakeFileSystem, FakePath, FakeProcess } from '@tools/test-utils'

import {
  Status,
  DEFAULT_IGNORED,
  DEFAULT_PATTERN,
  cmdGenerate
} from '@ts-schema-autogen/main'

async function setup () {
  const console = new FakeConsole()
  const fsx = new FakeFileSystem('/', { wdir: fsTree })
  const path = new FakePath()
  const process = new FakeProcess('wdir')
  const tjs = new TJS()
  const result = await cmdGenerate({
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

it('output contents have expected indentation', async () => {
  const { fsx, path } = await setup()
  const text = (basename: string) =>
    fsx.readFileSync(path.join('wdir', basename))
  const object = (basename: string) =>
    JSON.parse(text(basename))
  const reformat = (basename: string, indent?: string | number) =>
    JSON.stringify(object(basename), undefined, indent) + '\n'
  expect({
    'filename.json': text('filename.json'),
    'default.json': text('default.json'),
    'minified.json': text('minified.json'),
    'tab-indented.json': text('tab-indented.json'),
    'four-space-indented.json': text('four-space-indented.json')
  }).toEqual({
    'filename.json': reformat('filename.json', 2),
    'default.json': reformat('default.json', 2),
    'minified.json': reformat('minified.json', undefined),
    'tab-indented.json': reformat('tab-indented.json', '\t'),
    'four-space-indented.json': reformat('four-space-indented.json', 4)
  })
})

it('returns Status.Success', async () => {
  const { result } = await setup()
  expect(result).toBe(Status.Success)
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
