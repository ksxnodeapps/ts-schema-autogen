import { Config, FsTree } from './_'

const file = (config: Config) => JSON.stringify(config)
const config = (target?: string | readonly string[]) => file({
  extends: target,
  instruction: {}
})

export const fsTree: FsTree = {
  1: {
    '0.json': config('0.json')
  },

  2: {
    '0.json': config('1.json'),
    '1.json': config('0.json')
  },

  3: {
    '0.json': config('1.json'),
    '1.json': config('2.json'),
    '2.json': config('0.json')
  },

  tree: {
    '0.json': config(['1/a/0.json', '1/b/0.json']),
    1: {
      a: {
        '0.json': config('1.json'),
        '1.json': config('0.json')
      },
      b: {
        '0.json': config('1.json'),
        '1.json': config('0.json')
      }
    }
  },

  diamond: {
    '0.json': config('1.json'),
    '1.json': config(['2/a/0.json', '2/b/0.json', '2/c/0.json']),
    2: {
      a: {
        '0.json': config('1.json'),
        '1.json': config('../../3/return.json')
      },
      b: {
        '0.json': config('1.json'),
        '1.json': config('../../3/return.json')
      },
      c: {
        '0.json': config('1.json'),
        '1.json': config('../../3/escape.json')
      }
    },
    3: {
      'return.json': config('../1.json'),
      'escape.json': config('../4.json')
    },
    '4.json': config()
  }
}

export default fsTree
