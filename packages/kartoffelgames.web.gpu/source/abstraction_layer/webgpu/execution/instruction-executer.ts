import { List } from '@kartoffelgames/core.data';
import { WebGpuDevice } from '../web-gpu-device';
import { IInstructionSet } from './instruction_set/i-instruction-set';

export class InstructionExecuter {
    private readonly mGpu: WebGpuDevice;

    private readonly mInstructionSetList: List<IInstructionSet>;

    /**
     * Constructor.
     * @param pGpu - Gpu.
     */
    public constructor(pGpu: WebGpuDevice) {
        this.mGpu = pGpu;

        // Instruction sets.
        this.mInstructionSetList = new List<IInstructionSet>();
    }

    /**
     * Add instruction set.
     * @param pSet - New instruction net.
     */
    public addInstructionSet(pSet: IInstructionSet): void {
        this.mInstructionSetList.push(pSet);
    }

    /**
     * Remove all instruction sets.
     */
    public clearInstructions(): void {
        this.mInstructionSetList.clear();
    }

    public execute(): void {
        // Generate encoder and add render commands.
        const lEncoder = this.mGpu.device.createCommandEncoder();

        // Execute instruction sets.
        for (const lInstructionSet of this.mInstructionSetList) {
            lInstructionSet.execute(lEncoder);
        }

        this.mGpu.device.queue.submit([lEncoder.finish()]);
    }
}