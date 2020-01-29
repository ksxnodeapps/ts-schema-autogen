import { StringPathFileSystem } from 'simple-fake-fs'
import { FSX } from '@ts-schema-autogen/types'

export class FakeFileSystem extends StringPathFileSystem implements FSX.Mod {
  private mkfn<Xs extends any[], Y> (fn: (...xs: Xs) => Y) {
    return jest.fn(async (...xs: Xs) => fn.apply(this, xs))
  }

  public readonly stat = this.mkfn(this.statSync)
  public readonly readdir = this.mkfn(this.readdirSync)
  public readonly readFile = this.mkfn(this.readFileSync)
  public readonly outputFile = this.mkfn(this.outputFileSync)
  public readonly writeFile = this.mkfn(this.writeFileSync)
  public readonly remove = jest.fn()
}
