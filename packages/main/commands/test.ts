import { addProperty } from '@tsfun/object'
import { Status } from '@ts-schema-autogen/status'
import { SchemaWriter } from '@ts-schema-autogen/lib'
import { base } from '../param'
import listConfigFiles from '../list-config-files'
import parsers from '../parsers'

export interface TestParam<Program, Definition> extends base.Param<Program, Definition> {}

export async function cmdTest<Prog, Def> (param: TestParam<Prog, Def>) {
  const { modules } = param
  const { console } = modules
  const configFilesPromise = listConfigFiles(param)
  const writer = new SchemaWriter(addProperty(modules, 'parsers', await parsers))
  const testResult = await writer.testSchemas(await configFilesPromise)
  if (testResult.code) {
    console.error('[FAILURE] Some errors occurred')
    testResult.print(console.error)
    return testResult.code
  }

  console.info('[SUCCESS] All tests passed')
  return Status.Success
}
