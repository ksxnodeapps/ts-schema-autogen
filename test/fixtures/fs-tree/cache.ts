import { Config, FsTree } from './_'

const file = (config: Config) => JSON.stringify(config)

const config = (id: number, extension?: string) => file({
  generator: null!,
  extends: extension,
  instruction: {
    compilerOptions: {
      [id]: 'compilerOptions'
    },
    schemaSettings: {
      [id]: 'schemaSettings'
    }
  }
})

export const fsTree: FsTree = {
  '0.json': config(0, '1.json'),
  '1.json': config(1, '2.json'),
  '2.json': config(2, '3.json'),
  '3.json': config(3)
}

export default fsTree
