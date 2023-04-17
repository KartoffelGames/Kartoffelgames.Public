import { Exception } from '@kartoffelgames/core.data';
import { Gpu } from '../gpu';
import { GpuNativeObject } from '../gpu-native-object';
import { Shader } from '../shader';
import { IPipeline } from './i-pipeline.interface';

export class ComputePipeline extends GpuNativeObject<GPUComputePipeline> implements IPipeline{
    private mShader: Shader | null;
    private mShaderChanged: boolean;

    /**
     * Shader.
     */
    public get shader(): Shader {
        if (!this.mShader) {
            throw new Exception('Shader is not set for this pipeline', this);
        }
        return this.mShader;
    }

    /**
     * Constructor.
     * @param pGpu - GPU.
     */
    public constructor(pGpu: Gpu) {
        super(pGpu, 'COMPUTE_PIPELINE');

        // Init unassigned properties.
        this.mShaderChanged = true;
        this.mShader = null;
    }

    /**
     * Set Shader programms for pipeline.
     * @param pShader - Vertex with optional fragement shader.
     */
    public setShader(pShader: Shader): void {
        // Validate vertex shader.
        if (!pShader.computeEntryPoint) {
            throw new Exception('Compute shader has no entry point.', this);
        }

        // Unregister old shader and register new.
        if (this.mShader) {
            this.unregisterInternalNative(this.mShader);
        }
        if (pShader) {
            this.registerInternalNative(pShader);
        }

        this.mShader = pShader;
    }

    /**
     * Free storage of native object.
     * @param _pNativeObject - Native object. 
     */
    protected async destroyNative(_pNativeObject: GPUComputePipeline): Promise<void> {
        // Nothing to destroy.
    }

    /**
     * Generate native render pipeline.
     */
    protected async generate(): Promise<GPUComputePipeline> {
        // Check valid entry points.
        if (!this.mShader?.computeEntryPoint) {
            throw new Exception('Shadermodule has no compute entry point.', this);
        }

        // Generate pipeline layout from bind group layouts.
        const lPipelineLayout: GPUPipelineLayoutDescriptor = await this.mShader.bindGroups.native();

        // Construct basic GPURenderPipelineDescriptor.
        const lPipelineDescriptor: GPUComputePipelineDescriptor = {
            label: this.label,
            layout: this.gpu.device.createPipelineLayout(lPipelineLayout),
            compute: {
                module: await this.mShader.native(),
                entryPoint: this.mShader.vertexEntryPoint!.name, // It allways should has an entry point.
                // No constants. Yes.
            }
        };

        // Reset change flags.
        this.mShaderChanged = false;

        // Async is none GPU stalling.
        return this.gpu.device.createComputePipelineAsync(lPipelineDescriptor);
    }

    /**
     * Invalidate on data change or native data change.s
     */
    protected override async validateState(): Promise<boolean> {
        // Native objects are validated over internal natives.

        return !this.mShaderChanged;
    }
}