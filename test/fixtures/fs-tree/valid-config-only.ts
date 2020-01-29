import { safeDump } from 'js-yaml'
import { FsTree } from '../utils/types'
import unit from '../utils/unit'

import {
  Config,
  SingleSymbolInstruction,
  MultiSymbolInstruction,
  OutputDescriptor
} from '@ts-schema-autogen/types'

interface Dump {
  (config: Config): string
}

const subTree = (dump: Dump) => ({
  'single-symbol': {
    'single-output': {
      'output-filename': {
        '.schema.autogen.yaml': dump({
          generator: undefined!,
          instruction: unit<SingleSymbolInstruction>({
            symbol: 'Foo',
            output: 'output.schema.json'
          })
        })
      },
      'output-descriptor': dump({
        generator: undefined!,
        instruction: unit<SingleSymbolInstruction>({
          symbol: 'Foo',
          output: unit<OutputDescriptor>({
            filename: 'output.schema.json',
            format: 'json',
            indent: 'tab'
          })
        })
      })
    },
    'multiple-output': {
      'output-filename': {
        '.schema.autogen.yaml': dump({
          generator: undefined!,
          instruction: unit<SingleSymbolInstruction>({
            symbol: 'Foo',
            output: 'output.schema.json'
          })
        })
      },
      'output-descriptor': {
        '.schema.autogen.yaml': dump({
          generator: undefined!,
          instruction: unit<SingleSymbolInstruction>({
            symbol: 'Foo',
            output: [
              'non-descriptor.schema.json',
              unit<OutputDescriptor>({
                filename: 'default-descriptor.schema.json'
              }),
              unit<OutputDescriptor>({
                filename: 'custom-descriptor.schema.json',
                format: 'json',
                indent: 'tab'
              })
            ]
          })
        })
      }
    }
  },
  'multi-symbol': {
    'single-output': {
      'output-filename': {
        '.schema.autogen.yaml': dump({
          generator: undefined!,
          instruction: unit<MultiSymbolInstruction>({
            list: [
              {
                output: 'foo.schema.json',
                symbol: 'Foo'
              },
              {
                output: 'bar.schema.json',
                symbol: 'Bar'
              }
            ]
          })
        })
      },
      'output-descriptor': {
        '.schema.autogen.yaml': dump({
          generator: undefined!,
          instruction: unit<MultiSymbolInstruction>({
            list: [
              {
                output: 'foo.schema.json',
                symbol: 'Foo'
              },
              {
                output: 'bar.schema.json',
                symbol: 'Bar'
              }
            ]
          })
        })
      }
    },
    'multi-output': {
      'output-filename': {
        '.schema.autogen.yaml': dump({
          generator: undefined!,
          instruction: unit<MultiSymbolInstruction>({
            list: [
              {
                output: [
                  'foo.filename.schema.json',
                  {
                    filename: 'foo.default.schema.json'
                  },
                  {
                    filename: 'foo.custom.schema.json',
                    format: 'json',
                    indent: 'tab'
                  }
                ],
                symbol: 'Foo'
              },
              {
                output: [
                  {
                    filename: 'bar.4.schema.json',
                    format: 'json',
                    indent: 4
                  }
                ],
                symbol: 'Bar'
              }
            ]
          })
        })
      }
    }
  }
})

export const fsTree: FsTree = {
  yaml: subTree(safeDump),
  json: subTree(config => JSON.stringify(config, undefined, 2))
}

export default fsTree
