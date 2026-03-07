/**
 * Forward rendering PGSL import.
 *
 * Provides:
 * - Internal vertex/fragment structs for GPU pipeline
 * - All lighting calculation functions (point, directional, spot, area)
 *
 * Does NOT include entry points - those are in FORWARD_ENTRY_POINTS and must be
 * appended AFTER user code so the PGSL parser can resolve user function references.
 */
export const FORWARD_IMPORT: string = `
#IMPORT "Object";

// ===== Internal Raw Vertex Input (GPU attributes) =====
struct ForwardVertexIn {
    instanceId: InstanceIndex,

    [Location("position")]
    position: Vector3<float>,

    [Location("normal")]
    normal: Vector3<float>,

    [Location("color")]
    color: Vector4<float>,

    [Location("uv")]
    uv: Vector2<float>,

    [Location("uv2")]
    uv2: Vector2<float>,

    [Location("uv3")]
    uv3: Vector2<float>,

    [Location("uv4")]
    uv4: Vector2<float>
}

// ===== Internal Interpolated Output (vertex -> fragment) =====
struct ForwardVertexOutput {
    position: Position,

    [Location("worldPosition")]
    worldPosition: Vector4<float>,

    [Location("normal")]
    normal: Vector3<float>,

    [Location("color")]
    color: Vector4<float>,

    [Location("uv")]
    uv: Vector2<float>,

    [Location("uv2")]
    uv2: Vector2<float>,

    [Location("uv3")]
    uv3: Vector2<float>,

    [Location("uv4")]
    uv4: Vector2<float>
}

// ===== Internal Fragment Input (matches ForwardVertexOutput locations) =====
struct ForwardFragmentInput {
    [Location("worldPosition")]
    worldPosition: Vector4<float>,

    [Location("normal")]
    normal: Vector3<float>,

    [Location("color")]
    color: Vector4<float>,

    [Location("uv")]
    uv: Vector2<float>,

    [Location("uv2")]
    uv2: Vector2<float>,

    [Location("uv3")]
    uv3: Vector2<float>,

    [Location("uv4")]
    uv4: Vector2<float>
}

// ===== Fragment Output =====
struct ForwardFragmentOutput {
    [Location("color")]
    color: Vector4<float>
}

// ===== Constants =====
const PI: float = 3.14159265359;

// ===== Attenuation Helpers =====

function normalizedAttenuation(pDistance: float, pDropOff: float): float {
    if (pDropOff <= 0.0) {
        return 1.0;
    }
    return 1.0 / (1.0 + pow(pDistance, 2.0 * pDropOff));
}

// ===== Per-Type Light Calculations =====

function calculatePointLight(pLight: Light, pFragPos: Vector3<float>, pNormal: Vector3<float>): Vector3<float> {
    const toLight: Vector3<float> = pLight.positionRange.xyz - pFragPos;
    const dist: float = length(toLight);

    if ((pLight.positionRange.w > 0.0) && (dist > pLight.positionRange.w)) {
        return new Vector3<float>(0.0, 0.0, 0.0);
    }

    const direction: Vector3<float> = toLight / max(dist, 0.001);
    const nDotL: float = max(dot(pNormal, direction), 0.0);
    const attenuation: float = normalizedAttenuation(dist, pLight.rotationDropOff.w);

    return pLight.colorIntensity.rgb * pLight.colorIntensity.a * nDotL * attenuation;
}

function calculateDirectionalLight(pLight: Light, pNormal: Vector3<float>): Vector3<float> {
    const direction: Vector3<float> = normalize(-pLight.rotationDropOff.xyz);
    const nDotL: float = max(dot(pNormal, direction), 0.0);

    return pLight.colorIntensity.rgb * pLight.colorIntensity.a * nDotL;
}

function calculateSpotLight(pLight: Light, pFragPos: Vector3<float>, pNormal: Vector3<float>): Vector3<float> {
    const toLight: Vector3<float> = pLight.positionRange.xyz - pFragPos;
    const dist: float = length(toLight);

    if ((pLight.positionRange.w > 0.0) && (dist > pLight.positionRange.w)) {
        return new Vector3<float>(0.0, 0.0, 0.0);
    }

    const direction: Vector3<float> = toLight / max(dist, 0.001);
    const nDotL: float = max(dot(pNormal, direction), 0.0);

    const angles: Vector2<float> = unpack2x16float(pLight.packedAngles);
    const innerAngle: float = angles.x;
    const outerAngle: float = angles.y;

    const spotForward: Vector3<float> = normalize(pLight.rotationDropOff.xyz);
    const spotCosine: float = dot(-direction, spotForward);
    const innerCos: float = cos(radians(innerAngle * 0.5));
    const outerCos: float = cos(radians(outerAngle * 0.5));
    const spotEffect: float = smoothstep(outerCos, innerCos, spotCosine);

    const attenuation: float = normalizedAttenuation(dist, pLight.rotationDropOff.w);

    return pLight.colorIntensity.rgb * pLight.colorIntensity.a * nDotL * attenuation * spotEffect;
}

function calculateAreaLight(pLight: Light, pFragPos: Vector3<float>, pNormal: Vector3<float>): Vector3<float> {
    const toLight: Vector3<float> = pLight.positionRange.xyz - pFragPos;
    const dist: float = length(toLight);

    if ((pLight.positionRange.w > 0.0) && (dist > pLight.positionRange.w)) {
        return new Vector3<float>(0.0, 0.0, 0.0);
    }

    const direction: Vector3<float> = toLight / max(dist, 0.001);
    const nDotL: float = max(dot(pNormal, direction), 0.0);

    const lightForward: Vector3<float> = normalize(pLight.rotationDropOff.xyz);
    const forwardDot: float = dot(-direction, lightForward);
    if (forwardDot <= 0.0) {
        return new Vector3<float>(0.0, 0.0, 0.0);
    }

    const size: Vector2<float> = unpack2x16float(pLight.packedSize);
    const areaScale: float = size.x * size.y;
    const attenuation: float = normalizedAttenuation(dist, pLight.rotationDropOff.w);

    return pLight.colorIntensity.rgb * pLight.colorIntensity.a * nDotL * attenuation * forwardDot * areaScale;
}

function calculateAmbientLight(pLight: Light, pFragPos: Vector3<float>): Vector3<float> {
    // When range is 0 (infinite), apply full intensity everywhere.
    if (pLight.positionRange.w <= 0.0) {
        return pLight.colorIntensity.rgb * pLight.colorIntensity.a;
    }

    // When range is set, attenuate by distance.
    const toLight: Vector3<float> = pLight.positionRange.xyz - pFragPos;
    const dist: float = length(toLight);

    if (dist > pLight.positionRange.w) {
        return new Vector3<float>(0.0, 0.0, 0.0);
    }

    const attenuation: float = normalizedAttenuation(dist, pLight.rotationDropOff.w);

    return pLight.colorIntensity.rgb * pLight.colorIntensity.a * attenuation;
}

function calculateLighting(pFragPos: Vector3<float>, pNormal: Vector3<float>): Vector3<float> {
    let accumulatedLight: Vector3<float> = new Vector3<float>(0.0, 0.0, 0.0);

    for (let i: uint = 0; i < lightCount; i++) {
        const light: Light = lightData[lightIndexList[i]];

        switch (light.lightType) {
            case 0: {
                accumulatedLight += calculateDirectionalLight(light, pNormal);
            }
            case 1: {
                accumulatedLight += calculatePointLight(light, pFragPos, pNormal);
            }
            case 2: {
                accumulatedLight += calculateSpotLight(light, pFragPos, pNormal);
            }
            case 3: {
                accumulatedLight += calculateAreaLight(light, pFragPos, pNormal);
            }
            case 4: {
                accumulatedLight += calculateAmbientLight(light, pFragPos);
            }
            default: {}
        }
    }

    return accumulatedLight;
}
`;

