import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/gpu-object';
import { IGpuInstruction } from './instruction/i-gpu-instruction.interface';

export class InstructionExecuter extends GpuObject<'instructionExecutor'> {
    private readonly mInstructionList: Array<IGpuInstruction>;

    public constructor(pDevice: GpuDevice) {
        super(pDevice);
        
        this.mInstructionList = new Array<IGpuInstruction>();
    }

    /**
     * Add instruction to instruction list.
     * @param pInstruction - Instruction.
     */
    public addInstruction(pInstruction: IGpuInstruction): void {
        this.mInstructionList.push(pInstruction);
    }

    /**
     * Execute all instructions on order.
     */
    public execute(): void {
        const lInstructionExecutor = this.device.generator.request<'instructionExecutor'>(this);

        // Start execution.
        lInstructionExecutor.startExecution();

        for(const lInstruction of this.mInstructionList){
            lInstruction.execute(this);
        }

        // End Execution.
        lInstructionExecutor.endExecution();
    }
}