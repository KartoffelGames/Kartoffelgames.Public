import { Exception } from '@kartoffelgames/core';
import { GpuDevice } from '../../gpu/gpu-device';
import { GpuObjectSetupReferences } from '../../gpu/object/gpu-object';
import { IGpuObjectSetup } from '../../gpu/object/interface/i-gpu-object-setup';
import { BaseBufferMemoryLayout, BufferLayoutLocation } from './base-buffer-memory-layout';
import { StructBufferMemoryLayoutSetup, StructBufferMemoryLayoutSetupData } from './struct-buffer-memory-layout-setup';

export class StructBufferMemoryLayout extends BaseBufferMemoryLayout<StructBufferMemoryLayoutSetup> implements IGpuObjectSetup<StructBufferMemoryLayoutSetup> {
    private mAlignment: number;
    private mFixedSize: number;
    private mInnerProperties: Array<StructBufferMemoryLayoutProperty>;
    private mVariableSize: number;

    /**
     * Alignment of type.
     */
    public get alignment(): number {
        // Ensure setup was called.
        this.ensureSetup();

        return this.mAlignment;
    }

    /**
     * Type size in byte.
     */
    public get fixedSize(): number {
        // Ensure setup was called.
        this.ensureSetup();

        return this.mFixedSize;
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
     * Size of variable part of struct.
     */
    public get variableSize(): number {
        // Ensure setup was called.
        this.ensureSetup();

        return this.mVariableSize;
    }

    /**
     * Constructor.
     * 
     * @param pDevice - Device reference.
     * @param pParameter - Parameter.
     */
    public constructor(pDevice: GpuDevice) {
        super(pDevice);

        // Calculated properties.
        this.mAlignment = 0;
        this.mFixedSize = 0;
        this.mVariableSize = 0;

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
            if (this.mVariableSize > 0) {
                throw new Exception(`Can't read location of a memory layout with a variable size.`, this);
            }

            return { size: this.fixedSize, offset: 0 };
        }

        // Recalculate size.
        let lPropertyOffset: number = 0;
        let lFoundProperty: StructBufferMemoryLayoutProperty | null = null;
        for (const lProperty of this.mInnerProperties) {
            // Increase offset to needed alignment.
            lPropertyOffset = Math.ceil(lPropertyOffset / lProperty.layout.alignment) * lProperty.layout.alignment;

            // Inner property is found. Skip searching.
            // Alignment just applied so it can be skipped later.
            if (lProperty.name === lPropertyName) {
                lFoundProperty = lProperty;
                break;
            }

            // Increase offset for complete property. 
            // Only last property can have a variable size, so we can only save the fixed size.
            lPropertyOffset += lProperty.layout.fixedSize;
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
        for (let lIndex: number = 0; lIndex < this.mInnerProperties.length; lIndex++) {
            const lPropertyLayout = this.mInnerProperties[lIndex].layout;

            if (lPropertyLayout.variableSize > 0 && lIndex !== (this.mInnerProperties.length - 1)) {
                throw new Exception(`Only the last property of a struct memory layout can have a variable size.`, this);
            }

            // Increase offset to needed alignment.
            lRawDataSize = Math.ceil(lRawDataSize / lPropertyLayout.alignment) * lPropertyLayout.alignment;

            // Increase offset for type.
            lRawDataSize += lPropertyLayout.fixedSize;

            // Alignment is the highest alignment of all properties.
            if (lPropertyLayout.alignment > this.mAlignment) {
                this.mAlignment = lPropertyLayout.alignment;
            }

            // Set variable size. Can only be the last property.
            if (lPropertyLayout.variableSize > 0) {
                this.mVariableSize = lPropertyLayout.variableSize;
            }
        }

        // Apply struct alignment to raw data size.
        this.mFixedSize = Math.ceil(lRawDataSize / this.mAlignment) * this.mAlignment;
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

type StructBufferMemoryLayoutProperty = {
    orderIndex: number,
    name: string,
    layout: BaseBufferMemoryLayout;
};