import { inspect } from 'util'
import { Success, Failure } from '@ts-schema-autogen/status'

export function printFailure (result: Failure<unknown>): string {
  let text = '\n'
  result.print((...args) => text += args.join(' ') + '\n')
  return text
}

export const printResult = (result: Success<unknown> | Failure<unknown>): string =>
  result.code ? printFailure(result) : inspect(result)
