import { WebGpuBindGroup } from '../../bind_group/web-gpu-bind-group';
import { ComputePipeline } from '../../pipeline/compute-pipeline';
import { ComputeInstruction } from '../instruction/compute-instruction';
import { IInstructionSet } from './i-instruction-set';

export class ComputeInstructionSet implements IInstructionSet {
    private readonly mInstructionList: Array<ComputeInstruction>;

    /**
     * Constructor.
     */
    public constructor() {
        this.mInstructionList = new Array<ComputeInstruction>();
    }

    /**
     * Add render instruction.
     * @param pInstruction - Render instruction.
     */
    public addInstruction(pInstruction: ComputeInstruction): void {
        // Add instruction.
        this.mInstructionList.push(pInstruction);
    }

    /**
     * Execute instruction set.
     * @param pCommandEncoder - Command encoder.
     */
    public execute(pCommandEncoder: GPUCommandEncoder): void {
        // Pass descriptor is set, when the pipeline ist set.
        const lComputePassEncoder: GPUComputePassEncoder = pCommandEncoder.beginComputePass();

        // Instruction cache.
        let lPipeline: ComputePipeline | null = null;
        const lBindGroupList: Array<WebGpuBindGroup | undefined> = new Array<WebGpuBindGroup | undefined>();

        // Execute instructions.
        for (const lInstruction of this.mInstructionList) {
            // Use cached pipeline or use new.
            if (lInstruction.pipeline !== lPipeline) {
                lPipeline = lInstruction.pipeline;
                lComputePassEncoder.setPipeline(lInstruction.pipeline.native()!);
            }

            // Add bind groups.
            for (const lIndex of lPipeline.shader.bindGroups.groups) {
                const lNewBindGroup: WebGpuBindGroup | undefined = lInstruction.bindGroups[lIndex];
                const lCurrentBindGroup: WebGpuBindGroup | undefined = lBindGroupList[lIndex];

                // Use cached bind group or use new.
                if (lNewBindGroup !== lCurrentBindGroup) {
                    lBindGroupList[lIndex] = lNewBindGroup;

                    if (lNewBindGroup) {
                        lComputePassEncoder.setBindGroup(lIndex, lNewBindGroup.native());
                    }
                }
            }

            lComputePassEncoder.dispatchWorkgroups(lInstruction.parameter.workgroupCountX, lInstruction.parameter.workgroupCountY, lInstruction.parameter.workgroupCountZ);
        }

        lComputePassEncoder.end();
    }
}