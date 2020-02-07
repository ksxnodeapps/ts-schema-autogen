import { Schema } from 'jsonschema'
import { Path, FSX } from '@ts-schema-autogen/types'

export { Schema }
export type JoinPath = Path.Mod['join']
export type ReadFile = FSX.Mod['readFile']

export class SchemaLoader {
  private readonly cache = new Map<string, Schema>()

  constructor (
    private readonly joinPath: JoinPath,
    private readonly readFile: ReadFile
  ) {}

  public async load (name: string): Promise<Schema> {
    const {
      cache,
      joinPath,
      readFile
    } = this

    if (cache.has(name)) return cache.get(name)!

    const filename = joinPath(__dirname, 'schemas', name + '.schema.json')
    const text = await readFile(filename, 'utf8')
    const definition: Schema = JSON.parse(text)
    cache.set(name, definition)
    return definition
  }
}

export default SchemaLoader
