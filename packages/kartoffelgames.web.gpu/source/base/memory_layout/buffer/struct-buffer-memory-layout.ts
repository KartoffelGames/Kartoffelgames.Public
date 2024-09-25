import { Exception } from '@kartoffelgames/core';
import { BufferUsage } from '../../../constant/buffer-usage.enum';
import { GpuDevice } from '../../gpu/gpu-device';
import { GpuObjectSetupReferences } from '../../gpu/object/gpu-object';
import { BaseBufferMemoryLayout, BufferLayoutLocation, BufferMemoryLayoutParameter } from './base-buffer-memory-layout';
import { StructBufferMemoryLayoutSetup, StructBufferMemoryLayoutSetupData } from './struct-buffer-memory-layout-setup';
import { IGpuObjectSetup } from '../../gpu/object/interface/i-gpu-object-setup';

export class StructBufferMemoryLayout extends BaseBufferMemoryLayout<StructBufferMemoryLayoutSetup> implements IGpuObjectSetup<StructBufferMemoryLayoutSetup> {
    private mAlignment: number;
    private mInnerProperties: Array<StructBufferMemoryLayoutProperty>;
    private mSize: number;

    /**
     * Alignment of type.
     */
    public get alignment(): number {
        // Ensure setup was called.
        this.ensureSetup();

        return this.mAlignment;
    }

    /**
     * Ordered inner properties.
     */
    public get properties(): Array<BaseBufferMemoryLayout> {
        // Ensure setup was called.
        this.ensureSetup();

        return this.mInnerProperties.map((pProperty) => pProperty.layout);
    }

    /**
     * Type size in byte.
     */
    public get size(): number {
        // Ensure setup was called.
        this.ensureSetup();

        return this.mSize;
    }

    public get variableSizeStep(): number {
        // TODO: Size the buffer gains for every variable item. // Default to 0 when not variable.
    }

    /**
     * Constructor.
     * 
     * @param pDevice - Device reference.
     * @param pParameter - Parameter.
     */
    public constructor(pDevice: GpuDevice, pUsage: BufferUsage) {
        super(pDevice, { usage: pUsage });

        // Calculated properties.
        this.mAlignment = 0;
        this.mSize = 0;

        // Static properties.
        this.mInnerProperties = new Array<StructBufferMemoryLayoutProperty>();
    }

    /**
     * Get location of path.
     * @param pPathName - Path name. Divided by dots.
     */
    public override locationOf(pPathName: Array<string>): BufferLayoutLocation {
        // Ensure setup was called.
        this.ensureSetup();

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
     * Call setup.
     *
     * @param pSetupCallback - Setup callback.
     *
     * @returns this.
     */
    public override setup(pSetupCallback?: ((pSetup: StructBufferMemoryLayoutSetup) => void)): this {
        super.setup(pSetupCallback);

        return this;
    }

    /**
     * Setup struct layout.
     * 
     * @param pReferences - Setup data references.
     */
    protected override onSetup(pReferences: StructBufferMemoryLayoutSetupData): void {
        // Add each property
        for (const lProperty of pReferences.properties) {
            if (!lProperty.layout) {
                throw new Exception(`Struct propery layout was not set.`, this);
            }

            this.mInnerProperties.push({
                orderIndex: lProperty.orderIndex,
                name: lProperty.name,
                layout: lProperty.layout
            });
        }

        // Order properties.
        this.mInnerProperties = this.mInnerProperties.sort((pA, pB) => {
            return pA.orderIndex - pB.orderIndex;
        });

        // Calculate size.
        let lRawDataSize: number = 0;
        for (const lType of this.properties) {
            // Increase offset to needed alignment.
            lRawDataSize = Math.ceil(lRawDataSize / lType.alignment) * lType.alignment;

            // Increase offset for type.
            lRawDataSize += lType.size;

            // TODO: Size can be variable with arrays. What to do? Add a variableSize in MemoryBufferLayout and check for it in any buffer creation.

            if (lType.alignment > this.mAlignment) {
                this.mAlignment = lType.alignment;
            }
        }

        // Apply struct alignment to raw data size.
        this.mSize = Math.ceil(lRawDataSize / this.mAlignment) * this.mAlignment;
    }

    /**
     * Create setup object.
     * 
     * @param pReferences - Setup references.
     * 
     * @returns setup object. 
     */
    protected override onSetupObjectCreate(pReferences: GpuObjectSetupReferences<StructBufferMemoryLayoutSetupData>): StructBufferMemoryLayoutSetup {
        return new StructBufferMemoryLayoutSetup(pReferences);
    }
}

export interface StructBufferMemoryLayoutParameter extends BufferMemoryLayoutParameter { }

type StructBufferMemoryLayoutProperty = {
    orderIndex: number,
    name: string,
    layout: BaseBufferMemoryLayout;
};