import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { GpuTypes } from '../../gpu/gpu-device';
import { GpuObject } from '../../gpu/gpu-object';
import { StructBufferMemoryLayout } from '../../memory_layout/buffer/struct-buffer-memory-layout';

export abstract class ParameterLayout<TGpuTypes extends GpuTypes = GpuTypes, TNative = any> extends GpuObject<TGpuTypes, TNative> {
    private readonly mParameter: Dictionary<number, TGpuTypes['bufferMemoryLayout']>;
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
    public constructor(pDevice: TGpuTypes['gpuDevice'],) {
        super(pDevice);
        this.mParameter = new Dictionary<number, TGpuTypes['bufferMemoryLayout']>();
        this.mParameterNames = new Dictionary<string, number>();
    }

    /**
     * Add parameter layout.
     * @param pName - Parameter name.
     * @param pLayout - Parameter layout.
     */
    public addParameter(pLayout: TGpuTypes['bufferMemoryLayout']): void {
        // Find all childs of layout with locations.
        const lLocationLayoutList: Array<TGpuTypes['bufferMemoryLayout']> = new Array<TGpuTypes['bufferMemoryLayout']>();
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
            let lParentLayout: TGpuTypes['bufferMemoryLayout'] | null = lLocationLayout;
            while ((lParentLayout = lParentLayout.parent) !== null) {
                // Extend current name by its parent name.
                lName = `${lParentLayout.name}.${lName}`;
            }

            // Link name with index and index with layout.
            this.mParameterNames.set(lName, lLocationLayout.locationIndex);
            this.mParameter.set(lLocationLayout.locationIndex, lLocationLayout);

            // Register change listener for layout changes.
            lLocationLayout.addUpdateListener(() => {
                this.triggerAutoUpdate();
            });
        }

        // Trigger update.
        this.triggerAutoUpdate();
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
    public getLayoutOf(pName: string): TGpuTypes['bufferMemoryLayout'] {
        const lIndex: number = this.getIndexOf(pName);

        // Layout should exist when it name exists.
        return this.mParameter.get(lIndex)!;
    }
} 