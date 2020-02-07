import { Config, FsTree } from './_'

const file = (config: Config) => JSON.stringify(config)
const subTree = (config: Config): FsTree => ({
  '.schema.autogen.json': file(config)
})

export const fsTree: FsTree = {
  'string-instead-of-object': subTree('not a valid config' as any),
  'missing-instruction': subTree({
    instruction: undefined!
  }),
  'invalid-instruction': subTree({
    instruction: [0, 1, 2] as any
  }),
  'multiple-errors': subTree({
    instruction: {
      compilerOptions: {
        strictNullChecks: true,
        strict: false,
        allowJs: 'invalid' as any,
        checkJs: 'invalid' as any,
        esModuleInterop: 'invalid' as any
      },
      schemaSettings: {
        aliasRef: true,
        defaultNumberType: 'invalid' as any,
        excludePrivate: 'invalid' as any
      },
      input: [
        'valid-input.ts',
        {
          invalid: 'input.ts'
        } as any,
        null as any
      ],
      symbol: 'Foo',
      output: [
        'valid-output-filename.json',
        {
          filename: 'valid-output-descriptor.json'
        },
        {
          filename: null as any
        },
        {} as any,
        'invalid' as any
      ]
    }
  })
}

export default fsTree
