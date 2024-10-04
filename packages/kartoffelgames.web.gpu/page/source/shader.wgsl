// ------------------------- Object Values ---------------------- //
@group(0) @binding(0) var<uniform> transformationMatrix: mat4x4<f32>;
@group(0) @binding(1) var<storage, read> instancePositions: array<vec4<f32>>;
// -------------------------------------------------------------- //


// ------------------------- World Values ---------------------- //
@group(1) @binding(0) var<uniform> viewProjectionMatrix: mat4x4<f32>;
@group(1) @binding(1) var<uniform> timestamp: u32;

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
@group(2) @binding(0) var cubeTextureSampler: sampler;
@group(2) @binding(1) var cubeTexture: texture_2d<f32>;
// -------------------------------------------------------------- //


// --------------------- Light calculations --------------------- //

/**
 * Calculate point light output.
 */
fn calculatePointLights(fragmentPosition: vec4<f32>, normal: vec4<f32>) -> vec4<f32> {
    // Count of point lights.
    let pointLightCount: u32 = arrayLength(&pointLights);

    var lightResult: vec4<f32> = vec4<f32>(0, 0, 0, 1);

    for (var index: u32 = 0; index < pointLightCount; index++) {
        var pointLight: PointLight = pointLights[index];

        // Calculate light strength based on angle of incidence.
        let lightDirection: vec4<f32> = normalize(pointLight.position - fragmentPosition);
        let diffuse: f32 = max(dot(normal, lightDirection), 0.0);

        lightResult += pointLight.color * diffuse;
    }

    return lightResult;
}

/**
 * Apply lights to fragment color.
 */
fn applyLight(colorIn: vec4<f32>, fragmentPosition: vec4<f32>, normal: vec4<f32>) -> vec4<f32> {
    var lightColor: vec4<f32> = vec4<f32>(0, 0, 0, 1);

    lightColor += ambientLight.color;
    lightColor += calculatePointLights(fragmentPosition, normal);

    return lightColor * colorIn;
}
// -------------------------------------------------------------- //

fn hash(x: u32) -> u32
{
    var result: u32 = x;
    result ^= result >> 16;
    result *= 0x7feb352du;
    result ^= result >> 15;
    result *= 0x846ca68bu;
    result ^= result >> 16;
    return result;
}

struct VertexOut {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
    @location(1) normal: vec4<f32>,
    @location(2) fragmentPosition: vec4<f32>
}

struct VertexIn {
    @builtin(instance_index) instanceId : u32,
    @location(0) position: vec4<f32>,
    @location(1) uv: vec2<f32>,
    @location(2) normal: vec4<f32>
}

override animationSeconds: f32 = 3; 

@vertex
fn vertex_main(vertex: VertexIn) -> VertexOut {
    var instancePosition: vec4<f32> = instancePositions[vertex.instanceId] + vertex.position;

    // Generate 4 random numbers.
    var hash1: u32 = hash(vertex.instanceId + 1);
    var hash2: u32 = hash(hash1);
    var hash3: u32 = hash(hash2);
    var hash4: u32 = hash(hash3);

    // Convert into normals.
    var hashStartDisplacement: f32 = (f32(hash1) - pow(2, 31)) * 2 / pow(2, 32);
    var randomNormalPosition: vec3<f32> = vec3<f32>(
        (f32(hash2) - pow(2, 31)) * 2 / pow(2, 32),
        (f32(hash3) - pow(2, 31)) * 2 / pow(2, 32),
        (f32(hash4) - pow(2, 31)) * 2 / pow(2, 32)
    );

    // Calculate random position and animate a 100m spread. 
    var randPosition: vec4<f32> = instancePosition; // Current start.
    randPosition += vec4<f32>(randomNormalPosition, 1) * 1000; // Randomise start spreading 1000m in all directsions.
    randPosition += vec4<f32>(randomNormalPosition, 1) * sin((f32(timestamp) / (1000 * f32(animationSeconds))) + (hashStartDisplacement * 100)) * 100;
    randPosition[3] = 1; // Reset w coord.

    var transformedInstancePosition: vec4<f32> = transformationMatrix * randPosition;

    var out: VertexOut;
    out.position = viewProjectionMatrix * transformedInstancePosition;
    out.uv = vertex.uv;
    out.normal = vertex.normal;
    out.fragmentPosition = transformedInstancePosition;

    return out;
}

struct FragmentIn {
    @location(0) uv: vec2<f32>,
    @location(1) normal: vec4<f32>,
    @location(2) fragmentPosition: vec4<f32>
}

@fragment
fn fragment_main(fragment: FragmentIn) -> @location(0) vec4<f32> {
    return applyLight(textureSample(cubeTexture, cubeTextureSampler, fragment.uv), fragment.fragmentPosition, fragment.normal);
}