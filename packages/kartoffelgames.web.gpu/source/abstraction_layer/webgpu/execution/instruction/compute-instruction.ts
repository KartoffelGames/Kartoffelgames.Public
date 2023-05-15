import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { BindGroup } from '../../bind_group/bind-group';
import { ComputePipeline } from '../../pipeline/compute-pipeline';
import { IInstruction } from './i-instruction.interface';
import { ComputeParameter } from '../parameter/compute-parameter';

export class ComputeInstruction implements IInstruction {
    private readonly mBindGroups: Dictionary<number, BindGroup>;
    private readonly mComputeParameter: ComputeParameter;
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
     * Instruction parameter.
     */
    public get parameter(): ComputeParameter {
        return this.mComputeParameter;
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
    public constructor(pPipeline: ComputePipeline, pComputeParameter: ComputeParameter) {
        this.mBindGroups = new Dictionary<number, BindGroup>();
        this.mPipeline = pPipeline;
        this.mComputeParameter = pComputeParameter;
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