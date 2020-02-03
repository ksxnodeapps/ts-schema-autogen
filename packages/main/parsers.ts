import { ConfigParser, createJsonConfigParser, createYamlConfigParser } from '@ts-schema-autogen/lib'
export { ConfigParser, createJsonConfigParser as createJsonFormatDescriptor, createYamlConfigParser as createYamlFormatDescriptor }
export const parsers = Promise.all([
  createJsonConfigParser('JSON Parser'),
  createYamlConfigParser('YAML Parser')
])
export default parsers
