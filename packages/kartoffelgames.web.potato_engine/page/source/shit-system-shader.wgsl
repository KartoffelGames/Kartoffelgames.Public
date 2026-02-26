// ------------------- Light Struct -------------------------------- //
// Matches the CPU-side buffer layout from LightSystem (96 bytes per light, 16-byte aligned).
struct Light {
    position:        vec4<f32>,  // 0   - World position (x, y, z, w unused)
    color:           vec4<f32>,  // 16  - (r, g, b, a) where a = color.alpha * intensity
    lightType:       i32,        // 32  - 0 = point, 1 = directional, 2 = spot, 3 = area
    intensity:       f32,        // 36  - Raw intensity multiplier
    range:           f32,        // 40  - Max distance (not for directional)
    dropOff:         f32,        // 44  - Falloff curve exponent
    rotation:        vec4<f32>,  // 48  - Forward direction vector (directional, spot, area only)
    calculatedRange: f32,        // 64  - Effective range from inverse square law (not for directional)
    innerAngle:      f32,        // 68  - Inner cone angle in degrees (spot only)
    outerAngle:      f32,        // 72  - Outer cone angle in degrees (spot only)
    width:           f32,        // 76  - Area light width from transform scale (area only)
    height:          f32,        // 80  - Area light height from transform scale (area only)
    _reserved0:      f32,        // 84  - Reserved
    _reserved1:      f32,        // 88  - Reserved
    _reserved2:      f32,        // 92  - Reserved
};
// ----------------------------------------------------------------- //


// ------------------------- Object Values ------------------------- //
// Transformation data buffer from TransformationSystem.
@group(0) @binding(0) var<storage, read> transformationData: array<mat4x4<f32>>;

// Array of component indices into the transformation data buffer. One per instance.
@group(0) @binding(1) var<storage, read> componentIndices: array<u32>;
// ----------------------------------------------------------------- //


// ------------------------- Camera -------------------------------- //
@group(1) @binding(0) var<uniform> viewProjection: mat4x4<f32>;
// ----------------------------------------------------------------- //


// ------------------------- Lights -------------------------------- //
// Light data stored as a struct array from LightSystem.
@group(2) @binding(0) var<storage, read> lightData: array<Light>;

// Number of active lights in the lightData buffer.
@group(2) @binding(1) var<uniform> lightCount: u32;
// ----------------------------------------------------------------- //


// ------------------- Constants ----------------------------------- //
const OBJECT_COLOR: vec4<f32> = vec4<f32>(0.8, 0.8, 0.8, 1.0);
const AMBIENT_COLOR: vec3<f32> = vec3<f32>(0.15, 0.15, 0.15);
const PI: f32 = 3.14159265359;
// ----------------------------------------------------------------- //


// ------------------- Attenuation Helpers ------------------------- //

/**
 * Inverse square law attenuation with configurable drop-off exponent.
 * Model: 1.0 / (1.0 + d^(2 * dropOff))
 *
 * dropOff = 0  -> no falloff (returns 1.0)
 * dropOff = 0.5 -> inverse linear falloff
 * dropOff = 1  -> inverse square law
 */
fn normalizedAttenuation(pDistance: f32, pDropOff: f32) -> f32 {
    if (pDropOff <= 0.0) {
        return 1.0;
    }

    return 1.0 / (1.0 + pow(pDistance, 2.0 * pDropOff));
}
// ----------------------------------------------------------------- //


// ------------------- Per-Type Light Calculations ----------------- //

/**
 * Point light: omnidirectional emission with distance attenuation.
 */
fn calculatePointLight(pLight: Light, pFragPos: vec3<f32>, pNormal: vec3<f32>) -> vec3<f32> {
    let lToLight: vec3<f32> = pLight.position.xyz - pFragPos;
    let lDistance: f32 = length(lToLight);

    // Early cull by calculated range.
    if (lDistance > pLight.calculatedRange) {
        return vec3<f32>(0.0);
    }

    let lDirection: vec3<f32> = lToLight / max(lDistance, 0.001);
    let lNdotL: f32 = max(dot(pNormal, lDirection), 0.0);
    let lAttenuation: f32 = normalizedAttenuation(lDistance, pLight.dropOff);

    return pLight.color.rgb * pLight.color.a * lNdotL * lAttenuation;
}

/**
 * Directional light: parallel rays from a direction. No distance attenuation.
 */
fn calculateDirectionalLight(pLight: Light, pNormal: vec3<f32>) -> vec3<f32> {
    // Light travels in the forward direction; surface-to-light is the negation.
    let lDirection: vec3<f32> = normalize(-pLight.rotation.xyz);
    let lNdotL: f32 = max(dot(pNormal, lDirection), 0.0);

    return pLight.color.rgb * pLight.color.a * lNdotL;
}

/**
 * Spot light: cone of light with inner (full intensity) and outer (fade) angles.
 */
