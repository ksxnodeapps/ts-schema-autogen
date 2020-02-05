import { ConfigParser, createJsonConfigParser, createYamlConfigParser } from '@ts-schema-autogen/lib'
export { ConfigParser, createJsonConfigParser, createYamlConfigParser }
export const parsers = Promise.all([
  createJsonConfigParser('JSON Parser'),
  createYamlConfigParser('YAML Parser')
])
export default parsers
