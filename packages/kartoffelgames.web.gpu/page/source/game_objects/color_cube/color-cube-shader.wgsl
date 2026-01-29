// ------------------------- Object Values ---------------------- //
@group(0) @binding(0) var<uniform> transformationMatrix: mat4x4<f32>;
@group(0) @binding(1) var<uniform> color: vec4<f32>;
// -------------------------------------------------------------- //


// ------------------------- World Values ---------------------- //
struct Camera {
    viewProjection: mat4x4<f32>,
    view: mat4x4<f32>,
    projection: mat4x4<f32>,
    rotation: mat4x4<f32>,
    translation: mat4x4<f32>,
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
    @location(0) color: vec4<f32>,
    @location(1) normal: vec4<f32>,
    @location(2) fragmentPosition: vec4<f32>,
}

struct VertexIn {
    @builtin(instance_index) instanceId : u32,
    @location(0) position: vec4<f32>,
    @location(1) normal: vec4<f32>
}

@vertex
fn vertex_main(vertex: VertexIn) -> VertexOut {
    var worldposition: vec4<f32> = transformationMatrix * vertex.position;

    var out: VertexOut;
    out.position = camera.viewProjection * worldposition;
    out.normal = vertex.normal;
    out.fragmentPosition = worldposition;
    out.color = color;

    return out;
}

struct FragmentIn {
    @location(0) color: vec4<f32>,
    @location(1) normal: vec4<f32>,
    @location(2) fragmentPosition: vec4<f32>,
}

@fragment
fn fragment_main(fragment: FragmentIn) -> @location(0) vec4<f32> {
    return applyLight(fragment.color, fragment.fragmentPosition, fragment.normal);
}