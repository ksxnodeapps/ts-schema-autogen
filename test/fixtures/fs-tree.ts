import { safeDump } from 'js-yaml'
import { Config } from '@ts-schema-autogen/types'

export const fsTree = {
  default: {
    filename: {
      yaml: {
        '.schema.autogen.yaml': safeDump({
          generator: undefined!,
          instruction: [{
            // TODO: Add later
          }]
        } as Config)
      }
    }
  }
}

export default fsTree
