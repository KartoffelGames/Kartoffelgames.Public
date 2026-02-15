// ------------------------- Object Values ---------------------- //
// Transformation data buffer from TransformationSystem.
// Layout: blocks of 80 floats. Each block contains 4 parent indices followed by 4 transformation matrices (4x4).
// For component index i: block = floor(i / 4), sub = i % 4.
// Parent at: block * 80 + sub. Matrix at: block * 80 + 4 + sub * 16.
@group(0) @binding(0) var<storage, read> transformationData: array<f32>;

// Array of component indices into the transformation data buffer. One per instance.
@group(0) @binding(1) var<storage, read> componentIndices: array<u32>;
// -------------------------------------------------------------- //


// ------------------------- Camera ------------------------------ //
@group(1) @binding(0) var<uniform> viewProjection: mat4x4<f32>;
// -------------------------------------------------------------- //


// ------------------- Hardcoded Constants ----------------------- //
const BLOCK_SIZE: u32 = 80u;
const OBJECT_COLOR: vec4<f32> = vec4<f32>(0.8, 0.25, 0.15, 1.0);

const LIGHT_POSITION: vec3<f32> = vec3<f32>(5.0, 10.0, -5.0);
const LIGHT_COLOR: vec3<f32> = vec3<f32>(1.0, 1.0, 1.0);
const AMBIENT_COLOR: vec3<f32> = vec3<f32>(0.15, 0.15, 0.15);
// -------------------------------------------------------------- //


/**
 * Read a 4x4 transformation matrix from the flat transformation data buffer by component index.
 */
fn readTransformationMatrix(pComponentIndex: u32) -> mat4x4<f32> {
    // Calculate block and sub-index within the block.
    let lBlock: u32 = pComponentIndex / 4u;
    let lSub: u32 = pComponentIndex % 4u;

    // Calculate float offset of the matrix: block * 80 + 4 (skip parent indices) + sub * 16.
    let lOffset: u32 = lBlock * BLOCK_SIZE + 4u + lSub * 16u;

    // Read column-major 4x4 matrix.
    return mat4x4<f32>(
        vec4<f32>(transformationData[lOffset + 0u], transformationData[lOffset + 1u], transformationData[lOffset + 2u], transformationData[lOffset + 3u]),
        vec4<f32>(transformationData[lOffset + 4u], transformationData[lOffset + 5u], transformationData[lOffset + 6u], transformationData[lOffset + 7u]),
        vec4<f32>(transformationData[lOffset + 8u], transformationData[lOffset + 9u], transformationData[lOffset + 10u], transformationData[lOffset + 11u]),
        vec4<f32>(transformationData[lOffset + 12u], transformationData[lOffset + 13u], transformationData[lOffset + 14u], transformationData[lOffset + 15u])
    );
}


struct VertexOut {
    @builtin(position) position: vec4<f32>,
    @location(0) normal: vec4<f32>,
    @location(1) fragmentPosition: vec4<f32>,
}

struct VertexIn {
    @builtin(instance_index) instanceId: u32,
    @location(0) position: vec4<f32>,
    @location(1) normal: vec4<f32>,
}

@vertex
fn vertex_main(pVertex: VertexIn) -> VertexOut {
    // Look up the component index for this instance from the index array.
    let lComponentIndex: u32 = componentIndices[pVertex.instanceId];

    // Read the transformation matrix from the shared buffer.
    let lTransformationMatrix: mat4x4<f32> = readTransformationMatrix(lComponentIndex);

    // Calculate world position.
    let lWorldPosition: vec4<f32> = lTransformationMatrix * pVertex.position;

    var lOut: VertexOut;
    lOut.position = viewProjection * lWorldPosition;
    lOut.normal = normalize(lTransformationMatrix * vec4<f32>(pVertex.normal.xyz, 0.0));
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
