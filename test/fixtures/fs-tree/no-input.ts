import { Config, FsTree } from './_'

const file = (config: Config) => JSON.stringify(config)

export const fsTree: FsTree = {
  'no-input.schema.autogen.json': file({
    instruction: {
      input: undefined,
      symbol: 'Foo',
      output: 'no-input.schema.json',
      compilerOptions: 'compilerOptions' as any
    }
  }),
  'empty-string-input.schema.autogen.json': file({
    instruction: {
      input: '',
      symbol: 'Bar',
      output: 'empty-string-input.schema.json',
      compilerOptions: 'compilerOptions' as any
    }
  })
}

export default fsTree
