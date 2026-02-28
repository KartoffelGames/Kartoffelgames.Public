# Attributes

Attributes in PGSL are metadata annotations placed before declarations, enclosed in square brackets `[]`. They control how declarations are interpreted during transpilation.

## Syntax

```pgsl
[AttributeName(parameter1, parameter2)]
declaration ...
```

Multiple attributes can be stacked:

```pgsl
[GroupBinding("group_name", "binding_name")]
[AccessMode(AccessMode.Read)]
storage myBuffer: Array<float>;
```

## Variable Attributes

### `GroupBinding`

Assigns a bind group and binding slot to a module-scope variable (`uniform`, `storage`). Takes two string parameters: the group name and the binding name.

```pgsl
[GroupBinding("object", "transformation_matrix")]
uniform transformationMatrix: Matrix44<float>;

[GroupBinding("world", "view_projection_matrix")]
uniform viewProjectionMatrix: Matrix44<float>;
```

The string values are converted into numeric `@group(N)` and `@binding(N)` indices in the transpiled WGSL. See [Binding Mechanism](./binding-mechanism.md) for how numeric indices are assigned.

Can only be attached to `VariableDeclarationAst` (module-scope variable declarations).

### `AccessMode`

Specifies the access mode for a `storage` variable. Takes one parameter from the built-in `AccessMode` enum.

```pgsl
[GroupBinding("world", "point_lights")]
[AccessMode(AccessMode.Read)]
storage pointLights: Array<PointLight>;

[GroupBinding("compute", "output_buffer")]
[AccessMode(AccessMode.ReadWrite)]
storage outputBuffer: Array<float>;
```

Available values from the `AccessMode` enum:
- `AccessMode.Read` -- Read-only access (default for storage).
- `AccessMode.Write` -- Write-only access.
- `AccessMode.ReadWrite` -- Read and write access.

Can only be attached to `VariableDeclarationAst`.

## Struct Property Attributes

### `Location`

Assigns a user-defined I/O location to a struct property. Takes one string parameter: the location name. The string is converted to a numeric `@location(N)` index in the transpiled output.

```pgsl
struct VertexOutput {
    position: Position,

    [Location("uv")]
    uv: Vector2<float>,

    [Location("normal")]
    normal: Vector4<float>,

    [Location("fragment_position")]
    fragmentPosition: Vector4<float>
}
```

Location indices are assigned sequentially based on declaration order, similar to binding indices.

Can only be attached to `StructPropertyDeclarationAst`.

### `Interpolate`

Controls how values are interpolated between shader stages. Takes one or two parameters: an interpolation type and an optional sampling method.

```pgsl
struct FragmentInput {
    [Location("color")]
    [Interpolate(InterpolateType.Flat)]
    color: Vector4<float>,

    [Location("uv")]
    [Interpolate(InterpolateType.Perspective, InterpolateSampling.Center)]
    uv: Vector2<float>
}
```

Interpolation types (`InterpolateType` enum):
- `InterpolateType.Perspective` -- Perspective-correct interpolation.
- `InterpolateType.Linear` -- Linear interpolation.
- `InterpolateType.Flat` -- No interpolation (flat shading).

Interpolation sampling (`InterpolateSampling` enum):
- `InterpolateSampling.Center` -- Sample at pixel center.
- `InterpolateSampling.Centroid` -- Sample at centroid.
- `InterpolateSampling.Sample` -- Per-sample interpolation.
- `InterpolateSampling.First` -- Use first vertex value.
- `InterpolateSampling.Either` -- Use either first or provoking vertex.

Can only be attached to `StructPropertyDeclarationAst`.

### `Align`

Overrides the alignment of a struct property. Takes one unsigned integer constant parameter (the alignment in bytes).

```pgsl
struct CustomLayout {
    [Align(16)]
    position: Vector4<float>,

    [Align(4)]
    value: float
}
```

Can only be attached to `StructPropertyDeclarationAst`.

### `Size`

Overrides the size of a struct property. Takes one unsigned integer constant parameter (the size in bytes).

```pgsl
struct CustomLayout {
    [Size(32)]
    position: Vector4<float>
}
```

Can only be attached to `StructPropertyDeclarationAst`.

### `Invariant`

Marks a struct property as invariant, ensuring consistent results across shader invocations. Takes no parameters.

```pgsl
struct VertexOutput {
    [Invariant]
    position: Position
}
```

Can only be attached to `StructPropertyDeclarationAst`.

### `BlendSource`

Specifies the blend source index for dual-source blending. Takes one unsigned integer constant parameter. Using this attribute enables the `dual_source_blending` extension.

```pgsl
struct FragmentOutput {
    [Location("TextureOne")]
    [BlendSource(0)]
    color0: Vector4<float>,

    [Location("TextureOne")]
    [BlendSource(1)]
    color1: Vector4<float>
}
```

Can only be attached to `StructPropertyDeclarationAst`.

## Function Attributes (Entry Points)

### `Vertex`

Marks a function as a vertex shader entry point. Takes no parameters.

```pgsl
[Vertex()]
function vertex_main(input: VertexIn): VertexOut {
    // ...
}
```

Can only be attached to `FunctionDeclarationAst`. See [Entry Points](./entry-points.md) for parameter and return type restrictions.

### `Fragment`

Marks a function as a fragment shader entry point. Takes no parameters.

```pgsl
[Fragment()]
function fragment_main(input: FragmentIn): FragmentOut {
    // ...
}
```

Can only be attached to `FunctionDeclarationAst`. See [Entry Points](./entry-points.md) for parameter and return type restrictions.

### `Compute`

Marks a function as a compute shader entry point. Takes 1 to 3 integer constant parameters for the workgroup size (x, y, z). Unspecified dimensions default to 1.

```pgsl
[Compute(4, 4, 4)]
function compute_3d(): void {
    // workgroup size: 4 x 4 x 4
}
```

Can only be attached to `FunctionDeclarationAst`. See [Entry Points](./entry-points.md) for parameter and return type restrictions.

## Meta Attribute

The `Meta` attribute attaches string metadata to any declaration. It takes two string parameters: a key and a value. Meta attributes are not transpiled into the output but are collected into the `PgslParserResult.metaValues` map.

```pgsl
[Meta("ShaderType", "PBR")]
[Meta("Version", "2.0")]
struct Material {
    albedo: Vector4<float>,
    roughness: float
}
```

Meta values from the `Meta` attribute on declarations are collected along with preprocessor `#META` directives into the result's `metaValues` map.

Can be attached to any declaration type.
