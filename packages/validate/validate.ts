import Ajv from 'ajv'
import once from 'exec-once'
import { Result, ok, err } from '@tsfun/result'
import SchemaLoader from '@ts-schema-autogen/schemas'
import { Config } from '@ts-schema-autogen/types'
export { Config }

export type ValidationError = Ajv.ErrorObject
export type ValidationResult<Type> = Result<Type, ValidationError[]>

export class ValidatorFactory extends SchemaLoader {
  private readonly ajv = new Ajv({
    allErrors: true,
    async: false
  })

  private createValidator<Type> (name: string) {
    const { ajv } = this
    const getFn = once(() => ajv.compile(this.load(name)))

    function validate (data: unknown): ValidationResult<Type> {
      const fn = getFn()
      return fn(data) ? ok(data as Type) : err(fn.errors!)
    }

    return validate
  }

  public readonly Config = this.createValidator<Config>('config')
}

export default ValidatorFactory
