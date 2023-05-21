import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { WebGpuBindGroup } from '../../bind_group/web-gpu-bind-group';
import { ComputePipeline } from '../../pipeline/compute-pipeline';
import { IInstruction } from './i-instruction.interface';
import { ComputeParameter } from '../parameter/compute-parameter';

export class ComputeInstruction implements IInstruction {
    private readonly mBindGroups: Dictionary<number, WebGpuBindGroup>;
    private readonly mComputeParameter: ComputeParameter;
    private readonly mPipeline: ComputePipeline;

    /**
     * Get bind groups.
     */
    public get bindGroups(): Array<WebGpuBindGroup> {
        const lBindGroupList: Array<WebGpuBindGroup> = new Array<WebGpuBindGroup>();
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
        this.mBindGroups = new Dictionary<number, WebGpuBindGroup>();
        this.mPipeline = pPipeline;
        this.mComputeParameter = pComputeParameter;
    }

    /**
     * Set bind group of pipeline.
     * @param pBindGroup - Bind group.
     */
    public setBindGroup(pIndex: number, pBindGroup: WebGpuBindGroup): void {
        // Validate bind group layout.
        if (this.mPipeline.shader.bindGroups.getGroup(pIndex) !== pBindGroup.layout) {
            throw new Exception(`Bind data layout not matched with pipeline bind group layout.`, this);
        }

        this.mBindGroups.set(pIndex, pBindGroup);
    }
}