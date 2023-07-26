import { SamplerMemoryLayout, SamplerMemoryLayoutParameter } from '../../../base/memory_layout/sampler-memory-layout';
import { WebGpuTextureSampler } from '../texture/web-gpu-texture-sampler';
import { WebGpuDevice, WebGpuTypes } from '../web-gpu-device';

export class WebGpuSamplerMemoryLayout extends SamplerMemoryLayout<WebGpuTypes> {
    /**
     * Constructor.
     * @param pDevice - Device reference..
     * @param pParameter - Creation parameter.
     */
    public constructor(pDevice: WebGpuDevice, pParameter: SamplerMemoryLayoutParameter) {
        super(pDevice, pParameter);
    }

    /**
     * Create texture sampler from layout.
     */
    public override createTextureSampler(): WebGpuTextureSampler {
        return new WebGpuTextureSampler(this.device, this);
    }
}