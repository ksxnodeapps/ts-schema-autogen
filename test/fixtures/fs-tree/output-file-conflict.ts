import { Config, FsTree } from './_'

const file = (config: Config) => JSON.stringify(config)

export const fsTree: FsTree = {
  'obvious-conflicts': {
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
  'not-obvious-conflicts': {
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
  },
  'more-than-one-conflicts': {
    foo: file({
      generator: null!,
      instruction: {
        output: 'shared-output.json',
        symbol: 'Foo'
      }
    }),
    bar: file({
      generator: null!,
      instruction: {
        output: 'shared-output.json',
        symbol: 'Bar'
      }
    }),
    baz: file({
      generator: null!,
      instruction: {
        output: 'shared-output.json',
        symbol: 'Baz'
      }
    })
  }
}

export default fsTree
