import { Config, FsTree, dump } from './_'

// Don't use safeDump.
// Only unsafe version of js-yaml can serialize undefined, which is tested against.
const file = (config: Config) => dump(config)

const config = (value: 'base' | 'extension' | undefined): Config => ({
  generator: null!,
  instruction: {
    compilerOptions: {
      a: {
        b: value
      },
      c: value
    } as any,
    schemaSettings: {
      a: value,
      b: {
        c: value
      }
    } as any
  }
})

const base = (value: 'base' | undefined) => file({
  ...config(value),
  extends: 'extension.json'
})

const extension = (value: 'extension' | undefined) => file(config(value))

export const fsTree: FsTree = {
  'both-undefined': {
    'base.json': base(undefined),
    'extension.json': extension(undefined)
  },
  'undefined-base,defined-extension': {
    'base.json': base(undefined),
    'extension.json': extension('extension')
  },
  'defined-base,undefined-extension': {
    'base.json': base('base'),
    'extension.json': extension(undefined)
  },
  'both-defined': {
    'base.json': base('base'),
    'extension.json': extension('extension')
  }
}

export default fsTree
