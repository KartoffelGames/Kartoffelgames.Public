import { TypedArray } from '@kartoffelgames/core.data';
import { IBuffer } from '../buffer/i-buffer.interface';
import { IGpuObject } from '../gpu/i-gpu-object.interface';
import { ITextureSampler } from '../texture/i-texture-sampler.interface';
import { IFrameBufferTexture } from '../texture/i-frame-buffer-texture.interface';
import { IVideoTexture } from '../texture/i-video-texture.interface';
import { IImageTexture } from '../texture/i-image-texture.interface';
import { IBindGroupLayout } from './i-bind-group-layout.interface';

export interface IBindGroup extends IGpuObject {
    /**
     * Bind group layout.
     */
    bindGroupLayout: IBindGroupLayout

    /**
     * Add data to bind.
     * @param pName - Bind name.
     * @param pData - Bind data.
     */
    setData(pName: string, pData: BindData): void;
}

type BindData = IBuffer<TypedArray> | IFrameBufferTexture | ITextureSampler | IVideoTexture | IImageTexture;