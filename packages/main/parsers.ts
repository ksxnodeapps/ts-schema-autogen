import { ConfigParser, createJsonFormatDescriptor, createYamlFormatDescriptor } from '@ts-schema-autogen/lib'
export { ConfigParser, createJsonFormatDescriptor, createYamlFormatDescriptor }
export const parsers = Promise.all([
  createJsonFormatDescriptor('JSON Parser'),
  createYamlFormatDescriptor('YAML Parser')
])
export default parsers
