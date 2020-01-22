import { Instruction } from '@ts-schema-autogen/types'

export const listSymbolInstruction = (instruction: Instruction) =>
  instruction.list || (instruction.symbol ? [instruction] : [])
