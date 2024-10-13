import { GpuObjectSetup } from '../../gpu/object/gpu-object-setup';
import { BaseBufferMemoryLayout } from './base-buffer-memory-layout';
import { StructBufferMemoryLayoutPropertySetup } from './struct-buffer-memory-layout-property-setup';

export class StructBufferMemoryLayoutSetup extends GpuObjectSetup<StructBufferMemoryLayoutSetupData> {
    /**
     * Add propery.
     * 
     * @param pName - Propery name.
     * 
     * @returns property setup. 
     */
    public property(pName: string): StructBufferMemoryLayoutPropertySetup {
        // Create empty property.
        const lProperty: StructBufferMemoryLayoutSetupPropertyData = {
            name: pName,
            orderIndex: this.setupData.properties.length,
            layout: null
        };

        // Add empty property.
        this.setupData.properties.push(lProperty);

        // Create and return property setup.
        return new StructBufferMemoryLayoutPropertySetup(this.setupReferences, (pMemoryLayout: BaseBufferMemoryLayout) => {
            lProperty.layout = pMemoryLayout;
        });
    }

    /**
     * Fill in default data before the setup starts.
     *
     * @param pDataReference - Setup data reference.
     */
    protected override fillDefaultData(pDataReference: StructBufferMemoryLayoutSetupData): void {
        pDataReference.properties = new Array<{ orderIndex: number; name: string; layout: BaseBufferMemoryLayout; }>();
    }
}

type StructBufferMemoryLayoutSetupPropertyData = {
    orderIndex: number;
    name: string;
    layout: BaseBufferMemoryLayout | null;
};

export type StructBufferMemoryLayoutSetupData = {
    properties: Array<StructBufferMemoryLayoutSetupPropertyData>;
};