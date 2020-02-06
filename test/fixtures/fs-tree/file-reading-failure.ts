import { Config, FsTree } from './_'

const file = (config: Config) => JSON.stringify(config)

const fsTree: FsTree = {
  'single.json': file({
    extends: 'not-exist.json',
    instruction: {
      symbol: 'Foo',
      output: 'foo.schema.json'
    }
  }),
  'multiple.json': file({
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
    extends: 'single.json',
    instruction: {
      symbol: 'Foo',
      output: 'foo.schema.json'
    }
  }),
  'directory.json': file({
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
