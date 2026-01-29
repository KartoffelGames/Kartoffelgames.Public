// ------------------------- Object Values ---------------------- //
@group(0) @binding(0) var<uniform> transformationMatrix: mat4x4<f32>;
struct Particle {
    position: vec3<f32>,
    rotation: vec3<f32>,
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
    const MAX_DISTANCE: f32 = 3;
    const MAX_LIFETIME: f32 = 9999;

    var particle: Particle = particles[vertex.instanceId];

    let positionMatrix: mat4x4<f32> = mat4x4<f32>(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        particle.position.x, particle.position.y, particle.position.z, 1,
    );

    let rotationMatrixX: mat4x4<f32> = mat4x4<f32>(
        1, 0, 0, 0,
        0, cos(particle.rotation.x), -sin(particle.rotation.x), 0,
        0, sin(particle.rotation.x), cos(particle.rotation.x), 0,
        0, 0, 0, 1
    );

    let rotationMatrixY: mat4x4<f32> = mat4x4<f32>(
        cos(particle.rotation.y), 0, sin(particle.rotation.y), 0,
        0, 1, 0, 0,
        -sin(particle.rotation.y), 0, cos(particle.rotation.y), 0,
        0, 0, 0, 1
    );

    let rotationMatrixZ: mat4x4<f32> = mat4x4<f32>(
        cos(particle.rotation.z), -sin(particle.rotation.z), 0, 0,
        sin(particle.rotation.z), cos(particle.rotation.z), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    );

    let rotationMatrix: mat4x4<f32> = rotationMatrixX * rotationMatrixY * rotationMatrixZ;

    let distanceScale: f32 = (MAX_DISTANCE - distance(particle.position, camera.position)) / MAX_DISTANCE;
    let scalingMatrix: mat4x4<f32> = mat4x4<f32>(
        distanceScale, 0, 0, 0,
        0, distanceScale, 0, 0,
        0, 0, distanceScale, 0,
        0, 0, 0, 1,
    );

    let worldPosition: vec4<f32> = positionMatrix * scalingMatrix * transformationMatrix * rotationMatrix * vertex.position;

    var out: VertexOut;
    out.position = camera.viewProjection * worldPosition;
    out.uv = vertex.uv;
    out.fragmentPosition = worldPosition;
    out.alpha = clamp(particle.lifetime, 0, 1);

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

    if(color.a == 0) {
        discard;
    }

    return color;
}