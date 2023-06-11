import { Exception } from '@kartoffelgames/core.data';
import { AccessMode } from '../../../constant/access-mode.enum';
import { BindType } from '../../../constant/bind-type.enum';
import { ComputeStage } from '../../../constant/compute-stage.enum';
import { MemoryType } from '../../../constant/memory-type.enum';
import { IStructBufferMemoryLayout } from '../../../interface/memory_layout/buffer/i-struct-buffer.memory-layout.interface';
import { BufferLayoutLocation, BufferMemoryLayout } from './buffer-memory-layout';
import { Base } from '../../export.';

export abstract class StructBufferMemoryLayout extends BufferMemoryLayout implements IStructBufferMemoryLayout {
    private readonly mStructName: string;
    private mInnerProperties: Array<[number, BufferMemoryLayout]>;

    /**
     * Struct name.
     */
    public get structName(): string {
        return this.mStructName;
    }

    /**
     * Ordered inner properties.
     */
    public get properties(): Array<BufferMemoryLayout> {
        return this.mInnerProperties.map((pProperty) => pProperty[1]);
    }

    /**
     * Constructor.
     * @param pParameter - Parameter.
     */
    public constructor(pParameter: StructBufferMemoryLayoutParameter) {
        super(pParameter);

        // Static properties.
        this.mStructName = pParameter.structName;
        this.mInnerProperties = new Array<[number, BufferMemoryLayout]>();
    }

    /**
     * Get types of properties with set location.
     */
    public locations(): Array<BufferMemoryLayout> {
        const lLocationTypes: Array<BufferMemoryLayout> = new Array<BufferMemoryLayout>();
        for (const [, lPropertyType] of this.mInnerProperties.values()) {
            // Set property as location when set.
            if (lPropertyType.location !== null) {
                lLocationTypes.push(lPropertyType);
            }

            // Get all inner locations when property is a struct type.
            if (lPropertyType instanceof StructBufferMemoryLayout) {
                lLocationTypes.push(...lPropertyType.locations());
            }
        }

        return lLocationTypes;
    }

    /**
     * Add property to struct.
     * @param pName - Property name.
     * @param pOrder - Index of property.
     * @param pType - Property type.
     */
    public addProperty(pOrder: number, pType: BufferMemoryLayout): void {
        this.mInnerProperties.push([pOrder, pType]);

        // Order properties.
        this.mInnerProperties = this.mInnerProperties.sort((pA, pB) => {
            return pA[0] - pB[0];
        });

        // Call recalculation. Or other usefull things.
        this.onProperyAdd();
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
        const lOrderedTypeList: Array<BufferMemoryLayout> = this.mInnerProperties.sort(([pOrderA], [pOrderB]) => {
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

    /**
     * Called on property add.
     */
    protected abstract onProperyAdd(): void;
}

export type StructBufferMemoryLayoutParameter = {
    // "Interited" from BufferMemoryLayoutParameter.
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