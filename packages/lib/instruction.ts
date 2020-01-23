import { Instruction } from '@ts-schema-autogen/types'

/**
 * Convert various types of instruction into a list of symbol instructions
 * @param instruction Instruction to convert
 */
export const listSymbolInstruction = (instruction: Instruction) =>
  instruction.list || (instruction.symbol ? [instruction] : [])
