import { AccessMode } from '../../constant/access-mode.enum';
import { BindType } from '../../constant/bind-type.enum';
import { ComputeStage } from '../../constant/compute-stage.enum';
import { MemoryType } from '../../constant/memory-type.enum';
import { TextureDimension } from '../../constant/texture-dimension.enum';
import { TextureFormat } from '../../constant/texture-format.enum';
import { TextureUsage } from '../../constant/texture-usage.enum';
import { IFrameBufferTexture } from '../texture/i-frame-buffer-texture.interface';
import { IImageTexture } from '../texture/i-image-texture.interface';
import { IMemoryLayout } from './i-memory-layout.interface';

export interface ITextureMemoryLayout extends IMemoryLayout {
    /**
     * Texture dimension.
     */
    readonly dimension: TextureDimension;

    /**
     * Texture format.
     */
    readonly format: TextureFormat;

    /**
     * Create frame buffer texture.
     * @param pWidth - Texture width.
     * @param pHeight - Texture height.
     * @param pDepth - Texture depth.
     */
    createFrameBuffer(pWidth: number, pHeight: number, pDepth: number): IFrameBufferTexture;

    /**
     * Create frame buffer texture.
     * @param pCanvas - Canvas html element.
     */
    createFrameBuffer(pCanvas: HTMLCanvasElement): IFrameBufferTexture;

    /**
     * Create texture from images.
     * @param pSourceList - Image source list.
     */
    createImage(...pSourceList: Array<string>): Promise<IImageTexture>;
}

export type TextureMemoryLayoutParameter = {
    // "Interited" from MemoryLayoutParameter.
    access: AccessMode;
    bindType: BindType;
    location: number | null;
    name: string;
    memoryType: MemoryType;
    visibility: ComputeStage;

    // New 
    dimension: TextureDimension;
    format: TextureFormat;
    usage: TextureUsage;
};