export function maybeMultipleFailures<
  Failure extends { readonly code: number },
  MultipleFailures
> (
  failures: readonly Failure[],
  MultipleFailures: new (failures: readonly Failure[]) => MultipleFailures
): Failure | MultipleFailures | null {
  switch (failures.length) {
    case 0:
      return null
    case 1:
      return failures[0]
    default:
      return new MultipleFailures(failures)
  }
}

export default maybeMultipleFailures
