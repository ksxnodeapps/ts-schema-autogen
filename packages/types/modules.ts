import { CompilerOptions, Settings } from './types'

/** Interfaces of typescript-json-schema */
export namespace TJS {
  export interface Mod<Program, Definition> {
    getProgramFromFiles (files: string[], compilerOptions?: CompilerOptions, basePath?: string): Program
    buildGenerator (program: Program, settings?: Settings): Generator<Definition> | null
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
    readFile (filename: string, encoding: 'utf8'): Promise<string>
    outputFile (filename: string, content: string): Promise<void>
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
    isAbsolute (path: string): boolean
    join (base: string, ...paths: string[]): string
    dirname (path: string): string
    basename (path: string): string
    resolve (base: string, ...paths: string[]): string
  }
}

/** Interfaces of process */
export namespace Process {
  export interface Mod {
    cwd (): string
  }
}

/** Interfaces of console */
export namespace Console {
  export interface Mod {
    readonly info: LogFunc
    readonly error: LogFunc
  }

  export interface LogFunc {
    (...args: any[]): void
  }
}
