import { Gpu } from '../../gpu';
import { GpuNativeObject } from '../../gpu-native-object';
import { ITexture } from '../../resource/texture/i-texture.interface';
import { AttachmentType } from '../attachment-type.enum';

export abstract class BaseAttachment<TAttachment extends GPURenderPassColorAttachment | GPURenderPassDepthStencilAttachment> extends GpuNativeObject<TAttachment>{
    private readonly mAttachment: AttachmentDefinition;
    private mOldTextureId: string;

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
        super(pGpu, 'ATTACHMENT');
        this.mAttachment = pAttachment;
        this.mOldTextureId = '';
    }

    /**
     * Validate native object. Refresh native on negative state.
     */
    protected override async validateState(): Promise<boolean> {
        // Problem can not be solved with native object change listener,
        // as attachment.frame is not readonly and can be replaced with other textures when needed.
        // So checking for changes with the nativeId is the fastes way, without generating the native texture.

        // Validate for new generated texture.
        if (await this.mAttachment.frame.nativeId() !== this.mOldTextureId) {
            this.mOldTextureId = await this.mAttachment.frame.nativeId();
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
    baseArrayLayer: number;
};