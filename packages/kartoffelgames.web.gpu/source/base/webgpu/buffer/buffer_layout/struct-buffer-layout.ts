import { Exception } from '@kartoffelgames/core.data';
import { BufferLayoutLocation, IBufferLayout } from '../../../interface/buffer/i-buffer-layout.interface';
import { WgslAccessMode } from '../../shader/wgsl_enum/wgsl-access-mode.enum';
import { WgslBindingType } from '../../shader/wgsl_enum/wgsl-binding-type.enum';
import { WgslType } from '../../shader/wgsl_enum/wgsl-type.enum';
import { BufferLayout } from './buffer-layout';

export class StructBufferLayout extends BufferLayout implements IBufferLayout {
    private mAlignment: number;
    private readonly mInnerTypes: Array<[number, BufferLayout]>;
    private mSize: number;
    private readonly mStructName: string;

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
     * Struct name.
     */
    public get structName(): string {
        return this.mStructName;
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
    public constructor(pName: string, pStructName: string, pAccessMode?: WgslAccessMode, pBindType?: WgslBindingType, pLocation: number | null = null) {
        super(pName, pAccessMode, pBindType, pLocation);

        this.mStructName = pStructName;
        this.mAlignment = 0;
        this.mSize = 0;
        this.mInnerTypes = new Array<[number, BufferLayout]>();
    }

    /**
     * Add property to struct.
     * @param pName - Property name.
     * @param pOrder - Index of property.
     * @param pType - Property type.
     */
    public addProperty(pOrder: number, pType: BufferLayout): void {
        this.mInnerTypes.push([pOrder, pType]);
        pType.parent = this;

        // Recalculate alignment.
        if (pType.alignment > this.mAlignment) {
            this.mAlignment = pType.alignment;
        }

        // Get ordered types.
        const lOrderedTypeList: Array<BufferLayout> = this.mInnerTypes.sort(([pOrderA], [pOrderB]) => {
            return pOrderA - pOrderB;
        }).map(([, pType]) => pType);

        // Recalculate size.
        let lRawDataSize: number = 0;
        for (const lType of lOrderedTypeList) {
            // Increase offset to needed alignment.
            lRawDataSize = Math.ceil(lRawDataSize / lType.alignment) * lType.alignment;

            // Increase offset for type.
            lRawDataSize += lType.size;
        }

        // Apply struct alignment to raw data size.
        this.mSize = Math.ceil(lRawDataSize / this.mAlignment) * this.mAlignment;
    }

    /**
     * Get types of properties with set location.
     */
    public innerLocations(): Array<BufferLayout> {
        const lLocationTypes: Array<BufferLayout> = new Array<BufferLayout>();
        for (const [, lPropertyType] of this.mInnerTypes.values()) {
            // Set property as location when set.
            if (lPropertyType.location !== null) {
                lLocationTypes.push(lPropertyType);
            }

            // Get all inner locations when property is a struct type.
            if (lPropertyType instanceof StructBufferLayout) {
                lLocationTypes.push(...lPropertyType.innerLocations());
            }
        }

        return lLocationTypes;
    }

    /**
     * Get location of path.
     * @param pPathName - Path name. Divided by dots.
     */
    public override locationOf(pPathName: Array<string>): BufferLayoutLocation {
        const lPathName: Array<string> = [...pPathName];

        // Complete array.
        const lPropertyName: string | undefined = lPathName.shift();
        if (!lPropertyName) {
            return { size: this.size, offset: 0 };
        }

        // Get ordered types.
        const lOrderedTypeList: Array<BufferLayout> = this.mInnerTypes.sort(([pOrderA], [pOrderB]) => {
            return pOrderA - pOrderB;
        }).map(([, pType]) => pType);

        // Recalculate size.
        let lPropertyOffset: number = 0;
        let lPropertyLayout: BufferLayout | null = null;
        for (const lProperty of lOrderedTypeList) {
            // Increase offset to needed alignment.
            lPropertyOffset = Math.ceil(lPropertyOffset / lProperty.alignment) * lProperty.alignment;

            // Inner property is found. Skip searching.
            // Alignment just applied so it can be skipped later.
            if (lProperty.name === lPropertyName) {
                lPropertyLayout = lProperty;
                break;
            }

            // Increase offset for complete property.
            lPropertyOffset += lProperty.size;
        }

        // Validate property.
        if (!lPropertyLayout) {
            throw new Exception(`Struct buffer layout property "${lPropertyName}" not found.`, this);
        }

        const lPropertyLocation = lPropertyLayout.locationOf(lPathName);
        return {
            size: lPropertyLocation.size,
            offset: lPropertyOffset + lPropertyLocation.offset
        };
    }
}