// ------------------------- Object Values ---------------------- //
struct Particle {
    position: vec3<f32>,
    velocity: vec3<f32>,
    lifetime: f32
}
@group(0) @binding(0) var<storage, read_write> particles: array<Particle>;
@group(0) @binding(1) var<storage, read_write> indirect: vec4<u32>;
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

/**
 * PCG-Hash
 */
fn hash(input: u32) -> u32
{
    let state: u32 = input * 747796405u + 2891336453u;
    let word: u32 = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
    return (word >> 22u) ^ word;
}

override animationSeconds: f32 = 3; 

struct ComputeParams {
    @builtin(global_invocation_id) globalInvocationId : vec3u
}
@compute @workgroup_size(64)
fn compute_main(params: ComputeParams) {
    const MAX_DISTANCE: f32 = 5; //
    const MAX_LIFETIME: f32 = 10; //

    let id = params.globalInvocationId.x;
    if(id >= arrayLength(&particles)) {
        return;
    }

    var particle: Particle = particles[id];

    indirect[1] = 300;

    // Update time
    particle.lifetime -= time.delta;

    let cameraDistance: f32 = distance(particle.position, camera.position);
    if(particle.lifetime < 0 || cameraDistance > MAX_DISTANCE) {
        var hash1: u32 = hash(id * 10000  + u32(time.timestamp * 1000));
        var hash2: u32 = hash(hash1);
        var hash3: u32 = hash(hash2);
        var hash4: u32 = hash(hash3);

        let radi: f32 = (f32(hash1) - pow(2, 31)) * 2 / pow(2, 32);
        let posX: f32 = (f32(hash2) - pow(2, 31)) * 2 / pow(2, 32);
        let posY: f32 = (f32(hash3) - pow(2, 31)) * 2 / pow(2, 32);
        let posZ: f32 = (f32(hash4) - pow(2, 31)) * 2 / pow(2, 32);

        // Random normalized vector.
        var randomPosition: vec3<f32> =vec3<f32>(posX, posY, posZ);
        randomPosition = normalize(randomPosition);

        // Scale ball by 10m
        randomPosition *= radi * MAX_DISTANCE;

        particle.position = randomPosition + camera.position;
        particle.lifetime = MAX_LIFETIME;
        particle.velocity = vec3<f32>(0.1, -0.2, 0);
    }

    // Move by velocity.
    particle.position += particle.velocity * time.delta ;

    _ = animationSeconds;

    particles[id] = particle;
}