import { safeDump } from 'js-yaml'
import { FsTree } from './utils/types'
import unit from './utils/unit'

import {
  Config,
  SingleSymbolInstruction,
  MultiSymbolInstruction,
  OutputDescriptor
} from '@ts-schema-autogen/types'

const dump = <X> (x: X) => safeDump(x)
const dumpConfig = (config: Config) => dump(config)

export const fsTree: FsTree = {
  yaml: {
    'single-symbol': {
      'single-output': {
        'output-filename': {
          '.schema.autogen.yaml': dumpConfig({
            generator: undefined!,
            instruction: unit<SingleSymbolInstruction>({
              symbol: 'Foo',
              output: 'output.schema.json'
            })
          })
        },
        'output-descriptor': dumpConfig({
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
          '.schema.autogen.yaml': dumpConfig({
            generator: undefined!,
            instruction: unit<SingleSymbolInstruction>({
              symbol: 'Foo',
              output: 'output.schema.json'
            })
          })
        },
        'output-descriptor': dumpConfig({
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
    },
    'multi-symbol': {
      'single-output': {
        'output-filename': {
          '.schema.autogen.yaml': dumpConfig({
            generator: undefined!,
            instruction: unit<MultiSymbolInstruction>({
              compilerOptions: {},
              input: [],
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
      }
    }
  }
}

export default fsTree
