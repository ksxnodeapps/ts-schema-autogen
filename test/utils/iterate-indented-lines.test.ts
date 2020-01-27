import { iterateIndentedLines } from '@ts-schema-autogen/utils'

const text = '123\n456\n789'

it('as iterator', () => {
  const iterator = iterateIndentedLines(1, text)
  const a = iterator.next()
  const b = iterator.next()
  const c = iterator.next()
  const d = iterator.next()
  expect([a, b, c, d]).toEqual([
    { done: false, value: ' '.repeat(4) + '123' },
    { done: false, value: ' '.repeat(4) + '456' },
    { done: false, value: ' '.repeat(4) + '789' },
    { done: true, value: undefined }
  ])
})

it('as iterable', () => {
  expect([...iterateIndentedLines(1, text)]).toEqual([
    ' '.repeat(4) + '123',
    ' '.repeat(4) + '456',
    ' '.repeat(4) + '789'
  ])
})
