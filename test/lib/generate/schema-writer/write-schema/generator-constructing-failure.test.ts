import { FakeFileSystem, FakePath, FakeTJS, printResult } from '@tools/test-utils'

import {
  Config,
  Status,
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

it('returns result containing expected properties', async () => {
  const { result } = await setup()
  expect(result).toMatchObject({
    code: Status.GeneratorConstructingFailure,
    error: {
      program: expect.any(Object),
      settings: undefined
    }
  })
})

it('does not call outputFile', async () => {
  const { fsx } = await setup()
  expect(fsx.outputFile).not.toBeCalled()
})

it('error messages', async () => {
  const { result } = await setup()
  expect(printResult(result)).toMatchSnapshot()
})

it('status code', async () => {
  const { result } = await setup()
  expect(result.getStatusCode()).toBe(Status.GeneratorConstructingFailure)
})
