import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { GpuDevice } from '../../gpu/gpu-device';
import { GpuObject } from '../../gpu/gpu-object';
import { BaseBufferMemoryLayout } from '../../memory_layout/buffer/base-buffer-memory-layout';
import { StructBufferMemoryLayout } from '../../memory_layout/buffer/struct-buffer-memory-layout';
import { UpdateReason } from '../../gpu/gpu-object-update-reason';
import { LinearBufferMemoryLayout } from '../../memory_layout/buffer/linear-buffer-memory-layout';

export class RenderParameterLayout extends GpuObject {
    private readonly mParameter: Dictionary<number, LinearBufferMemoryLayout>;
    private readonly mParameterNames: Dictionary<string, number>;

    /**
     * Parameter count.
     */
    public get count(): number {
        // Highest index plus one.
        return Math.max(...this.mParameter.keys()) + 1;
    }

    /**
     * Get all parameter names.
     */
    public get parameter(): Array<string> {
        return [...this.mParameterNames.keys()];
    }

    /**
     * 
     * @param pDevice - Device reference.
     * @param pLayout - Buffer layout of parameter.
     */
    public constructor(pDevice: GpuDevice) {
        super(pDevice);
        this.mParameter = new Dictionary<number, LinearBufferMemoryLayout>();
        this.mParameterNames = new Dictionary<string, number>();
    }

    /**
     * Add parameter layout.
     * @param pName - Parameter name.
     * @param pLayout - Parameter layout.
     */
    public add(pLayout: StructBufferMemoryLayout | LinearBufferMemoryLayout): void {
        // Find all childs of layout with locations.
        const lLocationLayoutList: Array<LinearBufferMemoryLayout> = new Array<LinearBufferMemoryLayout>();
        if (pLayout instanceof StructBufferMemoryLayout) {
            lLocationLayoutList.push(...pLayout.locationLayouts());
        } else if (pLayout instanceof LinearBufferMemoryLayout) {
            lLocationLayoutList.push(pLayout);
        }

        // Validate existing parameter layout.
        if (lLocationLayoutList.length === 0) {
            throw new Exception('Pipeline parameter layout needs a parameter index.', this);
        }

        // Add each location as seperate parameter.
        for (const lLocationLayout of lLocationLayoutList) {
            // Validate existing parameter index.
            if (lLocationLayout.locationIndex === null) {
                throw new Exception('Pipeline parameter layout needs a parameter index.', this);
            }

            // Do not override existing parameter.
            if (this.mParameter.has(lLocationLayout.locationIndex)) {
                throw new Exception('Parameter does already exist.', this);
            }

            // Generate name by iterating its parents.
            let lName: string = lLocationLayout.name;
            let lParentLayout: BaseBufferMemoryLayout | null = lLocationLayout;
            while ((lParentLayout = lParentLayout.parent) !== null) {
                // Extend current name by its parent name.
                lName = `${lParentLayout.name}.${lName}`;
            }

            // Link name with index and index with layout.
            this.mParameterNames.set(lName, lLocationLayout.locationIndex);
            this.mParameter.set(lLocationLayout.locationIndex, lLocationLayout);

            // Register change listener for layout changes.
            lLocationLayout.addUpdateListener(() => {
                this.triggerAutoUpdate(UpdateReason.ChildData);
            });
        }

        // Trigger update.
        this.triggerAutoUpdate(UpdateReason.ChildData);
    }

    /**
     * Get index of parameter.
     * @param pName - Parameter name.
     */
    public getIndexOf(pName: string): number {
        // Validate name.
        if (!this.mParameterNames.has(pName)) {
            throw new Exception(`Parameter name "${pName}" does not exist`, this);
        }

        return this.mParameterNames.get(pName)!;
    }

    /**
     * Get layout of name.
     * @param pName - Parameter name.
     */
    public getLayoutOf(pName: string): LinearBufferMemoryLayout {
        const lIndex: number = this.getIndexOf(pName);

        // Layout should exist when it name exists.
        return this.mParameter.get(lIndex)!;
    }
}

