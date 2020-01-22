import { OutputDescriptor } from '@ts-schema-autogen/types'

/** Error code as well as discriminant of {@link Success} and {@link Failure} */
export enum Status {
  CircularReference = 8,
  FileTreeRemovalFailure = 7,
  TextParsingFailure = 6,
  FileReadingFailure = 5,
  FileWritingFailure = 4,
  OutputFileConflict = 3,
  MultipleFailures = 2,
  FatalError = 1,
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
}

/** More than one errors */
export class MultipleFailures<Error extends Iterable<Failure<any>>> extends Failure<Error> {
  public readonly code = Status.MultipleFailures
}

/** Multiple config target one output file */
export class OutputFileConflict extends Failure<OutputFileConflict.Error> {
  public readonly code = Status.OutputFileConflict
}

export namespace OutputFileConflict {
  export interface Error extends Map<string, readonly OutputDescriptor[]> {}
}

/** Failed to write a file */
export class FileWritingFailure extends Failure<readonly any[]> {
  public readonly code = Status.FileWritingFailure
}

/** Failed to read a file */
export class FileReadingFailure extends Failure<unknown> {
  public readonly code = Status.FileReadingFailure
}

/** Failed to parse a text data into structured data */
export class TextParsingFailure<Error> extends Failure<Error> {
  public readonly code = Status.TextParsingFailure
}

/** Failed to delete a file or directory */
export class FileTreeRemovalFailure<Error> extends Failure<Error> {
  public readonly code = Status.FileTreeRemovalFailure
}

/** Two or more configs inherit from each other directly or indirectly */
export class CircularReference<Error> extends Failure<Error> {
  public readonly code = Status.CircularReference
}
