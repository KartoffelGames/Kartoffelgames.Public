import type { CompareFunction } from '../../constant/compare-function.enum.ts';
import type { VertexFragmentPipelineDepthConfigurationData } from './vertex-fragment-pipeline.ts';

/**
 * Configuration object for pipeline depth target. 
 */
export class VertexFragmentPipelineDepthConfiguration {
    private readonly mCallback: VertexFragmentPipelineDepthConfigurationCallback;
    private readonly mDataReference: VertexFragmentPipelineDepthConfigurationData;

    /**
     * Constructor.
     * 
     * @param pCallback - Data callback.
     */
    public constructor(pDataReference: VertexFragmentPipelineDepthConfigurationData, pCallback: VertexFragmentPipelineDepthConfigurationCallback) {
        this.mCallback = pCallback;
        this.mDataReference = pDataReference;
    }

    /**
     * Set constant depth bias added to each fragment
     * 
     * @param pFunction - Constant depth bias added to each fragment
     * 
     * @returns this. 
     */
    public bias(pBias: number): this {
        // Set data.
        this.mDataReference.depthBias = pBias;

        // Callback change.
        this.mCallback();

        return this;
    }

    /**
     * Set the maximum depth bias of a fragment. 
     * 
     * @param pFunction - The maximum depth bias of a fragment.
     * 
     * @returns this. 
     */
    public biasClamp(pBias: number): this {
        // Set data.
        this.mDataReference.depthBiasClamp = pBias;

        // Callback change.
        this.mCallback();

        return this;
    }

    /**
     * Set depth bias that scales with the fragment’s slope
     * 
     * @param pFunction - Depth bias that scales with the fragment’s slope
     * 
     * @returns this. 
     */
    public biasSlopeScale(pBias: number): this {
        // Set data.
        this.mDataReference.depthBiasSlopeScale = pBias;

        // Callback change.
        this.mCallback();

        return this;
    }

    /**
     * Set the depth compare function.
     * 
     * @param pFunction - Compare function
     * 
     * @returns this. 
     */
    public compareWith(pFunction: CompareFunction): this {
        // Set data.
        this.mDataReference.depthCompare = pFunction;

        // Callback change.
        this.mCallback();

        return this;
    }

    /**
     * Enable depth write.
     * 
     * @param pEnable - Enable state of depth write.
     * 
     * @returns this. 
     */
    public enableWrite(pEnable: boolean): this {
        // Set data.
        this.mDataReference.depthWriteEnabled = pEnable;

        // Callback change.
        this.mCallback();

        return this;
    }
}

export type VertexFragmentPipelineDepthConfigurationCallback = () => void;

