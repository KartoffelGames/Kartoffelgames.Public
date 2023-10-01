import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/gpu-object';
import { BaseMemoryLayout } from '../memory_layout/base-memory-layout';
import { BindDataGroup } from './bind-data-group';
import { UpdateReason } from '../gpu/gpu-object-update-reason';

export class BindDataGroupLayout extends GpuObject<'bindDataGroupLayout'> {
    private readonly mBindings: Dictionary<string, BindLayout>;
    private mIdentifier: string;

    /**
     * Get binding names.
     */
    public get bindingNames(): Array<string> {
        return [...this.mBindings.keys()];
    }

    /**
    * Get bindings of group.
    */
    public get bindings(): Array<BindLayout> {
        const lBindingList: Array<BindLayout> = new Array<BindLayout>();
        for (const lBinding of this.mBindings.values()) {
            lBindingList[lBinding.index] = lBinding;
        }

        return lBindingList;
    }

    /**
     * Get bind group identifier.
     * Same configured groups has the same identifier.
     */
    public get identifier(): string {
        return this.mIdentifier;
    }

    /**
     * Constructor.
     * @param pDevice - Gpu Device reference.
     */
    public constructor(pDevice: GpuDevice) {
        super(pDevice);

        // Init storage.
        this.mBindings = new Dictionary<string, BindLayout>();

        // Update identifier.
        this.mIdentifier = '';
        this.addUpdateListener(() => {
            let lIdentifier: string = '';
            for (const lBind of this.mBindings.values()) {
                // Simple chain of values.
                lIdentifier += lBind.index;
                lIdentifier += '-' + lBind.name;
                lIdentifier += '-' + lBind.layout.accessMode;
                lIdentifier += '-' + lBind.layout.bindingIndex;
                lIdentifier += '-' + lBind.layout.memoryType;
                lIdentifier += '-' + lBind.layout.name;
                lIdentifier += '-' + lBind.layout.visibility;
                lIdentifier += ';';
            }

            this.mIdentifier = lIdentifier;
        });
    }

    /**
     * Add layout to binding group.
     * @param pLayout - Memory layout.
     * @param pName - Binding name. For easy access only.
     * @param pIndex - Index of bind inside group.
     */
    public addBinding(pLayout: BaseMemoryLayout, pName: string): void {
        if (pLayout.bindingIndex === null) {
            throw new Exception(`Layout "${pLayout.name}" binding needs a binding index.`, this);
        }

        // Set layout.
        this.mBindings.set(pName, {
            name: pName,
            index: pLayout.bindingIndex,
            layout: pLayout
        });

        // Register change listener for layout changes.
        pLayout.addUpdateListener(() => {
            this.triggerAutoUpdate(UpdateReason.ChildData);
        });

        // Trigger next auto update.
        this.triggerAutoUpdate(UpdateReason.ChildData);
    }

    /**
     * Create bind group from layout.
     */
    public createGroup(): BindDataGroup {
        return new BindDataGroup(this.device, this);
    }

    /**
     * Get full bind information.
     * @param pName - Bind name.
     */
    public getBind(pName: string): Readonly<BindLayout> {
        if (!this.mBindings.has(pName)) {
            throw new Exception(`Bind ${pName} does not exist.`, this);
        }

        return this.mBindings.get(pName)!;
    }
}

type BindLayout = {
    name: string,
    index: number,
    layout: BaseMemoryLayout;
};