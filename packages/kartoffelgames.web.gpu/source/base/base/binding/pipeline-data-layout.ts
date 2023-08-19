import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/gpu-object';
import { BindDataGroupLayout } from './bind-data-group-layout';

export class PipelineDataLayout extends GpuObject {
    private readonly mBindGroups: Dictionary<number, BindDataGroupLayout>;

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
    public constructor(pDevice: GpuDevice) {
        super(pDevice);

        // Init storage.
        this.mBindGroups = new Dictionary<number, BindDataGroupLayout>();
    }

    /**
     * Create bind group.
     * @param pIndex - Group index.
     * @param pLayout - [Optional] Bind group Layout.
     */
    public addGroupLayout(pIndex: number, pLayout: BindDataGroupLayout): void {
        this.mBindGroups.add(pIndex, pLayout);

        // Register change listener for layout changes.
        pLayout.addUpdateListener(() => {
            this.triggerAutoUpdate();
        });

        // Trigger auto update.
        this.triggerAutoUpdate();
    }

    /**
     * Get created bind group layout.
     * @param pIndex - Group index.
     */
    public getGroupLayout(pIndex: number): BindDataGroupLayout {
        // Throw on unaccessable group.
        if (!this.mBindGroups.has(pIndex)) {
            throw new Exception(`Bind group layout (${pIndex}) does not exists.`, this);
        }

        // Bind group should allways exist.
        return this.mBindGroups.get(pIndex)!;
    }
}