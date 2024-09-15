import { Dictionary, Exception } from '@kartoffelgames/core';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuNativeObject, GpuObjectUpdateListener, NativeObjectLifeTime } from '../gpu/gpu-native-object';
import { UpdateReason } from '../gpu/gpu-object-update-reason';
import { BindGroupLayout, BindLayout } from './bind-group-layout';

export class PipelineLayout extends GpuNativeObject<GPUPipelineLayout> {
    private readonly mBindGroupInvalidationListener: WeakMap<BindGroupLayout, GpuObjectUpdateListener>;
    private readonly mBindGroupNames: Dictionary<string, number>;
    private readonly mBindGroups: Dictionary<number, BindGroupLayout>;
    private readonly mInitialBindGroups: Dictionary<number, BindGroupLayout>;

    /**
     * Bind group names.
     */
    public get groups(): Array<string> {
        return [...this.mBindGroupNames.keys()];
    }

    /**
     * Constructor.
     * 
     * @param pDevice - Gpu Device reference.
     * @param pInitialGroups - Initial groups.
     */
    public constructor(pDevice: GpuDevice, pInitialGroups: Dictionary<number, BindGroupLayout>) {
        super(pDevice, NativeObjectLifeTime.Persistent);

        // Init storages.
        this.mBindGroupNames = new Dictionary<string, number>();
        this.mInitialBindGroups = new Dictionary<number, BindGroupLayout>();
        this.mBindGroups = new Dictionary<number, BindGroupLayout>();
        this.mBindGroupInvalidationListener = new WeakMap<BindGroupLayout, GpuObjectUpdateListener>();

        // TODO: Check gpu restriction.
        //this.device.gpu.limits.maxBindGroups

        // Set initial work groups.
        for (const [lGroupIndex, lGroup] of pInitialGroups) {
            // Set name to index mapping.
            this.mBindGroupNames.set(lGroup.name, lGroupIndex);

            // Set bind groups to initial data and working bind group.
            this.mInitialBindGroups.set(lGroupIndex, lGroup);
            this.mBindGroups.set(lGroupIndex, lGroup);

            // Add invalidationlistener.
            const lListener: GpuObjectUpdateListener = () => {
                this.triggerAutoUpdate(UpdateReason.ChildData);
            };
            lGroup.addInvalidationListener(lListener);
            this.mBindGroupInvalidationListener.set(lGroup, lListener);
        }
    }

    /**
     * Get bind group layout by name.
     * 
     * @param pGroupName - Group name.
     */
    public getGroupLayout(pGroupName: string): BindGroupLayout {
        const lGroupIndex: number | undefined = this.mBindGroupNames.get(pGroupName);

        // Throw on unaccessable group.
        if (typeof lGroupIndex === 'undefined') {
            throw new Exception(`Bind group layout (${pGroupName}) does not exists.`, this);
        }

        // Bind group should allways exist.
        return this.mBindGroups.get(lGroupIndex)!;
    }

    /**
     * Get group binding index by name.
     * 
     * @param pGroupName - Group name.
     * 
     * @returns group binding index. 
     */
    public groupIndex(pGroupName: string): number {
        const lBindGroupIndex: number | undefined = this.mBindGroupNames.get(pGroupName);
        if (!lBindGroupIndex) {
            throw new Exception(`Group binding placeholder can not replace a requiered bind group.`, this);
        }

        return lBindGroupIndex;
    }

    /**
     * Remove placeholder group.
     * 
     * @param pName - Bind group name of replacement.
     */
    public removePlaceholderGroup(pName: string): void {
        const lBindGroupIndex: number = this.groupIndex(pName);

        // Clean old placeholder.
        const lLastBindGroup: BindGroupLayout | undefined = this.mBindGroups.get(lBindGroupIndex);
        if (lLastBindGroup) {
            // Remove invalidation listener.
            lLastBindGroup.removeInvalidationListener(this.mBindGroupInvalidationListener.get(lLastBindGroup)!);

            // Remove old name.
            this.mBindGroupNames.delete(lLastBindGroup.name);
        }

        // Remove replacement layout.
        this.mBindGroups.delete(lBindGroupIndex);
    }

