import { Shader } from '../../../base/shader/shader';
import { WebGpuDevice, WebGpuTypes } from '../web-gpu-device';
import { WebGpuShaderInformation } from './web-gpu-shader-information';


export class WebGpuShader extends Shader<WebGpuTypes, GPUShaderModule>  {
    /**
     * Constructor.
     * @param pDevice - Gpu device reference.
     * @param pSource - Shader source.
     */
    public constructor(pDevice: WebGpuDevice, pSource: string) {
        super(pDevice, new WebGpuShaderInformation(pDevice, pSource));
    }

    /**
     * Destroy native shader object.
     * @param _pNativeObject - Native shader module.
     */
    protected override destroyNative(_pNativeObject: GPUShaderModule): void {
        // Nothing to destroy.
    }

    /***
     * Generate shader module.
     */
    protected generate(): GPUShaderModule {
        return this.device.reference.createShaderModule({ code: this.information.source });
    }
}