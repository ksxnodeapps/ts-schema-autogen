import { Config, FsTree } from './_'

const file = (config: Config) => JSON.stringify(config)

export const fsTree: FsTree = {
  '.schema.autogen.json': file({
    instruction: {
      symbol: 'Foo',
      output: [
        'filename.json',
        {
          filename: 'default.json'
        },
        {
          filename: 'minified.json',
          indent: 'none'
        },
        {
          filename: 'tab-indented.json',
          indent: 'tab'
        },
        {
          filename: 'four-space-indented.json',
          indent: 4
        }
      ]
    }
  })
}

export default fsTree
