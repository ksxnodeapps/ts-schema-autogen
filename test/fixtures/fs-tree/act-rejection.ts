import { Config, FsTree } from './_'

export const fsTree: FsTree = {
  directory: {
    file: 'abc'
  },
  '.schema.autogen.json': JSON.stringify({
    instruction: {
      symbol: 'Foo',
      output: 'directory'
    }
  } as Config)
}

export default fsTree
