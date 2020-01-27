import { serialize } from '@ts-schema-autogen/lib'

const object = {
  a: {
    b: 'ab'
  },
  c: [0, 1, 2]
}

it('indent = 4', () => {
  expect(serialize(object, { indent: 4, filename: undefined! }))
    .toBe(JSON.stringify(object, undefined, 4) + '\n')
})

it('indent = "tab"', () => {
  expect(serialize(object, { indent: 'tab', filename: undefined! }))
    .toBe(JSON.stringify(object, undefined, '\t') + '\n')
})

it('indent = "none"', () => {
  expect(serialize(object, { indent: 'none', filename: undefined! }))
    .toBe(JSON.stringify(object) + '\n')
})

it('indent = default', () => {
  expect(serialize(object, { filename: undefined! }))
    .toBe(JSON.stringify(object, undefined, 2) + '\n')
})
