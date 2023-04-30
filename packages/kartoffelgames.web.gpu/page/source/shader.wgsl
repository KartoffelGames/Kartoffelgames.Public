@group(0) @binding(0) var<uniform> transformationMatrix: mat4x4<f32>;

@group(1) @binding(0) var<uniform> color: vec4<f32>;
@group(1) @binding(1) var<uniform> viewProjectionMatrix: mat4x4<f32>;

@group(2) @binding(0) var cubetextureSampler: sampler;
@group(2) @binding(1) var cubeTexture: texture_2d<f32>;


struct VertexOut {
    @builtin(position) position: vec4<f32>,
    @location(0) color: vec4<f32>,
    @location(1) uv: vec2<f32>
}

struct VertexIn {
    @location(0) position: vec4<f32>,
    @location(1) color: vec4<f32>,
    @location(2) uv: vec2<f32>
}

@vertex
fn vertex_main(vertex: VertexIn) -> VertexOut {
    var out: VertexOut;
    out.position = viewProjectionMatrix * transformationMatrix * vertex.position;
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