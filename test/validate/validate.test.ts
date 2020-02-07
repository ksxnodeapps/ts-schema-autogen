import { ok, err } from '@tsfun/result'
import { Config, ValidatorFactory } from '@ts-schema-autogen/validate'

describe('Config', () => {
  function validate (instance: unknown) {
    const factory = new ValidatorFactory()
    const result = factory.Config(instance)
    return { factory, result }
  }

  describe('positive', () => {
    function setup () {
      const instance: Config = {
        instruction: {
          symbol: 'Foo',
          output: 'output'
        }
      }
      return { instance, ...validate(instance) }
    }

    it('returns an Ok', () => {
      const { instance, result } = setup()
      expect(result).toEqual(ok(instance))
    })

    it('returns an object that has value being input instance', () => {
      const { instance, result } = setup()
      expect(result.value).toBe(instance)
    })
  })

  describe('negative', () => {
    function setup () {
      const instance = 'Not Valid'
      return { instance, ...validate(instance) }
    }

    it('returns an Err', () => {
      const { result } = setup()
      expect(result).toEqual(err(expect.anything()))
    })

    it('matches snapshot', () => {
      const { result } = setup()
      expect(result).toMatchSnapshot()
    })
  })
})
