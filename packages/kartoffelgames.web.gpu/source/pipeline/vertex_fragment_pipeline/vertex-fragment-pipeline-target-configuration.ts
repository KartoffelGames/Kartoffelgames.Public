import { TextureAspect } from '../../constant/texture-aspect.enum.ts';
import { TextureBlendFactor } from '../../constant/texture-blend-factor.enum.ts';
import { TextureBlendOperation } from '../../constant/texture-blend-operation.enum.ts';
import { VertexFragmentPipelineTargetConfigData } from './vertex-fragment-pipeline.ts';

/**
 * Configuration object for piplines target.
 */
export class VertexFragmentPipelineTargetConfiguration {
    private readonly mCallback: VertexFragmentPipelineTargetConfigCallback;
    private readonly mDataReference: VertexFragmentPipelineTargetConfigData;

    /**
     * Constructor.
     * 
     * @param pCallback - Data callback.
     */
    public constructor(pDataReference: VertexFragmentPipelineTargetConfigData, pCallback: VertexFragmentPipelineTargetConfigCallback) {
        this.mCallback = pCallback;
        this.mDataReference = pDataReference;
    }

    /**
     * Set alpha blends.
     * 
     * @param pOperation - Blend operation.
     * @param pSourceFactor - Factor of source value.
     * @param pDestinationFactor - Factor of destination value.
     * 
     * @returns this. 
     */
    public alphaBlend(pOperation: TextureBlendOperation, pSourceFactor: TextureBlendFactor, pDestinationFactor: TextureBlendFactor): this {
        // Set data.
        this.mDataReference.alphaBlend = {
            operation: pOperation,
            sourceFactor: pSourceFactor,
            destinationFactor: pDestinationFactor
        };

        // Callback change.
        this.mCallback();

        return this;
    }

    /**
     * Set color blends.
     * 
     * @param pOperation - Blend operation.
     * @param pSourceFactor - Factor of source value.
     * @param pDestinationFactor - Factor of destination value.
     * 
     * @returns this. 
     */
    public colorBlend(pOperation: TextureBlendOperation, pSourceFactor: TextureBlendFactor, pDestinationFactor: TextureBlendFactor): this {
        // Set data.
        this.mDataReference.colorBlend = {
            operation: pOperation,
            sourceFactor: pSourceFactor,
            destinationFactor: pDestinationFactor
        };

        // Callback change.
        this.mCallback();

        return this;
    }

    /**
     * Set texture aspect writemask.
     * 
     * @param pAspects - Aspect to write into.
     * 
     * @returns this. 
     */
    public writeMask(...pAspects: Array<TextureAspect>): this {
        // Set data.
        this.mDataReference.aspectWriteMask = new Set<TextureAspect>(pAspects);

        // Callback change.
        this.mCallback();

        return this;
    }
}

export type VertexFragmentPipelineTargetConfigCallback = () => void;

