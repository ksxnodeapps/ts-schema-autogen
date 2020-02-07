import { Validator, Options, ValidationError } from 'jsonschema'
import once from 'exec-once'
import { Result, ok, err } from '@tsfun/result'
import SchemaLoader from './load'

import {
  Config,
  Instruction,
  OutputDescriptor,
  SymbolInstruction
} from '@ts-schema-autogen/types'
export {
  Config,
  Instruction,
  OutputDescriptor,
  SymbolInstruction
} from '@ts-schema-autogen/types'

export type ValidationResult<Type> = Result<Type, ValidationError[]>

// don't freeze this object
// know that jsonschema will modify this object
const VALIDATION_OPTIONS: Options = {
  allowUnknownAttributes: true
}

export class ValidatorFactory extends SchemaLoader {
  private readonly validator = new Validator()

  private createValidator<Type> (name: string) {
    const { validator } = this
    const schema = once(() => this.load(name))

    function validate (instance: unknown): ValidationResult<Type> {
      const result = validator.validate(instance, schema(), VALIDATION_OPTIONS)
      return result.valid ? ok(instance as Type) : err(result.errors)
    }

    return validate
  }

  public readonly Config = this.createValidator<Config>('config')
  public readonly Instruction = this.createValidator<Instruction>('instruction')
  public readonly OutputDescriptor = this.createValidator<OutputDescriptor>('output-descriptor')
  public readonly SymbolInstruction = this.createValidator<SymbolInstruction>('symbol-instruction')
}

export default ValidatorFactory
