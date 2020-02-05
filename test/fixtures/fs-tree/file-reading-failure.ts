import { Config, FsTree } from './_'

const file = (config: Config) => JSON.stringify(config)

const fsTree: FsTree = {
  'single.json': file({
    generator: null!,
    extends: 'not-exist.json',
    instruction: {
      symbol: 'Foo',
      output: 'foo.schema.json'
    }
  }),
  'multiple.json': file({
    generator: null!,
    extends: [
      'not-exist-0.json',
      'not-exist-1.json',
      'not-exist-2.json'
    ],
    instruction: {
      symbol: 'Foo',
      output: 'foo.schema.json'
    }
  }),
  'indirect.json': file({
    generator: null!,
    extends: 'single.json',
    instruction: {
      symbol: 'Foo',
      output: 'foo.schema.json'
    }
  }),
  'directory.json': file({
    generator: null!,
    extends: 'directory',
    instruction: {
      symbol: 'Foo',
      output: 'foo.schema.json'
    }
  }),
  directory: {
    file: 'content'
  }
}

export default fsTree
