import { addProperty, objectExtends } from '@tsfun/object'
import { Status } from '@ts-schema-autogen/status'
import { SchemaWriter, listConfigFiles } from '@ts-schema-autogen/lib'
import { ModuleSet } from './module-set'
import parsers from './parsers'

export async function generate<Prog, Def> (param: generate.Param<Prog, Def>): Promise<Status> {
  const { modules } = param
  const { basename, ignored } = param.args
  const root = modules.process.cwd()
  const configFilesIterator = listConfigFiles(objectExtends(modules, { root, basename, ignored }))
  const writer = new SchemaWriter(addProperty(modules, 'parsers', await parsers))
  writer.writeSchemas(configFilesIterator)
}

export namespace generate {
  export interface Param<Program, Definition> {
    readonly modules: ModuleSet<Program, Definition>
    readonly args: CliArguments
  }

  export interface CliArguments {
    readonly basename: string
    readonly ignored: readonly string[]
  }
}
