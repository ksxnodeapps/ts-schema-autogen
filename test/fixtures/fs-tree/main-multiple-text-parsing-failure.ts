import { Config, FsTree } from './_'

const file = (config: Config) => JSON.stringify(config)

const fsTree: FsTree = {
  success: {
    'foo.schema.autogen.json': file({
      instruction: {
        symbol: 'Foo',
        output: 'foo.schema.json'
      }
    }),
    'bar.schema.autogen.yaml': file({
      instruction: {
        symbol: 'Foo',
        output: 'bar.schema.json'
      }
    })
  },
  'text-parsing-failure': {
    'foo.schema.autogen.yaml': 'neither : json : nor : yaml',
    'bar.schema.autogen.json': 'neither : json : nor : yaml',
    'baz.schema.autogen.yaml': 'neither : yaml : nor : json'
  }
}

export default fsTree
