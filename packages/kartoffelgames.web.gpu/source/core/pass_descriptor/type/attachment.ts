import { Exception } from '@kartoffelgames/core.data';
import { Gpu } from '../../gpu';
import { GpuNativeObject } from '../../gpu-native-object';
import { ITexture } from '../../resource/texture/i-texture.interface';

export class Attachment extends GpuNativeObject<GPUTextureView>{
    private mBaseArrayLayer: number;
    private readonly mFormat: GPUTextureFormat;
    private readonly mLayers: GPUIntegerCoordinate;
    private mTexture: ITexture | null;

    /**
     * Get texture format.
     */
    public get format(): GPUTextureFormat {
        return this.mFormat;
    }

    /**
     * constructor.
     * @param pAttachment - Attachment.
     */
    public constructor(pGpu: Gpu, pFormat: GPUTextureFormat, pLayers: number) {
        super(pGpu, 'ATTACHMENT');
        this.mFormat = pFormat;
        this.mLayers = pLayers;

        // Set default.
        this.mTexture = null;
        this.mBaseArrayLayer = 0;
    }

    public updateTexture(pTexture: ITexture, pBaseArrayLayer: number): void {
        // Remove old and add new texture as internal native.
        if (this.mTexture) {
            this.unregisterInternalNative(this.mTexture);
        }
        this.registerInternalNative(pTexture);

        // Set new texture informations.
        this.mBaseArrayLayer = pBaseArrayLayer;
        this.mTexture = pTexture;
    }

    /**
     * Generate color attachment.
     */
    protected async generate(): Promise<GPUTextureView> {
        // Validate texture.
        if (!this.mTexture) {
            throw new Exception(`Attachment "${this.label}" has no texture.`, this);
        }

        const lTexture: GPUTexture = await this.mTexture.native();

        // Generate view.
        const lView: GPUTextureView = lTexture.createView({
            label: 'Texture-View' + this.mTexture.label,
            dimension: '2d',
            baseArrayLayer: this.mBaseArrayLayer,
            arrayLayerCount: this.mLayers,
        });

        return lView;
    }
}

export type AttachmentDefinition = {
    frame: ITexture;
    format: GPUTextureFormat;
    layers: GPUIntegerCoordinate;
    baseArrayLayer: number;
};