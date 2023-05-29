import { TypedArray } from '@kartoffelgames/core.data';
import { BufferLayout } from './buffer/buffer_layout/buffer-layout';
import { Base } from '../base/export.';
import { BufferUsage } from '../constant/buffer-usage.enum';
import { IBuffer } from '../interface/buffer/i-buffer.interface';
import { Buffer } from './buffer/buffer';
import { WebGpuDevice } from '../../abstraction_layer/webgpu/web-gpu-device';

export class GpuDevice extends Base.GpuDevice {
    private readonly mNative: WebGpuDevice;

    /**
     * Native web gpu device.
     */
    public get native(): WebGpuDevice {
        return this.mNative;
    }

    /**
     * //TODO: Something.
     * @param pDevice ---
     */
    public constructor(pDevice: WebGpuDevice) {
        super();

        this.mNative = pDevice;
    }

    /**
     * Create buffer.
     * @param pLayout - Buffer layout.
     * @param pUsage - Buffer usage.
     * @param pInitialData - Initial data. Defines buffer length.
     */
    public createBuffer<T extends TypedArray>(pLayout: BufferLayout, pUsage: BufferUsage, pInitialData: T): IBuffer<T> {
        return new Buffer<T>(this, pLayout, pUsage, pInitialData);
    }
}
