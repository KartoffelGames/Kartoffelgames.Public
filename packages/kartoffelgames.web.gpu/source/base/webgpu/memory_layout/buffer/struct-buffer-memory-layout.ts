import { Exception } from '@kartoffelgames/core.data';
import { BufferMemoryLayout } from './buffer-memory-layout';
import { BufferLayoutLocation, IBufferMemoryLayout } from '../../../interface/memory_layout/i-buffer-memory-layout.interface';
import { AccessMode } from '../../../constant/access-mode.enum';
import { BindType } from '../../../constant/bind-type.enum';
import { WgslType } from '../../shader/wgsl_enum/wgsl-type.enum';
import { ComputeStage } from '../../../constant/compute-stage.enum';
import { MemoryType } from '../../../constant/memory-type.enum';

export class StructBufferMemoryLayout extends BufferMemoryLayout implements IBufferMemoryLayout {
    private mAlignment: number;
    private readonly mInnerTypes: Array<[number, BufferMemoryLayout]>;
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
     * Constructor.
     */
    public constructor(pParameter: StructBufferMemoryLayoutParameter) {
        super({ ...pParameter, type: WgslType.Struct });

        this.mStructName = pParameter.structName;
        this.mAlignment = 0;
        this.mSize = 0;
        this.mInnerTypes = new Array<[number, BufferMemoryLayout]>();
    }

    /**
     * Add property to struct.
     * @param pName - Property name.
     * @param pOrder - Index of property.
     * @param pType - Property type.
     */
    public addProperty(pOrder: number, pType: BufferMemoryLayout): void {
        this.mInnerTypes.push([pOrder, pType]);

        // Recalculate alignment.
        if (pType.alignment > this.mAlignment) {
            this.mAlignment = pType.alignment;
        }

        // Get ordered types.
        const lOrderedTypeList: Array<BufferMemoryLayout> = this.mInnerTypes.sort(([pOrderA], [pOrderB]) => {
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
    public innerLocations(): Array<BufferMemoryLayout> {
        const lLocationTypes: Array<BufferMemoryLayout> = new Array<BufferMemoryLayout>();
        for (const [, lPropertyType] of this.mInnerTypes.values()) {
            // Set property as location when set.
            if (lPropertyType.location !== null) {
                lLocationTypes.push(lPropertyType);
            }

            // Get all inner locations when property is a struct type.
            if (lPropertyType instanceof StructBufferMemoryLayout) {
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
        const lOrderedTypeList: Array<BufferMemoryLayout> = this.mInnerTypes.sort(([pOrderA], [pOrderB]) => {
            return pOrderA - pOrderB;
        }).map(([, pType]) => pType);

        // Recalculate size.
        let lPropertyOffset: number = 0;
        let lPropertyLayout: BufferMemoryLayout | null = null;
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

type StructBufferMemoryLayoutParameter = {
    // "Interited" from MemoryLayoutParameter.
    access: AccessMode;
    bindType: BindType;
    location: number | null;
    name: string;
    memoryType: MemoryType;
    visibility: ComputeStage;
    parent: BufferMemoryLayout;

    // New.
    structName: string;
};