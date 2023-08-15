import { Dictionary } from '@kartoffelgames/core.data';
import { ComputeStage } from '../../constant/compute-stage.enum';
import { BindDataGroupLayout } from '../binding/bind-data-group-layout';
import { GpuTypes } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/gpu-object';
import { StructBufferMemoryLayout } from '../memory_layout/buffer/struct-buffer-memory-layout';
import { ShaderFunction } from './shader-information';

export abstract class Shader<TGpuTypes extends GpuTypes = GpuTypes, TNative = any> extends GpuObject<TGpuTypes, TNative> {
    private static readonly mBindGroupLayoutCache: Dictionary<string, BindDataGroupLayout> = new Dictionary<string, BindDataGroupLayout>();

    private readonly mAttachmentCount: number;
    private readonly mParameterLayout: TGpuTypes['parameterLayout'];
    private readonly mPipelineLayout: TGpuTypes['pipelineDataLayout'];
    private readonly mShaderInformation: TGpuTypes['shaderInformation'];

    /**
     * Shader information.
     */
    public get information(): TGpuTypes['shaderInformation'] {
        return this.mShaderInformation;
    }

    /**
     * Render parameter layout.
     */
    public get parameterLayout(): TGpuTypes['parameterLayout'] {
        return this.mParameterLayout;
    }

    /**
     * Shader pipeline layout.
     */
    public get pipelineLayout(): TGpuTypes['pipelineDataLayout'] {
        return this.mPipelineLayout;
    }

    /**
     * Shader attachment count.
     */
    public get renderTargetCount(): number {
        return this.mAttachmentCount;
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
            let lGroupLayout: TGpuTypes['bindDataGroupLayout'] = this.device.bindGroupLayout();
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
            this.mPipelineLayout.addGroupLayout(lGroupIndex, lGroupLayout);
        }

        // Get attachment count based on fragment function return values with an memory index.
        this.mAttachmentCount = 0;
        if (this.mShaderInformation.entryPoints.has(ComputeStage.Fragment)) {
            const lFragmentFunction: ShaderFunction<GpuTypes> = this.mShaderInformation.entryPoints.get(ComputeStage.Fragment)!;

            // Fragment has only buffer return types.
            const lFragmentReturn: TGpuTypes['bufferMemoryLayout'] = <TGpuTypes['bufferMemoryLayout']>lFragmentFunction.return;
            if (lFragmentReturn instanceof StructBufferMemoryLayout) {
                this.mAttachmentCount = lFragmentReturn.locationLayouts().length;
            } else {
                this.mAttachmentCount = 1;
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

