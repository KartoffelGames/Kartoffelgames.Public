import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { BindGroup } from '../../bind_group/bind-group';
import { ComputePipeline } from '../../pipeline/compute-pipeline';
import { IInstruction } from './i-instruction.interface';

export class ComputeShader implements IInstruction {
    private readonly mBindGroups: Dictionary<number, BindGroup>;
    private readonly mPipeline: ComputePipeline;

    /**
     * Get bind groups.
     */
    public get bindGroups(): Array<BindGroup> {
        const lBindGroupList: Array<BindGroup> = new Array<BindGroup>();
        for (const [lIndex, lBindGroup] of this.mBindGroups) {
            lBindGroupList[lIndex] = lBindGroup;
        }

        return lBindGroupList;
    }

    /**
     * Instructions compute pipeline.
     */
    public get pipeline(): ComputePipeline {
        return this.mPipeline;
    }

    /**
     * Constructor.
     */
    public constructor(pPipeline: ComputePipeline) {
        this.mBindGroups = new Dictionary<number, BindGroup>();
        this.mPipeline = pPipeline;
    }

    /**
     * Set bind group of pipeline.
     * @param pBindGroup - Bind group.
     */
    public setBindGroup(pIndex: number, pBindGroup: BindGroup): void {
        // Validate bind group layout.
        if (this.mPipeline.shader.bindGroups.getGroup(pIndex) !== pBindGroup.layout) {
            throw new Exception(`Bind data layout not matched with pipeline bind group layout.`, this);
        }

        this.mBindGroups.set(pIndex, pBindGroup);
    }
}