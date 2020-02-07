import def, { ValidatorFactory } from '@ts-schema-autogen/validate'

it('export ValidatorFactory as default', () => {
  expect(def).toBe(ValidatorFactory)
})
