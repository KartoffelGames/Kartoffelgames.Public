import { GpuObjectReason } from '../gpu/gpu-object-reason';
import { GeneratorFactoryMap, GeneratorNativeMap } from './base-generator-factory';

export abstract class BaseNativeGenerator<TMap extends GeneratorNativeMap, TGeneratorKey extends keyof GeneratorFactoryMap> {
    private readonly mFactory: TMap['factory'];
    private readonly mGpuObject: GeneratorFactoryMap[TGeneratorKey]['gpuObject'];
    private mLastGeneratedFrame: number;
    private mLastReason: GpuObjectReason;
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
        this.mLastReason = GpuObjectReason.Everything;
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
                this.invalidate(GpuObjectReason.LifeTime);
                break;
            }
            case NativeObjectLifeTime.Frame: {
                // Invalidate on different frame till last generated.
                if (this.factory.device.frameCount !== this.mLastGeneratedFrame) {
                    this.invalidate(GpuObjectReason.LifeTime);
                }
                break;
            }
        }

        // Generate new native when not already generated.
        if (this.mNative === null) {
            this.mNative = this.generate(this.mLastReason);
            this.mLastGeneratedFrame = this.factory.device.frameCount;
        }

        return this.mNative;
    }

    /**
     * Invalidate and destroy generated native.
     */
    public invalidate(pDestroyReason: GpuObjectReason): void {
        if (this.mNative !== null) {
            this.destroy(this.mNative, pDestroyReason);
        }

        this.mLastReason = pDestroyReason;
        this.mNative = null;
    }

    /**
     * Destroy generated native.
     * @param _pNative - Generated native.
     * @param _pDestroyReason - Reason why the native should be destroyed.
     */
    protected destroy(_pNative: TMap['generators'][TGeneratorKey]['native'], _pDestroyReason: GpuObjectReason): void {
        return;
    }

    /**
     * Generate native gpu object.
     * @param pUpdateReason - Reason why the native should be updated.
     */
    protected abstract generate(pUpdateReason: GpuObjectReason): TMap['generators'][TGeneratorKey]['native'];
}

export enum NativeObjectLifeTime {
    Persistent = 0,
    Frame = 1,
    Single = 2
}