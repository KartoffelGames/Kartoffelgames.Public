import { InstructionExecuter } from '../execution/instruction-executor';
import { GeneratorFactoryMap, GeneratorNativeMap } from './base-generator-factory';
import { BaseNativeGenerator } from './base-native-generator';

export abstract class BaseNativeInstructionGenerator<TMap extends GeneratorNativeMap, TGeneratorKey extends keyof GeneratorFactoryMap> extends BaseNativeGenerator<TMap, TGeneratorKey> {
    /**
     * Execute instruction.
     * @param pExecutor - Executor context.
     */
    public abstract execute(pExecutor: InstructionExecuter): void;
}