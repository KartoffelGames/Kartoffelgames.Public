// ------------------------- Object Values ---------------------- //
@group(0) @binding(0) var<uniform> transformationMatrix: mat4x4<f32>;
@group(0) @binding(1) var<storage, read> instancePositions: array<vec4<f32>>;
// -------------------------------------------------------------- //


// ------------------------- World Values ---------------------- //
@group(1) @binding(0) var<uniform> viewProjectionMatrix: mat4x4<f32>;

struct AmbientLight {
    color: vec4<f32>
}
@group(1) @binding(1) var<uniform> ambientLight: AmbientLight;

struct PointLight {
    position: vec4<f32>,
    color: vec4<f32>,
    range: f32
}
@group(1) @binding(2) var<storage, read> pointLights: array<PointLight>;
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

@vertex
fn vertex_main(vertex: VertexIn) -> VertexOut {
    var instancePosition: vec4<f32> = instancePositions[vertex.instanceId];
    var instancePositionMatrix: mat4x4<f32> = mat4x4<f32>(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, instancePosition.x * 5, instancePosition.y * 5, instancePosition.z * 5, 1);

    var out: VertexOut;
    out.position = viewProjectionMatrix * transformationMatrix * instancePositionMatrix * vertex.position;
    out.uv = vertex.uv;
    out.normal = vertex.normal;
    out.fragmentPosition = transformationMatrix * instancePositionMatrix * vertex.position;

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