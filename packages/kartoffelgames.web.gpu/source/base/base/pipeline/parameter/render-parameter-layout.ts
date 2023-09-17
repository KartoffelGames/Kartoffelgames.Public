import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { GpuDevice } from '../../gpu/gpu-device';
import { GpuObject } from '../../gpu/gpu-object';
import { BaseBufferMemoryLayout } from '../../memory_layout/buffer/base-buffer-memory-layout';
import { StructBufferMemoryLayout } from '../../memory_layout/buffer/struct-buffer-memory-layout';
import { GpuObjectReason } from '../../gpu/gpu-object-reason';

export class RenderParameterLayout extends GpuObject {
    private readonly mParameter: Dictionary<number, BaseBufferMemoryLayout>;
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
        this.mParameter = new Dictionary<number, BaseBufferMemoryLayout>();
        this.mParameterNames = new Dictionary<string, number>();
    }

    /**
     * Add parameter layout.
     * @param pName - Parameter name.
     * @param pLayout - Parameter layout.
     */
    public addParameter(pLayout: BaseBufferMemoryLayout): void {
        // Find all childs of layout with locations.
        const lLocationLayoutList: Array<BaseBufferMemoryLayout> = new Array<BaseBufferMemoryLayout>();
        if (pLayout instanceof StructBufferMemoryLayout) {
            lLocationLayoutList.push(...pLayout.locationLayouts());
        } else {
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
                this.triggerAutoUpdate(GpuObjectReason.ChildData);
            });
        }

        // Trigger update.
        this.triggerAutoUpdate(GpuObjectReason.ChildData);
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
    public getLayoutOf(pName: string): BaseBufferMemoryLayout {
        const lIndex: number = this.getIndexOf(pName);

        // Layout should exist when it name exists.
        return this.mParameter.get(lIndex)!;
    }
} 