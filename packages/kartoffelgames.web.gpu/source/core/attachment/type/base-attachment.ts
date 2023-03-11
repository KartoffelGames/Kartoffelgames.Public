import { Gpu } from '../../gpu';
import { GpuNativeObject } from '../../gpu-native-object';
import { ITexture } from '../../resource/texture/i-texture.interface';
import { AttachmentType } from '../attachment-type.enum';

export abstract class BaseAttachment<TAttachment extends GPURenderPassColorAttachment | GPURenderPassDepthStencilAttachment> extends GpuNativeObject<TAttachment>{
    private readonly mAttachment: AttachmentDefinition;
    private mOldTexture: GPUTexture | null;

    /**
     * Get texture format.
     */
    public get format(): GPUTextureFormat {
        return this.mAttachment.format;
    }

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
    protected override async validateState(): Promise<boolean> {
        // Validate for new generated texture.
        const lTexture: GPUTexture = await this.mAttachment.frame.native();
        if (lTexture !== this.mOldTexture) {
            this.mOldTexture = lTexture;
            return false;
        }

        return true;
    }
}

export type AttachmentDefinition = {
    type: AttachmentType,
    frame: ITexture;
    name: string,
    clearValue: GPUColor;
    loadOp: GPULoadOp;
    storeOp: GPUStoreOp;
    format: GPUTextureFormat;
    layers: GPUIntegerCoordinate;
    dimension: GPUTextureViewDimension;
    baseArrayLayer: number;
};