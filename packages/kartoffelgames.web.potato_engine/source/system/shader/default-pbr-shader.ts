/**
 * Default PBR shader user code.
 *
 * Pass-through vertex function and fragment that uses vertex colors as albedo.
 * Used as fallback while custom shaders are compiling or when compilation fails.
 */
export const DEFAULT_PBR_SHADER: string = `
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
    let out: PbrOutput;
    out.albedo = input.color;
    out.normal = input.normal;
    out.metallic = 0.0;
    out.roughness = 0.5;
    out.occlusion = 1.0;
    out.emission = new Vector3<float>(0.0, 0.0, 0.0);
    out.alphaThreshold = 0.0;
    return out;
}
`;
