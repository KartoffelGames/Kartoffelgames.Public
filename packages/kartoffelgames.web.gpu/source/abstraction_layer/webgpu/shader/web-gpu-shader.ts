import { GpuNativeObject } from '../gpu-native-object';
import { WebGpuDevice } from '../web-gpu-device';

export class WebGpuShader extends GpuNativeObject<GPUShaderModule>{
    private readonly mSource: string;

    /**
     * Constructor.
     * @param pGpu - GPU.
     * @param pSource - Shader module source code.
     */
    public constructor(pGpu: WebGpuDevice, pSource: string) {
        super(pGpu, 'SHADER');
        this.mSource = pSource;
    }

    /***
     * Generate shader module.
     */
    protected generate(): GPUShaderModule {
        return this.gpu.device.createShaderModule({ code: this.mSource });
    }
}
