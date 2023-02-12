import { Exception, TypedArray } from '@kartoffelgames/core.data';
import { Gpu } from '../gpu';

export abstract class BaseBuffer<T extends TypedArray> {
    private readonly mBuffer: GPUBuffer;
    private readonly mBufferItemCount: number;
    private readonly mDataType: BufferDataType<T>;
    private readonly mGpu: Gpu;

    public get buffer(): GPUBuffer {
        return this.mBuffer;
    }

    /**
     * GPU.
     */
    public get gpu(): Gpu {
        return this.mGpu;
    }

    /**
     * Buffer size in items.
     */
    public get itemCount(): number {
        return this.mBufferItemCount;
    }

    /**
     * Buffer size in bytes aligned to 4 bytes.
     */
    public get size(): number {
        return ((this.mBufferItemCount * this.type.BYTES_PER_ELEMENT) + 3) & ~3;
    }

    /**
     * Underlying data type.
     */
    public get type(): BufferDataType<T> {
        return this.mDataType;
    }

    /**
     * Constructor.
     * @param pGpu - GPU.
     * @param pUsage - Buffer usage beside COPY_DST.
     * @param pItemCount - Buffer size.
     * @param pInitialData  - Inital data. Can be empty.
     */
    public constructor(pGpu: Gpu, pUsage: GPUFlagsConstant, pItemCount: number, pData: T) {
        this.mGpu = pGpu;
        this.mBufferItemCount = pItemCount;
        this.mDataType = <BufferDataType<T>>pData.constructor;

        // Create buffer.
        this.mBuffer = pGpu.device.createBuffer({
            size: this.size,
            usage: pUsage | GPUBufferUsage.COPY_DST,
            mappedAtCreation: pData.length > 0 // Map data when buffer would receive initial data.
        });

        // Copy only when data is available.
        if (pData.length > 0) {
            if (pData.length > this.size) {
                throw new Exception('Buffer data exeedes buffer size.', this);
            }

            const lData = new this.mDataType(this.mBuffer.getMappedRange())
            lData.set(pData, 0);
            console.log(lData);

            // unmap buffer.
            this.mBuffer.unmap();
        }
    }

    /**
     * Request buffer write.
     * @param pBufferCallback - Callback called on buffer access.
     */
    public abstract write(pBufferCallback: (pBuffer: T) => Promise<void>): Promise<void>;
}

export type BufferDataType<T extends TypedArray> = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    BYTES_PER_ELEMENT: number;
    new(pArrayBuffer: ArrayBuffer): T;
};