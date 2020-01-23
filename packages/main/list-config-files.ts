import { pass } from '@tsfun/pipe'
import { objectExtends } from '@tsfun/object'
import { getAsyncArray } from '@ts-schema-autogen/utils'
import { listConfigFiles as iterateConfigFiles } from '@ts-schema-autogen/lib'
import { base } from './param'

export async function listConfigFiles (param: base.Param<unknown, unknown>) {
  const { modules } = param
  const { basename, ignored } = param.args
  const root = modules.process.cwd()
  return pass(modules)
    .to(objectExtends, { root, basename, ignored })
    .to(iterateConfigFiles)
    .to(getAsyncArray)
    .get()
}

export default listConfigFiles
