import { InstructionExecuter } from '../instruction-executor';

export interface IGpuInstruction {
    /**
     * Execute instruction in given context.
     * @param pExecutor - Executor context.
     */
    execute(pExecutor: InstructionExecuter): void
}