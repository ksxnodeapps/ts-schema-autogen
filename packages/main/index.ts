import { TJS, FSX, Path, Process, Console } from '@ts-schema-autogen/types'
import { Status } from '@ts-schema-autogen/status'

export interface ModuleSet<Program, Definition> {
  readonly tjs: TJS.Mod<Program, Definition>
  readonly fsx: FSX.Mod
  readonly path: Path.Mod
  readonly process: Process.Mod
  readonly console: Console.Mod
}

export interface CliArguments {
  readonly showStatus: boolean
}

export interface MainParam<Program, Definition> {
  readonly modules: ModuleSet<Program, Definition>
  readonly args: CliArguments
}

export async function main<Prog, Def> (param: MainParam<Prog, Def>): Promise<Status> {}
