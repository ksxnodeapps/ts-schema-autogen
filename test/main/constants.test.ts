import { DEFAULT_PATTERN } from '@ts-schema-autogen/main'

describe('DEFAULT_PATTERN', () => {
  describe('matches', () => {
    it('names that end with ".schema.autogen"', () => {
      expect('abc.schema.autogen').toMatch(new RegExp(DEFAULT_PATTERN))
    })

    it('names that end with ".schema.autogen.json"', () => {
      expect('abc.schema.autogen.json').toMatch(new RegExp(DEFAULT_PATTERN))
    })

    it('names that end with ".schema.autogen.yaml"', () => {
      expect('abc.schema.autogen.yaml').toMatch(new RegExp(DEFAULT_PATTERN))
    })

    it('names that end with ".schema.autogen.yml"', () => {
      expect('abc.schema.autogen.yml').toMatch(new RegExp(DEFAULT_PATTERN))
    })
  })

  describe('does not match', () => {
    it('names that end with ".schema.autogen."', () => {
      expect('abc.schema.autogen.').not.toMatch(new RegExp(DEFAULT_PATTERN))
    })

    it('names that end with ".schema.autogen.{alien extension}"', () => {
      expect('abc.schema.autogen.js').not.toMatch(new RegExp(DEFAULT_PATTERN))
    })

    it('names that end with ".schema.autogen.{supported extension}.{redundant suffix}"', () => {
      expect('abc.schema.autogen.json.json').not.toMatch(new RegExp(DEFAULT_PATTERN))
    })

    it('names that does not end with ".schema.autogen[.*]"', () => {
      expect('abc.json').not.toMatch(new RegExp(DEFAULT_PATTERN))
    })
  })
})
