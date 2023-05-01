// ------------------------- Object Values ---------------------- //
@group(0) @binding(0) var<uniform> transformationMatrix: mat4x4<f32>;
@group(0) @binding(1) var<storage, read> instancePositions: array<vec4<f32>>;
// -------------------------------------------------------------- //


// ------------------------- World Values ---------------------- //
@group(1) @binding(0) var<uniform> viewProjectionMatrix: mat4x4<f32>;
// -------------------------------------------------------------- //


// ------------------------- User Inputs ------------------------ //
@group(2) @binding(0) var cubetextureSampler: sampler;
@group(2) @binding(1) var cubeTexture: texture_2d<f32>;
@group(2) @binding(2) var<uniform> color: vec4<f32>;
// -------------------------------------------------------------- //


// --------------------- Light calculations --------------------- //
//struct AmbientLight {
//    color: vec3<f32>
//}
//@group(1) @binding(1) var<uniform> ambientLight: AmbientLight;

// struct DirectionalLight {
//     position: vec4<f32>,
//     color: vec3<f32>,
//     range: f32
// }
// @group(1) @binding(2) var<storage, read_write> directionalLights: array<DirectionalLight>;

/**
 * Apply lights to fragment color.
 */
//fn applyLight(colorIn: vec4<f32>) -> vec4<f32> {
//    return colorIn * vec4<f32>(ambientLight.color, 1.0);
//}
// -------------------------------------------------------------- //

struct VertexOut {
    @builtin(position) position: vec4<f32>,
    @location(0) color: vec4<f32>,
    @location(1) uv: vec2<f32>
}

struct VertexIn {
    @builtin(instance_index) instanceId : u32,
    @location(0) position: vec4<f32>,
    @location(1) color: vec4<f32>,
    @location(2) uv: vec2<f32>
}

@vertex
fn vertex_main(vertex: VertexIn) -> VertexOut {
    var instancePosition: vec4<f32> = instancePositions[vertex.instanceId];
    var instancePositionMatrix: mat4x4<f32> = mat4x4<f32>(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, instancePosition.x * 5, instancePosition.y * 5, instancePosition.z * 5, 1);

    var out: VertexOut;
    out.position = viewProjectionMatrix * transformationMatrix * instancePositionMatrix * vertex.position;
    out.color = vertex.color;
    out.uv = vertex.uv;

    return out;
}

struct FragmentIn {
    @location(0) color: vec4<f32>,
    @location(1) uv: vec2<f32>
}

@fragment
fn fragment_main(fragment: FragmentIn) -> @location(0) vec4<f32> {
  return textureSample(cubeTexture, cubetextureSampler, fragment.uv) * color * fragment.color;
}