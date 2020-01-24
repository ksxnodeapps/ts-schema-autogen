import path from 'path'
import console from 'console'
import process from 'process'
import * as tjs from 'typescript-json-schema'
import * as fsx from 'fs-extra'
import yargs from 'yargs'
import { Status, ModuleSet, cmdGenerate, cmdClean } from '@ts-schema-autogen/main'

const modules: ModuleSet<tjs.Program, tjs.Definition> = {
  path,
  console,
  process,
  tjs,
  fsx
}

export const buildArgs = (yargs: yargs.Argv) => yargs
  .option('basename', {
    type: 'string',
    describe: 'Extension-less name of config files',
    default: 'schema.autogen'
  })
  .option('ignored', {
    type: 'array',
    describe: 'Name of directories to be ignored',
    default: ['.git', 'node_modules']
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
