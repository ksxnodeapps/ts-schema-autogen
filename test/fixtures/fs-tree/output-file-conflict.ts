import { Config, FsTree } from './_'

const file = (config: Config) => JSON.stringify(config)

export const fsTree: FsTree = {
  'obvious-duplication': {
    'foo.json': file({
      generator: null!,
      instruction: {
        output: 'shared-output.json',
        symbol: 'Foo'
      }
    }),
    'bar.json': file({
      generator: null!,
      instruction: {
        output: 'shared-output.json',
        symbol: 'Bar'
      }
    })
  },
  'not-obvious-duplication': {
    foo: {
      '.schema.autogen.json': file({
        generator: null!,
        instruction: {
          output: [
            '../shared-output/schema.json'
          ],
          symbol: 'Foo'
        }
      })
    },
    'bar.schema.autogen.json': file({
      generator: null!,
      instruction: {
        output: {
          filename: 'shared-output/schema.json'
        },
        symbol: 'Bar'
      }
    })
  }
}

export default fsTree
