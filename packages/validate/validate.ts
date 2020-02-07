import { Validator, Options, ValidationError } from 'jsonschema'
import { Result, ok, err } from '@tsfun/result'
import SchemaLoader from './load'

import {
  Config,
  Instruction,
  OutputDescriptor,
  SymbolInstruction
} from '@ts-schema-autogen/types'

export type ValidationResult<Type> = Result<Type, ValidationError[]>

const VALIDATION_OPTIONS: Options = Object.freeze({
  allowUnknownAttributes: true
})

export class ValidatorFactory extends SchemaLoader {
  private readonly validator = new Validator()

  private createValidator<Type> (name: string) {
    const { validator } = this
    const schema = this.load(name)

    return async (instance: unknown): Promise<ValidationResult<Type>> => {
      const result = validator.validate(instance, await schema, VALIDATION_OPTIONS)
      return result.valid ? ok(instance as Type) : err(result.errors)
    }
  }

  public readonly validateConfig = this.createValidator<Config>('config')
  public readonly validateInstruction = this.createValidator<Instruction>('instruction')
  public readonly validateOutputDescriptor = this.createValidator<OutputDescriptor>('output-descriptor')
  public readonly validateSymbolInstruction = this.createValidator<SymbolInstruction>('symbol-instruction')
}

export default ValidatorFactory
