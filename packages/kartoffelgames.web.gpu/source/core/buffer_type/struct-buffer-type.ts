import { WgslAccessMode } from '../shader/enum/wgsl-access-mode.enum';
import { WgslBindingType } from '../shader/enum/wgsl-binding-type.enum';
import { WgslType } from '../shader/enum/wgsl-type.enum';
import { BufferType } from './buffer-type';

export class StructBufferType extends BufferType {
    private mAlignment: number;
    private readonly mInnerTypes: Array<[number, BufferType]>;
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
        this.mInnerTypes = new Array<[number, BufferType]>();
    }

    /**
     * Add property to struct.
     * @param pName - Property name.
     * @param pOrder - Index of property.
     * @param pType - Property type.
     */
    public addProperty(pOrder: number, pType: BufferType): void {
        this.mInnerTypes.push([pOrder, pType]);

        // Recalculate alignment.
        if (pType.alignment > this.mAlignment) {
            this.mAlignment = pType.alignment;
        }

        // Get ordered types.
        const lOrderedTypeList: Array<BufferType> = this.mInnerTypes.sort(([pOrderA], [pOrderB]) => {
            return pOrderA - pOrderB;
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