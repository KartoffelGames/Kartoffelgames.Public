# Binding Mechanism

PGSL uses string-based group and binding names in the `[GroupBinding]` attribute. These strings are converted into numeric `@group(N)` and `@binding(N)` indices during transpilation.

## Overview

In WGSL, resource bindings require numeric group and binding indices:

```wgsl
@group(0) @binding(0) var<uniform> transformationMatrix: mat4x4<f32>;
@group(0) @binding(1) var<storage,read> instancePositions: array<vec4<f32>>;
@group(1) @binding(0) var<uniform> viewProjectionMatrix: mat4x4<f32>;
```

In PGSL, these are replaced with descriptive string names:

```pgsl
[GroupBinding("object", "transformation_matrix")]
uniform transformationMatrix: Matrix44<float>;

[GroupBinding("object", "instance_positions")]
[AccessMode(AccessMode.Read)]
storage instancePositions: Array<Vector4<float>>;

[GroupBinding("world", "view_projection_matrix")]
uniform viewProjectionMatrix: Matrix44<float>;
```

## Index Assignment Rules

Numeric indices are assigned based on the **order of declaration** in the source code.

### Group Indices

Each unique group name is assigned a sequential index starting from 0, in the order it first appears:

| Declaration Order | Group Name | Group Index |
|-------------------|-----------|-------------|
| 1st occurrence    | `"object"` | `0`         |
| 2nd occurrence (new name) | `"world"` | `1` |
| 3rd occurrence (new name) | `"user"` | `2`  |

### Binding Indices

Within each group, each unique binding name is assigned a sequential index starting from 0, in the order it appears:

| Declaration Order | Group | Binding Name | Group Index | Binding Index |
|-------------------|-------|-------------|-------------|---------------|
| 1st | `"object"` | `"transformation_matrix"` | `0` | `0` |
| 2nd | `"object"` | `"instance_positions"` | `0` | `1` |
| 3rd | `"world"` | `"view_projection_matrix"` | `1` | `0` |
| 4th | `"user"` | `"cube_texture_sampler"` | `2` | `0` |
| 5th | `"user"` | `"cube_texture"` | `2` | `1` |

## Full Example

Given this PGSL source:

```pgsl
[GroupBinding("object", "transformation_matrix")]
uniform transformationMatrix: Matrix44<float>;

[GroupBinding("object", "instance_positions")]
[AccessMode(AccessMode.Read)]
storage instancePositions: Array<Vector4<float>>;

[GroupBinding("world", "view_projection_matrix")]
uniform viewProjectionMatrix: Matrix44<float>;

[GroupBinding("user", "cube_texture_sampler")]
uniform cubeTextureSampler: Sampler;

[GroupBinding("user", "cube_texture")]
uniform cubeTexture: Texture2d<float>;

[GroupBinding("world", "ambient_light")]
uniform ambientLight: AmbientLight;

[GroupBinding("world", "point_lights")]
[AccessMode(AccessMode.Read)]
storage pointLights: Array<PointLight>;
```

The transpiled WGSL output will be:

```wgsl
@group(0) @binding(0) var<uniform> transformationMatrix: mat4x4<f32>;
@group(0) @binding(1) var<storage,read> instancePositions: array<vec4<f32>>;
@group(1) @binding(0) var<uniform> viewProjectionMatrix: mat4x4<f32>;
@group(2) @binding(0) var cubeTextureSampler: sampler;
@group(2) @binding(1) var cubeTexture: texture_2d<f32>;
@group(1) @binding(1) var<uniform> ambientLight: AmbientLight;
@group(1) @binding(2) var<storage,read> pointLights: array<PointLight>;
```

Note that `ambient_light` gets group `1` (the `"world"` group, which was first introduced by `view_projection_matrix`) and binding `1` (the next unused binding in group `1`).

## Order Matters

Because indices are assigned based on declaration order, rearranging binding declarations will change the resulting numeric indices. This means:

- Adding a new binding before existing ones shifts subsequent indices.
- Moving a binding to a different position changes its index.
- The order in imported files is preserved (imports are inlined at their `#IMPORT` location).

This design allows the consuming application to know all binding layouts by reading the `PgslParserResult.bindings` array, which provides both the string names and numeric indices.

## Accessing Binding Information

The `PgslParserResult.bindings` array contains all binding information after transpilation:

```typescript
const result = parser.transpile(pgslSource, new WgslTranspiler());

for (const binding of result.bindings) {
    console.log(`Group: ${binding.group} (${binding.groupName})`);
    console.log(`Binding: ${binding.binding} (${binding.bindingName})`);
    console.log(`Type: ${binding.type.type}`);
}
```

Each `PgslParserResultBinding` provides:

| Property | Type | Description |
|----------|------|-------------|
| `group` | `number` | Numeric group index. |
| `binding` | `number` | Numeric binding index. |
| `groupName` | `string` | Original group string name. |
| `bindingName` | `string` | Original binding string name. |
| `type` | `PgslParserResultType` | Type information including alignment and size for buffer layout calculation. |

The type object can be inspected to determine the memory layout of the bound resource. The `type.alignmentType` indicates whether the binding uses `"uniform"` or `"storage"` alignment rules, which affects padding and stride calculations.
