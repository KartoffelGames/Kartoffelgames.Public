import { TypedArray } from '@kartoffelgames/core.data';
import { IBuffer } from '../buffer/i-buffer.interface';
import { IGpuObject } from '../gpu/i-gpu-object.interface';
import { ITextureSampler } from '../texture/i-texture-sampler.interface';
import { IFrameBufferTexture } from '../texture/i-frame-buffer-texture.interface';

export interface IBindGroup extends IGpuObject {
    /**
     * Add data to bind.
     * @param pName - Bind name.
     * @param pData - Bind data.
     */
    setData(pName: string, pData: BindData): void;
}

type BindData = IBuffer<TypedArray> | IFrameBufferTexture | ITextureSampler;