import { ModuleSet } from './module-set'

export namespace base {
  export interface Param<Program, Definition> {
    readonly modules: ModuleSet<Program, Definition>
    readonly args: CliArguments
  }

  export interface CliArguments {
    readonly pattern: string
    readonly ignored: readonly string[]
  }
}
