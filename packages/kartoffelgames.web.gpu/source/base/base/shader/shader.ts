import { Dictionary } from '@kartoffelgames/core.data';
import { ComputeStage } from '../../constant/compute-stage.enum';
import { BindDataGroupLayout } from '../binding/bind-data-group-layout';
import { GpuTypes } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/gpu-object';
import { ShaderFunction } from './shader-information';

// TODO: Split into Compute- and RenderShader AND ModuleShader(Block any entry point.)
// TODO: Add ShaderModules. With own PreCompile command. (import/if/define ....)
// TODO: Maybe own language??? 

export abstract class Shader<TGpuTypes extends GpuTypes = GpuTypes, TNative = any> extends GpuObject<TGpuTypes, TNative> {
    private static readonly mBindGroupLayoutCache: Dictionary<string, BindDataGroupLayout> = new Dictionary<string, BindDataGroupLayout>();

    private readonly mPipelineLayout: TGpuTypes['pipelineDataLayout'];
    private readonly mShaderInformation: TGpuTypes['shaderInformation'];

    /**
     * Shader information.
     */
    public get information(): TGpuTypes['shaderInformation'] {
        return this.mShaderInformation;
    }

    /**
     * Shader pipeline layout.
     */
    public get pipelineLayout(): TGpuTypes['pipelineDataLayout'] {
        return this.mPipelineLayout;
    }

    /**
     * Constructor.
     * @param pDevice - Gpu Device reference.
     */
    public constructor(pDevice: TGpuTypes['gpuDevice'], pSource: string) {
        super(pDevice);

        // Create shader information for source.
        this.mShaderInformation = this.createShaderInformation(pSource);

        // Generate layout.
        this.mPipelineLayout = this.device.pipelineLayout();
        for (const [lGroupIndex, lBindingList] of this.mShaderInformation.bindings) {
            // Create group layout and add each binding.
            let lGroupLayout: TGpuTypes['bindDataGroupLayout'] = this.createEmptyBindDataGroupLayout();
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
    }

    /**
     * Get entry point name of compute stage.
     * @param pStage - Compute stage of entry point.
     */
    public getEntryPoints(pStage: ComputeStage): Array<string> {
        // Ignore shader function generic. Does not matter for this function. Use only function names.
        const lEntryPointFunctions: Array<ShaderFunction<GpuTypes>> = this.mShaderInformation.entryPoints.get(pStage) ?? new Array<ShaderFunction<GpuTypes>>();
        return lEntryPointFunctions.map((pFunction: ShaderFunction<GpuTypes>) => { return pFunction.name; });
    }

    /**
     * Create empty bind data group layout.
     */
    protected abstract createEmptyBindDataGroupLayout(): TGpuTypes['bindDataGroupLayout'];

    /**
     * Create new shader information.
     */
    protected abstract createShaderInformation(pSource: string): TGpuTypes['shaderInformation'];
}

