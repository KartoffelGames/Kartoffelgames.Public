// ------------------------- Object Values ---------------------- //
@group(0) @binding(0) var cubeTextureSampler: sampler;
@group(0) @binding(1) var cubeMap: texture_cube<f32>;
// -------------------------------------------------------------- //


// ------------------------- World Values ---------------------- //
struct CameraTransformation {
    rotation: mat4x4<f32>,
    translation: mat4x4<f32>
}
struct Camera {
    viewProjection: mat4x4<f32>,
    view: mat4x4<f32>,
    projection: mat4x4<f32>,
    translation: CameraTransformation,
    invertedTranslation: CameraTransformation,
}
@group(1) @binding(0) var<uniform> camera: Camera;


@group(1) @binding(1) var<uniform> timestamp: f32;

struct AmbientLight {
    color: vec4<f32>
}
@group(1) @binding(2) var<uniform> ambientLight: AmbientLight;

struct PointLight {
    position: vec4<f32>,
    color: vec4<f32>,
    range: f32
}
@group(1) @binding(3) var<storage, read> pointLights: array<PointLight>;

@group(1) @binding(4) var<storage, read_write> debugValue: f32;
// -------------------------------------------------------------- //

struct VertexOut {
    @builtin(position) position: vec4<f32>,
    @location(1) fragmentPosition: vec4<f32>,
}

struct VertexIn {
    @location(0) position: vec4<f32>,
}

@vertex
fn vertex_main(vertex: VertexIn) -> VertexOut {
    var out: VertexOut;
    out.position = camera.projection * camera.invertedTranslation.rotation  * vertex.position;
    out.fragmentPosition = 0.5 * (vertex.position + vec4(1.0, 1.0, 1.0, 1.0));

    return out;
}

struct FragmentIn {
    @location(1) fragmentPosition: vec4<f32>,
}

@fragment
fn fragment_main(fragment: FragmentIn) -> @location(0) vec4<f32> {
    // Our camera and the skybox cube are both centered at (0, 0, 0)
  // so we can use the cube geometry position to get viewing vector to sample
  // the cube texture. The magnitude of the vector doesn't matter.
  var cubemapVec = fragment.fragmentPosition.xyz - vec3(0.5);
  // When viewed from the inside, cubemaps are left-handed (z away from viewer),
  // but common camera matrix convention results in a right-handed world space
  // (z toward viewer), so we have to flip it.
  //cubemapVec.z *= -1;
  return textureSample(cubeMap, cubeTextureSampler, cubemapVec);
}