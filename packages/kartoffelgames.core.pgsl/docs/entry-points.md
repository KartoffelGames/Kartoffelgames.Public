# Entry Points

Entry points are functions marked with `[Vertex()]`, `[Fragment()]`, or `[Compute()]` attributes that define the shader's execution stages.

## Vertex Entry Point

A vertex entry point is marked with the `[Vertex()]` attribute. It processes per-vertex data and outputs transformed vertex data.

### Syntax

```pgsl
[Vertex()]
function vertex_main(input: VertexInputStruct): VertexOutputStruct {
    // ...
}
```

### Parameter Restrictions

- A vertex entry point must accept exactly **one parameter** of a struct type.
- The input struct properties may use `[Location]` attributes for user-defined vertex attributes.
- The input struct may contain built-in input types: `VertexIndex`, `InstanceIndex`.

### Return Type Restrictions

- Must return a struct type.
- The output struct must contain a `Position` built-in property.
- Other output properties must have `[Location]` attributes.

### Example

```pgsl
struct VertexIn {
    instanceId: InstanceIndex,

    [Location("position")]
    position: Vector4<float>,

    [Location("uv")]
    uv: Vector2<float>,

    [Location("normal")]
    normal: Vector4<float>
}

struct VertexOut {
    position: Position,

    [Location("uv")]
    uv: Vector2<float>,

    [Location("normal")]
    normal: Vector4<float>,

    [Location("fragment_position")]
    fragmentPosition: Vector4<float>
}

[Vertex()]
function vertex_main(vertex: VertexIn): VertexOut {
    let out: VertexOut;
    out.position = viewProjectionMatrix * transformationMatrix * vertex.position;
    out.uv = vertex.uv;
    out.normal = vertex.normal;
    out.fragmentPosition = transformationMatrix * vertex.position;
    return out;
}
```

### Transpiled Output

The transpiled WGSL will have:
- `@vertex` attribute on the function.
- `@location(N)` on user-defined input/output properties.
- `@builtin(...)` on built-in properties.

```wgsl
@vertex
fn vertex_main(vertex: VertexIn) -> VertexOut {
    // ...
}
```

## Fragment Entry Point

A fragment entry point is marked with the `[Fragment()]` attribute. It processes per-fragment data and outputs color values.

### Syntax

```pgsl
[Fragment()]
function fragment_main(input: FragmentInputStruct): FragmentOutputStruct {
    // ...
}
```

### Parameter Restrictions

- A fragment entry point must accept exactly **one parameter** of a struct type.
- The input struct properties must have `[Location]` attributes for user-defined inter-stage data.
- The input struct may contain built-in fragment inputs: `Position` (fragment position), `FrontFacing`, `SampleIndex`, `SampleMask`.

### Return Type Restrictions

- Must return a struct type.
- Output properties must have `[Location]` attributes.
- The output struct may contain built-in fragment outputs: `FragDepth`, `SampleMask`.

### Example

```pgsl
struct FragmentIn {
    [Location("uv")]
    uv: Vector2<float>,

    [Location("normal")]
    normal: Vector4<float>,

    [Location("fragment_position")]
    fragmentPosition: Vector4<float>
}

struct FragmentOut {
    [Location("buffer")]
    color: Vector4<float>
}

[Fragment()]
function fragment_main(fragment: FragmentIn): FragmentOut {
    let out: FragmentOut;
    out.color = textureSample(cubeTexture, cubeTextureSampler, fragment.uv);
    return out;
}
```

### Discard

Fragment shaders can use the `discard` statement to abort processing of the current fragment:

```pgsl
[Fragment()]
function fragment_main(fragment: FragmentIn): FragmentOut {
    if (fragment.alpha < 0.1) {
        discard;
    }
    // ...
}
```

## Compute Entry Point

A compute entry point is marked with the `[Compute(x, y, z)]` attribute. It runs parallel computation without direct rendering output.

### Syntax

```pgsl
[Compute(workgroup_x, workgroup_y, workgroup_z)]
function compute_main(): void { }
```

### Parameter Restrictions

- A compute entry point may accept **zero or one** parameter.
- If a parameter is used, it must be a struct type.
- The input struct may contain built-in compute inputs: `LocalInvocationId`, `LocalInvocationIndex`, `GlobalInvocationId`, `WorkgroupId`, `NumWorkgroups`.

### Return Type Restrictions

- Must return `void`.

### Workgroup Size

The `[Compute]` attribute takes 1 to 3 integer constant parameters defining the workgroup size:

```pgsl
[Compute(4, 4, 4)]
function compute_3d(): void {
    // workgroup size: 4 x 4 x 4
}
```

### Example

```pgsl
struct ComputeInput {
    globalId: GlobalInvocationId,
    localId: LocalInvocationId,
    workgroupId: WorkgroupId
}

[GroupBinding("compute", "data")]
[AccessMode(AccessMode.ReadWrite)]
storage data: Array<float>;

workgroup sharedData: Array<float, 64>;

[Compute(64, 64, 64)]
function compute_main(input: ComputeInput): void {
    const index: uint = input.globalId.x;
    data[index] = data[index] * 2.0;

    workgroupBarrier();
}
```

## Entry Point Information in `PgslParserResult`

After transpilation, entry point information is available in `result.entryPoints`:

### Vertex Entry Point

```typescript
const vertexEntry = result.entryPoints[0]; // PgslParserResultVertexEntryPoint
vertexEntry.stage;  // 'vertex'
vertexEntry.name;   // 'vertex_main'
vertexEntry.input;  // struct type with properties and locations
vertexEntry.output; // struct type with properties and locations
```

### Fragment Entry Point

```typescript
const fragmentEntry = result.entryPoints[1]; // PgslParserResultFragmentEntryPoint
fragmentEntry.stage;  // 'fragment'
fragmentEntry.name;   // 'fragment_main'
fragmentEntry.input;  // struct type with properties and locations
fragmentEntry.output; // struct type with properties and locations
```

### Compute Entry Point

```typescript
const computeEntry = result.entryPoints[0]; // PgslParserResultComputeEntryPoint
computeEntry.stage;         // 'compute'
computeEntry.name;          // 'compute_main'
computeEntry.workgroupSize; // { x: 64, y: 1, z: 1 }
```

## Location Index Assignment

Location string names on struct properties are converted to numeric `@location(N)` indices using the same sequential assignment mechanism as bindings. Within a single struct, each unique location name gets the next available index:

```pgsl
struct VertexIn {
    [Location("position")]    // @location(0)
    position: Vector4<float>,

    [Location("uv")]          // @location(1)
    uv: Vector2<float>,

    [Location("normal")]      // @location(2)
    normal: Vector4<float>
}
```

The numeric index is determined by the order of declaration within the struct.
