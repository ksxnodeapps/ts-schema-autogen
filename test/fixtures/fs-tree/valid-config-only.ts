import { safeDump } from 'js-yaml'
import { FsTree } from '../utils/types'
import unit from '../utils/unit'

import {
  Config,
  InstructionSharedProperties,
  SingleSymbolInstruction,
  MultiSymbolInstruction,
  OutputDescriptor
} from '@ts-schema-autogen/types'

interface Dump {
  (config: Config): string
}

const subTree = (basename: string, dump: Dump): FsTree => ({
  'extensions': {
    'abc.yaml': safeDump({
      instruction: {
        compilerOptions: {
          'extension format': 'YAML',
          'extension property': 'compilerOptions',
          '(compilerOptions) extends': 'abc.yaml'
        },
        schemaSettings: {
          'extension format': 'YAML',
          'extension property': 'schemaSettings',
          '(schemaSettings) extends': 'abc.yaml'
        }
      } as InstructionSharedProperties
    } as Config),
    'abc.json': JSON.stringify({
      instruction: {
        compilerOptions: {
          'extension format': 'JSON',
          'extension property': 'compilerOptions',
          '(compilerOptions) extends': 'abc.json'
        },
        schemaSettings: {
          'extension format': 'JSON',
          'extension property': 'schemaSettings',
          '(schemaSettings) extends': 'abc.json'
        }
      } as InstructionSharedProperties
    } as Config, undefined, 2)
  },
  'single-symbol': {
    'single-output': {
      'output-filename': {
        [basename]: dump({
          generator: undefined!,
          extends: [
            '../../extensions/abc.yaml',
            '../../extensions/abc.json'
          ],
          instruction: unit<SingleSymbolInstruction>({
            symbol: 'Foo',
            output: 'output.schema.json'
          })
        })
      },
      'output-descriptor': dump({
        generator: undefined!,
        extends: [
          '../../extensions/abc.yaml',
          '../../extensions/abc.json'
        ],
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
        [basename]: dump({
          generator: undefined!,
          extends: [
            '../../extensions/abc.yaml',
            '../../extensions/abc.json'
          ],
          instruction: unit<SingleSymbolInstruction>({
            symbol: 'Foo',
            output: 'output.schema.json'
          })
        })
      },
      'output-descriptor': {
        [basename]: dump({
          generator: undefined!,
          extends: [
            '../../extensions/abc.yaml',
            '../../extensions/abc.json'
          ],
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
        [basename]: dump({
          generator: undefined!,
          extends: [
            '../../extensions/abc.yaml',
            '../../extensions/abc.json'
          ],
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
        [basename]: dump({
          generator: undefined!,
          extends: [
            '../../extensions/abc.yaml',
            '../../extensions/abc.json'
          ],
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
        [basename]: dump({
          generator: undefined!,
          extends: [
            '../../extensions/abc.yaml',
            '../../extensions/abc.json'
          ],
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
  yaml: subTree('.schema.autogen.yaml', safeDump),
  json: subTree('.schema.autogen.json', config => JSON.stringify(config, undefined, 2))
}

export default fsTree
