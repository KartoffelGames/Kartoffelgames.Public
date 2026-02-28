# Preprocessor

PGSL includes a preprocessor that runs before parsing. Preprocessor directives start with `#` and are processed top-to-bottom. Three directives are supported: `#IMPORT`, `#IFDEF`/`#IFNOTDEF`, and `#META`.

## `#IMPORT`

Imports the contents of a registered source file into the current document. The imported code is inlined at the import location.

### Syntax

```pgsl
#IMPORT "import_name";
```

The import name is a string identifier that must be registered with the parser before transpilation using `PgslParser.addImport()`.

### Registration

```typescript
const parser = new PgslParser();

parser.addImport('shared_types', `
    struct Light {
        position: Vector4<float>,
        color: Vector4<float>,
        range: float
    }
`);
```

### Basic Import

```pgsl
#IMPORT "shared_types";

[GroupBinding("world", "main_light")]
uniform mainLight: Light;
```

### Nested Imports

Imports can contain their own `#IMPORT` directives:

```typescript
parser.addImport('math_constants', `
    const EPSILON: float = 0.001;
`);

parser.addImport('math_utils', `
    #IMPORT "math_constants";
    const PI: float = 3.14;
`);
```

```pgsl
#IMPORT "math_utils";

function example(): void {
    const result: float = PI + EPSILON;
}
```

Both `PI` and `EPSILON` are available because `math_utils` itself imports `math_constants`.

### Duplicate Import Prevention

If the same import is referenced multiple times (directly or transitively), its content is only included once:

```pgsl
#IMPORT "math_utils";
#IMPORT "math_constants";
```

Even though both `math_utils` and the main document import `math_constants`, the constants from `math_constants` are included only once.

### Case Insensitivity

Import names are case-insensitive. The following are equivalent:

```typescript
parser.addImport('MYIMPORT', `const X: float = 1.0;`);
```

```pgsl
#IMPORT "myimport";
```

### Error: Non-Existent Import

Referencing an import that has not been registered throws an error:

```pgsl
#IMPORT "NonExistentImport";
```

This will throw: `Import "nonexistentimport" not found.`

## `#IFDEF` / `#IFNOTDEF`

Conditional compilation directives that include or exclude blocks of code based on environment values.

### Syntax

```pgsl
#IFDEF ENVIRONMENT_KEY
    // included if ENVIRONMENT_KEY is defined
#ENDIF

#IFNOTDEF ENVIRONMENT_KEY
    // included if ENVIRONMENT_KEY is NOT defined
#ENDIF
```

### Environment Values

Environment values are registered with the parser before transpilation:

```typescript
const parser = new PgslParser();
parser.addEnvironmentValue('USE_LIGHTING', 'true');
parser.addEnvironmentValue('DEBUG_MODE', 'true');
```

### Basic `#IFDEF`

```pgsl
#IFDEF USE_LIGHTING
const LIGHT_MULTIPLIER: float = 2.0;
#ENDIF

#IFDEF UNUSED_FEATURE
const UNUSED: float = 0.0;
#ENDIF

function example(): void {
    const result: float = LIGHT_MULTIPLIER;
}
```

If `USE_LIGHTING` is defined but `UNUSED_FEATURE` is not, only `LIGHT_MULTIPLIER` is included. The `UNUSED` constant is stripped from the output.

### Basic `#IFNOTDEF`

```pgsl
#IFNOTDEF USE_ADVANCED_RENDERING
const FALLBACK_VALUE: float = 1.0;
#ENDIF
```

The block is included only when the key is NOT defined.

### Nested Conditionals

`#IFDEF` and `#IFNOTDEF` blocks can be nested:

```pgsl
#IFDEF ENABLE_OUTER
    const OUTER_VALUE: float = 1.0;

    #IFDEF ENABLE_INNER
        const INNER_VALUE: float = 2.0;
    #ENDIF
#ENDIF
```

Both `OUTER_VALUE` and `INNER_VALUE` are only included if both `ENABLE_OUTER` and `ENABLE_INNER` are defined. If only `ENABLE_OUTER` is defined, only `OUTER_VALUE` is included.

### Mixed Conditionals

`#IFDEF` and `#IFNOTDEF` can be mixed:

```pgsl
#IFDEF FEATURE_A
const VALUE_A: float = 100.0;
#ENDIF

#IFNOTDEF FEATURE_B
const FALLBACK_B: float = 50.0;
#ENDIF
```

### Case Insensitivity

Environment keys are case-insensitive:

```typescript
parser.addEnvironmentValue('use_feature_enabled', 'true');
```

```pgsl
#IFDEF USE_FEATURE_ENABLED
const VALUE: float = 42.0;
#ENDIF
```

This works because `use_feature_enabled` and `USE_FEATURE_ENABLED` are treated as the same key.

### Interaction with Imports

`#IFDEF` blocks work inside imported files:

```typescript
parser.addEnvironmentValue('USE_PI_LONG', 'true');

parser.addImport('constants', `
    #IFDEF USE_PI_LONG
    const PI: float = 3.14159265;
    #ENDIF

    #IFDEF USE_PI_SHORT
    const PI: float = 3.14;
    #ENDIF
`);
```

```pgsl
#IMPORT "constants";

function example(): void {
    const value: float = PI;
}
```

Since `USE_PI_LONG` is defined, the long PI value is used.

## `#META`

Defines metadata key-value pairs that are collected into the `PgslParserResult.metaValues` map. Meta directives are stripped from the transpiled output.

### Syntax

```pgsl
#META "key" "value";
#META "key";
```

The first form defines a key-value pair. The second form defines a key with an empty string value.

### Key-Value Meta

```pgsl
#META "AppName" "MyApplication";
#META "Version" "2.5.1";

function example(): void {
    const value: float = 1.0;
}
```

The transpiled output contains only the function. The meta values are accessible via:

```typescript
result.metaValues.get('AppName')  // "MyApplication"
result.metaValues.get('Version')  // "2.5.1"
```

### Key-Only Meta

```pgsl
#META "Debug";
#META "OptimizeShaders";
```

Key-only meta values have an empty string as their value:

```typescript
result.metaValues.get('Debug')           // ""
result.metaValues.get('OptimizeShaders') // ""
```

### Imported Meta

Meta values from imported files are collected into the result:

```typescript
parser.addImport('library_meta', `
    #META "LibraryName" "CoreLibrary";
    #META "LibraryVersion" "3.0.0";
    const CONSTANT: float = 42.0;
`);
```

```pgsl
#IMPORT "library_meta";

function example(): void {
    const value: float = CONSTANT;
}
```

```typescript
result.metaValues.get('LibraryName')    // "CoreLibrary"
result.metaValues.get('LibraryVersion') // "3.0.0"
```

### Meta Override

Main document meta values override imported meta values with the same key:

```typescript
parser.addImport('defaults', `
    #META "AppName" "DefaultApp";
    #META "Version" "1.0.0";
    const CONSTANT: float = 42.0;
`);
```

```pgsl
#IMPORT "defaults";
#META "AppName" "OverriddenApp";

function example(): void {
    const value: float = CONSTANT;
}
```

```typescript
result.metaValues.get('AppName') // "OverriddenApp" (overridden)
result.metaValues.get('Version') // "1.0.0" (kept from import)
```
