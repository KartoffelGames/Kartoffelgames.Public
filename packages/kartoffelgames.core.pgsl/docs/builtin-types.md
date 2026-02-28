# Built-in Types

PGSL provides a set of built-in types that map to WGSL types during transpilation.

## Scalar Types

### Numeric Types

| PGSL Type  | WGSL Type | Description                     |
|------------|----------|---------------------------------|
| `float`    | `f32`    | 32-bit floating point           |
| `float16`  | `f16`    | 16-bit floating point (requires `f16` extension) |
| `int`      | `i32`    | 32-bit signed integer           |
| `uint`     | `u32`    | 32-bit unsigned integer         |

```pgsl
const pi: float = 3.14159265;
const count: int = 42;
const index: uint = 0;
const halfValue: float16 = 1.5h;
```

Using `float16` anywhere in the shader automatically enables the `f16` WGSL extension in the transpiled output.

### Abstract Numeric Types

PGSL uses abstract numeric types for literal values at compile time:

- **AbstractFloat** -- The type of untyped float literals (e.g., `3.14`). Implicitly convertible to `float` and `float16`.
- **AbstractInteger** -- The type of untyped integer literals (e.g., `42`). Implicitly convertible to `int`, `uint`, `float`, and `float16`.

These types only exist during compilation and are resolved to concrete types based on context.

### Boolean Type

| PGSL Type | WGSL Type | Description |
|-----------|----------|-------------|
| `bool`    | `bool`   | Boolean     |

```pgsl
const flag: bool = true;
```

### Void Type

| PGSL Type | WGSL Type | Description    |
|-----------|----------|----------------|
| `void`    | (none)   | No return type |

Used only as a function return type:

```pgsl
function doSomething(): void { }
```

## Vector Types

Vectors are parameterized by their inner scalar type.

| PGSL Type   | WGSL Type    | Description             |
|-------------|-------------|-------------------------|
| `Vector2<T>` | `vec2<T>`   | 2-component vector      |
| `Vector3<T>` | `vec3<T>`   | 3-component vector      |
| `Vector4<T>` | `vec4<T>`   | 4-component vector      |

`T` must be a numeric type (`float`, `float16`, `int`, `uint`) or `bool`.

```pgsl
const position: Vector4<float> = new Vector4(1.0, 2.0, 3.0, 1.0);
const uv: Vector2<float> = new Vector2(0.0, 1.0);
const normal: Vector3<float> = new Vector3(0.0, 1.0, 0.0);
```

### Vector Swizzling

Vector components can be accessed by `x`, `y`, `z`, `w` (or equivalently `r`, `g`, `b`, `a`):

```pgsl
function example(): void {
    let v: Vector4<float> = new Vector4(1.0, 2.0, 3.0, 4.0);
    let x: float = v.x;
    let xy: Vector2<float> = v.xy;
    let zyx: Vector3<float> = v.zyx;
}
```

## Matrix Types

Matrices are parameterized by their inner numeric type. The naming convention is `Matrix{rows}{cols}`.

| PGSL Type      | WGSL Type      | Description              |
|----------------|---------------|--------------------------|
| `Matrix22<T>`  | `mat2x2<T>`   | 2x2 matrix               |
| `Matrix23<T>`  | `mat2x3<T>`   | 2x3 matrix (2 cols, 3 rows) |
| `Matrix24<T>`  | `mat2x4<T>`   | 2x4 matrix               |
| `Matrix32<T>`  | `mat3x2<T>`   | 3x2 matrix               |
| `Matrix33<T>`  | `mat3x3<T>`   | 3x3 matrix               |
| `Matrix34<T>`  | `mat3x4<T>`   | 3x4 matrix               |
| `Matrix42<T>`  | `mat4x2<T>`   | 4x2 matrix               |
| `Matrix43<T>`  | `mat4x3<T>`   | 4x3 matrix               |
| `Matrix44<T>`  | `mat4x4<T>`   | 4x4 matrix               |

`T` must be a floating-point type (`float` or `float16`).

```pgsl
const identity: Matrix44<float> = new Matrix44(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
);
```

Matrix columns can be accessed by index:

```pgsl
function example(): void {
    let m: Matrix44<float> = new Matrix44(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    let firstColumn: Vector4<float> = m[0];
}
```

## Array Types

### Fixed-Size Arrays

```pgsl
Array<T, N>
```

`T` is the element type, `N` is the compile-time constant size.

```pgsl
const values: Array<float, 3> = new Array(1.0, 2.0, 3.0);
```

### Runtime-Sized Arrays

```pgsl
Array<T>
```

Runtime-sized arrays can only be used in `storage` declarations:

```pgsl
[GroupBinding("world", "lights")]
storage lights: Array<PointLight>;
```

## Texture Types

| PGSL Type                         | WGSL Type                         | Description                      |
|-----------------------------------|-----------------------------------|----------------------------------|
| `Texture1d<T>`                    | `texture_1d<T>`                   | 1D sampled texture               |
| `Texture2d<T>`                    | `texture_2d<T>`                   | 2D sampled texture               |
| `Texture2dArray<T>`               | `texture_2d_array<T>`             | 2D array sampled texture         |
| `Texture3d<T>`                    | `texture_3d<T>`                   | 3D sampled texture               |
| `TextureCube<T>`                  | `texture_cube<T>`                 | Cube sampled texture             |
| `TextureCubeArray<T>`             | `texture_cube_array<T>`           | Cube array sampled texture       |
| `TextureMultisampled2d<T>`        | `texture_multisampled_2d<T>`      | 2D multisampled texture          |
| `TextureDepth2d`                  | `texture_depth_2d`                | 2D depth texture                 |
| `TextureDepth2dArray`             | `texture_depth_2d_array`          | 2D array depth texture           |
| `TextureDepthCube`                | `texture_depth_cube`              | Cube depth texture               |
| `TextureDepthCubeArray`           | `texture_depth_cube_array`        | Cube array depth texture         |
| `TextureDepthMultisampled2d`      | `texture_depth_multisampled_2d`   | 2D multisampled depth texture    |
| `TextureExternal`                 | `texture_external`                | External texture                 |

