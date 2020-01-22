import { MaybeArray, ensureArray } from '@ts-schema-autogen/utils'
import { OutputDescriptor } from '@ts-schema-autogen/types'
export { OutputDescriptor }

export const ensureOutputDescriptor =
  (maybeDesc: string | OutputDescriptor) =>
    typeof maybeDesc === 'string' ? { filename: maybeDesc } : maybeDesc

export const ensureOutputDescriptorArray =
  (maybeDesc: MaybeArray<string | OutputDescriptor>): OutputDescriptor[] =>
    ensureArray(maybeDesc).map(ensureOutputDescriptor)
