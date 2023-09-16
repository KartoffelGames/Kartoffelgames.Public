import { GeneratorFactoryMap, GeneratorNativeMap } from './base-generator-factory';

export abstract class BaseNativeGenerator<TMap extends GeneratorNativeMap, TGeneratorKey extends keyof GeneratorFactoryMap> {
    private readonly mFactory: TMap['factory'];
    private readonly mGpuObject: GeneratorFactoryMap[TGeneratorKey]['gpuObject'];
    private mLastGeneratedFrame: number;
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
        this.mLastGeneratedFrame = 0;
    }

    /**
     * Generate native gpu object from base.
     */
    public create(): TMap['generators'][TGeneratorKey]['native'] {
        // Validate life time.
        switch (this.nativeLifeTime) {
            case NativeObjectLifeTime.Persistent: {
                // Do nothing.
                break;
            }
            case NativeObjectLifeTime.Single: {
                // Invalidate every time.
                this.invalidate();
                break;
            }
            case NativeObjectLifeTime.Frame: {
                // Invalidate on different frame till last generated.
                if (this.factory.device.frameCount !== this.mLastGeneratedFrame) {
                    this.invalidate();
                }
                break;
            }
        }

        // Generate new native when not already generated.
        if (this.mNative === null) {
            this.mNative = this.generate();
            this.mLastGeneratedFrame = this.factory.device.frameCount;
        }

        return this.mNative;
    }

    /**
     * Invalidate and destroy generated native.
     */
    public invalidate(): void {
        if (this.mNative !== null) {
            this.destroy(this.mNative);
        }

        this.mNative = null;
    }

    /**
     * Destroy generated native.
     * @param _pNative - Generated native.
     */
    protected destroy(_pNative: TMap['generators'][TGeneratorKey]['native']): void {
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