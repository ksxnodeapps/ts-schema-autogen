import { Config, FsTree } from './_'

const file = (config: Config) => JSON.stringify(config)

export const fsTree: FsTree = {
  container: {
    'foo.json': file({
      generator: null!,
      instruction: {
        symbol: 'Foo',
        output: 'foo.removable'
      }
    }),
    'bar.json': file({
      generator: null!,
      instruction: {
        symbol: 'Foo',
        output: ['bar.removable', 'bar.unremovable']
      }
    }),
    'baz.json': file({
      generator: null!,
      instruction: {
        symbol: 'Foo',
        output: 'baz.unremovable'
      }
    })
  }
}

export default fsTree
