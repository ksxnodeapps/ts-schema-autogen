import { pass } from '@tsfun/pipe'
import { addProperty, objectExtends } from '@tsfun/object'
import { getAsyncArray } from '@ts-schema-autogen/utils'
import { Status } from '@ts-schema-autogen/status'
import { SchemaWriter, listConfigFiles } from '@ts-schema-autogen/lib'
import { base } from '../param'
import parsers from '../parsers'

export interface GenerateParam<Program, Definition> extends base.Param<Program, Definition> {}

export async function cmdGenerate<Prog, Def> (param: GenerateParam<Prog, Def>) {
  const { modules } = param
  const { console } = modules
  const { basename, ignored } = param.args
  const root = modules.process.cwd()
  const configFilesPromise = pass(modules)
    .to(objectExtends, { root, basename, ignored })
    .to(listConfigFiles)
    .to(getAsyncArray)
    .get()
  const writer = new SchemaWriter(addProperty(modules, 'parsers', await parsers))
  const writeResult = await writer.writeSchemas(await configFilesPromise)
  if (writeResult.code) {
    console.error('[ERROR] Failed to generate JSON schemas')
    console.error(writeResult) // TODO: Implement Failure::toString() and use it here
    return writeResult.code
  }

  console.info('[SUCCESS]')
  return Status.Success
}
