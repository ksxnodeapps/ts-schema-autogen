import { MaybeArray } from '@ts-schema-autogen/utils'
import { HttpJsonSchemaOrgDraft04Schema } from './generated/json-schema'
import { JSONSchemaForTheTypeScriptCompilerSConfigurationFile } from './generated/tsconfig'

import {
  PartialArgs as Settings,
  Program,
  JsonSchemaGenerator,
  Definition
} from 'typescript-json-schema'
export {
  Settings,
  Program,
  JsonSchemaGenerator,
  Definition
}

/** Interface for a schema file */
export type JsonSchema = HttpJsonSchemaOrgDraft04Schema

/** TypeScript compiler options */
export type CompilerOptions = JSONSchemaForTheTypeScriptCompilerSConfigurationFile['compilerOptions']

/** Formats of output JSON schema files */
export interface OutputDescriptor {
  /** Name of output schema file */
  readonly filename: string
  /** Data format */
  readonly format?: 'json'
  /** JSON indentation */
  readonly indent?: 'tab' | 'none' | number
}

/** Instruction for a single symbol */
export interface SymbolInstruction {
  /** Output descriptor(s) and filename(s) */
  readonly output: MaybeArray<string | OutputDescriptor>
  /** Targeted type name */
  readonly symbol: string
}

/** Shared properties of instruction interfaces */
export interface InstructionSharedProperties {
  /** Compiler options to pass to typescript-json-schema module */
  readonly compilerOptions?: CompilerOptions
  /** Settings to pass to typescript-json-schema module */
  readonly schemaSettings?: Settings
  /** TypeScript source file(s) */
  readonly input?: string | readonly string[]
}

/** Instruction for multiple symbols */
export interface MultiSymbolInstruction extends InstructionSharedProperties {
  /** List of instruction units */
  readonly list?: readonly SymbolInstruction[]

  // omitted properties
  readonly output?: null
  readonly symbol?: null
}

/** Instruction for a single symbol */
export interface SingleSymbolInstruction extends InstructionSharedProperties, SymbolInstruction {
  // omitted properties
  readonly list?: null
}

/** Instruction to generate JSON schemas */
export type Instruction = MultiSymbolInstruction | SingleSymbolInstruction

/** Properties of a configuration file */
export interface Config {
  /** File(s) to inherit from */
  readonly extends?: string | readonly string[]
  /** Instruction to generate JSON schemas */
  readonly instruction: Instruction
}
