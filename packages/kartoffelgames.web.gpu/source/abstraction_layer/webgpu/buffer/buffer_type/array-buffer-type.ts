import { WgslAccessMode } from '../../shader/enum/wgsl-access-mode.enum';
import { WgslBindingType } from '../../shader/enum/wgsl-binding-type.enum';
import { WgslType } from '../../shader/enum/wgsl-type.enum';
import { BufferType } from './buffer-type';

export class ArrayBufferType extends BufferType {
    private readonly mArraySize: number;
    private readonly mInnerType: BufferType;

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
    public get innerType(): BufferType {
        return this.mInnerType;
    }

    /**
     * Type size in byte.
     */
    public get size(): number {
        if (this.mArraySize === -1) {
            return this.mArraySize;
        }

        return this.mInnerType.size * this.mArraySize;
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
    public constructor(pName: string, pInnerType: BufferType, pSize?: number, pAccessMode?: WgslAccessMode, pBindType?: WgslBindingType, pLocation: number | null = null) {
        super(pName, pAccessMode, pBindType, pLocation);

        this.mInnerType = pInnerType;
        this.mInnerType.parent = this;
        
        this.mArraySize = pSize ?? -1;
    }
}