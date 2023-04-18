import { Shader } from '../shader/shader';

export interface IPipeline {
    /**
     * Get pipeline shader.
     */
    readonly shader: Shader;

    /**
     * Set shader.
     * @param pShader - Shader.
     */
    setShader(pShader: Shader): void;
}