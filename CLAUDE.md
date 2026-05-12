# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

Kartoffelgames.Public is a **Deno workspace monorepo** of TypeScript packages under `packages/`. There is no top-level README, no `package.json`, and no separate build step — sources in each package's `source/` are consumed directly via Deno's workspace resolution and published to JSR/NPM unchanged.

The workspace member list lives in [deno.json](deno.json) (`workspace` array). Inter-package imports use the published JSR names (`@kartoffelgames/core`, `@kartoffelgames/core-dependency-injection`, etc.) — Deno resolves those to the local workspace members. Do not invent relative `../../` imports across package boundaries.

Each package has the same shape:

```
packages/<name>/
    deno.json         # JSR name, version, exports, kg config
    source/           # published code; entry is source/index.ts
    test/             # Deno tests
    page/             # (some packages) browser playground served via `kg page`
```

The `kg` block in each `deno.json` configures the in-house [@kartoffelgames/environment-cli](https://jsr.io/@kartoffelgames/environment-cli) tooling (bundle/scratchpad/page/test). The CLI is invoked as `deno task kg <command>` from the repo root — defined in [deno.json:22](deno.json#L22).

## Commands

All commands run from the repo root. The `kg` task is the workspace-aware entry point — prefer it over raw `deno test`/`deno bundle` for anything beyond a single file.

| Task | Command |
|---|---|
| Run all tests across all packages | `deno task kg test --all` |
| Run tests for current package | `deno task kg test` (from a package directory) |
| Run tests for a specific package | `deno task kg test -p=@kartoffelgames/core` |
| Run tests with coverage | `deno task kg test --coverage` |
| Run tests with detailed output | `deno task kg test --detailed` |
| Debug tests (attach inspector) | `deno task kg test --inspect` |
| Run a single test file | `deno test -A packages/<pkg>/test/<file>.test.ts` |
| Lint everything | `deno task lint` |
| Bundle a package | `deno task kg bundle` (from package directory) |
| Serve a package's `page/` playground | `deno task kg page` (from package directory) |
| Show all kg subcommands | `deno task kg help` |

Most `kg` subcommands accept `-p=<jsr-name>` (or `--package=<jsr-name>`) to target a specific workspace package from the repo root without `cd`-ing into it — e.g. `deno task kg bundle -p=@kartoffelgames/web-potato-engine`, `deno task kg page -p=@kartoffelgames/web-potato-web-builder`. Use the JSR name from the package's `deno.json`, not the directory name.

CI ([.github/workflows/test.yaml](.github/workflows/test.yaml)) runs `deno task kg test --all` plus dry-run JSR + NPM publishes via composite actions under [.github/actions/](.github/actions/).

VS Code launch configs in [.vscode/launch.json](.vscode/launch.json) attach a Node inspector to `deno test`/`deno run` on the currently open file (port 9229).

## Package architecture

Two cohesive layers, then leaf apps:

**Core libraries** (foundational, no DOM):
- `kartoffelgames.core` — data containers (`Dictionary`, `List`, `Stack`, `LinkedList`, `BoundVolumeHierarchy`), math (`Matrix`, `Vector`, `Quaternion`, `Euler`, `Frustum`), `Exception`, `MyersDiff`, `XxHash`, decorator type aliases. All other packages depend on this.
- `kartoffelgames.core.dependency_injection` — `Injection` (TC39 standard decorators, not legacy) plus `Metadata`/`ConstructorMetadata`/`PropertyMetadata`. Underpins PWB components.
- `kartoffelgames.core.interaction_zone` — `InteractionZone` / `InteractionZoneEvent`, a Zone.js-style mechanism for tracking async work and dispatching change events. Underpins PWB's reactivity.
- `kartoffelgames.core.parser` — lexer + parser primitives (`Lexer`, `LexerPattern`, `CodeParser`, exceptions/traces). Used by `core.xml` and `core.pgsl`.
- `kartoffelgames.core.xml`, `kartoffelgames.core.serializer`, `kartoffelgames.core.test` (custom `expect` with `toBeDeepEqual` / `toHaveOrderedItems` / `toBeComponentStructure` matchers on top of `@std/expect`).
- `kartoffelgames.core.pgsl` — PGSL ("Pixel"), a shader DSL that **transpiles to WGSL**. Pipeline: preprocessor (`#IMPORT`/`#IFDEF`/`#META`) → CST → AST → validation → `WgslTranspiler`.

**Web layer** (DOM / WebGPU):
- `kartoffelgames.web.potato_web_builder` (**PWB**) — decorator-based Web Components framework. See package [README](packages/kartoffelgames.web.potato_web_builder/README.md) and `docs/`. Three sublayers: Core (component system, template parser, modules, reactive state), built-in Modules (expression `{{...}}`, attribute `[prop]`/`[(prop)]`/`(event)`/`#id`, instructions `$if`/`$for`/`$slot`/`$dynamic-content`, extensions), Application (`PwbApplication`).
- `kartoffelgames.web.gpu` — WebGPU abstraction (buffers, pipelines, shaders, textures, execution).
- `kartoffelgames.web.potato_engine` — ECS-style game runtime built on PWB + GPU: `GameSystem`, `GameEnvironment`, `GameComponent`, hierarchy. Systems declare `dependentSystemTypes` and receive component state changes per update.
- `kartoffelgames.web.potato_engine_editor`, `kartoffelgames.web.potatno_code` (note the typo'd package name — intentional), `kartoffelgames.web.file_system`, `kartoffelgames.web.database`.

When changing a core library, scan dependents for breakage — particularly PWB and the engine, which lean heavily on `Injection`, `InteractionZone`, and the `core` data containers.

## Code style and conventions

Enforced by [eslint.config.js](eslint.config.js) — read it before introducing patterns. The lint rules are unusually opinionated; do not work around them. Additional house rules live in the GitHub agent files [Kartoffelgames-Code-Editor.agent.md](.github/agents/Kartoffelgames-Code-Editor.agent.md) and [Kartoffelgames-Test-Editor.agent.md](.github/agents/Kartoffelgames-Test-Editor.agent.md).

### TypeScript surface

- **TC39 standard decorators only** — `experimentalDecorators` is off. Use accessor properties with the new-style decorators (PWB's `@PwbComponent`, `@ComponentState.state()` etc.).
- **Deno strict TS**: `strictNullChecks`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `noUnusedParameters`, `noPropertyAccessFromIndexSignature`, `useUnknownInCatchVariables` are all on globally via [deno.json](deno.json).
- **Type imports**: `import type` is required (`consistent-type-imports` is `error`, inline-style preferred — `import { type Foo, bar } from './m'`).
- **Array type form**: `Array<T>` (generic), never `T[]`.
- **Explicit return types** on all public methods and functions.
- **Other enforced**: single quotes, semicolons, `===`, `prefer-const`, `prefer-readonly`, `prefer-for-of`, `curly`, `no-console`, no `var`, avoid unnecessary `return await`.

### Naming convention

Enforced by `@typescript-eslint/naming-convention` ([eslint.config.js:167](eslint.config.js#L167)):

| Kind | Form | Example |
|---|---|---|
| Local variable | `l` prefix + StrictPascalCase | `const lLocalVariable: string;` |
| Global variable | `g` prefix + StrictPascalCase | `const gParser = new PgslParser();` |
| Function parameter | `p` prefix + StrictPascalCase | `(pParameter: string, ...pArgs: Array<number>)` |
| Private/protected class field | `m` prefix + StrictPascalCase | `private mEnvironment: GameEnvironment;` |
| Public class property | strictCamelCase | `public encoding: string;` |
| Static readonly constant | `UPPER_CASE` | `public static readonly MAX_LENGTH = 1000;` |
| Type parameter | `T` prefix | `TValue`, `TKey` |
| Class / Type / Enum | StrictPascalCase | `TextProcessor`, `ProcessingResult` |
| Interface | StrictPascalCase, optional `I` prefix | `ISerializable` if implemented by classes; `ProcessingOptions` for plain-data shapes |
| Exported variable/function | StrictPascalCase | |

Underscore `_` is allowed as an ignored-arg name; otherwise leading underscores are forbidden.

### File and directory naming

- **Files**: `kebab-case.ts` (lowercase only)
- **Enum files**: `my-enum.enum.ts`
- **Interface-only files**: `i-my-interface.interface.ts` — only when the file's sole purpose is that interface, and only when the `I` prefix applies (implementation interfaces).
- **Directories**: `snake_case` (lowercase only, no hyphens — see existing `interaction_zone`, `component_item`, etc.).

### File content order

When a file holds multiple definitions, order them: **main class → helper classes → exported types → internal types**. The file is named after the main class.

### Enums

The codebase does not use TypeScript `enum` for new code. Use a const-object + type alias pattern, e.g.:

```typescript
export const PwbApplicationDebugLoggingType = {
    None: 0,
    Component: 1,
    Module: 2,
    Extention: 4,
    All: 7
} as const;
export type PwbApplicationDebugLoggingType = typeof PwbApplicationDebugLoggingType[keyof typeof PwbApplicationDebugLoggingType];
```

### Member ordering

Alphabetical within visibility-grouped sections: static fields → static accessors → static methods → instance fields (decorated first) → instance accessors → constructors → instance methods → abstract methods. The full ordering is in [eslint.config.js:102](eslint.config.js#L102) — follow it; do not reorder ad hoc.

### Method body structure

Method bodies are organized into labeled logical groups. Lead each group with a `// Sentence-case description.` comment:

```typescript
public processData(pInput: string): ProcessedData {
    // Validate input parameters.
    if (!pInput || pInput.length === 0) {
        throw new Exception('Input cannot be empty', this);
    }

    // Parse and transform data.
    const lParsedData: ParsedData = this.parseInput(pInput);
    const lTransformedData: TransformedData = this.transformData(lParsedData);

    // Generate and return result.
    return this.generateResult(lTransformedData);
}
```

### Parameter rules

- **Never split a parameter list across multiple lines** — keep all parameters on one line.
- **Constructor with >4 parameters**: replace with a single parameter-object typed as `<ClassName>ConstructorParameter`, declared in the same file using `type` (not `interface`).
- **Switch statement formatting**: use block `{ ... break; }` for multi-statement or non-returning cases; use inline `case N: return ...;` for cases that directly return.

### TSDoc

All public classes, methods, and properties carry TSDoc. Tag order is enforced by convention: description → `@typeParam` → `@param` → `@returns` → `@throws` → `@example` → other. Blank line between description and first tag, and between tag groups; same-tag types are not separated by blank lines. Parameter docs use the `p`-prefixed name: `@param pInput - Description.`

### TODO comments

Never delete a `// TODO` comment without explicit confirmation that the issue is resolved — comments are how in-flight work is tracked between sessions.

## Testing

Tests use Deno's built-in runner. Assertions use the custom `expect` from `@kartoffelgames/core-test`, which re-exports `@std/expect` plus the matchers `toBeDeepEqual`, `toHaveOrderedItems`, `toBeComponentStructure`.

The kg test runner walks the workspace and discovers tests via the `kg.config.test.directory` field in each package's `deno.json`. Tests live under each package's `test/` directory **mirroring the source layout** — `source/parser/lexer.ts` → `test/parser/lexer.test.ts`.

### Test file discipline

- **One class per test file.** One method, property, or constructor per `Deno.test`.
- **Test names**: `ClassName.method()` (with parens) for methods, `ClassName.property` (no parens) for properties, `Error: [what is tested]` for error-path tests. Statics are named like their instance siblings.
- **Group related tests with hyphens** in the name: `'Table - Single Row - Query with is'`.
- **Each step has three labeled sections** in order, each preceded by a comment:
  ```typescript
  Deno.test('TextNode.text', async (pContext) => {
      await pContext.step('Get text', () => {
          // Setup.
          const lTextNode: TextNode = new TextNode();
          lTextNode.text = 'Sample text';

          // Process.
          const lResult: string = lTextNode.text;

          // Evaluation.
          expect(lResult).toBe('Sample text');
      });
  });
  ```
  Only one "Process" action per step. Nest `pContext.step` for hierarchical groupings.
- **Error tests**: wrap the failing call in an anonymous function, then `expect(fn).toThrow('exact full message')`. Match the entire message, not a substring.
- **Test data uses generic names**: `TestTable`, `TestValueOne`, `propertyOne` — not `UserTable`, `John Doe`, etc. Checked values (the ones asserted on) go in the Setup section; throwaway values can be inline.

### Integration tests

For units that cannot be directly instantiated — syntax-tree nodes, objects that must come out of a parser/compiler pipeline, units with heavy dependencies — replace the `ClassName.method()` test-name pattern with **functional groupings**: `ClassName - SyntaxTree Values`, `ClassName - Validation`, `ClassName - Transpilation`, `ClassName - Error Cases`. Same three-section step structure inside.
