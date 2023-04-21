import { Shader } from '../shader/shader';

export interface IPipeline {
    /**
     * Get pipeline shader.
     */
    readonly shader: Shader;
}