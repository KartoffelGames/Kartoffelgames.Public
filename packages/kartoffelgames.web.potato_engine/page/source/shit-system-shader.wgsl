// ------------------------- Object Values ---------------------- //
@group(0) @binding(0) var<uniform> transformationMatrix: mat4x4<f32>;
// -------------------------------------------------------------- //


// ------------------------- Camera ------------------------------ //
@group(1) @binding(0) var<uniform> viewProjection: mat4x4<f32>;
// -------------------------------------------------------------- //


// ------------------- Hardcoded Constants ----------------------- //
const OBJECT_COLOR: vec4<f32> = vec4<f32>(0.8, 0.25, 0.15, 1.0);

const LIGHT_POSITION: vec3<f32> = vec3<f32>(5.0, 10.0, -5.0);
const LIGHT_COLOR: vec3<f32> = vec3<f32>(1.0, 1.0, 1.0);
const AMBIENT_COLOR: vec3<f32> = vec3<f32>(0.15, 0.15, 0.15);
// -------------------------------------------------------------- //


struct VertexOut {
    @builtin(position) position: vec4<f32>,
    @location(0) normal: vec4<f32>,
    @location(1) fragmentPosition: vec4<f32>,
}

struct VertexIn {
    @location(0) position: vec4<f32>,
    @location(1) normal: vec4<f32>,
}

@vertex
fn vertex_main(pVertex: VertexIn) -> VertexOut {
    // Calculate world position.
    let lWorldPosition: vec4<f32> = transformationMatrix * pVertex.position;

    var lOut: VertexOut;
    lOut.position = viewProjection * lWorldPosition;
    lOut.normal = normalize(transformationMatrix * vec4<f32>(pVertex.normal.xyz, 0.0));
    lOut.fragmentPosition = lWorldPosition;

    return lOut;
}

struct FragmentIn {
    @location(0) normal: vec4<f32>,
    @location(1) fragmentPosition: vec4<f32>,
}

@fragment
fn fragment_main(pFragment: FragmentIn) -> @location(0) vec4<f32> {
    // Calculate diffuse lighting from hardcoded point light.
    let lLightDirection: vec3<f32> = normalize(LIGHT_POSITION - pFragment.fragmentPosition.xyz);
    let lDiffuse: f32 = max(dot(pFragment.normal.xyz, lLightDirection), 0.0);

    // Combine ambient and diffuse.
    let lLightColor: vec3<f32> = AMBIENT_COLOR + LIGHT_COLOR * lDiffuse;

    // Apply light to object color.
    let lFinalColor: vec3<f32> = lLightColor * OBJECT_COLOR.xyz;

    return vec4<f32>(lFinalColor, OBJECT_COLOR.w);
}
