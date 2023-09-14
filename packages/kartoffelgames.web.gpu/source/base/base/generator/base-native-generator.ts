import { GeneratorFactoryMap, GeneratorNativeMap } from './base-generator-factory';

// TODO: Needs Factory generic so that generators can access correct WebGpuGenerator types.
export abstract class BaseNativeGenerator<TMap extends GeneratorNativeMap, TGeneratorKey extends keyof GeneratorFactoryMap> {
    private readonly mFactory: TMap['factory'];
    private readonly mGpuObject: GeneratorFactoryMap[TGeneratorKey]['gpuObject'];
    private mNative: TMap['generators'][TGeneratorKey]['native'] | null;

    /**
     * Life time of native object.
     */
    protected abstract nativeLifeTime: NativeObjectLifeTime;

    /**
     * Generator factory.
     */
    protected get factory(): TMap['factory'] {
        return this.mFactory;
    }

    /**
     * Get base object of generator.
     */
    protected get gpuObject(): GeneratorFactoryMap[TGeneratorKey]['gpuObject'] {
        return this.mGpuObject;
    }

    /**
     * Constructor.
     * @param pBaseObject - Base object containing all values.
     * @param pGeneratorFactory - Generator factory.
     */
    public constructor(pFactory: TMap['factory'], pBaseObject: TGeneratorKey extends keyof GeneratorFactoryMap ? GeneratorFactoryMap[TGeneratorKey]['gpuObject'] : never) {
        this.mFactory = pFactory;
        this.mGpuObject = pBaseObject;
        this.mNative = null;
    }

    /**
     * Invalidate and destroy generated native.
     */
    public invalidate(): void {
        if (this.mNative !== null) {
            this.destroy();
        }

        this.mNative = null;
    }

    /**
     * Generate native gpu object from base.
     */
    public request(): TMap['generators'][TGeneratorKey]['native'] {
        // TODO: Validate life time.

        // Generate new native when not already generated.
        if (this.mNative === null) {
            this.mNative = this.generate();
        }

        return this.mNative;
    }

    /**
     * Destroy generated native.
     */
    protected destroy(): void {
        return;
    }

    /**
     * Generate native gpu object.
     */
    protected abstract generate(): TMap['generators'][TGeneratorKey]['native'];
}

export enum NativeObjectLifeTime {
    Persistent = 0,
    Frame = 1,
    Single = 2
}