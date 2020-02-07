# TypeScript Schema Automatic Generator

Read config files and generate json schema files

## Development

### System Requirements

* Node.js ≥ 13.6.0
* Package Manager: [pnpm](https://pnpm.js.org/)
* Git

### Scripts

#### Build

```sh
pnpm run build
```

#### Clean

```sh
pnpm run clean
```

#### Test

##### Test Everything

```sh
pnpm test
```

##### Test Everything Without Coverage

```sh
pnpm run test:no-coverage
```

##### Test Changed Files Only

```sh
pnpm test -- --onlyChanged
```

##### Update Jest Snapshot

```sh
pnpm test -- -u
```

#### Start Node.js REPL

This starts a Node.js REPL where you can import every module inside `packages/` folder.

```sh
pnpm run repl
```

## Installation

This program requires [Node.js](https://nodejs.org) to run.

```sh
npm install --global @ts-schema-autogen/cli
```

## Usages

The program will scan through directory tree from working directory and search for [config files](#config-file) whose names end with `.schema.autogen.{json,yaml}` to perform actions.

### Config File

A config file is a JSON or YAML file that satisfies [the `Config` type](https://github.com/ksxnodeapps/ts-schema-autogen/blob/master/packages/types/types.ts#L72-L77) or [config.schema.json JSON schema](https://raw.githubusercontent.com/ksxnodeapps/ts-schema-autogen/master/packages/schemas/config.schema.json).

Config files whose names end with either `.schema.autogen.json` or `.schema.autogen.yaml` will be scanned by [`ts-schema-autogen`](cli-commands), others will be skipped.

A config file can inherit `compilerOptions` and `schemaSettings` from other config files via `extends` property.

If your editor support IntelliSense for JSON schemas (such as Visual Studio Code), it is recommended that you have `$schema` property set to `https://raw.githubusercontent.com/ksxnodeapps/ts-schema-autogen/master/packages/schemas/config.schema.json`. Alternatively, you can use `npm` to install `@ts-schema-autogen/schemas` and set `$schema` property to `./node_modules/@ts-schema-autogen/schemas/config.schema.json`.

#### Examples

##### Read 1 symbol from 1 TypeScript file and create 1 schema file

**input.ts**

```typescript
export interface MyType {
  foo: 123
  bar: 456
}
```

**.schema.autogen.json**

```json
{
  "$schema": "https://raw.githubusercontent.com/ksxnodeapps/ts-schema-autogen/master/packages/schemas/config.schema.json",
  "instruction": {
    "compilerOptions": {
      "strictNullChecks": true,
      "strict": true,
      "target": "ES2018",
      "noEmit": true,
      "lib": ["ESNext"]
    },
    "schemaSettings": {
      "required": true
    },
    "input": "input.ts",
    "symbol": "MyType",
    "output": "output.json"
  }
}
```

##### Read 2 symbols from 2 TypeScript files and create 2 schema files

**foo.ts**

```typescript
/// <reference path="./bar.ts" />
export interface Foo {
  readonly bar?: Bar
}
```

**bar.ts**

```typescript
/// <reference path="./foo.ts" />
export interface Bar {
  readonly foo?: Foo
}
```

**.schema.autogen.json**

```json
{
  "$schema": "https://raw.githubusercontent.com/ksxnodeapps/ts-schema-autogen/master/packages/schemas/config.schema.json",
  "instruction": {
    "compilerOptions": {
      "strictNullChecks": true,
      "strict": true,
      "target": "ES2018",
      "noEmit": true,
      "lib": ["ESNext"]
    },
    "schemaSettings": {
      "required": true
    },
    "input": [
      "foo.ts",
      "bar.ts"
    ],
    "list": [
      {
        "symbol": "Foo",
        "output": "foo.schema.json"
      },
      {
        "symbol": "Bar",
        "output": "bar.schema.json"
      }
    ]
  }
}
```

##### If you have multiple config files, you may want to use `extends` to inherit `compilerOptions` and `schemaSettings` from a common source

**settings.json**

```json
{
  "$schema": "https://raw.githubusercontent.com/ksxnodeapps/ts-schema-autogen/master/packages/schemas/config.schema.json",
  "instruction": {
    "compilerOptions": {
      "strictNullChecks": true,
      "strict": true,
      "target": "ES2018",
      "noEmit": true,
      "lib": ["ESNext"]
    },
    "schemaSettings": {
      "required": true
    }
  }
}
```

**foo.schema.autogen.json**

```json
{
  "$schema": "https://raw.githubusercontent.com/ksxnodeapps/ts-schema-autogen/master/packages/schemas/config.schema.json",
  "extends": "settings.json",
  "instruction": {
    "input": "foo.ts",
    "symbol": "Foo",
    "output": "foo.schema.json"
  }
}
```

**bar.schema.autogen.json**

```json
{
  "$schema": "https://raw.githubusercontent.com/ksxnodeapps/ts-schema-autogen/master/packages/schemas/config.schema.json",
  "extends": "settings.json",
  "instruction": {
    "input": "bar.ts",
    "symbol": "Bar",
    "output": "bar.schema.json"
  }
}
```

### CLI Commands

```
ts-schema-autogen <command>

Commands:
  ts-schema-autogen test      Check for out-of-date schema files
  ts-schema-autogen generate  Generate schema files
  ts-schema-autogen clean     Delete generated schema files

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
  --pattern  Regular expression that matches basename of config files
                    [string] [default: "\.schema\.autogen(\.(json|yaml|yml))?$"]
  --ignored  Name of directories to be ignored
                                      [array] [default: [".git","node_modules"]]
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```

## License

[MIT](https://git.io/Jvntb) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
