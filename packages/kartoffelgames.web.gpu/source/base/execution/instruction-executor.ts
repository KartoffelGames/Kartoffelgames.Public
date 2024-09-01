import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/gpu-native-object';
import { RenderTargets } from '../pipeline/target/render-targets';
import { ComputeInstruction } from './instruction/compute-instruction';
import { IGpuInstruction } from './instruction/i-gpu-instruction.interface';
import { VertexFragmentInstruction } from './instruction/vertex-fragment-instruction';

export class InstructionExecuter extends GpuObject<'instructionExecutor'> {
    private readonly mInstructionList: Array<IGpuInstruction>;

    public constructor(pDevice: GpuDevice) {
        super(pDevice);

        this.mInstructionList = new Array<IGpuInstruction>();
    }

    /**
     * Create and add new compute instruction
     */
    public createComputeInstruction(): ComputeInstruction {
        // Create instruction.
        const lInstruction: ComputeInstruction = new ComputeInstruction(this.device, this);

        // Add instruction to instruction list.
        this.mInstructionList.push(lInstruction);

        return lInstruction;
    }

    /**
     * Create and add new vertex fragment instruction
     * @param pRenderTargets - Instruction render targets.
     */
    public createVertexFragmentInstruction(pRenderTargets: RenderTargets): VertexFragmentInstruction {
        // Create instruction.
        const lInstruction: VertexFragmentInstruction = new VertexFragmentInstruction(this.device, this, pRenderTargets);

        // Add instruction to instruction list.
        this.mInstructionList.push(lInstruction);

        return lInstruction;
    }

    /**
     * Execute all instructions on order.
     */
    public execute(): void {
        const lInstructionExecutor = this.device.generator.request<'instructionExecutor'>(this);

        // Start execution.
        lInstructionExecutor.startExecution();

        for (const lInstruction of this.mInstructionList) {
            lInstruction.execute();
        }

        // End Execution.
        lInstructionExecutor.endExecution();
    }
}