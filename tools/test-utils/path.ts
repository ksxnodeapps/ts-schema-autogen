import Base, { symCwd, symRoot } from 'simple-fake-path'
import { Path } from '@ts-schema-autogen/types'

export class FakePath extends Base implements Path.Mod {
  public readonly [symCwd] = undefined!
  public readonly [symRoot] = ['/']
  public readonly sep = '/'
}
