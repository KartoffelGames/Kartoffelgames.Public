import { BaseGeneratorFactory } from '../generator/base-generator-factory';
import { RenderTargets } from '../pipeline/render-targets';
import { RenderShader } from '../shader/render-shader';

export class GpuDevice {
    /**
     * Request new gpu device.
     * @param pGenerator - Native object generator.
     */
    public static async request(pGenerator: BaseGeneratorFactory<any>): Promise<GpuDevice> {
        return new GpuDevice(await pGenerator.init());
    }

    private readonly mGenerator: BaseGeneratorFactory;

    /**
     * Native object generator.
     */
    public get generator(): BaseGeneratorFactory {
        return this.mGenerator;
    }

    /**
     * Constructor.
     * @param pGenerator - Native GPU-Object Generator.
     */
    private constructor(pGenerator: BaseGeneratorFactory) {
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