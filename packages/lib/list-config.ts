import traverse from 'fast-traverse'
import { FSX, Path } from '@ts-schema-autogen/types'

/** List all config files within a directory recursively */
export async function * listConfigFiles (param: listConfigFiles.Param) {
  const { ignored } = param
  const { stat, readdir } = param.fsx
  const { join } = param.path

  const traversalResults = traverse({
    deep: item => !ignored.includes(item.basename),
    dirname: param.root,
    stat,
    readdir,
    join
  })

  for await (const item of traversalResults) {
    for (const basename of item.list) {
      if (basename === param.basename) yield join(item.dirname, basename)
    }
  }
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
}