fn calculateSpotLight(pLight: Light, pFragPos: vec3<f32>, pNormal: vec3<f32>) -> vec3<f32> {
    let lToLight: vec3<f32> = pLight.position.xyz - pFragPos;
    let lDistance: f32 = length(lToLight);

    // Early cull by calculated range.
    if (lDistance > pLight.calculatedRange) {
        return vec3<f32>(0.0);
    }

    let lDirection: vec3<f32> = lToLight / max(lDistance, 0.001);
    let lNdotL: f32 = max(dot(pNormal, lDirection), 0.0);

    // Spot cone: compare angle between fragment-to-light and spot forward direction.
    let lSpotForward: vec3<f32> = normalize(pLight.rotation.xyz);
    let lSpotCosine: f32 = dot(-lDirection, lSpotForward);
    let lInnerCos: f32 = cos(radians(pLight.innerAngle * 0.5));
    let lOuterCos: f32 = cos(radians(pLight.outerAngle * 0.5));
    let lSpotEffect: f32 = smoothstep(lOuterCos, lInnerCos, lSpotCosine);

    let lAttenuation: f32 = normalizedAttenuation(lDistance, pLight.dropOff);

    return pLight.color.rgb * pLight.color.a * lNdotL * lAttenuation * lSpotEffect;
}

/**
 * Area light: rectangular emitter that only emits in the forward direction.
 * Base size 1x1 at pivot center; transformation scale defines actual width/height.
 */
fn calculateAreaLight(pLight: Light, pFragPos: vec3<f32>, pNormal: vec3<f32>) -> vec3<f32> {
    let lToLight: vec3<f32> = pLight.position.xyz - pFragPos;
    let lDistance: f32 = length(lToLight);

    // Early cull by calculated range.
    if (lDistance > pLight.calculatedRange) {
        return vec3<f32>(0.0);
    }

    let lDirection: vec3<f32> = lToLight / max(lDistance, 0.001);
    let lNdotL: f32 = max(dot(pNormal, lDirection), 0.0);

    // Area light only emits in the forward direction.
    let lLightForward: vec3<f32> = normalize(pLight.rotation.xyz);
    let lForwardDot: f32 = dot(-lDirection, lLightForward);
    if (lForwardDot <= 0.0) {
        return vec3<f32>(0.0);
    }

    // Larger area spreads light more; scale contribution by the emitter surface area.
    let lAreaScale: f32 = pLight.width * pLight.height;
    let lAttenuation: f32 = normalizedAttenuation(lDistance, pLight.dropOff);

    return pLight.color.rgb * pLight.color.a * lNdotL * lAttenuation * lForwardDot * lAreaScale;
}
// ----------------------------------------------------------------- //


// ------------------- Vertex Shader ------------------------------- //
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

    // Retrieve the world matrix from the transformation buffer.
    let lWorldMatrix: mat4x4<f32> = transformationData[lComponentIndex];

    // Calculate world position.
    let lWorldPosition: vec4<f32> = lWorldMatrix * vec4<f32>(pVertex.position, 1.0);

    var lOut: VertexOut;
    lOut.position = viewProjection * lWorldPosition;
    lOut.normal = normalize(lWorldMatrix * vec4<f32>(pVertex.normal, 0.0));
    lOut.fragmentPosition = lWorldPosition;

    return lOut;
}
// ----------------------------------------------------------------- //


// ------------------- Fragment Shader ----------------------------- //
struct FragmentIn {
    @location(0) normal: vec4<f32>,
    @location(1) fragmentPosition: vec4<f32>,
}

@fragment
fn fragment_main(pFragment: FragmentIn) -> @location(0) vec4<f32> {
    // Start with ambient light.
    var lAccumulatedLight: vec3<f32> = AMBIENT_COLOR;
    let lNormal: vec3<f32> = normalize(pFragment.normal.xyz);

    // Accumulate contribution from each active light.
    for (var i: u32 = 0u; i < lightCount; i = i + 1u) {
        let lLight: Light = lightData[i];

        switch (lLight.lightType) {
            case 0: { // Point
                lAccumulatedLight += calculatePointLight(lLight, pFragment.fragmentPosition.xyz, lNormal);
            }
            case 1: { // Directional
                lAccumulatedLight += calculateDirectionalLight(lLight, lNormal);
            }
            case 2: { // Spot
                lAccumulatedLight += calculateSpotLight(lLight, pFragment.fragmentPosition.xyz, lNormal);
            }
            case 3: { // Area
                lAccumulatedLight += calculateAreaLight(lLight, pFragment.fragmentPosition.xyz, lNormal);
            }
            default: {}
        }
    }

    // Apply accumulated light to object color.
    let lFinalColor: vec3<f32> = lAccumulatedLight * OBJECT_COLOR.xyz;

    return vec4<f32>(lFinalColor, OBJECT_COLOR.w);
}
// ----------------------------------------------------------------- //