    /**
     * Replace existing bind group.
     * 
     * @param pGroupName - Layout name that should be replaced.
     * @param pBindGroup - Replacement bind group.
     */
    public replaceGroup(pGroupName: string, pBindGroup: BindGroupLayout): void {
        const lBindGroupIndex: number = this.groupIndex(pGroupName);

        // Read original bind group.
        const lInitialGroup: BindGroupLayout | undefined = this.mInitialBindGroups.get(lBindGroupIndex);
        if (!lInitialGroup) {
            throw new Exception(`Only initial bind group layouts can be replaced.`, this);
        }

        // Read binding lists.
        const lInitialBindingList: Array<Readonly<BindLayout>> = pBindGroup.bindings;
        const lReplacementBindingList: Array<Readonly<BindLayout>> = pBindGroup.bindings;

        // Compare inital it with replacement to check compatibility.
        if (lInitialBindingList.length !== lReplacementBindingList.length) {
            throw new Exception(`Replacement group does not include all bindings.`, this);
        }

        // Compare all bindings.
        for (let lBindingIndex: number = 0; lBindingIndex < lInitialBindingList.length; lBindingIndex++) {
            const lInitialBinding: Readonly<BindLayout> | undefined = lInitialBindingList.at(lBindingIndex);
            const lReplacementBinding: Readonly<BindLayout> | undefined = lReplacementBindingList.at(lBindingIndex);

            // Continue on undefined or when bind layout is the same.
            if (lInitialBinding === lReplacementBinding) {
                continue;
            }

            // Can't set binding of something that is not there.
            if (typeof lInitialBinding === 'undefined') {
                throw new Exception(`Can't replace group binding with index "${lBindingIndex}". Layout binding does not exists in initial layout.`, this);
            }

            // Group must have the same bindings no binding can be missed.
            if (typeof lReplacementBinding === 'undefined') {
                throw new Exception(`Can't omit group binding with index "${lBindingIndex}".`, this);
            }

            // Same binding name.
            if (lInitialBinding.name !== lReplacementBinding.name) {
                throw new Exception(`Group binding replacement "${lReplacementBinding.name}" must be named "${lInitialBinding.name}"`, this);
            }

            // Must share the same access mode.
            if ((lReplacementBinding.accessMode & lInitialBinding.accessMode) !== lReplacementBinding.accessMode) {
                throw new Exception(`Group binding replacement "${lReplacementBinding.name}" must at least cover the initial access mode.`, this);
            }

            // Must share the same visibility.
            if ((lReplacementBinding.visibility & lInitialBinding.visibility) !== lReplacementBinding.visibility) {
                throw new Exception(`Group binding replacement "${lReplacementBinding.name}" must at least cover the initial visibility.`, this);
            }

            // Must be same memory layout.
            if (lReplacementBinding.constructor !== lInitialBinding.constructor) {
                throw new Exception(`Group binding replacement "${lReplacementBinding.name}" must have the same memory layout as initial bind group layout.`, this);
            }

            // TODO: layout: BaseMemoryLayout; some type of equal.
        }

        // Remove last 
        const lLastBindGroup: BindGroupLayout | undefined = this.mBindGroups.get(lBindGroupIndex);
        if (lLastBindGroup) {
            // Remove invalidation listener.
            lLastBindGroup.removeInvalidationListener(this.mBindGroupInvalidationListener.get(lLastBindGroup)!);
        }

        // Replace binding group and add invalidation listener.
        const lListener: GpuObjectUpdateListener = () => {
            this.triggerAutoUpdate(UpdateReason.ChildData);
        };
        pBindGroup.addInvalidationListener(lListener);
        this.mBindGroupInvalidationListener.set(pBindGroup, lListener);

        // Trigger updates.
        this.triggerAutoUpdate(UpdateReason.ChildData);
    }

    /**
     * Set a placeholder group that will not be used.
     * 
     * @param pIndex - Group index.
     * @param pLayout - [Optional] Bind group Layout.
     */
    public setPlaceholderGroup(pIndex: number, pLayout: BindGroupLayout): void {
        // Initial group must be undefined.
        if (this.mInitialBindGroups.has(pIndex)) {
            throw new Exception(`Group binding placeholder can not replace a requiered bind group.`, this);
        }

        // Clean old placeholder.
        const lLastBindGroup: BindGroupLayout | undefined = this.mBindGroups.get(pIndex);
        if (lLastBindGroup) {
            // Remove invalidation listener.
            lLastBindGroup.removeInvalidationListener(this.mBindGroupInvalidationListener.get(lLastBindGroup)!);

            // Remove old name.
            this.mBindGroupNames.delete(lLastBindGroup.name);
        }

        // Add replacment layout and name.
        this.mBindGroups.set(pIndex, pLayout);
        this.mBindGroupNames.set(pLayout.name, pIndex);

        // Register change listener for layout changes.
        const lListener: GpuObjectUpdateListener = () => {
            this.triggerAutoUpdate(UpdateReason.ChildData);
        };
        pLayout.addInvalidationListener(lListener);
        this.mBindGroupInvalidationListener.set(pLayout, lListener);

        // Trigger auto update.
        this.triggerAutoUpdate(UpdateReason.ChildData);
    }

    /**
     * Destroy native object.
     */
    protected override destroy(): void {
        // Nothing to destroy as it is only a descriptor object.
    }

    /**
     * Generate native gpu pipeline data layout.
     */
    protected override generate(): GPUPipelineLayout {
        // Generate pipeline layout from bind group layouts.
        const lPipelineLayoutDescriptor = { bindGroupLayouts: new Array<GPUBindGroupLayout>() };
        for (const [lGroupIndex, lBindGroupLayout] of this.mBindGroups) {
            lPipelineLayoutDescriptor.bindGroupLayouts[lGroupIndex] = lBindGroupLayout.native;
        }

        // Validate continunity.
        if (this.mBindGroups.size !== lPipelineLayoutDescriptor.bindGroupLayouts.length) {
            throw new Exception(`Bind group gap detected. Group not set.`, this);
        }

        // Generate pipeline layout from descriptor.
        return this.device.gpu.createPipelineLayout(lPipelineLayoutDescriptor);
    }
}