import { GpuDevice } from '../gpu/gpu-device';
import { GpuNativeObject, NativeObjectLifeTime } from '../gpu/gpu-native-object';
import { UpdateReason } from '../gpu/gpu-object-update-reason';
import { ComputeShader } from '../shader/compute-shader';

export class ComputePipeline extends GpuNativeObject<GPUComputePipeline> {
    private readonly mShader: ComputeShader;

    /**
     * Pipeline shader.
     */
    public get shader(): ComputeShader {
        return this.mShader;
    }

    /**
     * Constructor.
     * Set default data.
     * @param pDevice - Device.
     * @param pShader - Pipeline shader.
     */
    public constructor(pDevice: GpuDevice, pShader: ComputeShader) {
        super(pDevice, NativeObjectLifeTime.Persistent);
        this.mShader = pShader;

        // Listen for shader changes.
        pShader.addInvalidationListener(() => {
            this.triggerAutoUpdate(UpdateReason.ChildData);
        });
    }

    /**
     * Destroys nothing.
     */
    protected override destroy(): void {
        // Nothing to destroy.
    }

    /**
     * Generate native gpu pipeline data layout.
     */
    protected override generate(): GPUComputePipeline {
        // Generate pipeline layout from bind group layouts.
        const lPipelineLayout: GPUPipelineLayout = this.factory.request<'pipelineDataLayout'>(this.gpuObject.shader.pipelineLayout).create();

        // Construct basic GPURenderPipelineDescriptor.
        const lPipelineDescriptor: GPUComputePipelineDescriptor = {
            layout: lPipelineLayout,
            compute: {
                module: this.factory.request<'computeShader'>(this.gpuObject.shader).create(),
                entryPoint: this.gpuObject.shader.computeEntry,
                // TODO: Constants. Yes.
            }
        };

        // Async is none GPU stalling.
        return this.factory.gpu.createComputePipeline(lPipelineDescriptor); // TODO: Async create compute pipeline somehow.
    }
}