import { Buffer as BaseBuffer } from './buffer/buffer';
import { GpuDevice as BaseGpuDevice } from './gpu/gpu-device';
import { BufferLayout as BaseBufferLayout } from './buffer/buffer-layout';

export namespace Base {
    // GPU Base
    export const GpuDevice = BaseGpuDevice;

    // Buffer.
    export const BufferLayout = BaseBufferLayout;
    export const Buffer = BaseBuffer;
}