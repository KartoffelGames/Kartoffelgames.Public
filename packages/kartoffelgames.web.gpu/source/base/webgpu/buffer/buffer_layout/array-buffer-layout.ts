import { Exception } from '@kartoffelgames/core.data';
import { BufferLayoutLocation, IBufferLayout } from '../../../interface/buffer/i-buffer-layout.interface';
import { WgslAccessMode } from '../../shader/wgsl_enum/wgsl-access-mode.enum';
import { WgslBindingType } from '../../shader/wgsl_enum/wgsl-binding-type.enum';
import { WgslType } from '../../shader/wgsl_enum/wgsl-type.enum';
import { BufferLayout } from './buffer-layout';

export class ArrayBufferLayout extends BufferLayout implements IBufferLayout {
    private readonly mArraySize: number;
    private readonly mInnerType: BufferLayout;

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
    public get innerType(): BufferLayout {
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
     * Wgsl type.
     */
    public get type(): WgslType {
        return WgslType.Array;
    }

    /**
     * Constructor.
     * @param pInnerType - Type of array.
     * @param pSize - Optional array size.
     */
    public constructor(pName: string, pInnerType: BufferLayout, pSize?: number, pAccessMode?: WgslAccessMode, pBindType?: WgslBindingType, pLocation: number | null = null) {
        super(pName, pAccessMode, pBindType, pLocation);

        this.mInnerType = pInnerType;
        this.mInnerType.parent = this;

        this.mArraySize = pSize ?? -1;
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