import { omit } from '@tsfun/object'
import TJS from '../tjs'
import { Config, FsTree } from './_'

const jsonFile = (object: any, indent?: string | number) =>
  JSON.stringify(object, undefined, indent) + '\n'
const configFile = (config: Config) => JSON.stringify(config)

const config = (symbol: string) => configFile({
  instruction: {
    symbol,
    output: [
      'filename.json',
      {
        filename: 'default.json'
      },
      {
        filename: 'minified.json',
        indent: 'none'
      },
      {
        filename: 'tab-indented.json',
        indent: 'tab'
      },
      {
        filename: 'four-spaces-indented.json',
        indent: 4
      }
    ]
  }
})

const output = (schema: any): FsTree => ({
  'filename.json': jsonFile(schema, 2),
  'default.json': jsonFile(schema, 2),
  'minified.json': jsonFile(schema, undefined),
  'tab-indented.json': jsonFile(schema, '\t'),
  'four-spaces-indented.json': jsonFile(schema, 4)
})

const subTree = (symbol: string, schema: any): FsTree => ({
  '.schema.autogen.json': config(symbol),
  ...output(schema)
})

const subTreePatch = (
  symbol: string,
  schema: any,
  patch: FsTree = {}
): FsTree => ({ ...subTree(symbol, schema), ...patch })

const subTreeOmit = (
  symbol: string,
  schema: any,
  omitted: readonly string[] = []
): FsTree => omit(subTree(symbol, schema), omitted) as FsTree

export function createFsTree (): FsTree {
  const tjs = new TJS()
  const program = tjs.getProgramFromFiles()
  const generator = new TJS().buildGenerator(program)!
  const foo = generator.getSchemaForSymbol('Foo')
  const bar = generator.getSchemaForSymbol('Bar')
  const baz = generator.getSchemaForSymbol('Baz')
  return {
    'up-to-date': {
      foo: subTree('Foo', foo),
      bar: subTree('Bar', bar),
      baz: subTree('Baz', baz)
    },
    'content-mismatches': {
      foo: subTreePatch('Foo', foo),
      bar: subTreePatch('Bar', bar, {
        'filename.json': jsonFile(foo, 2)
      }),
      baz: subTreePatch('Baz', baz, {
        'default.json': jsonFile(foo, 2),
        'minified.json': jsonFile(bar)
      })
    },
    'content-missing': {
      foo: subTreeOmit('Foo', foo),
      bar: subTreeOmit('Bar', bar, [
        'filename.json'
      ]),
      baz: subTreeOmit('Baz', baz, [
        'default.json',
        'minified.json'
      ])
    }
  }
}

export default createFsTree
