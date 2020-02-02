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
      generator: null!,
      extends: 'def-json',
      instruction: {
        compilerOptions: {
          '(extensions.abc.compilerOptions) format': 'YAML',
          '(extensions.abc.compilerOptions) property': 'compilerOptions',
          '(extensions.abc.compilerOptions) filename': 'abc.yaml'
        },
        schemaSettings: {
          '(extensions.abc.schemaSettings) format': 'YAML',
          '(extensions.abc.schemaSettings) property': 'schemaSettings',
          '(extensions.abc.schemaSettings) filename': 'abc.yaml'
        }
      } as InstructionSharedProperties
    } as Config),
    'abc.json': JSON.stringify({
      generator: null!,
      extends: 'def-yaml',
      instruction: {
        compilerOptions: {
          '(extensions.abc.compilerOptions) format': 'JSON',
          '(extensions.abc.compilerOptions) property': 'compilerOptions',
          '(extensions.abc.compilerOptions) filename': 'abc.json'
        },
        schemaSettings: {
          '(extensions.abc.schemaSettings) format': 'JSON',
          '(extensions.abc.schemaSettings) property': 'schemaSettings',
          '(extensions.abc.schemaSettings) filename': 'abc.json'
        }
      } as InstructionSharedProperties
    } as Config, undefined, 2),
    'def-yaml': safeDump({
      generator: null!,
      instruction: {
        compilerOptions: {
          '(extensions.def.compilerOptions) format': 'YAML',
          '(extensions.def.compilerOptions) property': 'compilerOptions',
          '(extensions.def.compilerOptions) filename': 'def-yaml'
        },
        schemaSettings: {
          '(extensions.def.schemaSettings) format': 'YAML',
          '(extensions.def.schemaSettings) property': 'schemaSettings',
          '(extensions.def.schemaSettings) filename': 'def-yaml'
        }
      } as InstructionSharedProperties
    } as Config),
    'def-json': JSON.stringify({
      generator: null!,
      instruction: {
        compilerOptions: {
          '(extensions.def.compilerOptions) format': 'JSON',
          '(extensions.def.compilerOptions) property': 'compilerOptions',
          '(extensions.def.compilerOptions) filename': 'def-json'
        },
        schemaSettings: {
          '(extensions.def.schemaSettings) format': 'JSON',
          '(extensions.def.schemaSettings) property': 'schemaSettings',
          '(extensions.def.schemaSettings) filename': 'def-json'
        }
      } as InstructionSharedProperties
    } as Config, undefined, 2)
  },
  'single-symbol': {
    'single-output': {
      'output-filename': {
        [basename]: dump({
          generator: null!,
          extends: [
            '../../../extensions/abc.yaml',
            '../../../extensions/abc.json'
          ],
          instruction: unit<SingleSymbolInstruction>({
            compilerOptions: {
              '(base.compilerOptions) filename': basename
            } as any,
            schemaSettings: {
              '(base.schemaSettings) filename': basename
            } as any,
            symbol: 'Foo',
            output: 'output.schema.json'
          })
        })
      },
      'output-descriptor': {
        [basename]: dump({
          generator: null!,
          extends: [
            '../../../extensions/abc.yaml',
            '../../../extensions/abc.json'
          ],
          instruction: unit<SingleSymbolInstruction>({
            compilerOptions: {
              '(base.compilerOptions) filename': basename
            } as any,
            schemaSettings: {
              '(base.schemaSettings) filename': basename
            } as any,
            symbol: 'Foo',
            output: unit<OutputDescriptor>({
              filename: 'output.schema.json',
              format: 'json',
              indent: 'tab'
            })
          })
        })
      }
    },
    'multiple-output': {
      'output-filename': {
        [basename]: dump({
          generator: null!,
          extends: [
            '../../../extensions/abc.yaml',
            '../../../extensions/abc.json'
          ],
          instruction: unit<SingleSymbolInstruction>({
            compilerOptions: {
              '(base.compilerOptions) filename': basename
            } as any,
            schemaSettings: {
              '(base.schemaSettings) filename': basename
            } as any,
            symbol: 'Foo',
            output: [
              'abc.schema.json',
              'def.schema.json',
              'ghi.schema.json'
            ]
          })
        })
      },
      'output-descriptor': {
        [basename]: dump({
          generator: null!,
          extends: [
            '../../../extensions/abc.yaml',
            '../../../extensions/abc.json'
          ],
          instruction: unit<SingleSymbolInstruction>({
            compilerOptions: {
              '(base.compilerOptions) filename': basename
            } as any,
            schemaSettings: {
              '(base.schemaSettings) filename': basename
            } as any,
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
  'multiple-symbol': {
    'single-output': {
      'output-filename': {
        [basename]: dump({
          generator: null!,
          extends: [
            '../../../extensions/abc.yaml',
            '../../../extensions/abc.json'
          ],
          instruction: unit<MultiSymbolInstruction>({
            compilerOptions: {
              '(base.compilerOptions) filename': basename
            } as any,
            schemaSettings: {
              '(base.schemaSettings) filename': basename
            } as any,
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
          generator: null!,
          extends: [
            '../../../extensions/abc.yaml',
            '../../../extensions/abc.json'
          ],
          instruction: unit<MultiSymbolInstruction>({
            compilerOptions: {
              '(base.compilerOptions) filename': basename
            } as any,
            schemaSettings: {
              '(base.schemaSettings) filename': basename
            } as any,
            list: [
              {
                output: unit<OutputDescriptor>({
                  filename: 'foo.schema.json',
                  format: 'json',
                  indent: 'tab'
                }),
                symbol: 'Foo'
              },
              {
                output: unit<OutputDescriptor>({
                  filename: 'bar.schema.json',
                  format: 'json',
                  indent: 'tab'
                }),
                symbol: 'Bar'
              }
            ]
          })
        })
      }
    },
    'multiple-output': {
      'output-filename': {
        [basename]: dump({
          generator: null!,
          extends: [
            '../../../extensions/abc.yaml',
            '../../../extensions/abc.json'
          ],
          instruction: unit<MultiSymbolInstruction>({
            compilerOptions: {
              '(base.compilerOptions) filename': basename
            } as any,
            schemaSettings: {
              '(base.schemaSettings) filename': basename
            } as any,
            list: [
              {
                output: [
                  'abc.foo.schema.json',
                  'def.foo.schema.json',
                  'ghi.foo.schema.json'
                ],
                symbol: 'Foo'
              },
              {
                output: [
                  'abc.bar.schema.json',
                  'def.bar.schema.json',
                  'ghi.bar.schema.json'
                ],
                symbol: 'Bar'
              }
            ]
          })
        })
      },
      'output-descriptor': {
        [basename]: dump({
          generator: null!,
          extends: [
            '../../../extensions/abc.yaml',
            '../../../extensions/abc.json'
          ],
          instruction: unit<MultiSymbolInstruction>({
            compilerOptions: {
              '(base.compilerOptions) filename': basename
            } as any,
            schemaSettings: {
              '(base.schemaSettings) filename': basename
            } as any,
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
