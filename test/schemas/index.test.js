'use strict'
const cmd = require('@tools/test-spawn')
const preloadedNode = require('@tools/preloaded-node').bin
const tsSchemaAutogen = require.resolve('@ts-schema-autogen/cli/ts-schema-autogen')

it('TypeScript JSON Schema: Test', () => {
  cmd({
    defaultExecutable: 'node',
    argvPrefix: [preloadedNode, tsSchemaAutogen, 'test'],
    envMiddleName: 'SCHEMA_TEST'
  })
})
