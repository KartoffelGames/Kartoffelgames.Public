import { BindGroup } from '../../bind_group/bind-group';
import { IPipeline } from '../../pipeline/i-pipeline.interface';

export interface IInstruction {
    /**
     * Bind group in order.
     */
    readonly bindGroups: Array<BindGroup>;

    /**
     * Instruction pipeline.
     */
    readonly pipeline: IPipeline;

    /**
     * 
     * @param pIndex - Bind group index.
     * @param pBindGroup - Bind group. Musst match shader bind groups.
     */
    setBindGroup(pIndex: number, pBindGroup: BindGroup): Promise<void>

    /**
     * Set instruction pipeline.
     * @param pPipeline - Pipeline.
     */
    setPipeline(pPipeline: IPipeline): Promise<void>
}

