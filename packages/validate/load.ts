import path from 'path'
import { Schema } from 'jsonschema'
import { readFile } from 'fs-extra'

export { Schema }

export class SchemaLoader {
  private readonly cache = new Map<string, Schema>()

  public async load (name: string): Promise<Schema> {
    const { cache } = this
    if (cache.has(name)) return cache.get(name)!
    const filename = path.join(__dirname, 'schemas', name + '.schema.json')
    const text = await readFile(filename, 'utf8')
    const definition: Schema = JSON.parse(text)
    cache.set(name, definition)
    return definition
  }
}

export default SchemaLoader
