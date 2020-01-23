import { TJS, FSX, Path, Process, Console } from '@ts-schema-autogen/types'

export interface ModuleSet<Program, Definition> {
  readonly tjs: TJS.Mod<Program, Definition>
  readonly fsx: FSX.Mod
  readonly path: Path.Mod
  readonly process: Process.Mod
  readonly console: Console.Mod
}
