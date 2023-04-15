@group(0) @binding(0) var<uniform> color: vec4<f32>;
@group(0) @binding(1) var<uniform> transformationMatrix: mat4x4<f32>;
@group(0) @binding(2) var<uniform> viewProjectionMatrix: mat4x4<f32>;

struct VertexOut {
    @builtin(position) position: vec4<f32>,
    @location(0) color: vec4<f32>
}

struct VertexIn {
    @location(0) position: vec4<f32>,
    @location(1) color: vec4<f32>
}

@vertex
fn vertex_main(vertex: VertexIn) -> VertexOut {
    var out: VertexOut;
    out.position = viewProjectionMatrix * transformationMatrix * vertex.position;
    out.color = vertex.color;

    return out;
}

@fragment
fn fragment_main(@location(0) vertexcolor: vec4<f32>) -> @location(0) vec4<f32> {
  return color * vertexcolor;
}