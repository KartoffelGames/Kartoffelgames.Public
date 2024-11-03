import { CompareFunction } from '../../constant/compare-function.enum';
import { StencilOperation } from '../../constant/stencil-operation.enum';
import { VertexFragmentPipelineStencilConfigurationData } from './vertex-fragment-pipeline';

/**
 * Configuration object for pipeline stencil target. 
 */
export class VertexFragmentPipelineStencilConfiguration {
    private readonly mCallback: VertexFragmentPipelineStencilConfigurationCallback;
    private readonly mDataReference: VertexFragmentPipelineStencilConfigurationData;

    /**
     * Constructor.
     * 
     * @param pCallback - Data callback.
     */
    public constructor(pDataReference: VertexFragmentPipelineStencilConfigurationData, pCallback: VertexFragmentPipelineStencilConfigurationCallback) {
        this.mCallback = pCallback;
        this.mDataReference = pDataReference;
    }

    /**
     * Back operations.
     * 
     * @param pCompare - Compare function.
     * @param pFailOperation - Operation on compare fail.
     * @param pPassOperation  - Operation on compare pass.
     * @param pDepthFailOperation  - Operation on depth compare fail.
     * 
     * @returns this. 
     */
    public back(pCompare: CompareFunction, pFailOperation?: StencilOperation, pPassOperation?: StencilOperation, pDepthFailOperation?: StencilOperation): this {
        // Set data.
        this.mDataReference.stencilBack.compare = pCompare;

        // Optionals.
        if (pFailOperation) {
            this.mDataReference.stencilBack.failOperation = pFailOperation;
        }
        if (pPassOperation) {
            this.mDataReference.stencilBack.passOperation = pPassOperation;
        }
        if (pDepthFailOperation) {
            this.mDataReference.stencilBack.depthFailOperation = pDepthFailOperation;
        }

        // Callback change.
        this.mCallback();

        return this;
    }

    /**
     * Front operations.
     * 
     * @param pCompare - Compare function.
     * @param pFailOperation - Operation on compare fail.
     * @param pPassOperation  - Operation on compare pass.
     * @param pDepthFailOperation  - Operation on depth compare fail.
     * 
     * @returns this. 
     */
    public front(pCompare: CompareFunction, pFailOperation?: StencilOperation, pPassOperation?: StencilOperation, pDepthFailOperation?: StencilOperation): this {
        // Set data.
        this.mDataReference.stencilFront.compare = pCompare;

        // Optionals.
        if (pFailOperation) {
            this.mDataReference.stencilFront.failOperation = pFailOperation;
        }
        if (pPassOperation) {
            this.mDataReference.stencilFront.passOperation = pPassOperation;
        }
        if (pDepthFailOperation) {
            this.mDataReference.stencilFront.depthFailOperation = pDepthFailOperation;
        }

        // Callback change.
        this.mCallback();

        return this;
    }

    /**
     * Set writemask witch bit will be read for comparison tests.
     * 
     * @param pBitMask - Bitmask.
     * 
     * @returns this. 
     */
    public readMask(pBitMask: number): this {
        // Set data.
        this.mDataReference.stencilReadMask = pBitMask;

        // Callback change.
        this.mCallback();

        return this;
    }

    /**
     * Set writemask witch bit will be written for comparison tests.
     * 
     * @param pBitMask - Bitmask.
     * 
     * @returns this. 
     */
    public writeMask(pBitMask: number): this {
        // Set data.
        this.mDataReference.stencilWriteMask = pBitMask;

        // Callback change.
        this.mCallback();

        return this;
    }

}

export type VertexFragmentPipelineStencilConfigurationCallback = () => void;

