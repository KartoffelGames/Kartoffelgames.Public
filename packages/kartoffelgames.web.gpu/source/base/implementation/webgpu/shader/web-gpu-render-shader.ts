import { RenderShader } from '../../../base/shader/render-shader';
import { WebGpuBindDataGroupLayout } from '../bind_group/web-gpu-bind-data-group-layout';
import { WebGpuPipelineDataLayout } from '../bind_group/web-gpu-pipeline-data-layout';
import { WebGpuParameterLayout } from '../pipeline/parameter/web-gpu-parameter-layout';
import { WebGpuDevice, WebGpuTypes } from '../web-gpu-device';
import { WebGpuShaderInformation } from './web-gpu-shader-information';

export class WebGpuRenderShader extends RenderShader<WebGpuTypes, GPUShaderModule>  {
    /**
     * Constructor.
     * @param pDevice - Gpu device reference.
     * @param pSource - Shader source.
     */
    public constructor(pDevice: WebGpuDevice, pSource: string, pVertexEntry: string, pFragmentEntry?: string) {
        super(pDevice, pSource, pVertexEntry, pFragmentEntry);
    }

    /**
     * Generate empty bind data group layout.
     */
    protected override createEmptyBindDataGroupLayout(): WebGpuBindDataGroupLayout {
        return new WebGpuBindDataGroupLayout(this.device);
    }

    /**
     * Create empty parameter layout.
     */
    protected override createEmptyParameterLayout(): WebGpuParameterLayout {
        return new WebGpuParameterLayout(this.device);
    }

    /**
     * Generate empty pipeline data layout.
     */
    protected override createEmptyPipelineDataLayout(): WebGpuPipelineDataLayout {
        throw new WebGpuPipelineDataLayout(this.device);
    }

    /**
     * Generate shader information.
     * @param pSource - Shader source.
     */
    protected override createShaderInformation(pSource: string): WebGpuShaderInformation {
        return new WebGpuShaderInformation(this.device, pSource);
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