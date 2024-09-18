import { Exception } from '@kartoffelgames/core';
import { PrimitiveBufferFormat } from '../../memory_layout/buffer/enum/primitive-buffer-format.enum';
import { PrimitiveBufferMultiplier } from '../../memory_layout/buffer/enum/primitive-buffer-multiplier.enum';
import { VertexParameterLayoutDefinition } from '../../pipeline/parameter/vertex-parameter-layout';
import { ShaderSetupReference } from '../shader';

export class ShaderFragmentEntryPointSetup {
    private readonly mSetupReference: ShaderSetupReference;
    private readonly mVertexParameterCallback: RenderTargetCallback;

    /**
     * Constructor.
     * 
     * @param pSetupReference - Setup references.
     * @param pVertexParameterCallback - Vertex parameter update callback.
     */
    public constructor(pSetupReference: ShaderSetupReference, pVertexParameterCallback: RenderTargetCallback) {
        this.mSetupReference = pSetupReference;
        this.mVertexParameterCallback = pVertexParameterCallback;
    }

    /**
     * Setup vertex parameter.
     */
    public addParameter(pName: string, pLocationIndex: number, pDataFormat: PrimitiveBufferFormat, pDataMultiplier: PrimitiveBufferMultiplier): this {
        // Lock setup to a setup call.
        if (!this.mSetupReference.inSetup) {
            throw new Exception('Can only setup vertex shader entry point in a setup call.', this);
        }

        const lVertexParameter: VertexParameterLayoutDefinition = {
            name: pName,
            location: pLocationIndex,
            format: pDataFormat,
            multiplier: pDataMultiplier
        };

        // Callback size.
        this.mVertexParameterCallback(lVertexParameter);

        return this;
    }
}

type RenderTargetCallback = (pVertexParameter: VertexParameterLayoutDefinition) => void;