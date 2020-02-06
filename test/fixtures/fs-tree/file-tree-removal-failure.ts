import { Config, FsTree } from './_'

const file = (config: Config) => JSON.stringify(config)

export const fsTree: FsTree = {
  container: {
    'foo.json': file({
      instruction: {
        symbol: 'Foo',
        output: 'foo.removable'
      }
    }),
    'bar.json': file({
      instruction: {
        symbol: 'Foo',
        output: ['bar.removable', 'bar.unremovable']
      }
    }),
    'baz.json': file({
      instruction: {
        symbol: 'Foo',
        output: 'baz.unremovable'
      }
    })
  }
}

export default fsTree
