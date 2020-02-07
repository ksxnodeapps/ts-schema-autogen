import { Config, FsTree } from './_'

const file = (config: Config) => JSON.stringify(config)
const subTree = (input?: string | readonly string[]): FsTree => ({
  '.schema.autogen.json': file({
    instruction: {
      compilerOptions: {
        strictNullChecks: true,
        strict: true
      },
      schemaSettings: {
        required: true
      },
      input,
      symbol: 'Foo',
      output: input + '.schema.json'
    }
  })
})

export const fsTree: FsTree = {
  'no-input': subTree(),
  'input-filename': subTree('input.ts'),
  'input-array': subTree([
    'input/abc.ts',
    'input/def.ts',
    'input/ghi.ts'
  ])
}

export default fsTree
