import { concatIterable } from '@ts-schema-autogen/utils'

it('works', () => {
  const a = [0, 1, 2, 3]
  const b = ['a', 'b', 'c']
  const ab = concatIterable<number | string>(a, b)
  expect([...ab]).toEqual([...a, ...b])
})
