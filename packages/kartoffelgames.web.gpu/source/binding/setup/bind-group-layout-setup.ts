import { ComputeStage } from '../../constant/compute-stage.enum';
import { StorageBindingType } from '../../constant/storage-binding-type.enum';
import { GpuObjectSetup } from '../../gpu/object/gpu-object-setup';
import { BaseMemoryLayout } from '../../memory_layout/base-memory-layout';
import { BindGroupLayoutMemoryLayoutSetup } from './bind-group-layout-memory-layout-setup';

export class BindGroupLayoutSetup extends GpuObjectSetup<BindGroupLayoutSetupData> {
    /**
     * Add binding to group.
     * 
     * @param pName - Binding name.
     * @param pIndex - - Binding index.
     * @param pUsage - Buffer usage.
     * @param pVisibility - Visibility.
     * @param pAccessMode - Access mode.
     */
    public binding(pIndex: number, pName: string, pVisibility: ComputeStage, pStorageBinding?: StorageBindingType): BindGroupLayoutMemoryLayoutSetup { // TODO: Dynamic offset.
        // Lock setup to a setup call.
        this.ensureThatInSetup();

        // Create empty bind layout.
        const lBind: BindLayoutSetupData = {
            name: pName,
            index: pIndex,
            visibility: pVisibility,
            layout: null,
            storageType: pStorageBinding ?? StorageBindingType.None
        };

        // Set layout.
        this.setupData.bindings.push(lBind);

        // Create layout memory layout.
        return new BindGroupLayoutMemoryLayoutSetup(this.setupReferences, (pMemoryLayout: BaseMemoryLayout) => {
            lBind.layout = pMemoryLayout;
        });
    }

    /**
     * Fill in default data before the setup starts.
     * 
     * @param pDataReference - Setup data reference.
     */
    protected override fillDefaultData(pDataReference: BindGroupLayoutSetupData): void {
        pDataReference.bindings = new Array<BindLayoutSetupData>();
    }
}

type BindLayoutSetupData = {
    name: string;
    index: number;
    layout: BaseMemoryLayout | null;
    visibility: ComputeStage;
    storageType: StorageBindingType;
};

export type BindGroupLayoutSetupData = {
    bindings: Array<BindLayoutSetupData>;
};