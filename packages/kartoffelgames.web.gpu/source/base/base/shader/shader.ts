import { Dictionary } from '@kartoffelgames/core.data';
import { ComputeStage } from '../../constant/compute-stage.enum';
import { BindGroupLayout } from '../binding/bind-group-layout';
import { GpuTypes } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/gpu-object';
import { LinearBufferMemoryLayout } from '../memory_layout/buffer/linear-buffer-memory-layout';
import { StructBufferMemoryLayout } from '../memory_layout/buffer/struct-buffer-memory-layout';
import { ShaderFunction } from './shader-information';

export abstract class Shader<TGpuTypes extends GpuTypes = GpuTypes, TNative = any> extends GpuObject<TGpuTypes, TNative> {
    private static readonly mBindGroupLayoutCache: Dictionary<string, BindGroupLayout> = new Dictionary<string, BindGroupLayout>();

    private readonly mAttachmentCount: number;
    private readonly mPipelineLayout: TGpuTypes['pipelineLayout'];
    private readonly mShaderInformation: TGpuTypes['shaderInformation'];

    /**
     * Shader attachment count.
     */
    public get attachmentCount(): number {
        return this.mAttachmentCount;
    }

    /**
     * Shader information.
     */
    public get information(): TGpuTypes['shaderInformation'] {
        return this.mShaderInformation;
    }

    /**
     * Shader pipeline layout.
     */
    public get pipelineLayout(): TGpuTypes['pipelineLayout'] {
        return this.mPipelineLayout;
    }

    /**
     * Constructor.
     * @param pDevice - Gpu Device reference.
     */
    public constructor(pDevice: TGpuTypes['gpuDevice'], pShaderInformation: TGpuTypes['shaderInformation']) {
        super(pDevice);

        this.mShaderInformation = pShaderInformation;

        // Generate layout.
        this.mPipelineLayout = this.device.pipelineLayout();
        for (const [lGroupIndex, lBindingList] of this.mShaderInformation.bindings) {
            // Create group layout and add each binding.
            let lGroupLayout: TGpuTypes['bindGroupLayout'] = this.device.bindGroupLayout();
            for (const lBinding of lBindingList) {
                lGroupLayout.addBinding(lBinding, lBinding.name);
            }

            // Read from cache.
            if (Shader.mBindGroupLayoutCache.has(lGroupLayout.identifier)) {
                lGroupLayout = Shader.mBindGroupLayoutCache.get(lGroupLayout.identifier)!;
            }

            // Cache group layout.
            Shader.mBindGroupLayoutCache.set(lGroupLayout.identifier, lGroupLayout);

            // Add group to pipeline.
            this.mPipelineLayout.addGroup(lGroupIndex, lGroupLayout);
        }

        // Get attachment count based on fragment function return values with an memory index.
        this.mAttachmentCount = 0;
        if (this.mShaderInformation.entryPoints.has(ComputeStage.Fragment)) {
            const lFragmentFunction: ShaderFunction<GpuTypes> = this.mShaderInformation.entryPoints.get(ComputeStage.Fragment)!;

            // Fragment has only buffer return types.
            const lFragmentReturn: TGpuTypes['bufferMemoryLayout'] = <TGpuTypes['bufferMemoryLayout']>lFragmentFunction.return;
            if (lFragmentReturn instanceof LinearBufferMemoryLayout) {
                this.mAttachmentCount = 1;
            } else if (lFragmentReturn instanceof StructBufferMemoryLayout) {
                this.mAttachmentCount = lFragmentReturn.memoryIndices().length;
            }
        }
    }

    /**
     * Get entry point name of compute stage.
     * @param pStage - Compute stage of entry point.
     */
    public getEntryPoint(pStage: ComputeStage): string | null {
        return this.mShaderInformation.entryPoints.get(pStage)?.name ?? null;
    }
}

