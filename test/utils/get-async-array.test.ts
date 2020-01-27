import { getAsyncArray } from '@ts-schema-autogen/utils'

it('works', async () => {
  async function * generate () {
    yield 0
    yield 1
    yield 2
  }

  expect(await getAsyncArray(generate())).toEqual([0, 1, 2])
})
