import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { GpuTypes } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/gpu-object';

export abstract class BindGroup<TGpuTypes extends GpuTypes = GpuTypes, TNative = any> extends GpuObject<TGpuTypes, TNative> {
    private readonly mBindData: Dictionary<string, TGpuTypes['bindData']>;
    private readonly mLayout: TGpuTypes['bindGroupLayout'];

    /**
     * Layout of bind group.
     */
    public get layout(): TGpuTypes['bindGroupLayout'] {
        return this.mLayout;
    }

    /**
     * Constructor.
     * @param pDevice - Gpu Device reference.
     */
    public constructor(pDevice: TGpuTypes['gpuDevice'], pBindGroupLayout: TGpuTypes['bindGroupLayout']) {
        super(pDevice);

        this.mLayout = pBindGroupLayout;
        this.mBindData = new Dictionary<string, TGpuTypes['bindData']>();

        // Register change listener for layout changes.
        pBindGroupLayout.addUpdateListener(() => {
            this.triggerAutoUpdate();
        });
    }

    /**
     * Get data of layout binding.
     * @param pBindName - Bind layout entry name.
     */
    public getData(pBindName: string): TGpuTypes['bindData'] {
        const lData = this.mBindData.get(pBindName);
        if (!lData) {
            throw new Exception(`Cant get bind data "${pBindName}". No data set.`, this);
        }

        return lData;
    }

    /**
     * Set data to layout binding.
     * @param pBindName - Bind layout entry name.
     * @param pData - Bind data.
     */
    public setData(pBindName: string, pData: TGpuTypes['bindData']): void {
        // TODO: Validate data type with value type.

        // Set bind type to Teture for TS type check shutup.
        this.mBindData.set(pBindName, pData);
    }
}