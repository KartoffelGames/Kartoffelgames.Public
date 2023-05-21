import { WebGpuShader } from '../shader/web-gpu-shader';

export interface IPipeline {
    /**
     * Get pipeline shader.
     */
    readonly shader: WebGpuShader;
}