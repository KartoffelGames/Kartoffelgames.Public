import { WebGpuBindGroup } from '../../bind_group/web-gpu-bind-group';
import { IPipeline } from '../../pipeline/i-pipeline.interface';

export interface IInstruction {
    /**
     * Bind group in order.
     */
    readonly bindGroups: Array<WebGpuBindGroup>;

    /**
     * Instruction pipeline.
     */
    readonly pipeline: IPipeline;

    /**
     * 
     * @param pIndex - Bind group index.
     * @param pBindGroup - Bind group. Musst match shader bind groups.
     */
    setBindGroup(pIndex: number, pBindGroup: WebGpuBindGroup): void;
}

