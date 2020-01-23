import { MaybeArray, ensureArray } from '@ts-schema-autogen/utils'
import { OutputDescriptor } from '@ts-schema-autogen/types'
export { OutputDescriptor }

/**
 * Convert an output filename or descriptor into a descriptor
 * @param maybeDesc Output filename or output descriptor
 */
export const ensureOutputDescriptor =
  (maybeDesc: string | OutputDescriptor) =>
    typeof maybeDesc === 'string' ? { filename: maybeDesc } : maybeDesc

/**
 * Convert an output filename, descriptor, or array of either into an array of descriptors
 * @param maybeDesc Output filename, output descriptor or array of either
 */
export const ensureOutputDescriptorArray =
  (maybeDesc: MaybeArray<string | OutputDescriptor>): OutputDescriptor[] =>
    ensureArray(maybeDesc).map(ensureOutputDescriptor)
