import { Dictionary } from '@kartoffelgames/core';
import { ComputeStage } from '../../../constant/compute-stage.enum';
import { BaseMemoryLayout } from '../../memory_layout/base-memory-layout';

export class ShaderLayout {
    private readonly mGroups: Dictionary<number, ShaderLayoutGroup>;

    public constructor() {
        this.mGroups = new Dictionary<number, ShaderLayoutGroup>();
    }

    /**
     * Setup layout group.
     * 
     * @param pIndex - Group index.
     * @param pName - Group name.
     */
    public setupGroup(pIndex: number, pName: string): void {
        this.mGroups.add(pIndex, {
            index: pIndex,
            name: pName,
            bindings: new Dictionary<string, ShaderLayoutGroupBinding>()
        });
    }

    public addBinding(pGroupName: string, pBindingName: string, pUsage: ComputeStage, pLayout: BaseMemoryLayout): void {
        // TODO:
    }

    // TODO: Add entry points.s
}

type ShaderLayoutGroupBinding = {
    name: string;
    usage: ComputeStage; // Stages where binding is used.
    layout: BaseMemoryLayout;
};

type ShaderLayoutGroup = {
    index: number;
    name: string,
    bindings: Dictionary<string, ShaderLayoutGroupBinding>;
};