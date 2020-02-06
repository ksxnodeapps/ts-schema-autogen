import { Config, FsTree } from './_'

const file = (config: Config) => JSON.stringify(config)

export const fsTree: FsTree = {
  'obvious-conflicts': {
    'foo.json': file({
      instruction: {
        output: 'shared-output.json',
        symbol: 'Foo'
      }
    }),
    'bar.json': file({
      instruction: {
        output: 'shared-output.json',
        symbol: 'Bar'
      }
    })
  },
  'not-obvious-conflicts': {
    foo: {
      '.schema.autogen.json': file({
        instruction: {
          output: [
            '../shared-output/schema.json'
          ],
          symbol: 'Foo'
        }
      })
    },
    'bar.schema.autogen.json': file({
      instruction: {
        output: {
          filename: 'shared-output/schema.json'
        },
        symbol: 'Bar'
      }
    })
  },
  'more-than-one-conflicts': {
    'foo.json': file({
      instruction: {
        output: 'shared-output.json',
        symbol: 'Foo'
      }
    }),
    'bar.json': file({
      instruction: {
        output: 'shared-output.json',
        symbol: 'Bar'
      }
    }),
    'baz.json': file({
      instruction: {
        output: 'shared-output.json',
        symbol: 'Baz'
      }
    })
  },
  'mixed-with-non-conflicts': {
    'conflicted-foo.json': file({
      instruction: {
        output: 'shared-output.json',
        symbol: 'Foo'
      }
    }),
    'okay-foo.json': file({
      instruction: {
        output: 'foo.schema.json',
        symbol: 'Foo'
      }
    }),
    'conflicted-bar.json': file({
      instruction: {
        output: 'shared-output.json',
        symbol: 'Bar'
      }
    }),
    'okay-bar.json': file({
      instruction: {
        output: 'bar.schema.json',
        symbol: 'Bar'
      }
    })
  }
}

export default fsTree
