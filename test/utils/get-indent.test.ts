import { getIndent } from '@ts-schema-autogen/utils'

it('tab → tab', () => {
  expect(getIndent('tab')).toBe('\t')
})

it('number → number', () => {
  expect(getIndent(4)).toBe(4)
})

it('none → undefined', () => {
  expect(getIndent('none')).toBe(undefined)
})
