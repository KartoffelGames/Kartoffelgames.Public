# Declarations

PGSL supports several types of declarations at the module (top-level) scope: variables, functions, structs, enums, and aliases.

## Variable Declarations

### Module-Scope Variables

Module-scope variables are declared at the top level of a PGSL document. The general syntax is:

```pgsl
<declaration_type> <name>: <type> [= <expression>];
```

#### `const`

Declares a compile-time constant. Must have an initializer that is a constant expression. The type must be constructible.

```pgsl
const PI: float = 3.14159265;
const MAX_LIGHTS: int = 16;
const ORIGIN: Vector2<float> = new Vector2(0.0, 0.0);
```

#### `storage`

Declares a storage buffer variable. Must not have an initializer. Requires a `[GroupBinding]` attribute. The type must be host-shareable or a storage texture type.

```pgsl
[GroupBinding("world", "point_lights")]
storage pointLights: Array<PointLight>;

[GroupBinding("world", "point_lights")]
[AccessMode("read_write")]
storage pointLights: Array<PointLight>;
```

Storage texture declarations also use the `storage` keyword:

```pgsl
[GroupBinding("textures", "output_texture")]
storage outputTexture: TextureStorage2d<"rgba8unorm", "write">;
```

#### `uniform`

Declares a uniform buffer variable. Must not have an initializer. Requires a `[GroupBinding]` attribute. The type must be constructible and host-shareable, or a texture/sampler type.

```pgsl
[GroupBinding("object", "transform")]
uniform transformationMatrix: Matrix44<float>;

[GroupBinding("user", "sampler")]
uniform textureSampler: Sampler;

[GroupBinding("user", "texture")]
uniform diffuseTexture: Texture2d<float>;
```

Storage textures are not allowed in uniform declarations.

#### `workgroup`

Declares a workgroup-shared variable for compute shaders. Must have a fixed footprint and be a plain type. No initializer, no attributes.

```pgsl
workgroup sharedData: Array<float, 256>;
```

#### `private`

Declares a module-scope private variable. The type must be constructible. No attributes.

```pgsl
private counter: int = 0;
```

#### `param`

Declares a pipeline-creation-time parameter. Must be a scalar type with a constant initializer. No attributes. The value can be overridden at pipeline creation time.

```pgsl
param brightness: float = 1.0;
param featureEnabled: int = 0;
```

Parameters appear in the `PgslParserResult.parameters` array with their name and default value.

### Function-Scope Variables

Inside function bodies, `let` and `const` are used:

#### `let`

Declares a mutable local variable:

```pgsl
let position: Vector4<float> = new Vector4(0.0, 0.0, 0.0, 1.0);
let counter: int = 0;
counter = counter + 1;
```

#### `const` (function scope)

Declares an immutable local variable:

```pgsl
const lightCount: uint = arrayLength(&pointLights);
const offset: float = 0.5;
```

## Function Declarations

Functions are declared with the `function` keyword:

```pgsl
function <name>(<parameters>): <return_type> {
    <body>
}
```

### Basic Functions

```pgsl
function add(a: float, b: float): float {
    return a + b;
}

function doSomething(): void {
    // No return value needed.
}
```

## Struct Declarations

Structs define composite types with named fields:

```pgsl
struct <name> {
    <field_name>: <type>,
    <field_name>: <type>
}
```

```pgsl
struct PointLight {
    position: Vector4<float>,
    color: Vector4<float>,
    range: float
}
```

Struct properties can have attributes:

```pgsl
struct VertexOutput {
    position: Position,

    [Location("uv")]
    uv: Vector2<float>,

    [Location("normal")]
    normal: Vector4<float>
}
```

See [Attributes](./attributes.md) for details on struct property attributes like `[Location]`, `[Interpolate]`, `[Align]`, `[Size]`, `[Invariant]`, and `[BlendSource]`.

## Enum Declarations

Enums define named string constants:

```pgsl
enum Direction {
    Up = "up",
    Down = "down",
    Left = "left",
    Right = "right"
}
```

Enum values are accessed using dot notation:

```pgsl
const dir: string = Direction.Up;
```

Several built-in enums are available (see [Built-in Types](./builtin-types.md)):
- `AccessMode` with values `Read`, `Write`, `ReadWrite`
- `InterpolateType` with values `Perspective`, `Linear`, `Flat`
- `InterpolateSampling` with values `Center`, `Centroid`, `Sample`, `First`, `Either`

## Alias Declarations

Aliases create alternative names for existing types:

```pgsl
alias Float4 = Vector4<float>;
alias LightArray = Array<PointLight>;
```

The alias is resolved during AST processing and does not appear in the transpiled output.
