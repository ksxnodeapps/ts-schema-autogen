import { listConfigFiles } from '@ts-schema-autogen/lib'
import { DEFAULT_IGNORED, DEFAULT_PATTERN } from '@ts-schema-autogen/main'
import { getAsyncArray } from '@ts-schema-autogen/utils'
import fsTree from '../../fixtures/fs-tree/valid-config-only'
import { FakeFileSystem, FakePath } from '@tools/test-utils'

async function setup (root: string) {
  const fsx = new FakeFileSystem('/', { container: fsTree })
  const path = new FakePath()
  const result = await getAsyncArray(listConfigFiles({
    fsx,
    path,
    root,
    ignored: DEFAULT_IGNORED,
    pattern: new RegExp(DEFAULT_PATTERN)
  }))
  return { root, fsx, path, result }
}

const root = 'container'

it('returns result matching snapshot', async () => {
  const { result } = await setup(root)
  expect(result).toMatchSnapshot()
})
