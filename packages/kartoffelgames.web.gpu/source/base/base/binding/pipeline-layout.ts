import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { GpuTypes } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/gpu-object';

export abstract class PipelineLayout<TGpuTypes extends GpuTypes = GpuTypes, TNative = any> extends GpuObject<TGpuTypes, TNative> {
    private readonly mBindGroups: Dictionary<number, TGpuTypes['bindGroupLayout']>;

    /**
     * Bind group count.
     */
    public get groups(): Array<number> {
        return [...this.mBindGroups.keys()];
    }

    /**
     * Constructor.
     * @param pDevice - Gpu Device reference.
     */
    public constructor(pDevice: TGpuTypes['gpuDevice']) {
        super(pDevice);

        // Init storage.
        this.mBindGroups = new Dictionary<number, TGpuTypes['bindGroupLayout']>();
    }

    /**
     * Create bind group.
     * @param pIndex - Group index.
     * @param pLayout - [Optional] Bind group Layout.
     */
    public addGroup(pIndex: number, pLayout: TGpuTypes['bindGroupLayout']): void {
        this.mBindGroups.add(pIndex, pLayout);

        // TODO: Register change listener for dependency.

        // Trigger auto update.
        this.triggerAutoUpdate();
    }

    /**
     * Get created bind group layout.
     * @param pIndex - Group index.
     */
    public getGroup(pIndex: number): TGpuTypes['bindGroupLayout'] {
        // Throw on unaccessable group.
        if (!this.mBindGroups.has(pIndex)) {
            throw new Exception(`Bind group layout (${pIndex}) does not exists.`, this);
        }

        // Bind group should allways exist.
        return this.mBindGroups.get(pIndex)!;
    }
}