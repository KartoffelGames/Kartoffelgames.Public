import { Dictionary } from '@kartoffelgames/core.data';
import { BufferType } from './buffer-type';
import { WgslType } from '../shader/enum/wgsl-type.enum';
import { WgslAccessMode } from '../shader/enum/wgsl-access-mode.enum';
import { WgslBindingType } from '../shader/enum/wgsl-binding-type.enum';

export class StructBufferType extends BufferType {
    private mAlignment: number;
    private readonly mInnerTypes: Dictionary<string, [number, BufferType]>;
    private mSize: number;

    /**
     * Alignment of type.
     */
    public get alignment(): number {
        return this.mAlignment;
    }

    /**
     * Type size in byte.
     */
    public get size(): number {
        return this.mSize;
    }

    /**
     * Wgsl type.
     */
    public get type(): WgslType {
        return WgslType.Struct;
    }

    /**
     * Constructor.
     */
    public constructor(pName: string, pAccessMode?: WgslAccessMode, pBindType?: WgslBindingType, pLocation: number | null = null) {
        super(pName, pAccessMode, pBindType, pLocation);

        this.mAlignment = 0;
        this.mSize = 0;
        this.mInnerTypes = new Dictionary<string, [number, BufferType]>();
    }

    /**
     * Add property to struct.
     * @param pName - Property name.
     * @param pIndex - Index of property.
     * @param pType - Property type.
     */
    public addProperty(pName: string, pIndex: number, pType: BufferType): void {
        this.mInnerTypes.add(pName, [pIndex, pType]);

        // Recalculate alignment.
        if (pType.alignment > this.mAlignment) {
            this.mAlignment = pType.alignment;
        }

        // Get ordered types.
        const lOrderedTypeList: Array<BufferType> = [...this.mInnerTypes.values()].sort(([pIndexA], [pIndexB]) => {
            return pIndexA - pIndexB;
        }).map(([, pType]) => pType);

        // Recalculate size.
        let lCurrentOffset: number = 0;
        for (const lType of lOrderedTypeList) {
            // Increase offset when alignment does not match.
            // When alignment matches the modulo calculation is zero.
            lCurrentOffset += lCurrentOffset % lType.alignment;

            // Increase offset for type.
            lCurrentOffset += lType.size;
        }

        this.mSize = lCurrentOffset;
    }

    /**
     * Get types of properties with set location.
     */
    public innerLocations(): Array<BufferType> {
        const lLocationTypes: Array<BufferType> = new Array<BufferType>();
        for (const [, lPropertyType] of this.mInnerTypes.values()) {
            // Set property as location when set.
            if (lPropertyType.location) {
                lLocationTypes.push(lPropertyType);
            }

            // Get all inner locations when property is a struct type.
            if (lPropertyType instanceof StructBufferType) {
                lLocationTypes.push(...lPropertyType.innerLocations());
            }
        }

        return lLocationTypes;
    }
}