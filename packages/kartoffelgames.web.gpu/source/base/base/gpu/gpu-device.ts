import { TypedArray } from '@kartoffelgames/core.data';
import { BufferUsage } from '../../constant/buffer-usage.enum';
import { IBuffer } from '../../interface/buffer/i-buffer.interface';
import { BufferLayout } from '../buffer/buffer-layout';
import { IGpuDevice } from '../../interface/gpu/i-gpu-device.interface';
import { ITextureSampler } from '../../interface/texture/i-texture-sampler.interface';

export abstract class GpuDevice implements IGpuDevice {
    /**
     * Create buffer.
     * @param pLayout - Buffer layout.
     * @param pUsage - Buffer usage.
     * @param pInitialData - Initial data. Defines buffer length.
     */
    public abstract createBuffer<T extends TypedArray>(pLayout: BufferLayout, pUsage: BufferUsage, pInitialData: T): IBuffer<T>;

    /**
     * Create texture sampler.
     */
    public abstract createTextureSampler(): ITextureSampler;
}
