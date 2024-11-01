import { Exception, TypedArray } from '@kartoffelgames/core';
import { BaseBufferMemoryLayout } from '../memory_layout/buffer/base-buffer-memory-layout';
import { GpuBuffer } from './gpu-buffer';
import { StorageBindingType } from '../constant/storage-binding-type.enum';
import { GpuLimit } from '../gpu/capabilities/gpu-limit.enum';

/**
 * Create a view to look at a gpu buffer.
 */
export class GpuBufferView<T extends TypedArray> {
    private readonly mBuffer: GpuBuffer;
    private readonly mDynamicOffset: number;
    private readonly mLayout: BaseBufferMemoryLayout;
    private readonly mTypedArrayConstructor: GpuBufferViewFormat<T>;

    /**
     * Get underlying buffer of view.
     */
    public get buffer(): GpuBuffer {
        return this.mBuffer;
    }

    /**
     * Index of dynamic offset.
     */
    public get dynamicOffsetIndex(): number {
        return this.mDynamicOffset / this.mLayout.fixedSize;
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
     * @param pDynamicOffsetIndex - Index of dynamic offset.
     */
    public constructor(pBuffer: GpuBuffer, pLayout: BaseBufferMemoryLayout, pType: GpuBufferViewFormat<T>, pDynamicOffsetIndex: number = 0, pStorageType: StorageBindingType = StorageBindingType.None) {
        // Layout must fit into buffer.
        if (pLayout.fixedSize > pBuffer.size) {
            throw new Exception(`Buffer view fixed size (${pLayout.fixedSize}) exceedes buffer size (${pBuffer.size}). Buffer must at least be the layouts fixed size.`, this);
        }

        // Default dynamic offset.
        this.mDynamicOffset = 0;

        // Calculate and validate dynamic offset.
        if (pDynamicOffsetIndex > 0) {
            // Dynamic offsets can only be applied to fixed buffer layouts.
            if (pLayout.variableSize > 0) {
                throw new Exception('Dynamic offsets can only be applied to fixed buffer layouts.', this);
            }

            // Read correct alignment limitations for storage type.
            const lOffsetAlignment: number = (() => {
                if (pStorageType === StorageBindingType.None) {
                    return pBuffer.device.capabilities.getLimit(GpuLimit.MinUniformBufferOffsetAlignment);
                } else {
                    return pBuffer.device.capabilities.getLimit(GpuLimit.MinStorageBufferOffsetAlignment);
                }
            })();

            // Apply offset alignment to byte size.
            const lMinBufferSize: number = (Math.ceil(pLayout.fixedSize / lOffsetAlignment) * lOffsetAlignment) * (pDynamicOffsetIndex + 1);
            if (pBuffer.size < lMinBufferSize) {
                throw new Exception(`Buffer view offset size (${lMinBufferSize}) exceedes buffer size ${pBuffer.size}.`, this);
            }

            this.mDynamicOffset = (Math.ceil(pLayout.fixedSize / lOffsetAlignment) * lOffsetAlignment) * pDynamicOffsetIndex;
        }

        this.mLayout = pLayout;
        this.mBuffer = pBuffer;
        this.mTypedArrayConstructor = pType;

    }

    /**
     * Read buffer on layout location.
     * 
     * @param pLayoutPath - Layout path. 
     */
    public async read(pLayoutPath: Array<string> = []): Promise<TypedArray> {
        const lLocation = this.mLayout.locationOf(pLayoutPath);

        return new this.mTypedArrayConstructor(await this.mBuffer.read(this.mDynamicOffset + lLocation.offset, lLocation.size));
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
        return this.mBuffer.write(lDataBuffer.buffer, this.mDynamicOffset + lLocation.offset);
    }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export type GpuBufferViewFormat<T extends TypedArray> = (new (pArrayLike: ArrayLike<number> | ArrayBufferLike) => T) & { BYTES_PER_ELEMENT: number; };