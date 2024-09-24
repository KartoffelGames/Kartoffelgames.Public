import { Exception } from '@kartoffelgames/core';
import { UpdateReason } from '../../gpu/object/gpu-object-update-reason';
import { BaseBufferMemoryLayout, BufferLayoutLocation, BufferMemoryLayoutParameter } from './base-buffer-memory-layout';

export class StructBufferMemoryLayout extends BaseBufferMemoryLayout {
    private mAlignment: number;
    private mInnerProperties: Array<StructBufferMemoryLayoutProperty>;
    private mSize: number;

    /**
     * Alignment of type.
     */
    public get alignment(): number {
        return this.mAlignment;
    }

    /**
     * Ordered inner properties.
     */
    public get properties(): Array<BaseBufferMemoryLayout> {
        return this.mInnerProperties.map((pProperty) => pProperty.layout);
    }

    /**
     * Type size in byte.
     */
    public get size(): number {
        return this.mSize;
    }

    /**
     * Constructor.
     * @param pParameter - Parameter.
     */
    public constructor(pParameter: StructBufferMemoryLayoutParameter) {
        super(pParameter);

        // Calculated properties.
        this.mAlignment = 0;
        this.mSize = 0;

        // Static properties.
        this.mInnerProperties = new Array<StructBufferMemoryLayoutProperty>();
    }

    /**
     * Add property to struct.
     *
     * @param pOrder - Index of property.
     * @param pName - Property name.
     * @param pType - Property type.
     */
    public addProperty(pOrder: number, pName: string, pType: BaseBufferMemoryLayout): void {
        this.mInnerProperties.push({
            orderIndex: pOrder,
            name: pName,
            layout: pType
        });

        // Order properties.
        this.mInnerProperties = this.mInnerProperties.sort((pA, pB) => {
            return pA.orderIndex - pB.orderIndex;
        });

        // Call recalculation. Or other usefull things.
        this.recalculateAlignment();

        // Invalidate layout on setting changes.
        this.invalidate(UpdateReason.Setting);
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
        const lOrderedTypeList: Array<StructBufferMemoryLayoutProperty> = this.mInnerProperties.sort((pPropertyA, pPropertyB) => {
            return pPropertyA.orderIndex - pPropertyB.orderIndex;
        });

        // Recalculate size.
        let lPropertyOffset: number = 0;
        let lFoundProperty: StructBufferMemoryLayoutProperty | null = null;
        for (const lProperty of lOrderedTypeList) {
            // Increase offset to needed alignment.
            lPropertyOffset = Math.ceil(lPropertyOffset / lProperty.layout.alignment) * lProperty.layout.alignment;

            // Inner property is found. Skip searching.
            // Alignment just applied so it can be skipped later.
            if (lProperty.name === lPropertyName) {
                lFoundProperty = lProperty;
                break;
            }

            // Increase offset for complete property.
            lPropertyOffset += lProperty.layout.size;
        }

        // Validate property.
        if (!lFoundProperty) {
            throw new Exception(`Struct buffer layout property "${lPropertyName}" not found.`, this);
        }

        const lPropertyLocation = lFoundProperty.layout.locationOf(lPathName);
        return {
            size: lPropertyLocation.size,
            offset: lPropertyOffset + lPropertyLocation.offset
        };
    }

    /**
     * Recalculate size and alignment.
     */
    private recalculateAlignment(): void {
        // Recalculate size.
        let lRawDataSize: number = 0;
        for (const lType of this.properties) {
            // Increase offset to needed alignment.
            lRawDataSize = Math.ceil(lRawDataSize / lType.alignment) * lType.alignment;

            // Increase offset for type.
            lRawDataSize += lType.size;

            if (lType.alignment > this.mAlignment) {
                this.mAlignment = lType.alignment;
            }
        }

        // Apply struct alignment to raw data size.
        this.mSize = Math.ceil(lRawDataSize / this.mAlignment) * this.mAlignment;
    }
}

export interface StructBufferMemoryLayoutParameter extends BufferMemoryLayoutParameter { }

type StructBufferMemoryLayoutProperty = {
    orderIndex: number,
    name: string,
    layout: BaseBufferMemoryLayout;
};