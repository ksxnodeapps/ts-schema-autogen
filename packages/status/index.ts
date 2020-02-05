import { inspect } from 'util'
import { iterateIndentedLines, maybeMultipleFailures } from '@ts-schema-autogen/utils'
import { OutputDescriptor, Console } from '@ts-schema-autogen/types'

/** Error code as well as discriminant of {@link Success} and {@link Failure} */
export enum Status {
  /** Failed to build schema generator */
  GeneratorConstructingFailure = 11,

  /** No file parser specified */
  MissingFileParser = 10,

  /** File content is outdated */
  OutdatedFile = 9,

  /** Two or more configs inherit from each other directly or indirectly */
  CircularReference = 8,

  /** Failed to delete a file or directory */
  FileTreeRemovalFailure = 7,

  /** Failed to parse text data into structured data */
  TextParsingFailure = 6,

  /** Failed to read data from a file */
  FileReadingFailure = 5,

  /** Failed to write data to a file */
  FileWritingFailure = 4,

  /** More than one configs target the same output file */
  OutputFileConflict = 3,

  /** More than one errors */
  MultipleFailures = 2,

  /** Failures unaccounted for */
  FatalError = 1,

  /** Operation succeeded */
  Success = 0
}

export namespace Status {
  // tslint:disable-next-line:no-unnecessary-qualifier
  export type Failure = Exclude<Status, Status.Success>
}

/** Base class of all {@link Success} and {@link Failure} subclasses */
export abstract class ResultBase {
  /** Indicates whether result is a {@link Success} or an {@link Failure}, and which Failure */
  public abstract readonly code: Status

  /** Name of the result. As same as `Status[this.code]` */
  public get name () {
    return Status[this.code]
  }

  /** Return status code to pass to `process.exit`, it is usually (but not always) `this.code` */
  public getStatusCode (): Status {
    return this.code
  }
}

/** Container of value should operation went without errors */
export class Success<Value> extends ResultBase {
  public readonly code = Status.Success
  public readonly error = undefined

  constructor (
    /** Value of the operation that returns this result */
    public readonly value: Value
  ) {
    super()
  }
}

/** Container of error should operation encountered an error */
export abstract class Failure<Error> extends ResultBase {
  public abstract readonly code: Status.Failure
  public readonly value = undefined

  constructor (
    /** Error or information of error that the operation encountered */
    public readonly error: Error
  ) {
    super()
  }

  /** Return an iterable of lines */
  public abstract log (): Iterable<string>

  /** Use `log` to log lines from `this.log()` */
  public print (log: Console.LogFunc): void {
    for (const line of this.log()) {
      log(line)
    }
  }

  protected static indent = (level: number) => ' '.repeat(4 * level)
}

export abstract class FileSystemFailure<Error> extends Failure<Error> {
  constructor (
    /** Path to the filesystem entity that the failed operation was attempted on */
    public readonly path: string,

    /** Exact error message */
    error: Error
  ) {
    super(error)
  }

  public * log () {
    yield this.name
    yield Failure.indent(1) + 'path: ' + this.path
    yield Failure.indent(1) + 'error:'
    yield * iterateIndentedLines(2, inspect(this.error))
  }
}

/** More than one errors */
export class MultipleFailures<Error extends Iterable<Failure<any>>> extends Failure<Error> {
  public readonly code = Status.MultipleFailures

  public * log () {
    yield this.name
    for (const item of this.error) {
      for (const line of item.log()) {
        yield Failure.indent(1) + line
      }
    }
  }

  /**
   * Create a `MultipleFailures` or a single `Failure` from a list of failures
   * @param list List of failures
   * @returns `MultipleFailures` if `list` has more than one failures
   * @returns sole element of `list` if it has exactly one failure
   * @returns `null` if `list` is empty
   */
  public static maybe<
    Error extends Failure<any>
  > (list: readonly Error[]): MultipleFailures.Maybe<Error> | null {
    return maybeMultipleFailures(list, MultipleFailures)
  }

