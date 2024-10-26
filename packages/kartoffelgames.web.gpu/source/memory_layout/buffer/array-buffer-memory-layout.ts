import { Exception } from '@kartoffelgames/core';
import { GpuDevice } from '../../gpu/gpu-device';
import { BaseBufferMemoryLayout, BufferLayoutLocation } from './base-buffer-memory-layout';
import { BufferAlignmentType } from '../../constant/buffer-alignment-type.enum';

export class ArrayBufferMemoryLayout extends BaseBufferMemoryLayout {
    private readonly mAlignment: number;
    private readonly mArraySize: number;
    private readonly mInnerType: BaseBufferMemoryLayout;

    /**
     * Type byte alignment.
     */
    public override get alignment(): number {
        return this.mAlignment;
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

        return this.arraySize * Math.ceil(this.innerType.fixedSize / this.innerType.alignment) * this.innerType.alignment;
    }

    /**
     * Array type.
     * Is negative when array is variable sized.
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

        return Math.ceil(this.innerType.fixedSize / this.innerType.alignment) * this.innerType.alignment;
    }

    /**
     * Constructor.
     * 
     * @param pDevice - Device reference.
     * @param pParameter - Parameter.
     */
    public constructor(pDevice: GpuDevice, pParameter: ArrayBufferMemoryLayoutParameter) {
        super(pDevice, pParameter.innerType.alignmentType);

        // Static properties.
        this.mArraySize = pParameter.arraySize;
        this.mInnerType = pParameter.innerType;

        // Change alignment based on alignment type.
        this.mAlignment = (() => {
            switch (pParameter.innerType.alignmentType) {
                case BufferAlignmentType.Packed: {
                    return 1;
                }
                case BufferAlignmentType.Storage: {
                    return pParameter.innerType.alignment;
                }
                case BufferAlignmentType.Uniform: {
                    // For uniforms, arrays buffers are aligned by 16 byte
                    return Math.ceil(pParameter.innerType.alignment / 16) * 16;
                }
            }
        })();

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
            // Only valid for static arrays.
            if (this.variableSize > 0) {
                throw new Exception('Getting the offset and size location for dynamic arrays is not supported.', this);
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

export interface ArrayBufferMemoryLayoutParameter {
    /**
     * Array size. -1 when array is variable sized.
     */
    arraySize: number;
    innerType: BaseBufferMemoryLayout;
}