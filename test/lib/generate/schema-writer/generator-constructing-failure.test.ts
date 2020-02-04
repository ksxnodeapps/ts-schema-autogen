import { FakeFileSystem, FakePath, FakeTJS } from '@tools/test-utils'

import {
  Config,
  GeneratorConstructingFailure,
  SchemaWriter,
  createJsonConfigParser
} from '@ts-schema-autogen/lib'

class TJS extends FakeTJS<never> {
  protected readonly defMap = new Map<never, never>()
  protected implBuildGenerator () {
    return null
  }
}

async function setup () {
  const fsx = new FakeFileSystem('/')
  const path = new FakePath()
  const tjs = new TJS()
  const configPath = 'config.json'
  fsx.writeFileSync(configPath, JSON.stringify({
    generator: null!,
    instruction: {
      symbol: 'Foo',
      output: 'output.json'
    }
  } as Config))
  const schemaWriter = new SchemaWriter({
    fsx,
    path,
    tjs,
    parsers: [
      await createJsonConfigParser('JSON Parser')
    ]
  })
  const result = await schemaWriter.writeSchemas([configPath])
  return { fsx, path, tjs, configPath, result }
}

it('returns result matching snapshots', async () => {
  const { result } = await setup()
  expect(result).toMatchSnapshot()
})

it('returns a GeneratorConstructingFailure', async () => {
  const { result } = await setup()
  expect(result).toBeInstanceOf(GeneratorConstructingFailure)
})
