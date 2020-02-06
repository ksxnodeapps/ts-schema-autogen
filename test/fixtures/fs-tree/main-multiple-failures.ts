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
  },
  'circular-reference': {
    'foo.schema.autogen.json': file({
      extends: 'foo.schema.autogen.yaml',
      instruction: {
        symbol: 'Foo',
        output: 'foo.0.schema.json'
      }
    }),
    'foo.schema.autogen.yaml': file({
      extends: 'foo.schema.autogen.json',
      instruction: {
        symbol: 'Foo',
        output: 'foo.1.schema.json'
      }
    }),
    'bar.schema.autogen.json': file({
      extends: 'bar.schema.autogen.yaml',
      instruction: {
        symbol: 'Foo',
        output: 'foo.0.schema.json'
      }
    }),
    'bar.schema.autogen.yaml': file({
      extends: 'bar.schema.autogen.json',
      instruction: {
        symbol: 'Foo',
        output: 'foo.1.schema.json'
      }
    }),
    'baz.schema.autogen.json': file({
      extends: [
        'foo.schema.autogen.json',
        'bar.schema.autogen.json'
      ],
      instruction: {
        symbol: 'Foo',
        output: 'foo.1.schema.json'
      }
    })
  }
}

export default fsTree
