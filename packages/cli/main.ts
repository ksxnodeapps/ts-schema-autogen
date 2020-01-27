import path from 'path'
import console from 'console'
import process from 'process'
import * as tjs from 'typescript-json-schema'
import * as fsx from 'fs-extra'
import yargs from 'yargs'
import { DEFAULT_PATTERN, DEFAULT_IGNORED, Status, ModuleSet, cmdTest, cmdGenerate, cmdClean } from '@ts-schema-autogen/main'

const modules: ModuleSet<tjs.Program, tjs.Definition> = {
  path,
  console,
  process,
  tjs,
  fsx
}

export const buildArgs = (yargs: yargs.Argv) => yargs
  .option('pattern', {
    type: 'string',
    describe: 'Regular expression that matches basename of config files',
    default: DEFAULT_PATTERN
  })
  .option('ignored', {
    type: 'array',
    describe: 'Name of directories to be ignored',
    default: DEFAULT_IGNORED
  })

const handleStatus = (status: Promise<Status>) => status
  .then(status => process.exit(status))
  .catch(error => {
    console.error(error)
    return process.exit(Status.FatalError)
  })

// tslint:disable-next-line:no-unused-expression
yargs
  .command(
    'test',
    'Check for out-of-date schema files',
    buildArgs,
    args => handleStatus(cmdTest({ args, modules }))
  )
  .command(
    'generate',
    'Generate schema files',
    buildArgs,
    args => handleStatus(cmdGenerate({ args, modules }))
  )
  .command(
    'clean',
    'Delete generated schema files',
    buildArgs,
    args => handleStatus(cmdClean({ args, modules }))
  )
  .demandCommand()
  .env('TS_SCHEMA_AUTOGEN')
  .help()
  .argv
