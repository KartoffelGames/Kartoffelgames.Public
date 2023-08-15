import { Exception } from '@kartoffelgames/core.data';
import { ComputeStage } from '../../constant/compute-stage.enum';
import { GpuTypes } from '../gpu/gpu-device';
import { StructBufferMemoryLayout } from '../memory_layout/buffer/struct-buffer-memory-layout';
import { Shader } from './shader';
import { ShaderFunction } from './shader-information';

export abstract class RenderShader<TGpuTypes extends GpuTypes = GpuTypes, TNative = any> extends Shader<TGpuTypes, TNative> {
    private readonly mAttachmentCount: number;
    private readonly mFragmentEntry: string | null;
    private readonly mParameterLayout: TGpuTypes['parameterLayout'];
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
    public get parameterLayout(): TGpuTypes['parameterLayout'] {
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
    public constructor(pDevice: TGpuTypes['gpuDevice'], pSource: string, pVertexEntry: string, pFragmentEntry?: string) {
        super(pDevice, pSource);

        // Set entry points.
        this.mVertexEntry = pVertexEntry;
        this.mFragmentEntry = pFragmentEntry ?? null;

        // Validate vertex entry point.
        const lVertexEntryFunction: ShaderFunction<GpuTypes> | null = this.information.getFunction(this.mVertexEntry);
        if (!lVertexEntryFunction) {
            throw new Exception(`Vertex entry "${this.mVertexEntry}" not defined.`, this);
        } else if ((lVertexEntryFunction.tag & ComputeStage.Vertex) !== ComputeStage.Vertex) {
            throw new Exception(`Vertex entry "${this.mVertexEntry}" not an defined vertex entry.`, this);
        }

        // Validate fragment entry point.
        const lFragmentEntryFunction: ShaderFunction<GpuTypes> | null = (this.mFragmentEntry) ? this.information.getFunction(this.mFragmentEntry) : null;
        if (this.mFragmentEntry) {
            // Validate entry points existance.
            if (!lFragmentEntryFunction) {
                throw new Exception(`Fragment entry "${this.mFragmentEntry}" not defined.`, this);
            } else if ((lFragmentEntryFunction.tag & ComputeStage.Fragment) !== ComputeStage.Fragment) {
                throw new Exception(`Fragment entry "${this.mFragmentEntry}" not an defined fragment entry.`, this);
            }
        }

        // Create parameter layout and append every parameter.
        this.mParameterLayout = this.createEmptyParameterLayout();
        for (const lParameter of lVertexEntryFunction.parameter) {
            this.mParameterLayout.addParameter(<TGpuTypes['bufferMemoryLayout']>lParameter);
        }

        // Get attachment count based on fragment function return values with an memory index.
        this.mAttachmentCount = 0;
        if (this.mFragmentEntry) {
            // Fragment has only buffer return types.
            const lFragmentReturn: TGpuTypes['bufferMemoryLayout'] = <TGpuTypes['bufferMemoryLayout']>lFragmentEntryFunction!.return;
            if (lFragmentReturn instanceof StructBufferMemoryLayout) {
                this.mAttachmentCount = lFragmentReturn.locationLayouts().length;
            } else {
                this.mAttachmentCount = 1;
            }
        }
    }

    /**
     * Create empty parameter layout.
     */
    protected abstract createEmptyParameterLayout(): TGpuTypes['parameterLayout'];
}