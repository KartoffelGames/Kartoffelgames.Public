/**
 * Every benchmark input of the PGSL pipeline.
 *
 * The medium input is one realistic forward shader. The full input is the same shader with its
 * shading block repeated under renamed declarations. Bindings and entry points stay unique,
 * only the shading block is repeated, so every generated document is a valid shader.
 * Keeping every input in one place makes the three benchmark files differ in their input only.
 */
export class BenchmarkSource {
    /**
     * Smallest input that still produces transpiled code.
     */
    public static readonly SMALL: string = `
const brightness: float = 1.5;

function scale(value: float): float {
    return value * brightness;
}
`;

    /**
     * Bindings, shared structs and module constants. Declared once per document.
     */
    private static readonly HEADER: string = `
// ------------------------- Light data ------------------------- //
struct AmbientLight {
    color: Vector4<float>,
    intensity: float
}

struct PointLight {
    position: Vector4<float>,
    color: Vector4<float>,
    range: float,
    falloff: float
}

alias Color = Vector4<float>;
alias LightList = Array<PointLight>;

enum ToneMapping {
    None = "none",
    Reinhard = "reinhard",
    Filmic = "filmic"
}

// ------------------------- World values ----------------------- //
[GroupBinding("world", "view_projection_matrix")]
uniform viewProjectionMatrix: Matrix44<float>;

[GroupBinding("world", "camera_position")]
uniform cameraPosition: Vector4<float>;

[GroupBinding("world", "ambient_light")]
uniform ambientLight: AmbientLight;

[GroupBinding("world", "point_lights")]
[AccessMode(AccessMode.Read)]
storage pointLights: LightList;

// ------------------------- Object values ---------------------- //
[GroupBinding("object", "transformation_matrix")]
uniform transformationMatrix: Matrix44<float>;

[GroupBinding("object", "instance_positions")]
[AccessMode(AccessMode.Read)]
storage instancePositions: Array<Vector4<float>>;

// ------------------------- Material values -------------------- //
[GroupBinding("user", "base_color_sampler")]
uniform baseColorSampler: Sampler;

[GroupBinding("user", "base_color_texture")]
uniform baseColorTexture: Texture2d<float>;

[GroupBinding("user", "normal_texture")]
uniform normalTexture: Texture2d<float>;

// ------------------------- Constants -------------------------- //
param exposure: float = 1.0;
param debugMode: int = 0;

private frameCounter: int = 0;

const PI: float = 3.14159265;
const EPSILON: float = 0.0001;
const MAX_POINT_LIGHTS: int = 64;
`;

    /**
     * Entry points and their input and output structs. Declared once per document.
     */
    private static readonly FOOTER: string = `
// ------------------------- Entry points ----------------------- //
struct VertexIn {
    instanceId: InstanceIndex,

    [Location("position")]
    position: Vector4<float>,

    [Location("uv")]
    uv: Vector2<float>,

    [Location("normal")]
    normal: Vector4<float>
}

struct VertexOut {
    position: Position,

    [Location("uv")]
    uv: Vector2<float>,

    [Location("normal")]
    normal: Vector4<float>,

    [Location("world_position")]
    worldPosition: Vector4<float>
}

[Vertex()]
function vertex_main(vertex: VertexIn): VertexOut {
    const instancePosition: Vector4<float> = instancePositions[vertex.instanceId];
    const instanceMatrix: Matrix44<float> = new Matrix44(
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        instancePosition.x, instancePosition.y, instancePosition.z, 1.0
    );

    const worldPosition: Vector4<float> = transformationMatrix * instanceMatrix * vertex.position;

    let out: VertexOut;
    out.position = viewProjectionMatrix * worldPosition;
    out.uv = vertex.uv;
    out.normal = normalize(transformationMatrix * vertex.normal);
    out.worldPosition = worldPosition;

    return out;
}

struct FragmentIn {
    [Location("uv")]
    uv: Vector2<float>,

    [Location("normal")]
    normal: Vector4<float>,

    [Location("world_position")]
    worldPosition: Vector4<float>
}

struct FragmentOut {
    [Location("buffer")]
    color: Vector4<float>
}

[Fragment()]
function fragment_main(fragment: FragmentIn): FragmentOut {
    const albedo: Vector4<float> = textureSample(baseColorTexture, baseColorSampler, fragment.uv);

    if (albedo.w < 0.05) {
        discard;
    }

    const surface: SurfaceSample = sampleSurface(fragment.uv, fragment.normal, albedo);
    const shaded: Vector4<float> = shadeSurface(surface, fragment.worldPosition);

    let out: FragmentOut;
    out.color = toneMap(shaded * exposure, debugMode);

    return out;
}
`;

    /**
     * Everyday sized input. One realistic forward shader.
     */
    public static get medium(): string {
        return BenchmarkSource.HEADER + BenchmarkSource.unit('') + BenchmarkSource.FOOTER;
    }

    /**
     * Input that exceeds everyday usage.
     * The shading block of the realistic shader is repeated with renamed declarations.
     *
     * @param pUnitCount - How often the shading block is repeated.
     *
     * @returns Full sized benchmark input.
     */
    public static full(pUnitCount: number): string {
        const lCodePartList: Array<string> = new Array<string>();

        // Bindings and shared structs.
        lCodePartList.push(BenchmarkSource.HEADER);

        // Repeated shading block. The first block keeps the plain names the entry points use.
        for (let lUnitIndex: number = 0; lUnitIndex < pUnitCount; lUnitIndex++) {
            lCodePartList.push(BenchmarkSource.unit(lUnitIndex === 0 ? '' : `${lUnitIndex}`));
        }

        // Entry points.
        lCodePartList.push(BenchmarkSource.FOOTER);

        return lCodePartList.join('\n');
    }

