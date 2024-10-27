// ------------------------- Object Values ---------------------- //
@group(0) @binding(0) var<uniform> transformationMatrix: mat4x4<f32>;
struct Particle {
    position: vec3<f32>,
    velocity: vec3<f32>,
    lifetime: f32
}
@group(0) @binding(1) var<storage, read> particles: array<Particle>;
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
    position: vec3<f32>
}
@group(1) @binding(0) var<uniform> camera: Camera;

struct TimeData {
    timestamp: f32,
    delta: f32
}
@group(1) @binding(1) var<uniform> time: TimeData;

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


// ------------------------- User Inputs ------------------------ //
@group(2) @binding(0) var textureSampler: sampler;
@group(2) @binding(1) var texture: texture_2d<f32>;
// -------------------------------------------------------------- //

struct VertexOut {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
    @location(1) fragmentPosition: vec4<f32>,
    @location(2) alpha: f32
}

struct VertexIn {
    @builtin(instance_index) instanceId : u32,
    @location(0) position: vec4<f32>,
    @location(1) uv: vec2<f32>
}

@vertex
fn vertex_main(vertex: VertexIn) -> VertexOut {
    var particle: Particle = particles[vertex.instanceId];

    let positionMatrix: mat4x4<f32> = mat4x4<f32>(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        particle.position.x, particle.position.y, particle.position.z, 1,
    );

    var out: VertexOut;
    out.position = camera.viewProjection * positionMatrix * transformationMatrix * vertex.position ;
    out.uv = vertex.uv;
    out.fragmentPosition = transformationMatrix * positionMatrix * vertex.position;
    out.alpha = min(clamp(particle.lifetime, 0, 1), clamp(10 - particle.lifetime, 0, 1));

    return out;
}

struct FragmentIn {
    @location(0) uv: vec2<f32>,
    @location(1) fragmentPosition: vec4<f32>,
    @location(2) alpha: f32
}

@fragment
fn fragment_main(fragment: FragmentIn) -> @location(0) vec4<f32> {
    var color = textureSample(texture, textureSampler, fragment.uv);
    color.a *= fragment.alpha;

    return color;
}