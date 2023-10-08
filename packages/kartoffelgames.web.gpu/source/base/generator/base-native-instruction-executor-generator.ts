import { GeneratorFactoryMap, GeneratorNativeMap } from './base-generator-factory';
import { BaseNativeGenerator } from './base-native-generator';

export abstract class BaseNativeInstructionExecutorGenerator<TMap extends GeneratorNativeMap, TGeneratorKey extends keyof GeneratorFactoryMap> extends BaseNativeGenerator<TMap, TGeneratorKey> {
    /**
     * Execute instruction.
     */
    public abstract endExecution(): void;
    
    /**
     * Execute instruction.
     */
    public abstract startExecution(): void;
}