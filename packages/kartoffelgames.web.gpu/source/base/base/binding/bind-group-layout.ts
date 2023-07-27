import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { GpuTypes } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/gpu-object';

export abstract class BindGroupLayout<TGpuTypes extends GpuTypes = GpuTypes, TNative = any> extends GpuObject<TGpuTypes, TNative> {
    private readonly mBindings: Dictionary<string, BindLayout<TGpuTypes>>;

    /**
     * Get binding names.
     */
    public get bindingNames(): Array<string> {
        return [...this.mBindings.keys()];
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
    }

    /**
     * Add layout to binding group.
     * @param pLayout - Memory layout.
     * @param pName - Binding name. For easy access only.
     * @param pIndex - Index of bind inside group.
     */
    public addBinding(pLayout: TGpuTypes['memoryLayout'], pName: string, pIndex: number): void {
        // Set layout.
        this.mBindings.set(pName, {
            name: pName,
            index: pIndex,
            layout: pLayout
        });

        // TODO: Register change listener for dependency.

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
     * Remove bind.
     */
    public removeBind(pName: string): void {
        if (this.mBindings.delete(pName)) {
            // TODO: Unregister change listener for dependency.

            // Request object update.
            this.triggerAutoUpdate();
        }
    }
}

type BindLayout<TGpuTypes extends GpuTypes> = {
    name: string,
    index: number,
    layout: TGpuTypes['memoryLayout'];
};