import { Item, traverse } from 'fast-traverse'
import { FSX, Path } from '@ts-schema-autogen/types'

export function listConfigFiles (param: listConfigFiles.Param): listConfigFiles.Return {
  const { ignored } = param
  const { stat, readdir } = param.fsx
  const { join } = param.path
  return traverse({
    deep: item => !ignored.includes(item.basename),
    dirname: param.root,
    stat,
    readdir,
    join
  })
}

export namespace listConfigFiles {
  export interface Param {
    /** `fs-extra` to list directories */
    readonly fsx: FSX.Mod

    /** `path` module to manipulate paths */
    readonly path: Path.Mod

    /** Root directory */
    readonly root: string

    /** Ignored directories */
    readonly ignored: readonly string[]

    /** Config basename */
    readonly basename: string
  }

  export interface Return
  extends AsyncGenerator<Item<string | undefined, string, readonly string[]>> {}
}
