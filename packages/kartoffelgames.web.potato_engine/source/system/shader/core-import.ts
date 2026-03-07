/**
 * Core PGSL import defining shared types and World bindings.
 *
 * Provides:
 * - PBR output struct for fragment shader results
 * - Vertex/Fragment communication structs for user shader functions
 * - Light struct matching CPU-side buffer layout
 * - World bindings: camera, lights
 */
export const CORE_IMPORT: string = `
// ===== PBR Output Struct =====
struct PbrOutput {
    albedo: Vector4<float>,
    normal: Vector3<float>,
    metallic: float,
    roughness: float,
    occlusion: float,
    emission: Vector3<float>,
    alphaThreshold: float
}

// ===== User Vertex Input (local-space attributes) =====
struct VertexInput {
    position: Vector3<float>,
    normal: Vector3<float>,
    color: Vector4<float>,
    uv: Vector2<float>,
    uv2: Vector2<float>,
    uv3: Vector2<float>,
    uv4: Vector2<float>
}

// ===== User Vertex Output (modified local-space) =====
struct VertexOutput {
    position: Vector3<float>,
    normal: Vector3<float>,
    color: Vector4<float>,
    uv: Vector2<float>,
    uv2: Vector2<float>,
    uv3: Vector2<float>,
    uv4: Vector2<float>
}

// ===== User Fragment Input (interpolated values) =====
struct FragmentInput {
    normal: Vector3<float>,
    color: Vector4<float>,
    uv: Vector2<float>,
    uv2: Vector2<float>,
    uv3: Vector2<float>,
    uv4: Vector2<float>
}

// ===== Light Struct (matches CPU-side buffer layout, 64 bytes per light, 16-byte aligned) =====
struct Light {
    positionRange: Vector4<float>,
    colorIntensity: Vector4<float>,
    rotationDropOff: Vector4<float>,
    lightType: int,
    packedAngles: uint,
    packedSize: uint,
    reserved: uint
}

// ===== World Bindings (shared across all objects for same camera) =====
[GroupBinding("World", "viewProjection")]
uniform viewProjection: Matrix44<float>;

[GroupBinding("World", "lightData")]
[AccessMode(AccessMode.Read)]
storage lightData: Array<Light>;

[GroupBinding("World", "lightCount")]
uniform lightCount: uint;

[GroupBinding("World", "lightIndexList")]
[AccessMode(AccessMode.Read)]
storage lightIndexList: Array<uint>;
`;
