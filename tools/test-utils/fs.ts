import { StringPathFileSystem } from 'simple-fake-fs'
import { FSX } from '@ts-schema-autogen/types'

export class FakeFileSystem extends StringPathFileSystem implements FSX.Mod {}
