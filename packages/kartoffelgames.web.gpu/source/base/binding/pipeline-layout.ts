import { Dictionary, Exception } from '@kartoffelgames/core';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuNativeObject, NativeObjectLifeTime } from '../gpu/gpu-native-object';
import { UpdateReason } from '../gpu/gpu-object-update-reason';
import { BindGroupLayout } from './bind-group-layout';

export class PipelineLayout extends GpuNativeObject<GPUPipelineLayout> {
    private readonly mBindGroups: Dictionary<number, BindGroupLayout>;


    /**
     * Bind group count.
     */
    public get groups(): Array<number> {
        return [...this.mBindGroups.keys()];
    }

    /**
     * Constructor.
     * 
     * @param pDevice - Gpu Device reference.
     */
    public constructor(pDevice: GpuDevice) {
        super(pDevice, NativeObjectLifeTime.Persistent);

        // Init storage.
        this.mBindGroups = new Dictionary<number, BindGroupLayout>();

        // TODO: Find a way to reuse groups instead of initializing a new every time.
        // TODO: Validate if replaced group meets at least the preset criteria. (Same, layout, visibility, bindings)

        // TODO: Add initial data and at the same time to "working" data dictionary.
        // TODO: Add replaceGroup method. Method checks if replacement meets lowest standard of initial data. When it does, add it to "working" data dictionary but keep the inital data intact.

        // TODO: Access bind groups by name not index.
    }

    /**
     * Create bind group.
     * @param pIndex - Group index.
     * @param pLayout - [Optional] Bind group Layout.
     */
    public addGroupLayout(pIndex: number, pLayout: BindGroupLayout): void {
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
    public getGroupLayout(pIndex: number): BindGroupLayout {
        // Throw on unaccessable group.
        if (!this.mBindGroups.has(pIndex)) {
            throw new Exception(`Bind group layout (${pIndex}) does not exists.`, this);
        }

        // Bind group should allways exist.
        return this.mBindGroups.get(pIndex)!;
    }

    /**
     * Generate native gpu pipeline data layout.
     */
    protected override generate(): GPUPipelineLayout {
        const lBindGoupIndices: Array<number> = this.gpuObject.groups;

        // Generate pipeline layout from bind group layouts.
        const lPipelineLayoutDescriptor = { bindGroupLayouts: new Array<GPUBindGroupLayout>() };
        for (const lIndex of lBindGoupIndices) {
            const lBindGroupLayout = this.gpuObject.getGroupLayout(lIndex);

            lPipelineLayoutDescriptor.bindGroupLayouts[lIndex] = this.factory.request<'bindDataGroupLayout'>(lBindGroupLayout).create();
        }

        // Validate continunity.
        if (lBindGoupIndices.length !== lPipelineLayoutDescriptor.bindGroupLayouts.length) {
            throw new Exception(`Bind group gap detected. Group not set.`, this);
        }

        // Generate pipeline layout from descriptor.
        return this.factory.gpu.createPipelineLayout(lPipelineLayoutDescriptor);
    }
}