/**
 * Forward rendering entry point code.
 *
 * Contains the vertex_main and fragment_main entry points that bridge
 * user-defined vertex()/fragment() functions with the engine pipeline.
 *
 * Must be appended AFTER user code in the main document (not as an import)
 * because the PGSL parser processes import declarations before main document
 * declarations, and these entry points call user-defined functions.
 */
export const FORWARD_ENTRY_POINTS: string = `
// ===== Vertex Entry Point =====
[Vertex()]
function vertex_main(pVertex: ForwardVertexIn): ForwardVertexOutput {
    const componentIndex: uint = componentIndices[pVertex.instanceId];
    const worldMatrix: Matrix44<float> = transformationData[componentIndex];

    // Build user input struct.
    let userInput: VertexInput;
    userInput.position = pVertex.position;
    userInput.normal = pVertex.normal;
    userInput.color = pVertex.color;
    userInput.uv = pVertex.uv;
    userInput.uv2 = pVertex.uv2;
    userInput.uv3 = pVertex.uv3;
    userInput.uv4 = pVertex.uv4;

    // Call user vertex function.
    const userOutput: VertexOutput = vertex(userInput);

    // Transform to world space.
    const worldPosition: Vector4<float> = worldMatrix * new Vector4<float>(userOutput.position, 1.0);

    let out: ForwardVertexOutput;
    out.position = viewProjection * worldPosition;
    out.worldPosition = worldPosition;
    const normalWorld: Vector4<float> = worldMatrix * new Vector4<float>(userOutput.normal, 0.0);
    out.normal = normalize(normalWorld.xyz);
    out.color = userOutput.color;
    out.uv = userOutput.uv;
    out.uv2 = userOutput.uv2;
    out.uv3 = userOutput.uv3;
    out.uv4 = userOutput.uv4;

    return out;
}

// ===== Fragment Entry Point =====
[Fragment()]
function fragment_main(pFragment: ForwardFragmentInput): ForwardFragmentOutput {
    // Build user input struct.
    let userInput: FragmentInput;
    userInput.normal = pFragment.normal;
    userInput.color = pFragment.color;
    userInput.uv = pFragment.uv;
    userInput.uv2 = pFragment.uv2;
    userInput.uv3 = pFragment.uv3;
    userInput.uv4 = pFragment.uv4;

    // Call user fragment function.
    const pbrResult: PbrOutput = fragment(userInput);

    // Apply PBR lighting.
    const lighting: Vector3<float> = calculateLighting(pFragment.worldPosition.xyz, normalize(pbrResult.normal));

    // PBR composition.
    const albedo: Vector3<float> = pbrResult.albedo.xyz;
    const diffuse: Vector3<float> = albedo * (1.0 - pbrResult.metallic);
    const finalColor: Vector3<float> = diffuse * lighting * pbrResult.occlusion + pbrResult.emission;

    // Alpha test.
    const materialAlpha: float = pbrResult.albedo.w;
    if (materialAlpha < pbrResult.alphaThreshold) {
        discard;
    }

    let out: ForwardFragmentOutput;
    out.color = new Vector4<float>(finalColor, materialAlpha);

    return out;
}
`;
