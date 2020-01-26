import { ConsoleInstance } from 'simple-fake-console'
import { Console } from '@ts-schema-autogen/types'

export class FakeConsole implements Console.Mod {
  public readonly core = new ConsoleInstance()
  public readonly info = jest.fn(this.core.info)
  public readonly error = jest.fn(this.core.error)
}
