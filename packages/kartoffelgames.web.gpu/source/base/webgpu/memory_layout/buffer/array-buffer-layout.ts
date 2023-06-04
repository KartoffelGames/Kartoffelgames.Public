import { Exception } from '@kartoffelgames/core.data';
import { AccessMode } from '../../../constant/access-mode.enum';
import { BindType } from '../../../constant/bind-type.enum';
import { ComputeStage } from '../../../constant/compute-stage.enum';
import { MemoryType } from '../../../constant/memory-type.enum';
import { BufferLayoutLocation, IBufferMemoryLayout } from '../../../interface/memory_layout/i-buffer-memory-layout.interface';
import { WgslType } from '../../shader/wgsl_enum/wgsl-type.enum';
import { BufferMemoryLayout } from './buffer-memory-layout';

export class ArrayBufferMemoryLayout extends BufferMemoryLayout implements IBufferMemoryLayout {
    private readonly mArraySize: number;
    private readonly mInnerType: BufferMemoryLayout;

    /**
     * Alignment of type.
     */
    public get alignment(): number {
        return this.mInnerType.alignment;
    }

    /**
     * Array size.
     */
    public get arraySize(): number {
        return this.mArraySize;
    }

    /**
     * Array type.
     */
    public get innerType(): BufferMemoryLayout {
        return this.mInnerType;
    }

    /**
     * Type size in byte.
     */
    public get size(): number {
        if (this.mArraySize === -1) {
            return this.mArraySize;
        }

        return this.mArraySize * (Math.ceil(this.innerType.size / this.innerType.alignment) * this.innerType.alignment);
    }

    /**
     * Constructor.
     * @param pInnerType - Type of array.
     * @param pSize - Optional array size.
     */
    public constructor(pParameter: ArrayBufferMemoryLayoutParameter) {
        super({ ...pParameter, type: WgslType.Array });

        this.mInnerType = pParameter.innerType;
        this.mArraySize = pParameter.size ?? -1;
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

type ArrayBufferMemoryLayoutParameter = {
    // "Interited" from MemoryLayoutParameter.
    access: AccessMode;
    bindType: BindType;
    location: number | null;
    name: string;
    memoryType: MemoryType;
    visibility: ComputeStage;
    parent: BufferMemoryLayout;

    // New
    innerType: BufferMemoryLayout;
    size?: number;
};