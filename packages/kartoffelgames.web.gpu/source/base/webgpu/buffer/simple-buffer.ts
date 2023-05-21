import { TypedArray } from '@kartoffelgames/core.data';
import { WebGpuBuffer } from '../../../abstraction_layer/webgpu/buffer/web-gpu-buffer';
import { WebGpuDevice } from '../../../abstraction_layer/webgpu/web-gpu-device';
import { IBuffer } from '../../interface/buffer/i-buffer.interface';
import { IBufferLayout } from '../../interface/buffer/i-buffer-layout.interface';
import { BufferLayout } from './buffer_layout/buffer-layout';

export class SimpleBuffer<T extends TypedArray> extends WebGpuBuffer<T> implements IBuffer<T>  {
    private readonly mLayout: BufferLayout;

    /**
     * Buffer layout.
     */
    public get layout(): IBufferLayout {
        return this.mLayout;
    }

    /**
     * Constructor.
     * @param pGpu - GPU.
     * @param pLayout - Buffer layout.
     * @param pUsage - Buffer usage beside COPY_DST.
     * @param pInitialData  - Inital data. Can be empty.
     */
    public constructor(pGpu: WebGpuDevice, pLayout: BufferLayout, pUsage: GPUFlagsConstant, pInitialData: T) {
        super(pGpu, pUsage | GPUBufferUsage.COPY_DST, pInitialData);
        this.mLayout = pLayout;
    }


    read(pLayoutPath: string): Promise<T> {
        // TODO:
        // Offset.
        // Size.

        throw new Error('Method not implemented.');
    }

    /**
     * Read data raw without layout.
     * @param pOffset - Data offset.
     * @param pSize - Data size.
     */
    public async readRaw(pOffset?: number, pSize?: number): Promise<T> {
        return this.readData(pOffset, pSize);
    }

    write(pData: T, pLayoutPath: string): Promise<T> {
        throw new Error('Method not implemented.');
    }

    /**
     * Write data raw without layout.
     * @param pData - Data.
     * @param pOffset - Data offset.
     * @param pSize - Data size.
     */
    public async writeRaw(pData: T, pOffset?: number, pSize?: number): Promise<void> {
        // Data write is synchron.
        this.writeData((pBuffer: T) => {
            pBuffer.set(pData);
        }, pOffset, pSize);
    }

}