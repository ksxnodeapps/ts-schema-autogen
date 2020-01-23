import { MaybeAsyncIterable } from './types'

export async function getAsyncArray<Item> (iterable: MaybeAsyncIterable<Item>): Promise<Item[]> {
  const array: Item[] = []
  for await (const item of iterable) {
    array.push(item)
  }
  return array
}

export default getAsyncArray
