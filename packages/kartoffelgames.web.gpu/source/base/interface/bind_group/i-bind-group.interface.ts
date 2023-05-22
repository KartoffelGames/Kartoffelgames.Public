import { TypedArray } from '@kartoffelgames/core.data';
import { IBuffer } from '../buffer/i-buffer.interface';

export interface IBindGroup {
    /**
     * Add data to bind.
     * @param pName - Bind name.
     * @param pData - Bind data.
     */
    setData(pName: string, pData: BindData): void;
}

type BindData = IBuffer<TypedArray>