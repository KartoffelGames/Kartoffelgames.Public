import { Dictionary, Exception } from '@kartoffelgames/core';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/gpu-native-object';
import { BindDataGroupLayout } from './bind-data-group-layout';
import { UpdateReason } from '../gpu/gpu-object-update-reason';

export class PipelineDataLayout extends GpuObject<'pipelineDataLayout'> {
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
        pLayout.addInvalidationListener(() => {
            this.triggerAutoUpdate(UpdateReason.ChildData);
        });

        // Trigger auto update.
        this.triggerAutoUpdate(UpdateReason.ChildData);
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