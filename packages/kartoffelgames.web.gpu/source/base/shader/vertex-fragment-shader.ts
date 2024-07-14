import { Exception } from '@kartoffelgames/core';
import { ComputeStage } from '../../constant/compute-stage.enum';
import { GpuDevice } from '../gpu/gpu-device';
import { BaseBufferMemoryLayout } from '../memory_layout/buffer/base-buffer-memory-layout';
import { StructBufferMemoryLayout } from '../memory_layout/buffer/struct-buffer-memory-layout';
import { VertexParameterLayout } from '../pipeline/parameter/vertex-parameter-layout';
import { BaseShader } from './base-shader';
import { ShaderFunction } from './interpreter/base-shader-interpreter';
import { LinearBufferMemoryLayout } from '../memory_layout/buffer/linear-buffer-memory-layout';
import { RenderTargets } from '../pipeline/target/render-targets';
import { VertexFragmentPipeline } from '../pipeline/vertex-fragment-pipeline';

export class VertexFragmentShader extends BaseShader<'vertexFragmentShader'> {
    private readonly mAttachmentCount: number;
    private readonly mFragmentEntry: string | null;
    private readonly mParameterLayout: VertexParameterLayout;
    private readonly mVertexEntry: string;

    /**
     * Fragment entry point name.
     */
    public get fragmentEntry(): string | null {
        return this.mFragmentEntry;
    }

    /**
     * Render parameter layout.
     */
    public get parameterLayout(): VertexParameterLayout {
        return this.mParameterLayout;
    }

    /**
     * Shader attachment count.
     */
    public get renderTargetCount(): number {
        return this.mAttachmentCount;
    }

    /**
     * Vertex entry point name.
     */
    public get vertexEntry(): string {
        return this.mVertexEntry;
    }

    /**
     * Constructor.
     * @param pDevice - Gpu Device reference.
     */
    public constructor(pDevice: GpuDevice, pSource: string, pVertexEntry: string, pFragmentEntry?: string) {
        super(pDevice, pSource);

        // Set entry points.
        this.mVertexEntry = pVertexEntry;
        this.mFragmentEntry = pFragmentEntry ?? null;

        // Validate vertex entry point.
        const lVertexEntryFunction: ShaderFunction | null = this.information.getFunction(this.mVertexEntry);
        if (!lVertexEntryFunction) {
            throw new Exception(`Vertex entry "${this.mVertexEntry}" not defined.`, this);
        } else if ((lVertexEntryFunction.entryPoints & ComputeStage.Vertex) !== ComputeStage.Vertex) {
            throw new Exception(`Vertex entry "${this.mVertexEntry}" not an defined vertex entry.`, this);
        }

        // Validate fragment entry point.
        const lFragmentEntryFunction: ShaderFunction | null = (this.mFragmentEntry) ? this.information.getFunction(this.mFragmentEntry) : null;
        if (this.mFragmentEntry) {
            // Validate entry points existance.
            if (!lFragmentEntryFunction) {
                throw new Exception(`Fragment entry "${this.mFragmentEntry}" not defined.`, this);
            } else if ((lFragmentEntryFunction.entryPoints & ComputeStage.Fragment) !== ComputeStage.Fragment) {
                throw new Exception(`Fragment entry "${this.mFragmentEntry}" not an defined fragment entry.`, this);
            }
        }

        // Create parameter layout and append every parameter.
        this.mParameterLayout = new VertexParameterLayout(this.device);
        for (const lParameter of lVertexEntryFunction.parameter) {
            // Validate buffer type.
            if (!(lParameter instanceof LinearBufferMemoryLayout)) {
                throw new Exception('Only simple data types are allowed for vertex attributes.', this);
            }

            this.mParameterLayout.add(lParameter);
        }

        // Get attachment count based on fragment function return values with an memory index.
        this.mAttachmentCount = 0;
        if (this.mFragmentEntry) {
            // Fragment has only buffer return types.
            const lFragmentReturn: BaseBufferMemoryLayout = <BaseBufferMemoryLayout>lFragmentEntryFunction!.return;
            if (lFragmentReturn instanceof StructBufferMemoryLayout) {
                this.mAttachmentCount = lFragmentReturn.locationLayouts().length;
            } else {
                this.mAttachmentCount = 1;
            }
        }
    }

    /**
     * Create pipeline from shader.
     * @param pRenderTargets - Render targets.
     */
    public createPipeline(pRenderTargets: RenderTargets): VertexFragmentPipeline {
        return new VertexFragmentPipeline(this.device, this, pRenderTargets);
    }
}