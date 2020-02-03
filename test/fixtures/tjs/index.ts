import { FakeTJS } from '@tools/test-utils'

export interface Def {
  readonly symbol: string
  readonly type: 'schema'
}

export class TJS extends FakeTJS<Def> {
  public readonly defMap = new Map<string, Def>(
    [
      'Foo',
      'Bar',
      'Baz'
    ].map(symbol => [symbol, {
      symbol,
      type: 'schema'
    }])
  )
}

export default TJS
