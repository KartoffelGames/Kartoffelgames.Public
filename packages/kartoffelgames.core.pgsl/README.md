# @kartoffelgames/core.pgsl

PGSL (PotatoGames Shader Language), spoken "Pixel", is a high-level graphics shader language that transpiles into WGSL (WebGPU Shading Language). It provides a more expressive, type-safe syntax while maintaining full compatibility with the WebGPU pipeline.

## Overview

PGSL source code is parsed into an abstract syntax tree (AST), validated, and then transpiled into WGSL. The resulting transpiled code can be passed directly to `GPUDevice.createShaderModule()`.

The transpilation pipeline:

```
PGSL Source --> Preprocessor --> AST --> Validation --> Transpilation --> WGSL Output
```

1. **Preprocessor**: Resolves `#IMPORT`, `#IFDEF`, `#IFNOTDEF`, and `#META` directives.
2. **AST Construction**: Parses the preprocessed source into a concrete syntax tree (CST), then builds the abstract syntax tree (AST).
3. **Validation**: Type checking, scope analysis, and semantic validation. Produces incidents on errors.
4. **Transpilation**: Converts the validated AST into WGSL code using a `WgslTranspiler`.

## Usage

```typescript
import { PgslParser } from '@kartoffelgames/core.pgsl';
import { WgslTranspiler } from '@kartoffelgames/core.pgsl';

const parser = new PgslParser();

// Optional: add environment values for #IFDEF preprocessor directives
parser.addEnvironmentValue('USE_LIGHTING', 'true');

// Optional: register imports that can be used via #IMPORT
parser.addImport('shared_types', `
    struct Light {
        position: Vector4<float>,
        color: Vector4<float>
    }
`);

const pgslSource = `
    #IMPORT "shared_types";

    [GroupBinding("world", "main_light")]
    uniform mainLight: Light;

    struct VertexIn {
        [Location("position")]
        position: Vector4<float>
    }

    struct VertexOut {
        position: Position
    }

    [Vertex()]
    function vertex_main(input: VertexIn): VertexOut {
        let out: VertexOut;
        out.position = input.position;
        return out;
    }
`;

const result = parser.transpile(pgslSource, new WgslTranspiler());
```

## The `PgslParserResult` Object

The `transpile` method returns a `PgslParserResult` containing all information extracted from the parsed and transpiled shader.

### `result.source`

The transpiled WGSL source code string. This is the output that can be passed to `GPUDevice.createShaderModule()`. When the document has any incident, the source is an empty string.

### `result.incidents`

An array of `PgslParserResultIncident` objects. Each incident describes a validation or parsing error. When incidents are present, no usable data is generated -- the `source` will be empty and binding/entry point information will not be available.

Each incident has:
- `message` -- The error description.
- `range` -- The source code range `[startLine, startColumn, endLine, endColumn]` where the error occurred.

### `result.metaValues`

A `ReadonlyMap<string, string>` containing all `#META` key-value pairs found in the source and its imports. Main document meta values override imported meta values with the same key.

### `result.bindings`

An array of `PgslParserResultBinding` objects representing all `[GroupBinding]` declarations found in the shader. Each binding provides:

- `group` -- The numeric bind group index (assigned sequentially based on declaration order).
- `binding` -- The numeric binding index within the group (assigned sequentially based on declaration order).
- `groupName` -- The string group name as written in the `[GroupBinding]` attribute.
- `bindingName` -- The string binding name as written in the `[GroupBinding]` attribute.
- `type` -- A `PgslParserResultType` describing the bound variable's type, including alignment and size information.

### `result.parameters`

An array of `PgslParserResultParameter` objects for all `param` declarations. Each parameter has:

- `name` -- The parameter name.
- `value` -- The constant default value.

### `result.entryPoints`

Entry point information depends on the shader stage:

**Vertex entry points** (`PgslParserResultVertexEntryPoint`):
- `stage` -- `'vertex'`
- `name` -- The function name.
- `input` / `output` -- Struct type descriptions with properties, location indices, and built-in mappings.

**Fragment entry points** (`PgslParserResultFragmentEntryPoint`):
- `stage` -- `'fragment'`
- `name` -- The function name.
- `input` / `output` -- Struct type descriptions.

**Compute entry points** (`PgslParserResultComputeEntryPoint`):
- `stage` -- `'compute'`
- `name` -- The function name.
- `workgroupSize` -- `{ x: number, y: number, z: number }`.

### `result.extensions`

An array of strings listing the WGSL extensions required by the shader (e.g., `"f16"`, `"clip_distances"`, `"dual_source_blending"`, `"primitive_index"`). Extensions are automatically detected based on the types and features used in the shader.

## Transpiled Code

The transpiled WGSL code is available in the `source` property of the result object. The transpilation is performed by the `WgslTranspiler` which converts each AST node into its WGSL equivalent. The transpiler is the only built-in target; custom transpilers can be created by extending the `Transpiler` base class.

## Documentation

Detailed language documentation is available in the [`docs/`](./docs/) directory:

- [Declarations](./docs/declarations.md) -- Variable, function, struct, enum, and alias declarations.
- [Expressions](./docs/expressions.md) -- All expression types (arithmetic, comparison, logical, etc.).
- [Statements](./docs/statements.md) -- Control flow, assignments, and execution statements.
- [Attributes](./docs/attributes.md) -- Attribute syntax including the `[Meta]` attribute.
- [Built-in Types](./docs/builtin-types.md) -- Numeric, vector, matrix, texture, sampler, and other types.
- [Built-in Functions](./docs/builtin-functions.md) -- Numeric, texture, packing, and synchronisation functions.
- [Preprocessor](./docs/preprocessor.md) -- `#IMPORT`, `#IFDEF`, `#IFNOTDEF`, and `#META` directives.
- [Binding Mechanism](./docs/binding-mechanism.md) -- How string-based bindings are converted to numeric group/binding indices.
- [Entry Points](./docs/entry-points.md) -- Vertex, fragment, and compute shader entry points with parameter restrictions.
