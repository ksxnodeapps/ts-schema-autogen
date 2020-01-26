import { Process } from '@ts-schema-autogen/types'

export class FakeProcess implements Process.Mod {
  constructor (private readonly workDir: string) {}
  public readonly cwd = jest.fn(() => this.workDir)
}
