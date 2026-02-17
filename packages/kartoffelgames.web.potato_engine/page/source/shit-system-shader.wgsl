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
const MAX_PARENT_DEPTH: u32 = 32u;
const OBJECT_COLOR: vec4<f32> = vec4<f32>(0.8, 0.25, 0.15, 1.0);

const LIGHT_POSITION: vec3<f32> = vec3<f32>(5.0, 10.0, -5.0);
const LIGHT_COLOR: vec3<f32> = vec3<f32>(1.0, 1.0, 1.0);
const AMBIENT_COLOR: vec3<f32> = vec3<f32>(0.15, 0.15, 0.15);
// -------------------------------------------------------------- //


/**
 * Read the parent index of a component from the transformation data buffer.
 * Returns -1 when the component has no parent (root component).
 */
fn readParentIndex(pComponentIndex: u32) -> i32 {
    // Calculate block and sub-index within the block.
    let lBlock: u32 = pComponentIndex / 4u;
    let lSub: u32 = pComponentIndex % 4u;

    // Parent index is at the start of the block at sub offset.
    let lOffset: u32 = lBlock * BLOCK_SIZE + lSub;

    // Parent indices are stored as integers in the float buffer.
    return i32(transformationData[lOffset]);
}

/**
 * Read a local 4x4 transformation matrix from the flat transformation data buffer by component index.
 */
fn readLocalMatrix(pComponentIndex: u32) -> mat4x4<f32> {
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

/**
 * Compute the world transformation matrix for a component by walking up the parent chain.
 * Multiplies each ancestor's local matrix onto the result until a root component (parent index -1) is reached.
 */
fn readWorldMatrix(pComponentIndex: u32) -> mat4x4<f32> {
    // Start with the component's own local matrix.
    var lResult: mat4x4<f32> = readLocalMatrix(pComponentIndex);

    // Walk up the parent chain.
    var lParentIndex: i32 = readParentIndex(pComponentIndex);
    while (lParentIndex >= 0) {
        // Multiply parent matrix on the left: parent * child.
        let lParentMatrix: mat4x4<f32> = readLocalMatrix(u32(lParentIndex));
        lResult = lParentMatrix * lResult;

        // Move to the parent's parent.
        lParentIndex = readParentIndex(u32(lParentIndex));
    }

    return lResult;
}


struct VertexOut {
    @builtin(position) position: vec4<f32>,
    @location(0) normal: vec4<f32>,
    @location(1) fragmentPosition: vec4<f32>,
}

struct VertexIn {
    @builtin(instance_index) instanceId: u32,
    @location(0) position: vec3<f32>,
    @location(1) normal: vec3<f32>,
}

@vertex
fn vertex_main(pVertex: VertexIn) -> VertexOut {
    // Look up the component index for this instance from the index array.
    let lComponentIndex: u32 = componentIndices[pVertex.instanceId];

    // Compute the world matrix by walking the parent chain.
    let lWorldMatrix: mat4x4<f32> = readWorldMatrix(lComponentIndex);

    // Calculate world position.
    let lWorldPosition: vec4<f32> = lWorldMatrix * vec4<f32>(pVertex.position, 1.0);

    var lOut: VertexOut;
    lOut.position = viewProjection * lWorldPosition;
    lOut.normal = normalize(lWorldMatrix * vec4<f32>(pVertex.normal, 0.0));
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
