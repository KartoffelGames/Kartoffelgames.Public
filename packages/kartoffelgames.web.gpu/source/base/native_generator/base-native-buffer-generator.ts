import { TypedArray } from '@kartoffelgames/core';
import { GeneratorFactoryMap, GeneratorNativeMap } from './base-generator-factory';
import { BaseNativeGenerator } from './base-native-generator';

export abstract class BaseNativeBufferGenerator<TMap extends GeneratorNativeMap, TGeneratorKey extends keyof GeneratorFactoryMap> extends BaseNativeGenerator<TMap, TGeneratorKey> {
    /**
     * Read data raw from native buffer.
     * @param pOffset - Read offset.
     * @param pSize - Read size.
     */
    public abstract readRaw(pOffset: number, pSize: number): Promise<TypedArray>;

    /**
     * Write data raw without layout.
     * @param pData - Data.
     * @param pOffset - Data offset.
     * @param pSize - Data size.
     */
    public abstract writeRaw(pData: ArrayLike<number>, pOffset: number, pSize: number | undefined): Promise<void>;
}