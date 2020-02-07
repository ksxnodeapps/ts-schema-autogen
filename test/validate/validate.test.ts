import { ok, err } from '@tsfun/result'

import {
  Config,
  Instruction,
  OutputDescriptor,
  SymbolInstruction,
  ValidatorFactory
} from '@ts-schema-autogen/validate'

describe('validateConfig', () => {
  function validate (instance: unknown) {
    const factory = new ValidatorFactory()
    const result = factory.validateConfig(instance)
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
      expect(result).toMatchSnapshot({
        error: [{ schema: expect.any(Object) }]
      })
    })
  })
})

describe('validateInstruction', () => {
  function validate (instance: unknown) {
    const factory = new ValidatorFactory()
    const result = factory.validateInstruction(instance)
    return { factory, result }
  }

  describe('positive', () => {
    function setup () {
      const instance: Instruction = {
        symbol: 'Foo',
        output: 'output'
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
      expect(result).toMatchSnapshot({
        error: [{ schema: expect.any(Object) }]
      })
    })
  })
})

describe('validateOutputDescriptor', () => {
  function validate (instance: unknown) {
    const factory = new ValidatorFactory()
    const result = factory.validateOutputDescriptor(instance)
    return { factory, result }
  }

  describe('positive', () => {
    function setup () {
      const instance: OutputDescriptor = {
        filename: 'output'
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
      expect(result).toMatchSnapshot({
        error: [{ schema: expect.any(Object) }]
      })
    })
  })
})

describe('validateSymbolInstruction', () => {
  function validate (instance: unknown) {
    const factory = new ValidatorFactory()
    const result = factory.validateSymbolInstruction(instance)
    return { factory, result }
  }

  describe('positive', () => {
    function setup () {
      const instance: SymbolInstruction = {
        output: 'output',
        symbol: 'Foo'
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
      expect(result).toMatchSnapshot({
        error: [{ schema: expect.any(Object) }]
      })
    })
  })
})
