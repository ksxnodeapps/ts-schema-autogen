import path from 'path'
import { Schema } from 'jsonschema'
import { readFileSync } from 'fs'

export { Schema }

export class SchemaLoader {
  private readonly cache = new Map<string, Schema>()

  public load (name: string): Schema {
    const { cache } = this
    if (cache.has(name)) return cache.get(name)!
    const filename = path.join(__dirname, 'schemas', name + '.schema.json')
    const text = readFileSync(filename, 'utf8')
    const definition: Schema = JSON.parse(text)
    cache.set(name, definition)
    return definition
  }
}

export default SchemaLoader
