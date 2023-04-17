import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { BindGroup } from '../../bind_group/bind-group';
import { ComputePipeline } from '../../pipeline/compute-pipeline';
import { IInstruction } from './i-instruction.interface';

export class ComputeShader implements IInstruction {
    private readonly mBindGroups: Dictionary<number, BindGroup>;
    private mPipeline: ComputePipeline | null;

    /**
     * Get bind groups.
     */
    public get bindGroups(): Array<BindGroup> {
        const lBindGroupList: Array<BindGroup> = new Array<BindGroup>();
        for(const [lIndex, lBindGroup] of this.mBindGroups){
            lBindGroupList[lIndex] = lBindGroup;
        }

        return lBindGroupList;
    }

    /**
     * Instructions compute pipeline.
     */
    public get pipeline(): ComputePipeline {
        if(!this.mPipeline){
            throw new Exception('Pipeline not set.', this);
        }

        return this.mPipeline;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mBindGroups = new Dictionary<number, BindGroup>();
        this.mPipeline = null;
    }

    /**
     * Set bind group of pipeline.
     * @param pBindGroup - Bind group.
     */
    public async setBindGroup(pIndex: number, pBindGroup: BindGroup): Promise<void> {
        // Validate pipeline existance.
        if (!this.mPipeline) {
            throw new Exception(`Can't set bind group without set pipeline.`, this);
        }

        // Validate bind group layout.
        if (this.mPipeline.shader.bindGroups.getGroup(pIndex) !== pBindGroup.layout) {
            throw new Exception(`Bind data layout not matched with pipeline bind group layout.`, this);
        }

        this.mBindGroups.set(pIndex, pBindGroup);
    }

    /**
     * Set compute pipeline. Clears group binds.
     * @param pPipeline - Compute pipeline.
     */
    public async setPipeline(pPipeline: ComputePipeline): Promise<void> {
        this.mPipeline = pPipeline;

        // Clear binds.
        this.mBindGroups.clear();
    }
}