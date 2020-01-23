import { CompilerOptions, Settings } from './types'

/** Interfaces of typescript-json-schema */
export namespace TJS {
  export interface Mod<Program, Definition> {
    getProgramFromFiles (files: string[], compilerOptions?: CompilerOptions, basePath?: string): Program
    buildGenerator (program: Program, settings?: Settings): Generator<Definition>
  }

  export interface Generator<Definition> {
    getSchemaForSymbol (symbol: string): Definition
  }
}

/** Interfaces of fs-extra */
export namespace FSX {
  export interface Mod {
    stat (path: string): Promise<Stats>
    readdir (dirname: string): Promise<readonly string[]>
    readFile (filename: string): Promise<string>
    writeFile (filename: string, content: string): Promise<void>
    remove (filename: string): Promise<void>
  }

  export interface Stats {
    isFile (): boolean
    isDirectory (): boolean
  }
}

/** Interfaces of path */
export namespace Path {
  export interface Mod {
    join (base: string, ...paths: string[]): string
    dirname (path: string): string
    basename (path: string): string
    resolve (base: string, ...paths: string[]): string
  }
}
