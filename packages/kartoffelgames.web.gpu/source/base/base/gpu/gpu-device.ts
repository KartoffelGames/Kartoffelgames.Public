import { BaseGenerator } from '../generator/base-generator';
import { RenderTargets } from '../pipeline/render-targets';
import { RenderShader } from '../shader/render-shader';

export class GpuDevice {
    /**
     * Request new gpu device.
     * @param pGenerator - Native object generator.
     */
    public static async request(pGenerator: BaseGenerator<any>): Promise<GpuDevice> {
        return new GpuDevice(await pGenerator.init());
    }

    private readonly mGenerator: BaseGenerator;

    /**
     * Native object generator.
     */
    public get generator(): BaseGenerator {
        return this.mGenerator;
    }

    /**
     * Constructor.
     * @param pGenerator - Native GPU-Object Generator.
     */
    private constructor(pGenerator: BaseGenerator) {
        this.mGenerator = pGenerator;
    }

    /**
     * Create shader.
     * @param pSource - Shader source.
     * @param pVertexEntry - Vertex entry name.
     * @param pFragmentEntry - Optional fragment entry.
     */
    public renderShader(pSource: string, pVertexEntry: string, pFragmentEntry?: string): RenderShader {
        return new RenderShader(this, pSource, pVertexEntry, pFragmentEntry);
    }

    /**
     * Create render target group.
     * @param pWidth - Render target width.
     * @param pHeight - Render target height.
     * @param pMultisampleLevel - Multisample level of targets.
     */
    public renderTargets(pWidth: number, pHeight: number, pMultisampleLevel: number = 1): RenderTargets {
        return new RenderTargets(this, pWidth, pHeight, pMultisampleLevel);
    }
}