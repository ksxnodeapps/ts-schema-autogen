import { ensureArray } from '@ts-schema-autogen/utils'

it('on non-array', () => {
  const value = Symbol('value')
  expect(ensureArray(value)).toEqual([value])
})

it('on array', () => {
  const array = [0, 1, 2, 3]
  expect(ensureArray(array)).toBe(array)
})
