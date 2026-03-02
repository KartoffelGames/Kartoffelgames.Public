/**
 * Default PBR shader user code.
 *
 * Declares User group bindings for PBR material properties:
 * - baseColorFactor: RGBA color multiplier for albedo (default white).
 * - metallicFactor: Metalness value (default 0.0).
 * - roughnessFactor: Roughness value (default 0.5).
 * - baseColorTexture + baseColorSampler: Optional albedo texture (placeholder when unset).
 *
 * Final albedo = baseColorFactor * textureColor * vertexColor.
 * Used as fallback while custom shaders are compiling or when compilation fails.
 */
export const DEFAULT_PBR_SHADER: string = `
[GroupBinding("User", "baseColorFactor")]
uniform baseColorFactor: Vector4<float>;

[GroupBinding("User", "metallicFactor")]
uniform metallicFactor: float;

[GroupBinding("User", "roughnessFactor")]
uniform roughnessFactor: float;

[GroupBinding("User", "baseColorTexture")]
uniform baseColorTexture: Texture2d<float>;

[GroupBinding("User", "baseColorSampler")]
uniform baseColorSampler: Sampler;

function vertex(input: VertexInput): VertexOutput {
    let out: VertexOutput;
    out.position = input.position;
    out.normal = input.normal;
    out.color = input.color;
    out.uv = input.uv;
    out.uv2 = input.uv2;
    out.uv3 = input.uv3;
    out.uv4 = input.uv4;
    return out;
}

function fragment(input: FragmentInput): PbrOutput {
    const texColor: Vector4<float> = textureSample(baseColorTexture, baseColorSampler, input.uv);

    let out: PbrOutput;
    out.albedo = baseColorFactor * texColor * input.color;
    out.normal = input.normal;
    out.metallic = metallicFactor;
    out.roughness = roughnessFactor;
    out.occlusion = 1.0;
    out.emission = new Vector3<float>(0.0, 0.0, 0.0);
    out.alphaThreshold = 0.0;
    return out;
}
`;
