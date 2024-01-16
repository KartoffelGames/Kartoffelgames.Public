import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/gpu-object';
import { UpdateReason } from '../gpu/gpu-object-update-reason';
import { ComputeShader } from '../shader/compute-shader';

export class ComputePipeline extends GpuObject<'computePipeline'> {
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
        super(pDevice);
        this.mShader = pShader;

        // Listen for shader changes.
        pShader.addUpdateListener(() => {
            this.triggerAutoUpdate(UpdateReason.ChildData);
        });
    }
}