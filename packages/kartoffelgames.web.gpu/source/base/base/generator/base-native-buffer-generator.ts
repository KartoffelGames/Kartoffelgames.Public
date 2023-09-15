import { TypedArray } from '@kartoffelgames/core.data';
import { GeneratorFactoryMap, GeneratorNativeMap } from './base-generator-factory';
import { BaseNativeGenerator } from './base-native-generator';

export abstract class BaseNativeBufferGenerator<TMap extends GeneratorNativeMap, TGeneratorKey extends keyof GeneratorFactoryMap> extends BaseNativeGenerator<TMap, TGeneratorKey> {
    /**
     * Read data raw without layout.
     * @param pOffset - Data offset.
     * @param pSize - Data size.
     */
    public abstract readRaw<TType extends TypedArray>(pOffset?: number | undefined, pSize?: number | undefined): Promise<TType>;

    /**
     * Write data raw without layout.
     * @param pData - Data.
     * @param pOffset - Data offset.
     * @param pSize - Data size.
     */
    public abstract writeRaw(pData: ArrayLike<number>, pOffset?: number | undefined, pSize?: number | undefined): Promise<void>;
}