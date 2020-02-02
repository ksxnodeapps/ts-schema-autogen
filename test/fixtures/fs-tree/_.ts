export { safeDump } from 'js-yaml'
export { FsTree } from '../utils/types'
export { default as unit } from '../utils/unit'
export * from '@ts-schema-autogen/types'
import { Config } from '@ts-schema-autogen/types'
export interface Dump {
  (config: Config): string
}
