import { ConfigParser, createJsonFormatDescriptor, createYamlFormatDescriptor } from '@ts-schema-autogen/lib'
export { ConfigParser, createJsonFormatDescriptor, createYamlFormatDescriptor }
export const parsers = Promise.all([
  createJsonFormatDescriptor(),
  createYamlFormatDescriptor()
])
export default parsers
