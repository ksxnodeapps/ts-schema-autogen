import { FsTree } from './_'

const def = <Value> (mod: { readonly default: Value }) => mod.default

export const createFsTree = async (): Promise<FsTree> => ({
  'circular-reference': await import('./circular-reference').then(def),
  'file-reading-failure': await import('./file-reading-failure').then(def),
  'output-file-conflict': await import('./output-file-conflict').then(def),
  'text-parsing-failure': await import('./invalid-syntax').then(def),
  'valid-config-only': await import('./valid-config-only').then(def)
})

export default createFsTree