    /**
     * One shading block of the realistic shader.
     * Every declared name carries the suffix, so the block can be repeated inside one document.
     *
     * @param pSuffix - Suffix appended to every declared name.
     *
     * @returns Code of one shading block.
     */
    public static unit(pSuffix: string): string {
        return BenchmarkSource.UNIT_TEMPLATE.replaceAll('__N__', pSuffix);
    }

    /**
     * Template of one shading block. Every declared name contains the suffix placeholder.
     */
    private static readonly UNIT_TEMPLATE: string = `
// ------------------------- Surface shading -------------------- //
struct SurfaceSample__N__ {
    albedo: Vector4<float>,
    normal: Vector4<float>,
    roughness: float,
    metallic: float
}

/**
 * Sample the material surface at a uv coordinate.
 */
function sampleSurface__N__(uv: Vector2<float>, normal: Vector4<float>, albedo: Vector4<float>): SurfaceSample__N__ {
    const normalSample: Vector4<float> = textureSample(normalTexture, baseColorSampler, uv);

    let out: SurfaceSample__N__;
    out.albedo = albedo;
    out.normal = normalize(normal + normalSample * 0.5);
    out.roughness = clamp(normalSample.w, 0.05, 1.0);
    out.metallic = saturate(albedo.w);

    return out;
}

/**
 * Normal distribution term of the shading model.
 */
function distributionGgx__N__(normalDotHalf: float, roughness: float): float {
    const alpha: float = roughness * roughness;
    const alphaSquared: float = alpha * alpha;
    const denominator: float = normalDotHalf * normalDotHalf * alphaSquared - normalDotHalf * normalDotHalf + 1.0;

    return alphaSquared / max(PI * denominator * denominator, EPSILON);
}

/**
 * Geometry term of the shading model.
 */
function geometrySchlick__N__(normalDotView: float, roughness: float): float {
    const k: float = roughness * roughness * 0.5;

    return normalDotView / max(normalDotView * 1.0 - normalDotView * k + k, EPSILON);
}

/**
 * Fresnel term of the shading model.
 */
function fresnelSchlick__N__(cosTheta: float, reflectance: Vector4<float>): Vector4<float> {
    const factor: float = pow(1.0 - cosTheta, 5.0);

    return reflectance + new Vector4<float>(1.0, 1.0, 1.0, 1.0) * factor - reflectance * factor;
}

/**
 * Attenuation of a single point light.
 */
function pointLightAttenuation__N__(light: PointLight, worldPosition: Vector4<float>): float {
    const lightDistance: float = distance(light.position, worldPosition);

    if (lightDistance > light.range) {
        return 0.0;
    }

    const normalized: float = lightDistance / max(light.range, EPSILON);

    return pow(1.0 - normalized, light.falloff);
}

/**
 * Accumulate every point light of the scene.
 */
function accumulatePointLights__N__(surface: SurfaceSample__N__, worldPosition: Vector4<float>): Vector4<float> {
    const lightCount: uint = arrayLength(&pointLights);
    const viewDirection: Vector4<float> = normalize(cameraPosition - worldPosition);

    let result: Vector4<float> = new Vector4<float>(0.0, 0.0, 0.0, 0.0);
    let processed: int = 0;

    for (let index: uint = 0; index < lightCount; index++) {
        if (processed >= MAX_POINT_LIGHTS) {
            break;
        }

        const light: PointLight = pointLights[index];
        const attenuation: float = pointLightAttenuation__N__(light, worldPosition);

        if (attenuation <= EPSILON) {
            continue;
        }

        const lightDirection: Vector4<float> = normalize(light.position - worldPosition);
        const halfDirection: Vector4<float> = normalize(lightDirection + viewDirection);

        const normalDotLight: float = max(dot(surface.normal, lightDirection), 0.0);
        const normalDotView: float = max(dot(surface.normal, viewDirection), 0.0);
        const normalDotHalf: float = max(dot(surface.normal, halfDirection), 0.0);

        const distribution: float = distributionGgx__N__(normalDotHalf, surface.roughness);
        const geometry: float = geometrySchlick__N__(normalDotView, surface.roughness);
        const fresnel: Vector4<float> = fresnelSchlick__N__(normalDotView, surface.albedo);

        const specular: Vector4<float> = fresnel * distribution * geometry;
        const diffuse: Vector4<float> = surface.albedo * normalDotLight;

        result += light.color * attenuation * diffuse + light.color * attenuation * specular;
        processed++;
    }

    return result;
}

/**
 * Combine ambient and direct light of a surface.
 */
function shadeSurface__N__(surface: SurfaceSample__N__, worldPosition: Vector4<float>): Vector4<float> {
    let result: Vector4<float> = ambientLight.color * ambientLight.intensity * surface.albedo;

    result += accumulatePointLights__N__(surface, worldPosition);

    return result;
}

/**
 * Map the shaded color into display range.
 */
function toneMap__N__(color: Vector4<float>, mode: int): Vector4<float> {
    let mapped: Vector4<float> = color;

    switch (mode) {
        case 0: {
            mapped = color;
        }
        case 1: {
            mapped = color / (color + new Vector4<float>(1.0, 1.0, 1.0, 1.0));
        }
        default: {
            mapped = saturate(color * 1.2 - new Vector4<float>(0.05, 0.05, 0.05, 0.0));
        }
    }

    let iteration: int = 0;
    do {
        mapped = mapped * 1.0;
        iteration++;
    } while (iteration < 1);

    let guard: int = 0;
    while (guard < 2) {
        mapped = new Vector4<float>(mapped.x, mapped.y, mapped.z, 1.0);
        guard++;
    }

    return mapped;
}
`;
}