For sampled textures, `T` is the texel component type (`float`, `int`, `uint`).

```pgsl
[GroupBinding("user", "diffuse_texture")]
uniform diffuseTexture: Texture2d<float>;
```

### Storage Textures

| PGSL Type                                    | WGSL Type                                     | Description                  |
|----------------------------------------------|-----------------------------------------------|------------------------------|
| `TextureStorage1d<format, access>`           | `texture_storage_1d<format, access>`          | 1D storage texture           |
| `TextureStorage2d<format, access>`           | `texture_storage_2d<format, access>`          | 2D storage texture           |
| `TextureStorage2dArray<format, access>`      | `texture_storage_2d_array<format, access>`    | 2D array storage texture     |
| `TextureStorage3d<format, access>`           | `texture_storage_3d<format, access>`          | 3D storage texture           |

Storage textures require a texel format and access mode as string parameters:

```pgsl
[GroupBinding("compute", "output")]
storage outputTexture: TextureStorage2d<"rgba8unorm", "write">;
```

## Sampler Types

| PGSL Type          | WGSL Type            | Description             |
|--------------------|---------------------|-------------------------|
| `Sampler`          | `sampler`           | Regular sampler         |
| `SamplerComparison`| `sampler_comparison`| Comparison sampler      |

```pgsl
[GroupBinding("user", "texture_sampler")]
uniform textureSampler: Sampler;

[GroupBinding("user", "depth_sampler")]
uniform depthSampler: SamplerComparison;
```

## Built-in Semantic Types

These special types map struct properties to GPU built-in values. They are used in entry point input/output structs.

| PGSL Type          | WGSL Built-in                  | Transpiled Type | Description                                                |
|--------------------|--------------------------------|-----------------|------------------------------------------------------------|
| `Position`         | `@builtin(position)`           | `vec4<f32>`     | Clip-space vertex position (vertex output) or fragment position (fragment input) |
| `VertexIndex`      | `@builtin(vertex_index)`       | `u32`           | Current vertex index                                       |
| `InstanceIndex`    | `@builtin(instance_index)`     | `u32`           | Current instance index                                     |
| `FrontFacing`      | `@builtin(front_facing)`       | `bool`          | Whether the fragment is front-facing                       |
| `FragDepth`        | `@builtin(frag_depth)`         | `f32`           | Fragment depth output                                      |
| `SampleIndex`      | `@builtin(sample_index)`       | `u32`           | Current sample index within multi-sampling                 |
| `SampleMask`       | `@builtin(sample_mask)`        | `u32`           | Sample coverage mask                                       |
| `LocalInvocationId` | `@builtin(local_invocation_id)` | `vec3<u32>`   | Local invocation ID in compute shader                      |
| `LocalInvocationIndex` | `@builtin(local_invocation_index)` | `u32`   | Linearized local invocation index                          |
| `GlobalInvocationId` | `@builtin(global_invocation_id)` | `vec3<u32>` | Global invocation ID                                       |
| `WorkgroupId`      | `@builtin(workgroup_id)`       | `vec3<u32>`     | Current workgroup ID                                       |
| `NumWorkgroups`    | `@builtin(num_workgroups)`     | `vec3<u32>`     | Total number of workgroups                                 |
| `PrimitiveIndex`   | `@builtin(primitive_index)`    | `u32`           | Index of the current primitive (requires `primitive_index` extension) |
| `ClipDistances<N>` | `@builtin(clip_distances)`     | `array<f32,N>`  | Clip distances array (requires `clip_distances` extension) |

```pgsl
struct VertexInput {
    instanceId: InstanceIndex,

    [Location("position")]
    position: Vector4<float>
}

struct VertexOutput {
    position: Position,

    [Location("uv")]
    uv: Vector2<float>
}
```

## Pointer Type

```pgsl
Pointer<T>
```

Pointers are used in function parameters to pass references to storage data:

```pgsl
function example(ptr: Pointer<float>): void {
    let value: float = *ptr;
}
```

## Built-in Enums

### `AccessMode`

| Value              | String Value   |
|-------------------|----------------|
| `AccessMode.Read`      | `"read"`          |
| `AccessMode.Write`     | `"write"`         |
| `AccessMode.ReadWrite` | `"read_write"`    |

### `InterpolateType`

| Value                        | String Value    |
|-----------------------------|-----------------|
| `InterpolateType.Perspective`| `"perspective"` |
| `InterpolateType.Linear`    | `"linear"`      |
| `InterpolateType.Flat`      | `"flat"`        |

### `InterpolateSampling`

| Value                            | String Value   |
|---------------------------------|----------------|
| `InterpolateSampling.Center`   | `"center"`     |
| `InterpolateSampling.Centroid` | `"centroid"`   |
| `InterpolateSampling.Sample`   | `"sample"`     |
| `InterpolateSampling.First`    | `"first"`      |
| `InterpolateSampling.Either`   | `"either"`     |

## Built-in Structs

### `FrexpResult`

Returned by the `frexp` built-in function. Contains:
- `fract: float` -- The fractional part.
- `exp: int` -- The exponent part.

### `ModfResult`

Returned by the `modf` built-in function. Contains:
- `fract: float` -- The fractional part.
- `whole: float` -- The whole number part.
