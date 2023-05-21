import { Exception } from '@kartoffelgames/core.data';
import { WebGpuDevice } from '../web-gpu-device';
import { GpuNativeObject } from '../gpu-native-object';
import { WebGpuShader } from '../shader/web-gpu-shader';
import { IPipeline } from './i-pipeline.interface';

export class ComputePipeline extends GpuNativeObject<GPUComputePipeline> implements IPipeline {
    private readonly mShader: WebGpuShader;

    /**
     * Shader.
     */
    public get shader(): WebGpuShader {
        return this.mShader;
    }

    /**
     * Constructor.
     * @param pGpu - GPU.
     */
    public constructor(pGpu: WebGpuDevice, pShader: WebGpuShader) {
        super(pGpu, 'COMPUTE_PIPELINE');

        // Check valid entry points.
        if (!pShader.computeEntryPoint) {
            throw new Exception('Shadermodule has no compute entry point.', this);
        }

        // Set and register internal.
        this.mShader = pShader;
        this.registerInternalNative(pShader);
    }

    /**
     * Generate native render pipeline.
     */
    protected generate(): GPUComputePipeline {
        // Generate pipeline layout from bind group layouts.
        const lPipelineLayout: GPUPipelineLayoutDescriptor = this.mShader.bindGroups.native();

        // Construct basic GPURenderPipelineDescriptor.
        const lPipelineDescriptor: GPUComputePipelineDescriptor = {
            label: this.label,
            layout: this.gpu.device.createPipelineLayout(lPipelineLayout),
            compute: {
                module: this.mShader.native(),
                entryPoint: this.mShader.vertexEntryPoint!.name, // It allways should has an entry point.
                // No constants. Yes.
            }
        };

        // Async is none GPU stalling.
        return this.gpu.device.createComputePipeline(lPipelineDescriptor); // TODO: Async somehow.
    }
}