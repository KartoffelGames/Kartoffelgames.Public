import { Exception } from '@kartoffelgames/core';
import { GpuDevice } from '../../gpu/gpu-device';
import { BaseBufferMemoryLayout, BufferLayoutLocation, BufferMemoryLayoutParameter } from './base-buffer-memory-layout';

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
     * Type size in byte.
     */
    public get fixedSize(): number {
        if (this.arraySize < 1) {
            return 0;
        }

        return this.arraySize * (Math.ceil(this.innerType.fixedSize / this.innerType.alignment) * this.innerType.alignment);
    }

    /**
     * Array type.
     */
    public get innerType(): BaseBufferMemoryLayout {
        return this.mInnerType;
    }

    /**
     * Size of the variable part of layout in bytes.
     */
    public get variableSize(): number {
        if (this.arraySize > 0) {
            return 0;
        }

        return (Math.ceil(this.innerType.fixedSize / this.innerType.alignment) * this.innerType.alignment);
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

        if (this.mInnerType.variableSize > 0) {
            throw new Exception(`Array memory layout must be of fixed size.`, this);
        }
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
            if (this.variableSize > 0) {
                throw new Exception('No size can be calculated for dynamic array buffer locations.', this);
            }

            return { size: this.fixedSize, offset: 0 };
        }

        // Validate item index.
        if (isNaN(<any>lItemIndexString)) {
            throw new Exception('Array index must be a number.', this);
        }

        // Calculate size of single item.
        const lArrayItemSize: number = Math.ceil(this.innerType.fixedSize / this.innerType.alignment) * this.innerType.alignment;
        const lArrayItemOffset: number = parseInt(lItemIndexString) * lArrayItemSize;

        // Single item.
        if (lPathName.length === 0) {
            return { size: lArrayItemSize, offset: lArrayItemOffset };
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