  public getStatusCode () {
    const codes = new Set<Status>()
    for (const failure of this.error) {
      codes.add(failure.getStatusCode())
    }
    if (codes.size === 1) {
      const [status] = codes
      return status
    }
    return super.getStatusCode()
  }
}

export namespace MultipleFailures {
  /** Error or set of errors */
  export type Maybe<
    Error extends Failure<any>,
    List extends Iterable<Error> = readonly Error[]
  > = Error | MultipleFailures<List>
}

/** Multiple configs target the same output file */
export class OutputFileConflict extends Failure<OutputFileConflict.Error> {
  public readonly code = Status.OutputFileConflict

  public * log () {
    yield this.name
    for (const [filename] of this.error) {
      yield Failure.indent(1) + filename
    }
  }
}

export namespace OutputFileConflict {
  export interface Error extends Map<string, readonly OutputDescriptor[]> {}
}

/** Failed to write data to a file */
export class FileWritingFailure extends FileSystemFailure<unknown> {
  public readonly code = Status.FileWritingFailure
}

/** Failed to read data from a file */
export class FileReadingFailure extends FileSystemFailure<unknown> {
  public readonly code = Status.FileReadingFailure
}

/** Failed to parse a text data into structured data */
export class TextParsingFailure<Error extends TextParsingFailure.ConfigParseError<any>>
extends Failure<readonly Error[]> {
  public readonly code = Status.TextParsingFailure

  public * log () {
    yield this.name
    for (const item of this.error) {
      yield Failure.indent(1) + item.parser.name
      yield * iterateIndentedLines(2, String(item.error))
    }
  }
}

export namespace TextParsingFailure {
  /** Error carried by {@link TextParsingFailure} */
  export interface ConfigParseError<Error> {
    readonly parser: {
      /** Name of the parser */
      readonly name: string
    }

    /** Error that `loader.parseConfigText` thrown */
    readonly error: Error
  }
}

/** Failed to delete a file or directory */
export class FileTreeRemovalFailure<Error> extends FileSystemFailure<Error> {
  public readonly code = Status.FileTreeRemovalFailure
}

/** Two or more configs inherit from each other directly or indirectly */
export class CircularReference extends Failure<Iterable<string>> {
  public readonly code = Status.CircularReference

  public * log () {
    yield this.name
    for (const filename of this.error) {
      yield Failure.indent(1) + filename
    }
  }
}

export class OutdatedFile extends FileSystemFailure<OutdatedFile.Error> {
  public readonly code = Status.OutdatedFile

  public * log () {
    yield this.name
    const { receivedContent } = this.error
    yield Failure.indent(1) + 'file: ' + this.path
    if (receivedContent === null) {
      yield Failure.indent(1) + 'expected: file exists'
      yield Failure.indent(1) + 'received: file does not exist'
    } else {
      yield Failure.indent(1) + 'content mismatches' // TODO LATER: Convert this to a diff message
    }
  }
}

export namespace OutdatedFile {
  export interface Error {
    readonly expectedContent: string
    readonly receivedContent: string | null // `null` means "file does not exist"
  }
}

export class MissingFileParser extends Failure<void> {
  public readonly code = Status.MissingFileParser

  public * log () {
    yield this.name
    yield Failure.indent(1) + 'No parser specified'
  }
}

export class GeneratorConstructingFailure<Program, Settings>
extends Failure<GeneratorConstructingFailure.Error<Program, Settings>> {
  public readonly code = Status.GeneratorConstructingFailure

  public * log () {
    yield this.name
    yield Failure.indent(1) + 'Failed to build schema generator'
    yield Failure.indent(1) + 'program:'
    yield * iterateIndentedLines(2, inspect(this.error.program))
    yield Failure.indent(1) + 'settings:'
    yield * iterateIndentedLines(2, inspect(this.error.settings))
  }
}

export namespace GeneratorConstructingFailure {
  export interface Error<Program, Settings> {
    readonly program: Program
    readonly settings: Settings
  }
}
