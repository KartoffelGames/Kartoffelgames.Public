import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { GpuTypes } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/gpu-object';

export abstract class BindGroupLayout<TGpuTypes extends GpuTypes = GpuTypes, TNative = any> extends GpuObject<TGpuTypes, TNative> {
    private readonly mBindings: Dictionary<string, BindLayout<TGpuTypes>>;
    private mIdentifier: string;

    /**
     * Get binding names.
     */
    public get bindingNames(): Array<string> {
        return [...this.mBindings.keys()];
    }

    /**
     * Get bind group identifier.
     * Same configured groups has the same identifier.
     */
    public get identifier(): string {
        return this.mIdentifier;
    }

    /**
     * Get bindings of group.
     */
    protected get bindings(): Array<BindLayout<TGpuTypes>> {
        const lBindingList: Array<BindLayout<TGpuTypes>> = new Array<BindLayout<TGpuTypes>>();
        for (const lBinding of this.mBindings.values()) {
            lBindingList[lBinding.index] = lBinding;
        }

        return lBindingList;
    }

    /**
     * Constructor.
     * @param pDevice - Gpu Device reference.
     */
    public constructor(pDevice: TGpuTypes['gpuDevice']) {
        super(pDevice);

        // Init storage.
        this.mBindings = new Dictionary<string, BindLayout<TGpuTypes>>();

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
                lIdentifier += '-' + lBind.layout.parameterIndex;
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
    public addBinding(pLayout: TGpuTypes['memoryLayout'], pName: string): void {
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
            this.triggerAutoUpdate();
        });

        // Trigger next auto update.
        this.triggerAutoUpdate();
    }

    /**
     * Get full bind information.
     * @param pName - Bind name.
     */
    public getBind(pName: string): Readonly<BindLayout<TGpuTypes>> {
        if (!this.mBindings.has(pName)) {
            throw new Exception(`Bind ${pName} does not exist.`, this);
        }

        return this.mBindings.get(pName)!;
    }

    /**
     * Create bind group from layout.
     */
    public abstract createGroup(): TGpuTypes['bindGroup'];
}

type BindLayout<TGpuTypes extends GpuTypes> = {
    name: string,
    index: number,
    layout: TGpuTypes['memoryLayout'];
};