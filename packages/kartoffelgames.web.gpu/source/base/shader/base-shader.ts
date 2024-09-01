import { Dictionary } from '@kartoffelgames/core';
import { ComputeStage } from '../../constant/compute-stage.enum';
import { BindDataGroupLayout } from '../binding/bind-data-group-layout';
import { PipelineDataLayout } from '../binding/pipeline-data-layout';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuNativeObject, NativeObjectLifeTime } from '../gpu/gpu-native-object';

// TODO: Split into Compute- and RenderShader AND ModuleShader(Block any entry point.)
// TODO: Add ShaderModules. With own PreCompile command. (import/if/define ....)
// TODO: Maybe own language??? 

export abstract class BaseShader extends GpuNativeObject<GPUShaderModule> {
    private static readonly mBindGroupLayoutCache: Dictionary<string, BindDataGroupLayout> = new Dictionary<string, BindDataGroupLayout>();

    private readonly mPipelineLayout: PipelineDataLayout;
    private readonly mShaderInformation: BaseShaderInterpreter;

    /**
     * Shader information.
     */
    public get information(): BaseShaderInterpreter {
        return this.mShaderInformation;
    }

    /**
     * Shader pipeline layout.
     */
    public get pipelineLayout(): PipelineDataLayout {
        return this.mPipelineLayout;
    }

    /**
     * Constructor.
     * @param pDevice - Gpu Device reference.
     */
    public constructor(pDevice: GpuDevice, pSource: string) {
        super(pDevice, NativeObjectLifeTime.Persistent);

        // Create shader information for source.
        this.mShaderInformation = this.device.shaderInterpreter.interpret(pSource);

        // Generate layout.
        this.mPipelineLayout = new PipelineDataLayout(this.device);
        for (const [lGroupIndex, lBindingList] of this.mShaderInformation.bindings) {
            // Create group layout and add each binding.
            let lGroupLayout: BindDataGroupLayout = new BindDataGroupLayout(this.device);
            for (const lBinding of lBindingList) {
                lGroupLayout.addBinding(lBinding, lBinding.name);
            }

            // Read from cache.
            if (BaseShader.mBindGroupLayoutCache.has(lGroupLayout.identifier)) {
                lGroupLayout = BaseShader.mBindGroupLayoutCache.get(lGroupLayout.identifier)!;
            }

            // Cache group layout.
            BaseShader.mBindGroupLayoutCache.set(lGroupLayout.identifier, lGroupLayout);

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
        const lEntryPointFunctions: Array<ShaderFunction> = this.mShaderInformation.entryPoints.get(pStage) ?? new Array<ShaderFunction>();
        return lEntryPointFunctions.map((pFunction: ShaderFunction) => { return pFunction.name; });
    }
}