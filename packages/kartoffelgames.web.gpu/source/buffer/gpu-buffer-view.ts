import { TypedArray } from '@kartoffelgames/core';
import { BaseBufferMemoryLayout } from '../memory_layout/buffer/base-buffer-memory-layout';
import { GpuBuffer } from './gpu-buffer';

/**
 * Create a view to look at a gpu buffer.
 */
export class GpuBufferView<T extends TypedArray> {
    private readonly mBuffer: GpuBuffer;
    private readonly mLayout: BaseBufferMemoryLayout;
    private readonly mTypedArrayConstructor: GpuBufferViewFormat<T>;

    /**
     * Get underlying buffer of view.
     */
    public get buffer(): GpuBuffer {
        return this.mBuffer;
    }

    /**
     * Buffer view format.
     */
    public get format(): GpuBufferViewFormat<T> {
        return this.mTypedArrayConstructor;
    }

    /**
     * Length of buffer view based on view type.
     */
    public get length(): number {
        return this.mBuffer.size / this.mTypedArrayConstructor.BYTES_PER_ELEMENT;
    }

    /**
     * Constructor.
     * 
     * @param pBuffer - Views buffer. 
     * @param pLayout - Layout of view.
     */
    public constructor(pBuffer: GpuBuffer, pLayout: BaseBufferMemoryLayout, pType: GpuBufferViewFormat<T>) { // TODO: Define type with Enum and set data with dataview loops.
        this.mLayout = pLayout;
        this.mBuffer = pBuffer;
        this.mTypedArrayConstructor = pType;

        // TODO: Only on fixed layouts: Check how often the layout fits into the buffer and safe the calculated available offsets.
        // TODO: Add offset counts to read and write.
    }

    /**
     * Read buffer on layout location.
     * 
     * @param pLayoutPath - Layout path. 
     */
    public async read(pLayoutPath: Array<string> = []): Promise<TypedArray> {
        const lLocation = this.mLayout.locationOf(pLayoutPath);

        return new this.mTypedArrayConstructor(await this.mBuffer.read(lLocation.offset, lLocation.size));
    }

    /**
     * Write data on layout location.
     * 
     * @param pData - Data.
     * @param pLayoutPath - Layout path.
     */
    public async write(pData: ArrayLike<number>, pLayoutPath: Array<string> = []): Promise<void> {
        const lLocation = this.mLayout.locationOf(pLayoutPath);

        // Add data into a data buffer.
        const lDataBuffer: TypedArray = new this.mTypedArrayConstructor(pData);

        // Skip new promise creation by returning original promise.
        return this.mBuffer.write(lDataBuffer.buffer, lLocation.offset);
    }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export type GpuBufferViewFormat<T extends TypedArray> = (new (pArrayLike: ArrayLike<number> | ArrayBufferLike) => T) & { BYTES_PER_ELEMENT: number; };