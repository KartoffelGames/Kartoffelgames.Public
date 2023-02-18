import { Gpu } from '../../gpu';
import { GpuNativeObject } from '../../gpu-native-object';
import { Texture } from '../../resource/texture/texture';

export abstract class BaseAttachment<TAttachment extends GPURenderPassColorAttachment | GPURenderPassDepthStencilAttachment> extends GpuNativeObject<TAttachment>{
    private readonly mAttachment: AttachmentDefinition;
    private mOldTexture: GPUTexture | null;

    /**
     * Attachment definition.
     */
    protected get attachment(): AttachmentDefinition {
        return this.mAttachment;
    }

    /**
     * constructor.
     * @param pAttachment - Attachment.
     */
    public constructor(pGpu: Gpu, pAttachment: AttachmentDefinition) {
        super(pGpu);
        this.mAttachment = pAttachment;
        this.mOldTexture = null;
    }

    /**
     * Validate native object. Refresh native on negative state.
     */
    protected override async validateState(): Promise<boolean>{
        // Validate for new generated texture.
        const lTexture: GPUTexture = await this.mAttachment.texture.native();
        if(lTexture !== this.mOldTexture){
            this.mOldTexture = lTexture;
            return false;
        }

        return true;
    }
}

export type AttachmentDefinition = {
    texture: Texture;
    clearValue: GPUColor;
    loadOp: GPULoadOp;
    storeOp: GPUStoreOp;

    format: GPUTextureFormat;
    dimension: GPUTextureViewDimension;
    arrayLayerCount: GPUIntegerCoordinate;
    baseArrayLayer: number,
}

