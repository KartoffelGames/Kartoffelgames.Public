import { InstructionExecuter } from '../instruction-executor';

export interface IGpuInstruction {
    /**
     * Get executor.
     */
    executor: InstructionExecuter;

    /**
     * Execute instruction in given context.
     * @param pExecutor - Executor context.
     */
    execute(): void;
}