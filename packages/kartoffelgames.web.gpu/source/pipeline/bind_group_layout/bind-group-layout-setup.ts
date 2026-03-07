import type { ComputeStage } from '../../constant/compute-stage.enum.ts';
import { StorageBindingType } from '../../constant/storage-binding-type.enum.ts';
import { GpuObjectSetup } from '../../gpu_object/gpu-object-setup.ts';
import type { BindLayoutBinding } from './bind-group-layout.ts';
import { type BindGroupLayoutMemoryLayoutSetupData, BindGroupLayoutMemoryLayoutSetup } from './bind-group-layout-memory-layout-setup.ts';

/**
 * setup object to add bindings to bind group layouts.
 */
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
    public binding(pIndex: number, pName: string, pVisibility: ComputeStage, pStorageBinding?: StorageBindingType): BindGroupLayoutMemoryLayoutSetup {
        // Lock setup to a setup call.
        this.ensureThatInSetup();

        // Create empty bind layout.
        const lBind: BindLayoutSetupData = {
            name: pName,
            index: pIndex,
            visibility: pVisibility,
            resource: null,
            storageType: pStorageBinding ?? StorageBindingType.None,
            hasDynamicOffset: false,
        };

        // Set layout.
        this.setupData.bindings.push(lBind);

        // Create layout memory layout.
        return new BindGroupLayoutMemoryLayoutSetup(this.setupReferences, (pResourceData: BindGroupLayoutMemoryLayoutSetupData) => {
            lBind.resource = pResourceData.resource;
            lBind.hasDynamicOffset = pResourceData.hasDynamicOffset;
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
    resource: BindLayoutBinding | null;
    visibility: ComputeStage;
    storageType: StorageBindingType;
    hasDynamicOffset: boolean;
};

export type BindGroupLayoutSetupData = {
    bindings: Array<BindLayoutSetupData>;
};
