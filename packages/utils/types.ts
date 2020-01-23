export type MaybeArray<Item> = Item | readonly Item[]
export type MaybePromise<Value> = Value | Promise<Value>
export type MaybeAsyncIterable<Item> = Iterable<Item> | AsyncIterable<Item>
