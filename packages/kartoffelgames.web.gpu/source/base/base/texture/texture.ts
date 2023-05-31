import { TextureFormat } from '../../constant/texture-format.enum';
import { ITexture } from '../../interface/texture/i-texture.interface';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/gpu-object';

export abstract class Texture<TGpu extends GpuDevice, TNative extends object> extends GpuObject<TGpu, TNative> implements ITexture {
    private readonly mDepth: number;
    private readonly mFormat: TextureFormat;
    private mHeight: number;
    private mMultiSampleLevel: number;
    private mWidth: number;

    /**
     * Texture depth.
     */
    public get depth(): number {
        return this.mDepth;
    }

    /**
     * Texture format.
     */
    public get format(): TextureFormat {
        return this.mFormat;
    }

    /**
     * Texture height.
     */
    public get height(): number {
        return this.mHeight;
    } set height(pValue: number) {
        this.mHeight = pValue;

        // Trigger auto update.
        this.triggerAutoUpdate();
    }

    /**
     * Texture multi sample level.
     */
    public get multiSampleLevel(): number {
        return this.mMultiSampleLevel;
    } set multiSampleLevel(pValue: number) {
        this.mMultiSampleLevel = pValue;

        // Trigger auto update.
        this.triggerAutoUpdate();
    }

    /**
     * Texture width.
     */
    public get width(): number {
        return this.mWidth;
    } set width(pValue: number) {
        this.mWidth = pValue;

        // Trigger auto update.
        this.triggerAutoUpdate();
    }

    /**
     * 
     * @param pGpu - Device.
     * @param pFormat - Texture format.
     * @param pDepth - Texture depth.
     */
    public constructor(pGpu: TGpu, pFormat: TextureFormat, pDepth: number = 1) {
        super(pGpu);

        // Fixed values.
        this.mDepth = pDepth;
        this.mFormat = pFormat;

        // Set defaults.
        this.mHeight = 1;
        this.mWidth = 1;
        this.mMultiSampleLevel = 1;
    }
}