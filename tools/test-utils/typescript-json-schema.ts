import { TJS } from '@ts-schema-autogen/types'

export abstract class FakeTJS<Def> implements TJS.Mod<FakeTJS.Program<Def>, Def> {
  protected abstract readonly defMap: Map<string, Def>
  protected implGetProgram (): FakeTJS.Program<Def> {
    return new FakeTJS.Program(symbol => {
      const schema = this.defMap.get(symbol)
      if (!schema) throw new Error(`Symbol ${symbol} does not exist`)
      return schema
    })
  }
  public readonly getProgramFromFiles = jest.fn(() => this.implGetProgram())
  protected implBuildGenerator (program: FakeTJS.Program<Def>): FakeTJS.Generator<Def> | null {
    return new FakeTJS.Generator(program)
  }
  public readonly buildGenerator = jest.fn((program: FakeTJS.Program<Def>) => this.implBuildGenerator(program))
}

export namespace FakeTJS {
  export class Program<Def> {
    constructor (
      public readonly getSchema: (symbol: string) => Def
    ) {}
  }

  export class Generator<Def> implements TJS.Generator<Def> {
    constructor (private readonly program: Program<Def>) {}
    public readonly getSchemaForSymbol = (symbol: string) => this.program.getSchema(symbol)
  }
}
