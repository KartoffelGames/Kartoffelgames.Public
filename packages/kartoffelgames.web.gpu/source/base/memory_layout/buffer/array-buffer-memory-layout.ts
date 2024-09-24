import { Exception } from '@kartoffelgames/core';
import { BaseBufferMemoryLayout, BufferLayoutLocation, BufferMemoryLayoutParameter } from './base-buffer-memory-layout';
import { GpuDevice } from '../../gpu/gpu-device';

export class ArrayBufferMemoryLayout extends BaseBufferMemoryLayout {
    private readonly mArraySize: number;
    private readonly mInnerType: BaseBufferMemoryLayout;

    /**
     * Alignment of type.
     */
    public get alignment(): number {
        return this.innerType.alignment;
    }

    /**
     * Array item count.
     */
    public get arraySize(): number {
        return this.mArraySize;
    }

    /**
     * Array type.
     */
    public get innerType(): BaseBufferMemoryLayout {
        return this.mInnerType;
    }

    /**
     * Type size in byte.
     */
    public get size(): number {
        if (this.arraySize === -1) {
            return -1;
        }

        return this.arraySize * (Math.ceil(this.innerType.size / this.innerType.alignment) * this.innerType.alignment);
    }

    /**
     * Constructor.
     * 
     * @param pDevice - Device reference.
     * @param pParameter - Parameter.
     */
    public constructor(pDevice: GpuDevice, pParameter: ArrayBufferMemoryLayoutParameter) {
        super(pDevice, pParameter);

        // Static properties.
        this.mArraySize = pParameter.arraySize;
        this.mInnerType = pParameter.innerType;
    }

    /**
     * Get location of path.
     * @param pPathName - Path name. Divided by dots.
     */
    public override locationOf(pPathName: Array<string>): BufferLayoutLocation {
        const lPathName: Array<string> = [...pPathName];

        // Complete array.
        const lItemIndexString: string | undefined = lPathName.shift();
        if (!lItemIndexString) {
            // Only valid for ststic arrays.
            if (this.mArraySize < 0) {
                throw new Exception('No size can be calculated for dynamic array buffer locations.', this);
            }

            return { size: this.size, offset: 0 };
        }

        // Validate item index.
        if (isNaN(<any>lItemIndexString)) {
            throw new Exception('Array index must be a number.', this);
        }

        // Calculate size of single item.s
        const lArrayItemSize: number = Math.ceil(this.innerType.size / this.innerType.alignment) * this.innerType.alignment;
        const lArrayItemOffset: number = parseInt(lItemIndexString) * lArrayItemSize;

        // Single item.
        if (lPathName.length === 0) {
            return { size: lArrayItemSize, offset: lArrayItemSize * lArrayItemOffset };
        }

        // Inner property.
        const lInnerLocation = this.innerType.locationOf(lPathName);
        return { size: lInnerLocation.size, offset: lArrayItemOffset + lInnerLocation.offset };
    }
}

export interface ArrayBufferMemoryLayoutParameter extends BufferMemoryLayoutParameter {
    arraySize: number;
    innerType: BaseBufferMemoryLayout;
}