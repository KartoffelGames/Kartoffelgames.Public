// ------------------------- Object Values ---------------------- //
@group(0) @binding(0) var<uniform> transformationMatrix: mat4x4<f32>;
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


// ------------------------- User Inputs ------------------------ //
@group(2) @binding(0) var videoTextureSampler: sampler;
@group(2) @binding(1) var videoTexture: texture_2d<f32>;
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
    @location(2) fragmentPosition: vec4<f32>,
}

struct VertexIn {
    @builtin(instance_index) instanceId : u32,
    @location(0) position: vec4<f32>,
    @location(1) uv: vec2<f32>,
    @location(2) normal: vec4<f32>
}

@vertex
fn vertex_main(vertex: VertexIn) -> VertexOut {
    let translation: mat4x4<f32> = mat4x4(
        vec4<f32>(1, 0, 0, 0),
        vec4<f32>(0, 1, 0, 0),
        vec4<f32>(0, 0, 1, 0),
        transformationMatrix[3]
    );

    let scaling: mat4x4<f32> = mat4x4(
        vec4<f32>(length(transformationMatrix[0].xyz), 0, 0, 0),
        vec4<f32>(0, length(transformationMatrix[1].xyz), 0, 0),
        vec4<f32>(0, 0, length(transformationMatrix[2].xyz), 0),
        vec4<f32>(0, 0, 0, 1),
    );

    var transformedPosition: vec4<f32> = translation * camera.translation.rotation * scaling  * vertex.position;

    var out: VertexOut;
    out.position = camera.viewProjection * transformedPosition;
    out.uv = vertex.uv;
    out.normal = vertex.normal;
    out.fragmentPosition = transformedPosition;

    return out;
}

struct FragmentIn {
    @location(0) uv: vec2<f32>,
    @location(1) normal: vec4<f32>,
    @location(2) fragmentPosition: vec4<f32>,
}

@fragment
fn fragment_main(fragment: FragmentIn) -> @location(0) vec4<f32> {
    let videoColor: vec4<f32> = textureSample(videoTexture, videoTextureSampler, fragment.uv);

    if(videoColor.g > 0.83 && videoColor.g < 0.85 && videoColor.r < 0.30) {
        discard;
    }

    return applyLight(videoColor, fragment.fragmentPosition, fragment.normal);
}