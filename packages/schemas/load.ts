import path from 'path'
import { Schema } from 'jsonschema'
import { readFileSync } from 'fs'

export { Schema }

export class SchemaLoader {
  public load (name: string): Schema {
    const filename = path.join(__dirname, name + '.schema.json')
    const text = readFileSync(filename, 'utf8')
    return JSON.parse(text)
  }
}

export default SchemaLoader
