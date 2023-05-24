import { TypedArray } from '@kartoffelgames/core.data';
import { IBuffer } from '../buffer/i-buffer.interface';
import { ITexture } from '../texture/i-texture.interface';
import { ITextureSampler } from '../texture/i-texture-sampler.interface';

export interface IBindGroup {
    /**
     * Add data to bind.
     * @param pName - Bind name.
     * @param pData - Bind data.
     */
    setData(pName: string, pData: BindData): void;
}

type BindData = IBuffer<TypedArray> | ITexture | ITextureSampler;