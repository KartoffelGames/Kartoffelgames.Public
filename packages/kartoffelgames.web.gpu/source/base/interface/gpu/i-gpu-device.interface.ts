import { TypedArray } from '@kartoffelgames/core.data';
import { BufferUsage } from '../../constant/buffer-usage.enum';
import { IBufferLayout } from '../buffer/i-buffer-layout.interface';
import { IBuffer } from '../buffer/i-buffer.interface';

export interface IGpuDevice {
    /**
     * Create buffer.
     * @param pLayout - Buffer layout.
     * @param pUsage - Buffer usage.
     * @param pInitialData - Initial data. Defines buffer length.
     */
    createBuffer<T extends TypedArray>(pLayout: IBufferLayout, pUsage: BufferUsage, pInitialData: T): IBuffer<T>;
}