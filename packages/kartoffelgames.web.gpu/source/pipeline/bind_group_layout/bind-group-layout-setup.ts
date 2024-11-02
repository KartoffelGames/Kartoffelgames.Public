import { BaseMemoryLayout } from '../../base-memory-layout';
import { BufferAlignmentType } from '../../constant/buffer-alignment-type.enum';
import { ComputeStage } from '../../constant/compute-stage.enum';
import { StorageBindingType } from '../../constant/storage-binding-type.enum';
import { GpuObjectSetup } from '../../gpu_object/gpu-object-setup';
import { BindGroupBindingMemoryLayoutSetuData, BindGroupLayoutMemoryLayoutSetup } from './bind-group-layout-memory-layout-setup';

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
            layout: null,
            storageType: pStorageBinding ?? StorageBindingType.None,
            hasDynamicOffset: false,
        };

        // Set layout.
        this.setupData.bindings.push(lBind);

        // Aligment type of memory layout. When it is not a storage buffer then is is a uniform buffer.
        const lAlignmentType: BufferAlignmentType = (lBind.storageType === StorageBindingType.None) ? BufferAlignmentType.Uniform : BufferAlignmentType.Storage;

        // Create layout memory layout.
        return new BindGroupLayoutMemoryLayoutSetup(this.setupReferences, lAlignmentType, (pMemoryLayout: BindGroupBindingMemoryLayoutSetuData) => {
            lBind.layout = pMemoryLayout.layout;
            lBind.hasDynamicOffset = pMemoryLayout.hasDynamicOffset;
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
    hasDynamicOffset: boolean;
};

export type BindGroupLayoutSetupData = {
    bindings: Array<BindLayoutSetupData>;
};