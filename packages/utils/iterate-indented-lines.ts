export function * iterateIndentedLines (indent: number, text: string) {
  const prefix = ' '.repeat(4 * indent)
  for (const line of text.split('\n')) {
    yield prefix + line
  }
}

export default iterateIndentedLines
