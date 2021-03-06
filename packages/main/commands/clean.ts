import { objectExtends } from '@tsfun/object'
import { clean, listConfigFiles } from '@ts-schema-autogen/lib'
import { Status } from '@ts-schema-autogen/status'
import { base } from '../param'
import parsers from '../parsers'

export interface CleanParam extends base.Param<unknown, unknown> {}

export async function cmdClean (param: CleanParam) {
  const { modules, args } = param
  const { console } = modules
  const cleanResult = await clean(objectExtends(modules, {
    parsers: await parsers,
    configFiles: listConfigFiles(objectExtends(modules, {
      root: modules.process.cwd(),
      pattern: new RegExp(args.pattern),
      ignored: args.ignored
    }))
  }))
  if (cleanResult.code) {
    console.error('[FAILURE] Failed to clean')
    cleanResult.print(console.error)
    return cleanResult.getStatusCode()
  }
  console.info('[SUCCESS]')
  return Status.Success
}
